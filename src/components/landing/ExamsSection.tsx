import styles from "./ExamsSection.module.css";

const exams = [
  {
    name: "TOEFL",
    fullName: "Test of English as a Foreign Language",
    description:
      "Reading, Listening, Speaking ve Writing bölümlerinde AI destekli analiz ve değerlendirme.",
    sections: ["Reading", "Listening", "Speaking", "Writing"],
    color: "#6366f1",
  },
  {
    name: "YDS",
    fullName: "Yabancı Dil Bilgisi Seviye Tespit Sınavı",
    description:
      "Kelime bilgisi, dilbilgisi, çeviri ve okuduğunu anlama bölümlerinde kapsamlı hazırlık.",
    sections: ["Vocabulary", "Grammar", "Translation", "Reading"],
    color: "#8b5cf6",
  },
  {
    name: "YÖKDİL",
    fullName: "Yükseköğretim Kurumları Yabancı Dil Sınavı",
    description:
      "Fen Bilimleri, Sosyal Bilimler ve Sağlık Bilimleri alanlarında uzmanlaşmış içerik analizi.",
    sections: ["Science", "Social", "Health", "Reading"],
    color: "#a855f7",
  },
];

export default function ExamsSection() {
  return (
    <section className={`section ${styles.exams}`} id="exams">
      <div className="container">
        <div className={styles.header}>
          <span className="section-label">📊 Desteklenen Sınavlar</span>
          <h2 className="section-title">
            Akademik Sınav Standartlarında
            <br />
            <span className="text-gradient">Otomatik Değerlendirme</span>
          </h2>
          <p className="section-subtitle">
            Uluslararası ve ulusal sınav kriterlerine uygun rubric tabanlı
            puanlama sistemi ile öğrencilerinize hassas geri bildirim sağlayın.
          </p>
        </div>

        <div className={styles.grid}>
          {exams.map((exam) => (
            <div key={exam.name} className={styles.card}>
              <div
                className={styles.cardBorder}
                style={{
                  background: `linear-gradient(180deg, ${exam.color}40, transparent)`,
                }}
              />
              <div className={styles.cardInner}>
                <div
                  className={styles.examBadge}
                  style={{ color: exam.color }}
                >
                  {exam.name}
                </div>
                <h3 className={styles.examFullName}>{exam.fullName}</h3>
                <p className={styles.examDesc}>{exam.description}</p>
                <div className={styles.sections}>
                  {exam.sections.map((section) => (
                    <span
                      key={section}
                      className={styles.sectionTag}
                      style={{
                        borderColor: `${exam.color}30`,
                        color: exam.color,
                      }}
                    >
                      {section}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
