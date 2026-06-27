import Link from "next/link";
import styles from "./CTASection.module.css";

export default function CTASection() {
  return (
    <section className={`section ${styles.cta}`} id="cta">
      <div className="container">
        <div className={styles.ctaCard}>
          {/* Background gradient */}
          <div className={styles.ctaBg} aria-hidden="true" />

          <div className={styles.ctaContent}>
            <h2 className={styles.ctaTitle}>
              Eğitim Kurumunuz İçin
              <br />
              <span className="text-gradient">DilAI&apos;ı Keşfedin</span>
            </h2>
            <p className={styles.ctaDesc}>
              Yapay zeka destekli dil eğitimi platformuyla öğrencilerinizin
              akademik başarısını artırın. Hemen ücretsiz deneme hesabınızı
              oluşturun.
            </p>
            <div className={styles.ctaActions}>
              <Link href="/register" className="btn btn-primary btn-lg">
                Ücretsiz Deneyin
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 18 18"
                  fill="currentColor"
                >
                  <path d="M9.354 3.354a.5.5 0 0 0-.708-.708l-6 6a.5.5 0 0 0 0 .708l6 6a.5.5 0 0 0 .708-.708L4.207 9.5H14.5a.5.5 0 0 0 0-1H4.207l5.147-5.146z" transform="rotate(180 9 9)" />
                </svg>
              </Link>
              <Link href="/login" className="btn btn-secondary btn-lg">
                Giriş Yap
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
