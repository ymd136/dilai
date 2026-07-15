"use client";

import { useDashboard } from "@/contexts/DashboardContext";
import { getClassesByExam } from "@/lib/mocks/teacherData";
import { MOCK_EXAM_OPTIONS } from "@/lib/mocks/examOptions";
import { useTeacherAssignments } from "@/hooks/useAssignmentStore";
import type { SessionUser } from "@/types/user";
import styles from "./TeacherWelcomeBanner.module.css";

type TeacherWelcomeBannerProps = {
  user: SessionUser;
};

export default function TeacherWelcomeBanner({ user }: TeacherWelcomeBannerProps) {
  const { selectedExam, examColor } = useDashboard();
  const assignments = useTeacherAssignments(selectedExam);

  const examLabel =
    MOCK_EXAM_OPTIONS.find((e) => e.id === selectedExam)?.name ?? selectedExam;

  const classes = getClassesByExam(selectedExam);
  const totalStudents = classes.reduce((sum, cls) => sum + cls.studentCount, 0);

  return (
    <div
      className={`glass-card ${styles.banner} animate-fade-in-up`}
      style={{ "--exam-color": examColor } as React.CSSProperties}
      id="teacher-welcome-banner"
    >
      <div className={styles.content}>
        <span className="section-label">👨‍🏫 Eğitmen Paneli</span>
        <h2 className="section-title">
          Hoş Geldin, {user.firstName}!{" "}
          <span className="text-gradient">{examLabel} Yönetimi</span>
        </h2>
        <p className="section-subtitle">
          Sınıflarını yönet, AI asistanınla ödev oluştur ve öğrenci performansını
          tek ekrandan takip et.
        </p>
        <span className={styles.examTag}>Aktif Filtre: {examLabel}</span>
      </div>

      <div className={styles.stats}>
        <div className={styles.stat}>
          <span className={styles.statValue}>{classes.length}</span>
          <span className={styles.statLabel}>Sınıf</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.statValue}>{totalStudents}</span>
          <span className={styles.statLabel}>Öğrenci</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.statValue}>{assignments.length}</span>
          <span className={styles.statLabel}>Aktif Ödev</span>
        </div>
      </div>
    </div>
  );
}
