import styles from "./HowItWorksSection.module.css";

const steps = [
  {
    number: "01",
    title: "Kayıt Ol & Sınıfını Oluştur",
    description:
      "Kurumunuzu veya bireysel hesabınızı dakikalar içinde oluşturun. Sınıflarınızı tanımlayın ve öğrencilerinizi davet edin.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="8.5" cy="7" r="4" />
        <line x1="20" y1="8" x2="20" y2="14" />
        <line x1="23" y1="11" x2="17" y2="11" />
      </svg>
    ),
  },
  {
    number: "02",
    title: "Ödev Ata & AI ile Değerlendir",
    description:
      "TOEFL, YDS veya YÖKDİL formatlarında ödevler oluşturun. Öğrenciler ödevlerini tamamladığında AI anında analiz eder.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
        <polyline points="10 9 9 9 8 9" />
      </svg>
    ),
  },
  {
    number: "03",
    title: "Sonuçları İzle & Gelişimi Takip Et",
    description:
      "Detaylı raporlar ve analizlerle öğrenci gelişimini takip edin. Zayıf alanları belirleyin ve kişiselleştirilmiş öneriler alın.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="20" x2="18" y2="10" />
        <line x1="12" y1="20" x2="12" y2="4" />
        <line x1="6" y1="20" x2="6" y2="14" />
      </svg>
    ),
  },
];

export default function HowItWorksSection() {
  return (
    <section className={`section ${styles.howItWorks}`} id="how-it-works">
      <div className="container">
        <div className={styles.header}>
          <span className="section-label">🚀 Nasıl Çalışır</span>
          <h2 className="section-title">
            <span className="text-gradient">3 Kolay Adımda</span> Başlayın
          </h2>
          <p className="section-subtitle">
            DilAI ile eğitim süreçlerinizi dijitalleştirmek dakikalar alır.
          </p>
        </div>

        <div className={styles.stepsContainer}>
          {steps.map((step, index) => (
            <div key={step.number} className={styles.stepWrapper}>
              <div className={`glass-card ${styles.step}`}>
                <div className={styles.stepNumber}>{step.number}</div>
                <div className={styles.stepIcon}>{step.icon}</div>
                <h3 className={styles.stepTitle}>{step.title}</h3>
                <p className={styles.stepDesc}>{step.description}</p>
              </div>
              {index < steps.length - 1 && (
                <div className={styles.connector}>
                  <svg width="40" height="12" viewBox="0 0 40 12" fill="none">
                    <path
                      d="M0 6h32M28 1l6 5-6 5"
                      stroke="url(#arrow-grad)"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <defs>
                      <linearGradient id="arrow-grad" x1="0" y1="6" x2="40" y2="6">
                        <stop stopColor="#6366f1" />
                        <stop offset="1" stopColor="#a855f7" />
                      </linearGradient>
                    </defs>
                  </svg>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
