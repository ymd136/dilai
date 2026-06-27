import styles from "./TargetAudienceSection.module.css";

const audiences = [
  {
    emoji: "🏫",
    title: "Eğitim Kurumları & Dil Okulları",
    description:
      "Öğrencilerinize toplu ödev atayın, AI raporlarıyla performanslarını takip edin. Kurum genelinde analitik dashboard ile eğitim kalitesini ölçün.",
    highlights: ["Toplu ödev atama", "Performans raporları", "Kurum analitiği"],
  },
  {
    emoji: "🎓",
    title: "Sınava Hazırlanan Öğrenciler",
    description:
      "TOEFL, YDS ve YÖKDİL formatlarında pratik yapın. AI koçunuzla konuşma pratiği yaparak stressiz bir sınav hazırlığı deneyimi yaşayın.",
    highlights: ["Gerçek sınav formatı", "AI koç desteği", "Stressiz pratik"],
  },
  {
    emoji: "💼",
    title: "Profesyoneller",
    description:
      "Akademik seviyede İngilizce yetkinliğinizi geliştirin. İş hayatınızda ihtiyaç duyduğunuz dil becerilerini esnek zaman dilimlerinde kazanın.",
    highlights: [
      "Esnek çalışma saatleri",
      "Akademik İngilizce",
      "Kariyer gelişimi",
    ],
  },
  {
    emoji: "👨‍🏫",
    title: "İngilizce Eğitmenleri",
    description:
      "Öğrencilerinize verimli konuşma ödevleri atayın. AI analiz raporlarıyla ödev kontrol yükünüzü minimuma indirin ve öğretmeye odaklanın.",
    highlights: [
      "Otomatik ödev kontrolü",
      "Detaylı AI raporları",
      "Zaman tasarrufu",
    ],
  },
];

export default function TargetAudienceSection() {
  return (
    <section className={`section ${styles.audience}`} id="audience">
      <div className="container">
        <div className={styles.header}>
          <span className="section-label">👥 Hedef Kitle</span>
          <h2 className="section-title">
            <span className="text-gradient">Herkes İçin</span> Tasarlandı
          </h2>
          <p className="section-subtitle">
            Eğitim ekosisteminin her paydaşına özel çözümler sunarak dil
            öğrenimini demokratikleştiriyoruz.
          </p>
        </div>

        <div className={styles.grid}>
          {audiences.map((audience, index) => (
            <div
              key={audience.title}
              className={`glass-card ${styles.card}`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className={styles.cardEmoji}>{audience.emoji}</div>
              <h3 className={styles.cardTitle}>{audience.title}</h3>
              <p className={styles.cardDesc}>{audience.description}</p>
              <div className={styles.highlights}>
                {audience.highlights.map((item) => (
                  <span key={item} className={styles.highlight}>
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 14 14"
                      fill="none"
                    >
                      <path
                        d="M11.667 3.5L5.25 9.917 2.333 7"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    {item}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
