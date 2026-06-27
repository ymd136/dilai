"use client";

import { useState } from "react";
import Link from "next/link";
import styles from "./register.module.css";

type UserRole = "student" | "teacher" | "admin";

const roles: { value: UserRole; label: string; icon: string; desc: string }[] = [
  {
    value: "student",
    label: "Öğrenci",
    icon: "🎓",
    desc: "Sınav hazırlığı ve ödev takibi",
  },
  {
    value: "teacher",
    label: "Eğitmen",
    icon: "👨‍🏫",
    desc: "Ödev atama ve performans analizi",
  },
  {
    value: "admin",
    label: "Kurum Yöneticisi",
    icon: "🏫",
    desc: "Kurum geneli yönetim ve raporlama",
  },
];

export default function RegisterPage() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<UserRole>("student");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // TODO: Implement registration
    setTimeout(() => setIsLoading(false), 1500);
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
              <rect width="28" height="28" rx="8" fill="url(#reg-logo)" />
              <path d="M8 10h4v8H8V10zm8 0h4v8h-4V10z" fill="white" opacity="0.9" />
              <path d="M12 13h4v2h-4v-2z" fill="white" opacity="0.7" />
              <defs>
                <linearGradient id="reg-logo" x1="0" y1="0" x2="28" y2="28">
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
            Eğitimde
            <br />
            <span className="text-gradient-accent">Yeni Nesil</span>
            <br />
            Deneyim
          </h1>

          <p className={styles.brandDesc}>
            Hemen ücretsiz hesabınızı oluşturun ve yapay zeka destekli dil
            eğitimi platformunun gücünü keşfedin.
          </p>

          <div className={styles.features}>
            <div className={styles.feature}>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M16.667 5L7.5 14.167 3.333 10" stroke="#818cf8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span>AI destekli konuşma analizi</span>
            </div>
            <div className={styles.feature}>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M16.667 5L7.5 14.167 3.333 10" stroke="#818cf8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span>TOEFL, YDS, YÖKDİL formatları</span>
            </div>
            <div className={styles.feature}>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M16.667 5L7.5 14.167 3.333 10" stroke="#818cf8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span>Detaylı performans raporları</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Register Form */}
      <div className={styles.formSide}>
        <div className={styles.formContainer}>
          <div className={styles.formHeader}>
            <h2 className={styles.formTitle}>Hesap Oluşturun</h2>
            <p className={styles.formSubtitle}>
              Ücretsiz hesabınızı oluşturarak başlayın
            </p>
          </div>

          <form onSubmit={handleSubmit} className={styles.form} id="register-form">
            {/* Role Selection */}
            <div className={styles.roleSelector}>
              {roles.map((r) => (
                <button
                  key={r.value}
                  type="button"
                  className={`${styles.roleCard} ${role === r.value ? styles.roleActive : ""}`}
                  onClick={() => setRole(r.value)}
                  id={`role-${r.value}`}
                >
                  <span className={styles.roleIcon}>{r.icon}</span>
                  <span className={styles.roleLabel}>{r.label}</span>
                  <span className={styles.roleDesc}>{r.desc}</span>
                </button>
              ))}
            </div>

            {/* Name Fields */}
            <div className={styles.nameRow}>
              <div className={styles.inputGroup}>
                <label htmlFor="register-firstname" className="input-label">
                  Ad
                </label>
                <input
                  id="register-firstname"
                  type="text"
                  className="input-field"
                  placeholder="Adınız"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                  autoComplete="given-name"
                />
              </div>
              <div className={styles.inputGroup}>
                <label htmlFor="register-lastname" className="input-label">
                  Soyad
                </label>
                <input
                  id="register-lastname"
                  type="text"
                  className="input-field"
                  placeholder="Soyadınız"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                  autoComplete="family-name"
                />
              </div>
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="register-email" className="input-label">
                E-posta Adresi
              </label>
              <input
                id="register-email"
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
              <label htmlFor="register-password" className="input-label">
                Şifre
              </label>
              <div className={styles.passwordWrapper}>
                <input
                  id="register-password"
                  type={showPassword ? "text" : "password"}
                  className="input-field"
                  placeholder="En az 8 karakter"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={8}
                  autoComplete="new-password"
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
              disabled={isLoading}
              id="register-submit"
            >
              {isLoading ? (
                <span className={styles.spinner} />
              ) : (
                "Kayıt Ol"
              )}
            </button>
          </form>

          <p className={styles.terms}>
            Kayıt olarak{" "}
            <a href="#" className={styles.link}>
              Kullanım Şartları
            </a>{" "}
            ve{" "}
            <a href="#" className={styles.link}>
              Gizlilik Politikası
            </a>
            &apos;nı kabul etmiş olursunuz.
          </p>

          <p className={styles.loginLink}>
            Zaten hesabınız var mı?{" "}
            <Link href="/login" className={styles.link}>
              Giriş Yapın
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
