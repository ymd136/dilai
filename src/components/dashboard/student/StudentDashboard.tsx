"use client";

import { useState, useCallback, useMemo } from "react";
import { useDashboard } from "@/contexts/DashboardContext";
import EmptyState from "@/components/dashboard/shared/EmptyState";
import MentorRecommendations from "@/components/dashboard/shared/MentorRecommendations";
import StudentAssignments from "./StudentAssignments";
import MultipleChoiceQuiz from "./MultipleChoiceQuiz";
import SpeakingExercise from "./SpeakingExercise";
import WritingExercise from "./WritingExercise";
import StudentAnalytics from "./StudentAnalytics";
import type { SessionUser } from "@/types/user";
import type { StudentAssignment } from "@/lib/mocks/studentMockData";
import {
  useStudentAssignments,
  useStudentClasses,
} from "@/hooks/useAssignmentStore";
import styles from "./StudentDashboard.module.css";

type StudentDashboardProps = {
  user: SessionUser;
  hasActiveClass?: boolean;
};

type ActiveExercise = {
  assignmentId: string;
  type: "MULTIPLE_CHOICE" | "SPEAKING" | "WRITING";
  level: string;
  questionCount: number;
} | null;

export default function StudentDashboard({
  user,
  hasActiveClass = true,
}: StudentDashboardProps) {
  const { activeNav, selectedClassId, selectClass, examColor } = useDashboard();
  const fullName = `${user.firstName} ${user.lastName}`;
  const assignments = useStudentAssignments();
  const studentClasses = useStudentClasses();
  const [activeExercise, setActiveExercise] = useState<ActiveExercise>(null);

  const selectedClass = useMemo(
    () => studentClasses.find((c) => c.id === selectedClassId) ?? null,
    [studentClasses, selectedClassId]
  );

  const upcomingAssignments = useMemo(
    () =>
      assignments
        .filter((a) => a.status === "pending" || a.status === "grading")
        .slice(0, 3),
    [assignments]
  );

  const handleStartAssignment = useCallback(
    (assignment: StudentAssignment) => {
      setActiveExercise({
        assignmentId: assignment.id,
        type: assignment.type,
        level: assignment.level,
        questionCount: assignment.questionCount,
      });
    },
    []
  );

  const handleBackToAssignments = useCallback(() => {
    setActiveExercise(null);
  }, []);

  if (activeExercise) {
    if (activeExercise.type === "MULTIPLE_CHOICE") {
      return (
        <div className={styles.dashboard}>
          <MultipleChoiceQuiz
            assignmentId={activeExercise.assignmentId}
            level={activeExercise.level}
            questionCount={activeExercise.questionCount}
            onBack={handleBackToAssignments}
          />
        </div>
      );
    }
    if (activeExercise.type === "SPEAKING") {
      return (
        <div className={styles.dashboard}>
          <SpeakingExercise
            assignmentId={activeExercise.assignmentId}
            level={activeExercise.level}
            onBack={handleBackToAssignments}
          />
        </div>
      );
    }
    if (activeExercise.type === "WRITING") {
      return (
        <div className={styles.dashboard}>
          <WritingExercise
            assignmentId={activeExercise.assignmentId}
            level={activeExercise.level}
            onBack={handleBackToAssignments}
          />
        </div>
      );
    }
  }

  if (activeNav === "analytics") {
    return (
      <div className={styles.dashboard}>
        <StudentAnalytics />
      </div>
    );
  }

  if (activeNav === "classes" && selectedClass) {
    return (
      <div className={styles.dashboard} id="student-class-view">
        <div
          className={`glass-card ${styles.classBanner} animate-fade-in-up`}
          style={{ "--exam-color": examColor } as React.CSSProperties}
        >
          <span className="section-label">🏫 Sınıf Ödevleri</span>
          <h2 className="section-title">
            <span className="text-gradient">{selectedClass.name}</span>
          </h2>
          <p className="section-subtitle">
            Bu sınıfa atanmış ödevleri görüntüle, filtrele ve çözmeye başla.
          </p>
        </div>
        <StudentAssignments
          onStartAssignment={handleStartAssignment}
          classFilter={selectedClass.id}
        />
      </div>
    );
  }

  // Home (Ana Sayfa)
  if (!hasActiveClass) {
    return (
      <div className={styles.dashboard} id="student-dashboard">
        <EmptyState userName={fullName} />
      </div>
    );
  }

  return (
    <div className={styles.dashboard} id="student-dashboard">
      <div
        className={`glass-card ${styles.welcomeBanner} animate-fade-in-up`}
        style={{ "--exam-color": examColor } as React.CSSProperties}
      >
        <div className={styles.welcomeContent}>
          <span className="section-label">👋 Ana Sayfa</span>
          <h2 className="section-title">
            Hoş Geldin, {user.firstName}!{" "}
            <span className="text-gradient">AI Mentorun Hazır</span>
          </h2>
          <p className="section-subtitle">
            Yaklaşan ödevlerini takip et ve yapay zeka mentorunun sana özel
            önerilerini keşfet.
          </p>
        </div>
      </div>

      {upcomingAssignments.length > 0 && (
        <div
          className={`glass-card ${styles.upcomingAlert} animate-fade-in-up delay-1`}
          role="status"
        >
          <div className={styles.upcomingHeader}>
            <div>
              <span className={styles.upcomingLabel}>⏰ Yaklaşan Ödevleriniz Var</span>
              <p className={styles.upcomingDesc}>
                {upcomingAssignments.length} ödev teslim bekliyor. Sınıfından
                seçerek hemen başlayabilirsin.
              </p>
            </div>
            <span className={styles.upcomingCount}>
              {upcomingAssignments.length}
            </span>
          </div>
          <div className={styles.upcomingList}>
            {upcomingAssignments.map((assignment) => {
              const classInfo = studentClasses.find(
                (c) => c.name === assignment.className
              );
              return (
                <button
                  key={assignment.id}
                  type="button"
                  className={styles.upcomingItem}
                  onClick={() => {
                    if (classInfo) selectClass(classInfo.id);
                  }}
                >
                  <span className={styles.upcomingTitle}>{assignment.title}</span>
                  <span className={styles.upcomingMeta}>
                    {assignment.className} ·{" "}
                    {new Date(assignment.dueDate).toLocaleDateString("tr-TR", {
                      day: "numeric",
                      month: "short",
                    })}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      <MentorRecommendations />
    </div>
  );
}
