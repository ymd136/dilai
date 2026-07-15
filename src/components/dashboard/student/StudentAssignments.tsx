"use client";

import { useMemo, useState } from "react";
import { EXAM_COLORS } from "@/types/exam";
import {
  type StudentAssignment,
  type StudentAssignmentStatus,
  type StudentAssignmentType,
  classNameToId,
} from "@/lib/mocks/studentMockData";
import { useStudentAssignments } from "@/hooks/useAssignmentStore";
import styles from "./StudentAssignments.module.css";

type StatusTab = "pending" | "completed" | "all";
type TypeFilter = "ALL" | StudentAssignmentType;

const STATUS_TAB_ORDER: { id: StatusTab; label: string }[] = [
  { id: "pending", label: "Bekleyen" },
  { id: "completed", label: "Tamamlanan" },
  { id: "all", label: "Tümü" },
];

const TYPE_FILTERS: { id: TypeFilter; label: string }[] = [
  { id: "ALL", label: "Tümü" },
  { id: "WRITING", label: "Writing" },
  { id: "SPEAKING", label: "Speaking" },
  { id: "MULTIPLE_CHOICE", label: "Quizzes" },
];

const STATUS_LABELS: Record<StudentAssignmentStatus, string> = {
  pending: "Yapılacak",
  grading: "Değerlendiriliyor",
  completed: "Tamamlandı",
};

const TYPE_LABELS: Record<StudentAssignmentType, string> = {
  MULTIPLE_CHOICE: "Çoktan Seçmeli",
  SPEAKING: "Speaking",
  WRITING: "Writing",
};

const METRIC_LABELS: Record<string, string> = {
  grammar: "Dilbilgisi",
  vocabulary: "Kelime Bilgisi",
  coherence: "Tutarlılık",
  fluency: "Akıcılık",
  pronunciation: "Telaffuz",
  taskAchievement: "Görevi Tamamlama",
};

type StudentAssignmentsProps = {
  onStartAssignment?: (assignment: StudentAssignment) => void;
  /** When set, only show assignments for this class (by name or id) */
  classFilter?: string | null;
};

