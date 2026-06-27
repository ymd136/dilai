"use client";

import { useDashboard } from "@/contexts/DashboardContext";
import MentorRecommendations from "./MentorRecommendations";
import { MOCK_EXAM_OPTIONS } from "@/lib/mocks/examOptions";
import styles from "./EmptyState.module.css";

type EmptyStateProps = {
  userName: string;
};

export default function EmptyState({ userName }: EmptyStateProps) {
  const { selectedExam, examColor } = useDashboard();

  const examLabel =
    MOCK_EXAM_OPTIONS.find((e) => e.id === selectedExam)?.name ?? selectedExam;

  return (
    <div className={styles.wrapper} id="dashboard-empty-state">
      <div className={`${styles.hero} animate-fade-in-up`}>
        <span className="section-label">🎯 Başlangıç</span>
        <h2 className={`section-title ${styles.heroTitle}`}>
          Hoş Geldin, {userName.split(" ")[0]}!{" "}
          <span className="text-gradient">Hazırlığa Başla</span>
        </h2>
        <p className={`section-subtitle ${styles.heroSubtitle}`}>
          Henüz aktif bir sınıfın veya ödevin yok. Hedef sınavını seç ve yapay
          zeka mentorunun sana özel önerilerini keşfet.
        </p>
        <span
          className={styles.examBadge}
          style={{ "--exam-color": examColor } as React.CSSProperties}
        >
          Seçili Sınav: {examLabel}
        </span>
        <div className={styles.ctaRow}>
          <button type="button" className="btn btn-primary btn-lg">
            Sınıfa Katıl
          </button>
          <button type="button" className="btn btn-secondary btn-lg">
            Demo Ödev Dene
          </button>
        </div>
      </div>

      <MentorRecommendations />
    </div>
  );
}
