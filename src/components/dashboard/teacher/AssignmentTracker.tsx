"use client";

import { useDashboard } from "@/contexts/DashboardContext";
import { getAssignmentsByExam } from "@/lib/mocks/teacherData";
import { EXAM_COLORS } from "@/types/exam";
import { MOCK_EXAM_OPTIONS } from "@/lib/mocks/examOptions";
import type { TeacherAssignment } from "@/types/teacher";
import styles from "./AssignmentTracker.module.css";

function getSubmissionClass(submitted: number, total: number): string {
  const ratio = submitted / total;
  if (ratio >= 1) return styles.submissionComplete;
  if (ratio >= 0.6) return styles.submissionPartial;
  return styles.submissionLow;
}

function formatDueDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("tr-TR", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function AssignmentRow({ assignment }: { assignment: TeacherAssignment }) {
  const examColor = EXAM_COLORS[assignment.examType];
  const submissionClass = getSubmissionClass(
    assignment.submittedCount,
    assignment.totalCount
  );

  return (
    <tr>
      <td>
        <div className={styles.assignmentTitle}>{assignment.title}</div>
        <div className={styles.className}>{assignment.className}</div>
      </td>
      <td>
        <span
          className={`${styles.badge} ${styles.examBadge}`}
          style={{ "--exam-color": examColor } as React.CSSProperties}
        >
          {assignment.examType === "YOKDIL" ? "YÖKDİL" : assignment.examType}
        </span>
      </td>
      <td>
        <span className={`${styles.badge} ${styles.typeBadge}`}>
          {assignment.assignmentType}
        </span>
      </td>
      <td>
        <span className={`${styles.badge} ${styles.submissionBadge} ${submissionClass}`}>
          {assignment.submittedCount}/{assignment.totalCount} Teslim Edildi
        </span>
      </td>
      <td>
        <span className={styles.dueDate}>{formatDueDate(assignment.dueDate)}</span>
      </td>
    </tr>
  );
}

export default function AssignmentTracker() {
  const { selectedExam } = useDashboard();
  const assignments = getAssignmentsByExam(selectedExam);

  const examLabel =
    MOCK_EXAM_OPTIONS.find((e) => e.id === selectedExam)?.name ?? selectedExam;

  if (assignments.length === 0) {
    return (
      <section className={styles.section} aria-label="Ödev takibi">
        <div className={styles.header}>
          <span className="section-label">📋 Ödevler</span>
          <h2 className="section-title">Atanan Ödevlerin Takibi</h2>
        </div>
        <div className={`glass-card ${styles.emptyState}`}>
          {examLabel} formatında atanmış ödev bulunmuyor.
        </div>
      </section>
    );
  }

  return (
    <section
      className={`${styles.section} animate-fade-in-up delay-5`}
      aria-label="Ödev takibi"
      id="assignment-tracker"
    >
      <div className={styles.header}>
        <span className="section-label">📋 Ödevler</span>
        <h2 className="section-title">
          Atanan Ödevlerin <span className="text-gradient">Takibi</span>
        </h2>
        <p className="section-subtitle">
          {examLabel} formatındaki ödevlerin teslim durumları ve son tarihleri.
        </p>
      </div>

      <div className={`glass-card ${styles.tableWrap}`}>
        <table className={styles.table}>
          <thead className={styles.tableHead}>
            <tr>
              <th>Ödev</th>
              <th>Sınav Türü</th>
              <th>Ödev Tipi</th>
              <th>Teslim Durumu</th>
              <th>Son Tarih</th>
            </tr>
          </thead>
          <tbody className={styles.tableBody}>
            {assignments.map((assignment) => (
              <AssignmentRow key={assignment.id} assignment={assignment} />
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