export default function StudentAssignments({
  onStartAssignment,
  classFilter = null,
}: StudentAssignmentsProps) {
  const assignments = useStudentAssignments();
  const [activeTab, setActiveTab] = useState<StatusTab>("pending");
  const [typeFilter, setTypeFilter] = useState<TypeFilter>("ALL");
  const [resultsAssignment, setResultsAssignment] =
    useState<StudentAssignment | null>(null);

  const filtered = useMemo(() => {
    return assignments.filter((a) => {
      const classOk =
        !classFilter ||
        a.className === classFilter ||
        classNameToId(a.className) === classFilter;

      const statusOk =
        activeTab === "all"
          ? true
          : activeTab === "pending"
            ? a.status === "pending" || a.status === "grading"
            : a.status === "completed";

      const typeOk = typeFilter === "ALL" ? true : a.type === typeFilter;
      return classOk && statusOk && typeOk;
    });
  }, [assignments, activeTab, typeFilter, classFilter]);

  const statusClass = (status: StudentAssignmentStatus) => {
    if (status === "completed") return styles.statusCompleted;
    if (status === "grading") return styles.statusGrading;
    return styles.statusPending;
  };

  return (
    <div
      className={`${styles.assignments} animate-fade-in-up`}
      id="student-assignments"
    >
      {!classFilter && (
      <div>
        <span className="section-label">📚 Ödevlerim</span>
        <h2 className="section-title">
          Sınıflarım & <span className="text-gradient">Ödevlerim</span>
        </h2>
        <p className="section-subtitle">
          Sınıflarına atanmış ödevleri görüntüle ve çözmeye başla.
        </p>
      </div>
      )}

      <div className={styles.tabs}>
        {STATUS_TAB_ORDER.map((tab) => (
          <button
            key={tab.id}
            type="button"
            className={`${styles.tab} ${
              activeTab === tab.id ? styles.tabActive : ""
            }`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className={styles.typePills} role="group" aria-label="Ödev tipi filtresi">
        {TYPE_FILTERS.map((filter) => (
          <button
            key={filter.id}
            type="button"
            className={`${styles.typePill} ${
              typeFilter === filter.id ? styles.typePillActive : ""
            }`}
            onClick={() => setTypeFilter(filter.id)}
          >
            {filter.label}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className={`glass-card ${styles.emptyState}`}>
          <span className={styles.emptyIcon}>📭</span>
          <h3 className={styles.emptyTitle}>Ödev Yok</h3>
          <p className={styles.emptyDesc}>
            Bu kategoride henüz ödev bulunmuyor.
          </p>
        </div>
      ) : (
        <div className={styles.cardGrid}>
          {filtered.map((assignment) => {
            const examColor = EXAM_COLORS[assignment.examType];

            return (
              <article
                key={assignment.id}
                className={`glass-card ${styles.assignmentCard}`}
                style={{ "--exam-color": examColor } as React.CSSProperties}
              >
                <div className={styles.cardHeader}>
                  <div>
                    <h3 className={styles.cardTitle}>{assignment.title}</h3>
                    <p className={styles.cardClass}>{assignment.className}</p>
                  </div>
                  <span
                    className={`${styles.statusBadge} ${statusClass(assignment.status)}`}
                  >
                    {STATUS_LABELS[assignment.status]}
                  </span>
                </div>

                <div className={styles.cardMeta}>
                  <span className={`${styles.badge} ${styles.examBadge}`}>
                    {assignment.examType === "YOKDIL"
                      ? "YÖKDİL"
                      : assignment.examType}
                  </span>
                  <span className={`${styles.badge} ${styles.typeBadge}`}>
                    {TYPE_LABELS[assignment.type]}
                  </span>
                  <span className={`${styles.badge} ${styles.levelBadge}`}>
                    {assignment.level}
                  </span>
                </div>

                <div className={styles.cardFooter}>
                  <div className={styles.dueDate}>
                    <span>📅</span>
                    {new Date(assignment.dueDate).toLocaleDateString("tr-TR", {
                      day: "numeric",
                      month: "short",
                    })}
                    <span className={styles.questionCount}>
                      • {assignment.questionCount} Soru
                    </span>
                  </div>

                  {assignment.status === "grading" ? (
                    <span className={styles.gradingHint}>AI puanlıyor…</span>
                  ) : assignment.status === "completed" ? (
                    <div className={styles.scoreDisplay}>
                      {assignment.score != null && (
                        <span className={styles.scoreBadge}>
                          %{assignment.score}
                        </span>
                      )}
                      <button
                        type="button"
                        className={styles.startBtn}
                        onClick={() => setResultsAssignment(assignment)}
                      >
                        Sonuçları Gör
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      className={styles.startBtn}
                      onClick={() => onStartAssignment?.(assignment)}
                    >
                      Başla →
                    </button>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      )}

      {resultsAssignment?.aiAnalysis && (
        <div
          className={styles.modalOverlay}
          role="dialog"
          aria-modal="true"
          aria-labelledby="results-modal-title"
          onClick={() => setResultsAssignment(null)}
        >
          <div
            className={`glass-card ${styles.modalPanel}`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.modalHeader}>
              <div>
                <h3 id="results-modal-title" className={styles.modalTitle}>
                  AI Değerlendirme Sonuçları
                </h3>
                <p className={styles.modalSubtitle}>{resultsAssignment.title}</p>
              </div>
              <button
                type="button"
                className={styles.modalClose}
                onClick={() => setResultsAssignment(null)}
                aria-label="Kapat"
              >
                ✕
              </button>
            </div>

            <div className={styles.modalScoreRow}>
              <div className={styles.modalScoreBlock}>
                <span className={styles.modalScoreValue}>
                  %{resultsAssignment.aiAnalysis.score}
                </span>
                <span className={styles.modalScoreLabel}>Genel Puan</span>
              </div>
              <div className={styles.modalCefr}>
                <span className={styles.modalCefrLabel}>CEFR Seviyesi</span>
                <span className={styles.modalCefrValue}>
                  {resultsAssignment.aiAnalysis.cefrLevel}
                </span>
              </div>
            </div>

            <div className={styles.metricGrid}>
              {Object.entries(resultsAssignment.aiAnalysis.metrics).map(
                ([key, value]) =>
                  value != null ? (
                    <div key={key} className={styles.metricItem}>
                      <div className={styles.metricHeader}>
                        <span>{METRIC_LABELS[key] ?? key}</span>
                        <strong>{value}</strong>
                      </div>
                      <div className={styles.metricBar}>
                        <div
                          className={styles.metricBarFill}
                          style={{ width: `${value}%` }}
                        />
                      </div>
                    </div>
                  ) : null
              )}
            </div>

            <div className={styles.feedbackBlock}>
              <h4>Dilbilgisi</h4>
              <p>{resultsAssignment.aiAnalysis.grammarFeedback}</p>
            </div>
            <div className={styles.feedbackBlock}>
              <h4>Kelime Bilgisi</h4>
              <p>{resultsAssignment.aiAnalysis.vocabularyFeedback}</p>
            </div>
            <div className={styles.feedbackBlock}>
              <h4>Genel Değerlendirme</h4>
              <p>{resultsAssignment.aiAnalysis.generalReview}</p>
            </div>

            <button
              type="button"
              className={`btn btn-primary ${styles.modalAction}`}
              onClick={() => setResultsAssignment(null)}
            >
              Kapat
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
