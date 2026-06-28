import { NextResponse } from "next/server";
import { auth } from "@/lib/auth/auth";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";

/**
 * DELETE /api/admin/users/[id]
 * Kullanıcıyı kurumdan çıkar (institutionId = null).
 * ?permanent=true query parametresi ile tamamen siler.
 */
export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  // Admin doğrulaması
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) {
    return NextResponse.json({ error: "Yetkisiz erişim." }, { status: 401 });
  }
  const adminUser = session.user as { id: string; role?: string };
  if (adminUser.role !== "ADMIN") {
    return NextResponse.json(
      { error: "Bu işlem için yönetici yetkisi gereklidir." },
      { status: 403 }
    );
  }

  // Admin'in kurumunu bul
  const admin = await prisma.user.findUnique({
    where: { id: adminUser.id },
    select: { institutionId: true },
  });

  if (!admin?.institutionId) {
    return NextResponse.json(
      { error: "Kurum bilginiz bulunamadı." },
      { status: 403 }
    );
  }

  // Silinecek kullanıcıyı kontrol et
  const targetUser = await prisma.user.findUnique({
    where: { id },
    select: { id: true, institutionId: true, role: true },
  });

  if (!targetUser) {
    return NextResponse.json(
      { error: "Kullanıcı bulunamadı." },
      { status: 404 }
    );
  }

  // Sadece kendi kurumundaki kullanıcıları yönetebilir
  if (targetUser.institutionId !== admin.institutionId) {
    return NextResponse.json(
      { error: "Bu kullanıcı sizin kurumunuza ait değil." },
      { status: 403 }
    );
  }

  // Admin kendini silemez
  if (targetUser.id === adminUser.id) {
    return NextResponse.json(
      { error: "Kendinizi kurumdan çıkaramazsınız." },
      { status: 400 }
    );
  }

  const url = new URL(_request.url);
  const permanent = url.searchParams.get("permanent") === "true";

  try {
    if (permanent) {
      // Tam silme: önce ilişkili kayıtları sil, sonra kullanıcıyı
      await prisma.$transaction([
        prisma.session.deleteMany({ where: { userId: id } }),
        prisma.account.deleteMany({ where: { userId: id } }),
        prisma.submission.deleteMany({ where: { userId: id } }),
        prisma.enrollment.deleteMany({ where: { userId: id } }),
        prisma.user.delete({ where: { id } }),
      ]);
    } else {
      // Kurumdan çıkarma
      await prisma.user.update({
        where: { id },
        data: { institutionId: null },
      });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("User deletion error:", err);
    return NextResponse.json(
      { error: "Kullanıcı işlemi sırasında bir hata oluştu." },
      { status: 500 }
    );
  }
}
