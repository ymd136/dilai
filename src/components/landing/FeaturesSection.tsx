import styles from "./FeaturesSection.module.css";

const features = [
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
        <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
        <line x1="12" y1="19" x2="12" y2="23" />
        <line x1="8" y1="23" x2="16" y2="23" />
      </svg>
    ),
    title: "AI Konuşma Analizi",
    description:
      "Öğrencilerin ses kayıtlarını metne dönüştürerek telaffuz, akıcılık ve kelime doğruluğu analizi yapar. Gelişmiş LLM modelleriyle anlık geri bildirim sağlar.",
    tag: "Speaking",
    gradient: "linear-gradient(135deg, #6366f1, #818cf8)",
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
      </svg>
    ),
    title: "Akademik Sınav Değerlendirme",
    description:
      "TOEFL, YDS ve YÖKDİL kriterlerine (Rubric) uygun otomatik puanlama ve yapay zeka geri bildirimi sağlar. Her bölüm için detaylı skor analizi.",
    tag: "Scoring",
    gradient: "linear-gradient(135deg, #8b5cf6, #a78bfa)",
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
        <line x1="9" y1="7" x2="17" y2="7" />
        <line x1="9" y1="11" x2="15" y2="11" />
      </svg>
    ),
    title: "Kurumsal Ödev Yönetimi",
    description:
      "Eğitmenlerin kolayca sınıflar oluşturmasına, sınav formatlarına uygun ödevler tanımlamasına ve öğrenci gelişimini takip etmesine olanak tanır.",
    tag: "LMS",
    gradient: "linear-gradient(135deg, #a855f7, #c084fc)",
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="9 11 12 14 22 4" />
        <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
      </svg>
    ),
    title: "Anlık Hata & Gramer Tespiti",
    description:
      "Cümle içi zaman uyumsuzluklarını, yanlış bağlaç kullanımlarını ve kelime hatalarını detaylı açıklamalarıyla birlikte listeler.",
    tag: "Grammar",
    gradient: "linear-gradient(135deg, #ec4899, #f472b6)",
  },
];

export default function FeaturesSection() {
  return (
    <section className={`section ${styles.features}`} id="features">
      <div className="container">
        <div className={styles.header}>
          <span className="section-label">✨ Özellikler</span>
          <h2 className="section-title">
            <span className="text-gradient">Yapay Zeka</span> ile Güçlendirilmiş
            <br />
            Eğitim Araçları
          </h2>
          <p className="section-subtitle">
            Gelişmiş dil modelleri ve ses analitiği altyapısıyla öğrencilerin
            dil yetkinliğini ölçün, analiz edin ve geliştirin.
          </p>
        </div>

        <div className={styles.grid}>
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className={`glass-card ${styles.card}`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div
                className={styles.cardIcon}
                style={{ background: feature.gradient }}
              >
                {feature.icon}
              </div>
              <div className={styles.cardTag}>{feature.tag}</div>
              <h3 className={styles.cardTitle}>{feature.title}</h3>
              <p className={styles.cardDescription}>{feature.description}</p>
              <div
                className={styles.cardGlow}
                style={{
                  background: feature.gradient,
                }}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
