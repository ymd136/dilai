"use client";

import { useMemo, useState } from "react";
import { useDashboard } from "@/contexts/DashboardContext";
import {
  useAllTeacherAssignments,
  useTeacherClasses,
} from "@/hooks/useAssignmentStore";
import { addStudentToClass } from "@/lib/mocks/assignmentStore";
import { EXAM_COLORS } from "@/types/exam";
import { toast } from "@/lib/toast";
import styles from "./ClassDetailView.module.css";

type ClassTab = "students" | "assignments";

type ClassDetailViewProps = {
  classId: string;
};

export default function ClassDetailView({ classId }: ClassDetailViewProps) {
  const { examColor, setActiveNav } = useDashboard();
  const classes = useTeacherClasses();
  const allAssignments = useAllTeacherAssignments();
  const [activeTab, setActiveTab] = useState<ClassTab>("students");
  const [showAddStudent, setShowAddStudent] = useState(false);
  const [studentName, setStudentName] = useState("");

  const selectedClass = useMemo(
    () => classes.find((c) => c.id === classId) ?? null,
    [classes, classId]
  );

  const classAssignments = useMemo(() => {
    if (!selectedClass) return [];
    return allAssignments.filter((a) => a.className === selectedClass.name);
  }, [allAssignments, selectedClass]);

  if (!selectedClass) {
    return (
      <div className={`glass-card ${styles.emptyState}`}>
        Seçili sınıf bulunamadı.
      </div>
    );
  }

  const handleAddStudent = () => {
    const name = studentName.trim();
    if (!name) return;
    addStudentToClass(selectedClass.id, {
      id: `s-${Date.now()}`,
      name,
      progressScore: 50 + Math.floor(Math.random() * 40),
    });
    toast.success(`${name} sınıfa eklendi.`);
    setStudentName("");
    setShowAddStudent(false);
  };

  return (
    <div className={`${styles.wrapper} animate-fade-in-up`} id="class-detail">
      <div
        className={`glass-card ${styles.banner}`}
        style={{ "--exam-color": examColor } as React.CSSProperties}
      >
        <span className="section-label">🏫 Sınıf Detayı</span>
        <h2 className="section-title">
          <span className="text-gradient">{selectedClass.name}</span>
        </h2>
        <p className="section-subtitle">
          Öğrencileri yönet, ödev tamamlanma oranlarını takip et.
        </p>
        <div className={styles.bannerMeta}>
          <span className={styles.metaChip}>
            {selectedClass.examType === "YOKDIL"
              ? "YÖKDİL"
              : selectedClass.examType}
          </span>
          <span className={styles.metaChip}>
            {selectedClass.studentCount} Öğrenci
          </span>
          <span className={styles.metaChip}>
            {classAssignments.length} Ödev
          </span>
        </div>
      </div>

      <div className={styles.tabs}>
        <button
          type="button"
          className={`${styles.tab} ${
            activeTab === "students" ? styles.tabActive : ""
          }`}
          onClick={() => setActiveTab("students")}
        >
          Öğrenciler
        </button>
        <button
          type="button"
          className={`${styles.tab} ${
            activeTab === "assignments" ? styles.tabActive : ""
          }`}
          onClick={() => setActiveTab("assignments")}
        >
          Ödevler
        </button>
      </div>

      {activeTab === "students" ? (
        <section className={`glass-card ${styles.panel}`}>
          <div className={styles.panelHeader}>
            <h3 className={styles.panelTitle}>Sınıf Öğrencileri</h3>
            <button
              type="button"
              className="btn btn-primary btn-sm"
              onClick={() => setShowAddStudent((v) => !v)}
            >
              {showAddStudent ? "İptal" : "+ Öğrenci Ekle"}
            </button>
          </div>

          {showAddStudent && (
            <div className={styles.addRow}>
              <input
                className="input-field"
                placeholder="Öğrenci adı soyadı"
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
              />
              <button
                type="button"
                className="btn btn-primary"
                disabled={!studentName.trim()}
                onClick={handleAddStudent}
              >
                Ekle
              </button>
            </div>
          )}

          {selectedClass.students.length === 0 ? (
            <p className={styles.emptyHint}>Bu sınıfta henüz öğrenci yok.</p>
          ) : (
            <div className={styles.studentList}>
              {selectedClass.students.map((student) => (
                <div key={student.id} className={styles.studentRow}>
                  <span className={styles.studentName}>{student.name}</span>
                  <div className={styles.progressWrap}>
                    <div className={styles.progressBar}>
                      <div
                        className={styles.progressFill}
                        style={{ width: `${student.progressScore}%` }}
                      />
                    </div>
                    <span className={styles.progressScore}>
                      %{student.progressScore}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      ) : (
        <section className={`glass-card ${styles.panel}`}>
          <div className={styles.panelHeader}>
            <h3 className={styles.panelTitle}>Sınıf Ödevleri</h3>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => setActiveNav("ai-room")}
            >
              Yeni Ödev Ata
            </button>
          </div>

          {classAssignments.length === 0 ? (
            <p className={styles.emptyHint}>
              Bu sınıfa henüz ödev atanmamış.
            </p>
          ) : (
            <div className={styles.assignmentList}>
              {classAssignments.map((assignment) => {
                const rate =
                  assignment.totalCount === 0
                    ? 0
                    : Math.round(
                        (assignment.submittedCount / assignment.totalCount) *
                          100
                      );
                const examColorLocal = EXAM_COLORS[assignment.examType];
                return (
                  <article
                    key={assignment.id}
                    className={styles.assignmentCard}
                    style={
                      {
                        "--exam-color": examColorLocal,
                      } as React.CSSProperties
                    }
                  >
                    <div>
                      <h4 className={styles.assignmentTitle}>
                        {assignment.title}
                      </h4>
                      <p className={styles.assignmentMeta}>
                        {assignment.assignmentType} · Son tarih{" "}
                        {new Date(assignment.dueDate).toLocaleDateString(
                          "tr-TR",
                          { day: "numeric", month: "short" }
                        )}
                      </p>
                    </div>
                    <div className={styles.completionBlock}>
                      <span className={styles.completionLabel}>
                        {assignment.submittedCount}/{assignment.totalCount}{" "}
                        teslim
                      </span>
                      <div className={styles.completionBar}>
                        <div
                          className={styles.completionFill}
                          style={{ width: `${rate}%` }}
                        />
                      </div>
                      <span className={styles.completionRate}>%{rate}</span>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>
      )}
    </div>
  );
}
