"use client";

import { useDashboard } from "@/contexts/DashboardContext";
import { getClassesByExam } from "@/lib/mocks/teacherData";
import { MOCK_EXAM_OPTIONS } from "@/lib/mocks/examOptions";
import styles from "./ClassManagement.module.css";

const MAX_VISIBLE_STUDENTS = 4;

export default function ClassManagement() {
  const { selectedExam, examColor } = useDashboard();
  const classes = getClassesByExam(selectedExam);

  const examLabel =
    MOCK_EXAM_OPTIONS.find((e) => e.id === selectedExam)?.name ?? selectedExam;

  if (classes.length === 0) {
    return (
      <section className={styles.section} aria-label="Sınıf yönetimi">
        <div className={styles.header}>
          <span className="section-label">🏫 Sınıflar</span>
          <h2 className="section-title">Sınıflar & Öğrenciler</h2>
        </div>
        <div className={`glass-card ${styles.emptyState}`}>
          {examLabel} formatında henüz aktif sınıf bulunmuyor.
        </div>
      </section>
    );
  }

  return (
    <section
      className={`${styles.section} animate-fade-in-up delay-4`}
      aria-label="Sınıf yönetimi"
      id="class-management"
    >
      <div className={styles.header}>
        <span className="section-label">🏫 Sınıflar</span>
        <h2 className="section-title">
          Sınıflar & <span className="text-gradient">Öğrenciler</span>
        </h2>
        <p className="section-subtitle">
          {examLabel} formatına hazırlanan aktif sınıfların ve öğrenci
          ilerleme skorları.
        </p>
      </div>

      <div className={styles.grid}>
        {classes.map((cls) => {
          const visibleStudents = cls.students.slice(0, MAX_VISIBLE_STUDENTS);
          const remaining = cls.studentCount - visibleStudents.length;

          return (
            <article
              key={cls.id}
              className={`glass-card ${styles.classCard}`}
              style={{ "--exam-color": examColor } as React.CSSProperties}
            >
              <div className={styles.classHeader}>
                <div>
                  <h3 className={styles.className}>{cls.name}</h3>
                  <p className={styles.classMeta}>{examLabel} Hazırlık Grubu</p>
                </div>
                <span className={styles.studentBadge}>
                  {cls.studentCount} Öğrenci
                </span>
              </div>

              <div className={styles.studentList}>
                {visibleStudents.map((student) => (
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
                {remaining > 0 && (
                  <p className={styles.moreStudents}>
                    +{remaining} öğrenci daha
                  </p>
                )}
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
