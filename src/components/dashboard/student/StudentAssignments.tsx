"use client";

import { useState } from "react";
import { EXAM_COLORS } from "@/types/exam";
import {
  MOCK_STUDENT_ASSIGNMENTS,
  type StudentAssignment,
  type StudentAssignmentStatus,
} from "@/lib/mocks/studentMockData";
import styles from "./StudentAssignments.module.css";

type Tab = "pending" | "completed" | "all";

const TAB_ORDER: { id: Tab; label: string }[] = [
  { id: "pending", label: "Bekleyen" },
  { id: "completed", label: "Tamamlanan" },
  { id: "all", label: "Tümü" },
];

const STATUS_LABELS: Record<StudentAssignmentStatus, string> = {
  pending: "Bekliyor",
  in_progress: "Devam Ediyor",
  completed: "Tamamlandı",
};

const TYPE_LABELS: Record<string, string> = {
  MULTIPLE_CHOICE: "Çoktan Seçmeli",
  SPEAKING: "Speaking",
  WRITING: "Writing",
};

type StudentAssignmentsProps = {
  onStartAssignment?: (assignment: StudentAssignment) => void;
};

export default function StudentAssignments({
  onStartAssignment,
}: StudentAssignmentsProps) {
  const [activeTab, setActiveTab] = useState<Tab>("pending");

  const filtered =
    activeTab === "all"
      ? MOCK_STUDENT_ASSIGNMENTS
      : MOCK_STUDENT_ASSIGNMENTS.filter((a) =>
          activeTab === "pending"
            ? a.status === "pending" || a.status === "in_progress"
            : a.status === "completed"
        );

  return (
    <div
      className={`${styles.assignments} animate-fade-in-up`}
      id="student-assignments"
    >
      <div>
        <span className="section-label">📚 Ödevlerim</span>
        <h2 className="section-title">
          Sınıflarım & <span className="text-gradient">Ödevlerim</span>
        </h2>
        <p className="section-subtitle">
          Sınıflarına atanmış ödevleri görüntüle ve çözmeye başla.
        </p>
      </div>

      {/* Tabs */}
      <div className={styles.tabs}>
        {TAB_ORDER.map(
          (tab) => (
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
          )
        )}
      </div>

      {/* Cards */}
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
            const statusClass =
              assignment.status === "completed"
                ? styles.statusCompleted
                : assignment.status === "in_progress"
                ? styles.statusInProgress
                : styles.statusPending;

            return (
              <article
                key={assignment.id}
                className={`glass-card ${styles.assignmentCard}`}
                style={
                  { "--exam-color": examColor } as React.CSSProperties
                }
              >
                <div className={styles.cardHeader}>
                  <div>
                    <h3 className={styles.cardTitle}>{assignment.title}</h3>
                    <p className={styles.cardClass}>{assignment.className}</p>
                  </div>
                  <span className={`${styles.statusBadge} ${statusClass}`}>
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

                  {assignment.status === "completed" && assignment.score ? (
                    <div className={styles.scoreDisplay}>
                      <span className={styles.scoreBadge}>
                        %{assignment.score}
                      </span>
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
    </div>
  );
}
