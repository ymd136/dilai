"use client";

import { useDashboard } from "@/contexts/DashboardContext";
import type { TeacherAssistantCard } from "@/types/teacher";
import styles from "./TeacherAssistantCards.module.css";

function CreateIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

function ForecastIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
    </svg>
  );
}

function VocabIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
    </svg>
  );
}

function AssistantCard({
  card,
  examColor,
  index,
}: {
  card: TeacherAssistantCard;
  examColor: string;
  index: number;
}) {
  const isFeatured = card.type === "create_assignment";
  const delayClass = `delay-${index + 1}`;

  const iconMap = {
    create_assignment: <CreateIcon />,
    performance_forecast: <ForecastIcon />,
    weekly_vocabulary: <VocabIcon />,
  };

  const cardClass = isFeatured
    ? `glass-card ${styles.featuredCard} animate-fade-in-up ${delayClass}`
    : `glass-card ${styles.card} animate-fade-in-up ${delayClass}`;

  return (
    <article
      className={cardClass}
      style={{ "--exam-color": examColor } as React.CSSProperties}
    >
      <div
        className={
          isFeatured
            ? `${styles.cardIcon} ${styles.featuredIcon}`
            : styles.cardIcon
        }
      >
        {iconMap[card.type]}
      </div>
      <h3
        className={
          isFeatured
            ? `${styles.cardTitle} ${styles.featuredTitle}`
            : styles.cardTitle
        }
      >
        {card.title}
      </h3>
      <p className={styles.cardDesc}>{card.description}</p>

      {card.type === "performance_forecast" && card.meta && (
        <div className={styles.meta}>
          <div className={styles.metaRow}>
            <span className={styles.metaLabel}>Projeksiyon</span>
            <span className={styles.metaValue}>{card.meta.projectedSuccess}</span>
          </div>
          {card.meta.optimizationTip && (
            <p className={styles.metaTip}>{card.meta.optimizationTip}</p>
          )}
        </div>
      )}

      {card.type === "weekly_vocabulary" && card.meta?.sampleWords && (
        <div className={styles.meta}>
          <div className={styles.metaRow}>
            <span className={styles.metaLabel}>Kelime Sayısı</span>
            <span className={styles.metaValue}>{card.meta.wordCount} kelime</span>
          </div>
          <div className={styles.wordTags}>
            {card.meta.sampleWords.map((word) => (
              <span key={word} className={styles.wordTag}>
                {word}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className={styles.cardActions}>
        {card.type === "create_assignment" ? (
          <button type="button" className="btn btn-primary btn-lg">
            Ödev Oluştur
          </button>
        ) : card.type === "performance_forecast" ? (
          <button type="button" className="btn btn-secondary">
            Detaylı Rapor
          </button>
        ) : (
          <button type="button" className="btn btn-primary">
            Sınıfa Gönder
          </button>
        )}
      </div>
    </article>
  );
}

export default function TeacherAssistantCards() {
  const { teacherAssistants, isLoadingTeacherAssistants, examColor, selectedExam } =
    useDashboard();

  if (isLoadingTeacherAssistants) {
    return (
      <div className={styles.loadingGrid}>
        <div className={`${styles.skeleton} ${styles.skeletonFeatured}`} />
        <div className={styles.skeleton} />
        <div className={styles.skeleton} />
      </div>
    );
  }

  return (
    <section className={styles.section} aria-label="AI eğitmen asistanı">
      <div className={styles.header}>
        <span className="section-label">🤖 AI Eğitmen Asistanı</span>
        <h2 className="section-title">
          <span className="text-gradient">Akıllı</span> Ödev & Analiz Merkezi
        </h2>
        <p className="section-subtitle">
          {selectedExam} formatına özel yapay zeka asistanın ödev oluşturma,
          performans tahmini ve kelime paketleri sunuyor.
        </p>
      </div>

      <div className={styles.grid}>
        {teacherAssistants.map((card, index) => (
          <AssistantCard
            key={card.id}
            card={card}
            examColor={examColor}
            index={index}
          />
        ))}
      </div>
    </section>
  );
}
