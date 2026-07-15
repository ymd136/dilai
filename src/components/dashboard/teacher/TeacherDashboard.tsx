"use client";

import { useMemo } from "react";
import { useDashboard } from "@/contexts/DashboardContext";
import AssignmentTracker from "./AssignmentTracker";
import CreateAssignment from "./CreateAssignment";
import CreateClass from "./CreateClass";
import ClassDetailView from "./ClassDetailView";
import { MOCK_TEACHER_INSIGHTS } from "@/lib/mocks/teacherData";
import {
  usePendingGradingCount,
  useTeacherClasses,
  useAllTeacherAssignments,
} from "@/hooks/useAssignmentStore";
import type { SessionUser } from "@/types/user";
import styles from "./TeacherDashboard.module.css";

type TeacherDashboardProps = {
  user: SessionUser;
};

export default function TeacherDashboard({ user }: TeacherDashboardProps) {
  const { activeNav, selectedClassId, examColor, setActiveNav, selectClass } =
    useDashboard();
  const classes = useTeacherClasses();
  const assignments = useAllTeacherAssignments();
  const pendingGrading = usePendingGradingCount();

  const totalStudents = useMemo(
    () => classes.reduce((sum, c) => sum + c.studentCount, 0),
    [classes]
  );

  if (activeNav === "create-class") {
    return (
      <div className={styles.dashboard}>
        <CreateClass />
      </div>
    );
  }

  if (activeNav === "ai-room") {
    return (
      <div className={styles.dashboard}>
        <CreateAssignment />
      </div>
    );
  }

  if (activeNav === "assignments") {
    return (
      <div className={styles.dashboard}>
        <AssignmentTracker />
      </div>
    );
  }

  if (activeNav === "classes" && selectedClassId) {
    return (
      <div className={styles.dashboard}>
        <ClassDetailView classId={selectedClassId} />
      </div>
    );
  }

  // Home
  return (
    <div className={styles.dashboard} id="teacher-dashboard">
      <div
        className={`glass-card ${styles.welcomeBanner} animate-fade-in-up`}
        style={{ "--exam-color": examColor } as React.CSSProperties}
      >
        <span className="section-label">👨‍🏫 Ana Sayfa</span>
        <h2 className="section-title">
          Merhaba {user.firstName},{" "}
          <span className="text-gradient">İyi Dersler!</span>
        </h2>
        <p className="section-subtitle">
          Sınıflarını yönet, AI asistanınla ödev hazırla ve öğrenci
          teslimlerini tek panelden takip et.
        </p>
      </div>

      <div className={`${styles.statGrid} animate-fade-in-up delay-1`}>
        <article className={`glass-card ${styles.statCard}`}>
          <span className={styles.statLabel}>Toplam Sınıf</span>
          <span className={styles.statValue}>{classes.length}</span>
        </article>
        <article className={`glass-card ${styles.statCard}`}>
          <span className={styles.statLabel}>Toplam Öğrenci</span>
          <span className={styles.statValue}>{totalStudents}</span>
        </article>
        <article className={`glass-card ${styles.statCard}`}>
          <span className={styles.statLabel}>Değerlendirme Bekleyen</span>
          <span className={`${styles.statValue} ${styles.statAccent}`}>
            {pendingGrading}
          </span>
        </article>
        <article className={`glass-card ${styles.statCard}`}>
          <span className={styles.statLabel}>Aktif Ödev</span>
          <span className={styles.statValue}>{assignments.length}</span>
        </article>
      </div>

      <section
        className={`${styles.insightsSection} animate-fade-in-up delay-2`}
        aria-label="Yapay Zeka Sınıf Asistanı"
      >
        <div className={styles.sectionHeader}>
          <span className="section-label">🤖 Yapay Zeka Sınıf Asistanı</span>
          <h2 className="section-title">
            AI <span className="text-gradient">Önerileri</span>
          </h2>
          <p className="section-subtitle">
            Sınıf performansına göre kişiselleştirilmiş aksiyon önerileri.
          </p>
        </div>

        <div className={styles.insightGrid}>
          {MOCK_TEACHER_INSIGHTS.map((insight) => (
            <article
              key={insight.id}
              className={`glass-card ${styles.insightCard}`}
            >
              <div className={styles.insightTop}>
                <h3 className={styles.insightTitle}>{insight.title}</h3>
                <span
                  className={`${styles.urgencyBadge} ${
                    insight.urgency === "high"
                      ? styles.urgencyHigh
                      : insight.urgency === "medium"
                        ? styles.urgencyMedium
                        : styles.urgencyLow
                  }`}
                >
                  {insight.urgency === "high"
                    ? "Öncelikli"
                    : insight.urgency === "medium"
                      ? "Öneri"
                      : "Bilgi"}
                </span>
              </div>
              <p className={styles.insightDesc}>{insight.description}</p>
              {insight.className && (
                <button
                  type="button"
                  className={styles.insightLink}
                  onClick={() => {
                    const cls = classes.find(
                      (c) => c.name === insight.className
                    );
                    if (cls) selectClass(cls.id);
                  }}
                >
                  {insight.className} →
                </button>
              )}
            </article>
          ))}
        </div>
      </section>

      <section
        className={`${styles.quickActions} animate-fade-in-up delay-3`}
        aria-label="Hızlı işlemler"
      >
        <button
          type="button"
          className={`glass-card ${styles.actionCard}`}
          onClick={() => setActiveNav("create-class")}
        >
          <span className={styles.actionIcon}>🏫</span>
          <span className={styles.actionTitle}>Yeni Sınıf Oluştur</span>
          <span className={styles.actionDesc}>
            Yeni bir sınıf tanımla ve öğrenci eklemeye başla.
          </span>
        </button>
        <button
          type="button"
          className={`glass-card ${styles.actionCard}`}
          onClick={() => setActiveNav("ai-room")}
        >
          <span className={styles.actionIcon}>🤖</span>
          <span className={styles.actionTitle}>AI ile Ödev Hazırla</span>
          <span className={styles.actionDesc}>
            Soru havuzundan ödev seçip sınıfına anında ata.
          </span>
        </button>
        <button
          type="button"
          className={`glass-card ${styles.actionCard}`}
          onClick={() => setActiveNav("assignments")}
        >
          <span className={styles.actionIcon}>📋</span>
          <span className={styles.actionTitle}>Ödev Takip</span>
          <span className={styles.actionDesc}>
            Teslimleri incele ve AI notlandırmayı başlat.
          </span>
        </button>
      </section>
    </div>
  );
}
