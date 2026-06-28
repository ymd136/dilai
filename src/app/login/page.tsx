"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signIn, useSession } from "@/lib/auth/auth-client";
import styles from "./login.module.css";

export default function LoginPage() {
  const router = useRouter();
  const { data: session } = useSession();

  useEffect(() => {
    if (session) {
      router.push("/dashboard");
    }
  }, [session, router]);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState<"google" | "microsoft" | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const result = await signIn.email({
        email,
        password,
        callbackURL: "/dashboard",
      });

      if (result.error) {
        setError(
          result.error.code === "INVALID_EMAIL_OR_PASSWORD"
            ? "E-posta veya şifre hatalı."
            : result.error.message ?? "Giriş yapılırken bir hata oluştu."
        );
      } else {
        router.push("/dashboard");
        router.refresh();
      }
    } catch {
      setError("Beklenmeyen bir hata oluştu. Lütfen tekrar deneyin.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setSocialLoading("google");
    setError(null);
    try {
      await signIn.social({
        provider: "google",
        callbackURL: "/dashboard",
      });
    } catch {
      setError("Google ile giriş yapılırken bir hata oluştu.");
      setSocialLoading(null);
    }
  };

  const handleMicrosoftSignIn = async () => {
    setSocialLoading("microsoft");
    setError(null);
    try {
      await signIn.social({
        provider: "microsoft",
        callbackURL: "/dashboard",
      });
    } catch {
      setError("Microsoft ile giriş yapılırken bir hata oluştu.");
      setSocialLoading(null);
    }
  };

  return (
    <div className={styles.page}>
      {/* Background Effects */}
      <div className={styles.bgEffects} aria-hidden="true">
        <div className={styles.orb1} />
        <div className={styles.orb2} />
      </div>

      {/* Left Side - Branding */}
      <div className={styles.brandSide}>
        <div className={styles.brandContent}>
          <Link href="/" className={styles.logo}>
            <svg width="36" height="36" viewBox="0 0 28 28" fill="none">
              <rect width="28" height="28" rx="8" fill="url(#login-logo)" />
              <path d="M8 10h4v8H8V10zm8 0h4v8h-4V10z" fill="white" opacity="0.9" />
              <path d="M12 13h4v2h-4v-2z" fill="white" opacity="0.7" />
              <defs>
                <linearGradient id="login-logo" x1="0" y1="0" x2="28" y2="28">
                  <stop stopColor="#6366f1" />
                  <stop offset="1" stopColor="#a855f7" />
                </linearGradient>
              </defs>
            </svg>
            <span>
              Dil<span className={styles.logoHighlight}>AI</span>
            </span>
          </Link>

          <h1 className={styles.brandTitle}>
            Yapay Zeka ile
            <br />
            <span className="text-gradient">Dil Öğrenimini</span>
            <br />
            Dönüştürün
          </h1>

          <p className={styles.brandDesc}>
            AI destekli konuşma analizi, otomatik puanlama ve gelişmiş ödev
            yönetimi ile eğitim kalitesini artırın.
          </p>

          <div className={styles.brandStats}>
            <div className={styles.brandStat}>
              <span className={styles.brandStatValue}>50+</span>
              <span className={styles.brandStatLabel}>Eğitim Kurumu</span>
            </div>
            <div className={styles.brandStat}>
              <span className={styles.brandStatValue}>10K+</span>
              <span className={styles.brandStatLabel}>Aktif Öğrenci</span>
            </div>
            <div className={styles.brandStat}>
              <span className={styles.brandStatValue}>%94</span>
              <span className={styles.brandStatLabel}>Başarı</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className={styles.formSide}>
        <div className={styles.formContainer}>
          <div className={styles.formHeader}>
            <h2 className={styles.formTitle}>Hoş Geldiniz</h2>
            <p className={styles.formSubtitle}>
              Hesabınıza giriş yaparak devam edin
            </p>
          </div>

          {/* Social Login Buttons */}
          <div className={styles.socialButtons}>
            <button
              className={`btn btn-secondary ${styles.socialBtn}`}
              type="button"
              id="login-google"
              onClick={handleGoogleSignIn}
              disabled={!!socialLoading || isLoading}
            >
              {socialLoading === "google" ? (
                <span className={styles.spinner} />
              ) : (
                <svg width="18" height="18" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                </svg>
              )}
              Google ile Giriş Yap
            </button>

            <button
              className={`btn btn-secondary ${styles.socialBtn} ${styles.microsoftBtn}`}
              type="button"
              id="login-microsoft"
              onClick={handleMicrosoftSignIn}
              disabled={!!socialLoading || isLoading}
            >
              {socialLoading === "microsoft" ? (
                <span className={styles.spinner} />
              ) : (
                <svg width="18" height="18" viewBox="0 0 24 24">
                  <rect x="1" y="1" width="10" height="10" fill="#f25022" />
                  <rect x="13" y="1" width="10" height="10" fill="#7fba00" />
                  <rect x="1" y="13" width="10" height="10" fill="#00a4ef" />
                  <rect x="13" y="13" width="10" height="10" fill="#ffb900" />
                </svg>
              )}
              Microsoft ile Giriş Yap
            </button>
          </div>

          <div className={styles.divider}>
            <span>veya e-posta ile giriş yap</span>
          </div>

          {error && (
            <div className={styles.errorBox} role="alert">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className={styles.form} id="login-form">
            <div className={styles.inputGroup}>
              <label htmlFor="login-email" className="input-label">
                E-posta Adresi
              </label>
              <input
                id="login-email"
                type="email"
                className="input-field"
                placeholder="ornek@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </div>

            <div className={styles.inputGroup}>
              <div className={styles.labelRow}>
                <label htmlFor="login-password" className="input-label">
                  Şifre
                </label>
                <a href="#" className={styles.forgotLink}>
                  Şifremi Unuttum
                </a>
              </div>
              <div className={styles.passwordWrapper}>
                <input
                  id="login-password"
                  type={showPassword ? "text" : "password"}
                  className="input-field"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className={styles.passwordToggle}
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Şifreyi gizle" : "Şifreyi göster"}
                >
                  {showPassword ? (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24" />
                      <line x1="1" y1="1" x2="23" y2="23" />
                    </svg>
                  ) : (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className={`btn btn-primary btn-lg ${styles.submitBtn}`}
              disabled={isLoading || !!socialLoading}
              id="login-submit"
            >
              {isLoading ? (
                <span className={styles.spinner} />
              ) : (
                "Giriş Yap"
              )}
            </button>
          </form>

          <p className={styles.registerLink}>
            Hesabınız yok mu?{" "}
            <Link href="/register" className={styles.link}>
              Kayıt Olun
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
