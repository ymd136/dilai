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

export async function GET() {
  const auth_result = await requireAdmin();
  if ("error" in auth_result) {
    return NextResponse.json({ error: auth_result.error }, { status: auth_result.status });
  }

  const institutions = await prisma.institution.findMany({
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ institutions });
}

export async function POST(request: NextRequest) {
  const auth_result = await requireAdmin();
  if ("error" in auth_result) {
    return NextResponse.json({ error: auth_result.error }, { status: auth_result.status });
  }

  const body = await request.json();
  const { name, domain } = body as { name?: string; domain?: string };

  if (!name?.trim() || !domain?.trim()) {
    return NextResponse.json({ error: "Kurum adı ve domain zorunludur." }, { status: 400 });
  }

  // Domain formatı kontrolü
  const domainRegex = /^[a-z0-9.-]+\.[a-z]{2,}$/;
  if (!domainRegex.test(domain)) {
    return NextResponse.json({ error: "Geçersiz domain formatı. Örn: ankara.edu.tr" }, { status: 400 });
  }

  try {
    const institution = await prisma.institution.create({
      data: {
        name: name.trim(),
        domain: domain.toLowerCase().trim(),
      },
    });

    return NextResponse.json({ institution: { ...institution, createdAt: institution.createdAt.toISOString() } }, { status: 201 });
  } catch (err: unknown) {
    if ((err as { code?: string }).code === "P2002") {
      return NextResponse.json({ error: "Bu domain zaten kayıtlı." }, { status: 409 });
    }
    return NextResponse.json({ error: "Kurum eklenirken bir hata oluştu." }, { status: 500 });
  }
}
