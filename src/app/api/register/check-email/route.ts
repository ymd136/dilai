import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * GET /api/register/check-email?email=...
 * Public API to check the pre-registration status of an email.
 * Helps display: "Ankara Üniversitesi bünyesinde kayıt işleminizi tamamlıyorsunuz."
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const email = searchParams.get("email");

  if (!email?.trim()) {
    return NextResponse.json({ error: "E-posta parametresi zorunludur." }, { status: 400 });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
      select: {
        status: true,
        institution: {
          select: {
            name: true,
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json({ status: "NOT_FOUND" });
    }

    if (user.status === "PENDING") {
      return NextResponse.json({
        status: "PENDING",
        institutionName: user.institution?.name ?? null,
      });
    }

    return NextResponse.json({ status: "ACTIVE" });
  } catch (err) {
    console.error("Check email API error:", err);
    return NextResponse.json(
      { error: "Sorgulama sırasında bir hata oluştu." },
      { status: 500 }
    );
  }
}
