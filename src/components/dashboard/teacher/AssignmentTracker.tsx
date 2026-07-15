"use client";

import { useMemo, useState } from "react";
import { useDashboard } from "@/contexts/DashboardContext";
import { MOCK_EXAM_OPTIONS } from "@/lib/mocks/examOptions";
import { useTeacherAssignments } from "@/hooks/useAssignmentStore";
import { gradeTeacherSubmission } from "@/lib/mocks/assignmentStore";
import { EXAM_COLORS } from "@/types/exam";
import type {
  TeacherAssignment,
  TeacherStudentSubmission,
  StudentSubmissionStatus,
} from "@/types/teacher";
import { toast } from "@/lib/toast";
import styles from "./AssignmentTracker.module.css";

const METRIC_LABELS: Record<string, string> = {
  grammar: "Dilbilgisi Doğruluğu",
  vocabulary: "Kelime Zenginliği",
  coherence: "Tutarlılık",
  fluency: "Akıcılık",
  pronunciation: "Telaffuz",
  taskAchievement: "Görev Başarısı",
};

const STATUS_LABELS: Record<StudentSubmissionStatus, string> = {
  not_submitted: "Teslim Edilmedi",
  grading: "Değerlendiriliyor",
  graded: "Puanlandı",
};

function getSubmissionClass(submitted: number, total: number): string {
  const ratio = total === 0 ? 0 : submitted / total;
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

function statusBadgeClass(status: StudentSubmissionStatus): string {
  if (status === "graded") return styles.studentStatusGraded;
  if (status === "grading") return styles.studentStatusGrading;
  return styles.studentStatusPending;
}

function AssignmentRow({
  assignment,
  onOpen,
}: {
  assignment: TeacherAssignment;
  onOpen: (assignment: TeacherAssignment) => void;
}) {
  const examColor = EXAM_COLORS[assignment.examType];
  const submissionClass = getSubmissionClass(
    assignment.submittedCount,
    assignment.totalCount
  );

  return (
    <tr
      className={styles.clickableRow}
      onClick={() => onOpen(assignment)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onOpen(assignment);
        }
      }}
      tabIndex={0}
      role="button"
      aria-label={`${assignment.title} teslim detaylarını aç`}
    >
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
        <span
          className={`${styles.badge} ${styles.submissionBadge} ${submissionClass}`}
        >
          {assignment.submittedCount}/{assignment.totalCount} Teslim Edildi
        </span>
      </td>
      <td>
        <span className={styles.dueDate}>
          {formatDueDate(assignment.dueDate)}
        </span>
      </td>
    </tr>
  );
}

