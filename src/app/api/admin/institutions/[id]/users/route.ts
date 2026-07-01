import { NextResponse } from "next/server";
import { auth } from "@/lib/auth/auth";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";

/**
 * GET /api/admin/institutions/[id]/users
 * Sadece Süper Adminlerin erişimine açıktır.
 * Belirli bir kurumun tüm kullanıcılarını (öğretmenler ve öğrenciler) döndürür.
 */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  // Süper Admin doğrulaması
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) {
    return NextResponse.json({ error: "Yetkisiz erişim." }, { status: 401 });
  }
  const user = session.user as { id: string; role?: string };
  if (user.role !== "ADMIN") {
    return NextResponse.json(
      { error: "Bu işlem için yönetici yetkisi gereklidir." },
      { status: 403 }
    );
  }

  const dbUser = await prisma.user.findUnique({
    where: { id: user.id },
    select: { institutionId: true },
  });

  if (dbUser?.institutionId !== null) {
    return NextResponse.json(
      { error: "Bu işlem için Süper Admin yetkisi gereklidir." },
      { status: 403 }
    );
  }

  try {
    const users = await prisma.user.findMany({
      where: { institutionId: id },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });

    const serialized = users.map((u) => ({
      ...u,
      createdAt: u.createdAt.toISOString(),
    }));

    return NextResponse.json({ users: serialized });
  } catch (err) {
    console.error("Error fetching institution users:", err);
    return NextResponse.json(
      { error: "Kullanıcılar yüklenirken bir hata oluştu." },
      { status: 500 }
    );
  }
}
