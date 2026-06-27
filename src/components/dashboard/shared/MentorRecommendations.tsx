"use client";

import { useDashboard } from "@/contexts/DashboardContext";
import type { MentorRecommendation } from "@/types/mentor";
import styles from "./MentorRecommendations.module.css";

function SpeakingIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
      <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
      <line x1="12" y1="19" x2="12" y2="23" />
      <line x1="8" y1="23" x2="16" y2="23" />
    </svg>
  );
}

function BoostIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
    </svg>
  );
}

function WordIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
      <line x1="9" y1="7" x2="17" y2="7" />
      <line x1="9" y1="11" x2="15" y2="11" />
    </svg>
  );
}

function RecommendationCard({
  item,
  examColor,
  index,
}: {
  item: MentorRecommendation;
  examColor: string;
  index: number;
}) {
  const isFeatured = item.type === "speaking_simulation";
  const delayClass = `delay-${index + 1}`;

  const iconMap = {
    speaking_simulation: <SpeakingIcon />,
    weakness_boost: <BoostIcon />,
    word_of_day: <WordIcon />,
  };

  const cardClass = isFeatured
    ? `glass-card ${styles.featuredCard} animate-fade-in-up ${delayClass}`
    : `glass-card ${styles.card} animate-fade-in-up ${delayClass}`;

  const iconClass = isFeatured
    ? `${styles.cardIcon} ${styles.featuredIcon}`
    : styles.cardIcon;

  const titleClass = isFeatured
    ? `${styles.cardTitle} ${styles.featuredTitle}`
    : styles.cardTitle;

  return (
    <article
      className={cardClass}
      style={{ "--exam-color": examColor } as React.CSSProperties}
    >
      <div className={iconClass}>{iconMap[item.type]}</div>
      <h3 className={titleClass}>{item.title}</h3>
      <p className={styles.cardDesc}>{item.description}</p>

      {item.type === "weakness_boost" && item.meta?.weakness && (
        <div className={styles.meta}>
          <span className={styles.metaLabel}>Tespit Edilen Zayıf Nokta</span>
          <span className={styles.metaValue}>{item.meta.weakness}</span>
        </div>
      )}

      {item.type === "word_of_day" && item.meta?.word && (
        <div className={styles.meta}>
          <span className={styles.metaLabel}>{item.meta.word}</span>
          <span className={styles.metaMeaning}>{item.meta.meaning}</span>
          {item.meta.exampleSentence && (
            <span className={styles.metaExample}>
              &ldquo;{item.meta.exampleSentence}&rdquo;
            </span>
          )}
        </div>
      )}

      <div className={styles.cardActions}>
        {item.type === "speaking_simulation" ? (
          <button type="button" className="btn btn-primary btn-lg">
            Simülasyonu Başlat
          </button>
        ) : item.type === "weakness_boost" ? (
          <button type="button" className="btn btn-primary">
            Mikro-Ödevi Başlat
          </button>
        ) : (
          <button type="button" className="btn btn-secondary">
            Kelimeyi Çalış
          </button>
        )}
      </div>
    </article>
  );
}

export default function MentorRecommendations() {
  const { recommendations, isLoadingRecommendations, examColor, selectedExam } =
    useDashboard();

  if (isLoadingRecommendations) {
    return (
      <div className={styles.loadingGrid}>
        <div className={`${styles.skeleton} ${styles.skeletonFeatured}`} />
        <div className={styles.skeleton} />
        <div className={styles.skeleton} />
      </div>
    );
  }

  if (recommendations.length === 0) {
    return (
      <p className={styles.emptyMessage}>
        {selectedExam} için henüz AI önerisi bulunamadı.
      </p>
    );
  }

  return (
    <section className={styles.section} aria-label="AI mentor önerileri">
      <div className={styles.header}>
        <span className="section-label">🤖 AI Mentor Önerileri</span>
        <h2 className="section-title">
          <span className="text-gradient">Kişiselleştirilmiş</span> Çalışma Planı
        </h2>
        <p className="section-subtitle">
          Seçtiğiniz sınav formatına göre yapay zeka mentorunuz size özel
          öneriler sunuyor.
        </p>
      </div>

      <div className={styles.grid}>
        {recommendations.map((item, index) => (
          <RecommendationCard
            key={item.id}
            item={item}
            examColor={examColor}
            index={index}
          />
        ))}
      </div>
    </section>
  );
}