export default function AssignmentTracker() {
  const { selectedExam } = useDashboard();
  const assignments = useTeacherAssignments(selectedExam);
  const [selectedAssignmentId, setSelectedAssignmentId] = useState<
    string | null
  >(null);
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(
    null
  );
  const [isGrading, setIsGrading] = useState(false);

  const examLabel =
    MOCK_EXAM_OPTIONS.find((e) => e.id === selectedExam)?.name ?? selectedExam;

  const selectedAssignment = useMemo(
    () => assignments.find((a) => a.id === selectedAssignmentId) ?? null,
    [assignments, selectedAssignmentId]
  );

  const selectedSubmission = useMemo(() => {
    if (!selectedAssignment || !selectedStudentId) return null;
    return (
      selectedAssignment.submissions.find((s) => s.id === selectedStudentId) ??
      null
    );
  }, [selectedAssignment, selectedStudentId]);

  const openAssignment = (assignment: TeacherAssignment) => {
    setSelectedAssignmentId(assignment.id);
    const firstSubmitted = assignment.submissions.find(
      (s) => s.status !== "not_submitted"
    );
    setSelectedStudentId(firstSubmitted?.id ?? null);
  };

  const closePanel = () => {
    setSelectedAssignmentId(null);
    setSelectedStudentId(null);
    setIsGrading(false);
  };

  const handleGrade = async (submission: TeacherStudentSubmission) => {
    if (!selectedAssignment) return;
    setIsGrading(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    gradeTeacherSubmission(selectedAssignment.id, submission.id);
    setIsGrading(false);
    toast.success("Yapay zeka analizi tamamlandı!");
  };

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
              <AssignmentRow
                key={assignment.id}
                assignment={assignment}
                onOpen={openAssignment}
              />
            ))}
          </tbody>
        </table>
      </div>

      {selectedAssignment && (
        <div
          className={styles.modalOverlay}
          role="dialog"
          aria-modal="true"
          aria-labelledby="submission-details-title"
          onClick={closePanel}
        >
          <div
            className={`glass-card ${styles.drawerPanel}`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.drawerHeader}>
              <div>
                <h3
                  id="submission-details-title"
                  className={styles.drawerTitle}
                >
                  Ödev Teslim Detayları
                </h3>
                <p className={styles.drawerSubtitle}>
                  {selectedAssignment.title} · {selectedAssignment.className}
                </p>
              </div>
              <button
                type="button"
                className={styles.drawerClose}
                onClick={closePanel}
                aria-label="Kapat"
              >
                ✕
              </button>
            </div>

            <div className={styles.drawerBody}>
              <div className={styles.studentList}>
                <h4 className={styles.panelSectionTitle}>Öğrenciler</h4>
                {selectedAssignment.submissions.map((submission) => (
                  <button
                    key={submission.id}
                    type="button"
                    className={`${styles.studentItem} ${
                      selectedStudentId === submission.id
                        ? styles.studentItemActive
                        : ""
                    }`}
                    onClick={() => setSelectedStudentId(submission.id)}
                    disabled={submission.status === "not_submitted"}
                  >
                    <span className={styles.studentName}>
                      {submission.studentName}
                    </span>
                    <span
                      className={`${styles.studentStatus} ${statusBadgeClass(submission.status)}`}
                    >
                      {STATUS_LABELS[submission.status]}
                    </span>
                  </button>
                ))}
              </div>

              <div className={styles.detailPane}>
                {!selectedSubmission ||
                selectedSubmission.status === "not_submitted" ? (
                  <div className={styles.detailEmpty}>
                    Teslim edilmiş bir öğrenci seçin.
                  </div>
                ) : (
                  <>
                    <h4 className={styles.panelSectionTitle}>
                      {selectedSubmission.studentName} — Cevap
                    </h4>

                    {selectedAssignment.assignmentType === "Speaking" ||
                    selectedSubmission.audioLabel ? (
                      <div className={styles.audioPlayer}>
                        <div className={styles.audioIcon}>🎙️</div>
                        <div>
                          <p className={styles.audioTitle}>Ses Kaydı</p>
                          <p className={styles.audioMeta}>
                            {selectedSubmission.audioLabel ??
                              "speaking-recording.webm"}
                          </p>
                        </div>
                        <div className={styles.audioWave}>
                          {[1, 2, 3, 4, 5, 6, 7].map((i) => (
                            <span key={i} />
                          ))}
                        </div>
                      </div>
                    ) : null}

                    {selectedSubmission.content && (
                      <div className={styles.responseBox}>
                        <p>{selectedSubmission.content}</p>
                      </div>
                    )}

                    {selectedSubmission.status === "grading" && (
                      <button
                        type="button"
                        className={`btn btn-primary ${styles.gradeBtn}`}
                        disabled={isGrading}
                        onClick={() => handleGrade(selectedSubmission)}
                      >
                        {isGrading ? (
                          <>
                            <span className={styles.btnSpinner} aria-hidden />
                            AI Analiz Ediliyor…
                          </>
                        ) : (
                          "Yapay Zeka Analizini Başlat"
                        )}
                      </button>
                    )}

                    {isGrading && (
                      <div className={styles.gradingBanner}>
                        <span className={styles.btnSpinner} aria-hidden />
                        Detaylı puanlama metrikleri hazırlanıyor…
                      </div>
                    )}

                    {selectedSubmission.status === "graded" &&
                      selectedSubmission.aiAnalysis && (
                        <div className={styles.aiResultCard}>
                          <div className={styles.aiResultHeader}>
                            <div>
                              <span className={styles.aiScore}>
                                %{selectedSubmission.aiAnalysis.score}
                              </span>
                              <span className={styles.aiScoreLabel}>
                                Genel Puan
                              </span>
                            </div>
                            <div className={styles.cefrChip}>
                              CEFR {selectedSubmission.aiAnalysis.cefrLevel}
                            </div>
                          </div>

                          <div className={styles.metricGrid}>
                            {Object.entries(
                              selectedSubmission.aiAnalysis.metrics
                            ).map(([key, value]) =>
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

                          <div className={styles.tipBlock}>
                            <h5>Dilbilgisi</h5>
                            <p>
                              {selectedSubmission.aiAnalysis.grammarFeedback}
                            </p>
                          </div>
                          <div className={styles.tipBlock}>
                            <h5>Kelime Bilgisi</h5>
                            <p>
                              {
                                selectedSubmission.aiAnalysis
                                  .vocabularyFeedback
                              }
                            </p>
                          </div>
                          <div className={styles.tipBlock}>
                            <h5>AI Öneri</h5>
                            <p>
                              {selectedSubmission.aiAnalysis.generalReview}
                            </p>
                          </div>
                        </div>
                      )}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
