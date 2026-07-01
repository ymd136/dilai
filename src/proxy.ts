import { NextRequest, NextResponse } from "next/server";

// Korunan rotalar — bu prefix'lere giriş yapmadan erişilemez
const PROTECTED_PREFIXES = ["/dashboard", "/admin", "/company", "/student", "/teacher"];

// Giriş yapmış kullanıcıların erişmemesi gereken rotalar
const AUTH_ROUTES = ["/login", "/register"];

/**
 * Next.js 16 proxy (Edge Runtime uyumlu).
 * Oturum token kontrolü cookie üzerinden yapılır — Prisma/Node.js bağımlılığı yok.
 * Gerçek session doğrulama sunucu bileşenlerinde (session.ts) yapılır.
 */
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // BetterAuth'un kendi API rotalarına dokunma
  if (pathname.startsWith("/api/auth")) {
    return NextResponse.next();
  }

  const isProtected = PROTECTED_PREFIXES.some((prefix) =>
    pathname.startsWith(prefix)
  );

  if (!isProtected) {
    return NextResponse.next();
  }

  // BetterAuth'un session cookie'sini kontrol et (Edge Runtime uyumlu)
  const sessionToken =
    request.cookies.get("better-auth.session_token")?.value ??
    request.cookies.get("__Secure-better-auth.session_token")?.value;

  const isLoggedIn = !!sessionToken;

  // Giriş yapmamış kullanıcı korumalı rotaya erişmeye çalışıyor
  if (!isLoggedIn) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths EXCEPT:
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico
     * - public files
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
