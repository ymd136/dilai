import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/auth";
import { prisma } from "@/lib/prisma";

/**
 * POST /api/register
 * Public registration endpoint.
 * Handles both:
 * 1. Pre-registered (PENDING) users created by institutions: activates them, hashes their password, and preserves their institution and role.
 * 2. Fresh users: creates a new account programmatically via Better Auth.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { firstName, lastName, email, password } = body as {
      firstName?: string;
      lastName?: string;
      email?: string;
      password?: string;
    };

    // Validasyon
    if (!firstName?.trim() || !lastName?.trim() || !email?.trim() || !password?.trim()) {
      return NextResponse.json(
        { error: "Tüm alanlar zorunludur." },
        { status: 400 }
      );
    }

    if (password.length < 3) {
      return NextResponse.json(
        { error: "Şifre en az 3 karakter olmalıdır." },
        { status: 400 }
      );
    }

    const emailLower = email.toLowerCase().trim();

    // Mevcut kullanıcı kontrolü
    const existing = await prisma.user.findUnique({
      where: { email: emailLower },
    });

    if (existing) {
      if (existing.status === "ACTIVE") {
        return NextResponse.json(
          { error: "Bu e-posta adresi zaten kullanılıyor. Giriş yapmayı deneyin." },
          { status: 400 }
        );
      }

      // Kullanıcı PENDING durumundaysa:
      // Kurum ve Rol bilgilerini sakla
      const { institutionId, role } = existing;

      // Geçici olarak PENDING kullanıcıyı sil (Better Auth signUp çakışmasını önlemek için)
      await prisma.user.delete({
        where: { id: existing.id },
      });

      try {
        // Better Auth ile hesabı ve credentials kaydını oluştur
        const signUpResult = await auth.api.signUpEmail({
          body: {
            email: emailLower,
            password,
            name: `${firstName.trim()} ${lastName.trim()}`,
            firstName: firstName.trim(),
            lastName: lastName.trim(),
          },
        });

        if (!signUpResult?.user) {
          throw new Error("Better Auth signup returned null");
        }

        // Kurum, rol ve aktif durumunu güncelle/geri yükle
        const activatedUser = await prisma.user.update({
          where: { id: signUpResult.user.id },
          data: {
            role,
            institutionId,
            status: "ACTIVE",
          },
        });

        return NextResponse.json({
          success: true,
          user: activatedUser,
        });
      } catch (signUpErr) {
        console.error("Activation signup error, rolling back pending user:", signUpErr);
        // Geri alma: Silinen pending kullanıcıyı tekrar oluştur
        await prisma.user.create({
          data: {
            email: emailLower,
            firstName: firstName.trim(),
            lastName: lastName.trim(),
            name: `${firstName.trim()} ${lastName.trim()}`,
            role,
            institutionId,
            status: "PENDING",
          },
        });
        return NextResponse.json(
          { error: "Aktivasyon tamamlanırken bir hata oluştu." },
          { status: 500 }
        );
      }
    }

    // Sıfırdan kayıt olan kullanıcı
    const signUpResult = await auth.api.signUpEmail({
      body: {
        email: emailLower,
        password,
        name: `${firstName.trim()} ${lastName.trim()}`,
        firstName: firstName.trim(),
        lastName: lastName.trim(),
      },
    });

    if (!signUpResult?.user) {
      return NextResponse.json(
        { error: "Kayıt sırasında bir hata oluştu." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      user: signUpResult.user,
    });
  } catch (err) {
    console.error("Public registration error:", err);
    return NextResponse.json(
      { error: "Sunucu hatası oluştu." },
      { status: 500 }
    );
  }
}
