import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/auth";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";

async function requireAdmin() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) {
    return { error: "Yetkisiz erişim.", status: 401 };
  }
  const user = session.user as { role?: string };
  if (user.role !== "ADMIN") {
    return { error: "Bu işlem için yönetici yetkisi gereklidir.", status: 403 };
  }
  return { session };
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth_result = await requireAdmin();
  if ("error" in auth_result) {
    return NextResponse.json({ error: auth_result.error }, { status: auth_result.status });
  }

  const { id } = await params;

  try {
    await prisma.institution.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Kurum silinemedi." }, { status: 500 });
  }
}
