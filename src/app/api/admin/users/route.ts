import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/auth";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";

/**
 * Admin oturumunu doğrular ve kurum bilgisini döndürür.
 */
async function requireAdminWithInstitution() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) {
    return { error: "Yetkisiz erişim.", status: 401 };
  }
  const user = session.user as { id: string; role?: string };
  if (user.role !== "ADMIN") {
    return { error: "Bu işlem için yönetici yetkisi gereklidir.", status: 403 };
  }

  // Admin'in kurumunu bul
  const dbUser = await prisma.user.findUnique({
    where: { id: user.id },
    select: { institutionId: true },
  });

  if (!dbUser?.institutionId) {
    return { error: "Kurum bilginiz bulunamadı. Lütfen bir kuruma bağlı olduğunuzdan emin olun.", status: 403 };
  }

  return { session, institutionId: dbUser.institutionId, adminId: user.id };
}

/**
 * GET /api/admin/users
 * Admin'in kurumuna bağlı tüm kullanıcıları listele.
 */
export async function GET() {
  const result = await requireAdminWithInstitution();
  if ("error" in result) {
    return NextResponse.json({ error: result.error }, { status: result.status });
  }

  const users = await prisma.user.findMany({
    where: { institutionId: result.institutionId },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      role: true,
      status: true,
      createdAt: true,
    },
  });

  const serialized = users.map((u) => ({
    ...u,
    createdAt: u.createdAt.toISOString(),
  }));

  return NextResponse.json({ users: serialized });
}

/**
 * POST /api/admin/users
 * Admin'in kurumuna bağlı yeni kullanıcı (öğrenci veya eğitmen) oluştur.
 * Şifre belirlenmez, kullanıcı "PENDING" olarak doğrudan DB'de oluşturulur.
 */
export async function POST(request: NextRequest) {
  const result = await requireAdminWithInstitution();
  if ("error" in result) {
    return NextResponse.json({ error: result.error }, { status: result.status });
  }

  const body = await request.json();
  const { firstName, lastName, email, role } = body as {
    firstName?: string;
    lastName?: string;
    email?: string;
    role?: string;
  };

  // Validasyon
  if (!firstName?.trim() || !lastName?.trim() || !email?.trim()) {
    return NextResponse.json(
      { error: "Ad, soyad ve e-posta zorunludur." },
      { status: 400 }
    );
  }

  const allowedRoles = ["STUDENT", "TEACHER"];
  const userRole = (role ?? "STUDENT").toUpperCase();
  if (!allowedRoles.includes(userRole)) {
    return NextResponse.json(
      { error: "Geçersiz rol. Sadece Öğrenci veya Eğitmen atanabilir." },
      { status: 400 }
    );
  }

  // E-posta zaten kayıtlı mı?
  const existing = await prisma.user.findUnique({
    where: { email: email.toLowerCase().trim() },
  });
  if (existing) {
    return NextResponse.json(
      { error: "Bu e-posta adresi sistemde zaten kayıtlı." },
      { status: 400 }
    );
  }

  try {
    const newUser = await prisma.user.create({
      data: {
        email: email.toLowerCase().trim(),
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        name: `${firstName.trim()} ${lastName.trim()}`,
        role: userRole as "STUDENT" | "TEACHER",
        institutionId: result.institutionId,
        status: "PENDING",
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        role: true,
        status: true,
        createdAt: true,
      },
    });

    return NextResponse.json(
      {
        user: {
          ...newUser,
          createdAt: newUser.createdAt.toISOString(),
        },
      },
      { status: 201 }
    );
  } catch (err: unknown) {
    console.error("Admin user creation error:", err);
    if ((err as { code?: string }).code === "P2002") {
      return NextResponse.json(
        { error: "Bu e-posta adresi sistemde zaten kayıtlı." },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Kullanıcı oluşturulurken bir hata oluştu." },
      { status: 500 }
    );
  }
}
