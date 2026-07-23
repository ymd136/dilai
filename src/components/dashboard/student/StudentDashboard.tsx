"use client";

import { useState, useCallback } from "react";
import { useDashboard } from "@/contexts/DashboardContext";
import EmptyState from "@/components/dashboard/shared/EmptyState";
import StudentAssignments from "./StudentAssignments";
import MultipleChoiceQuiz from "./MultipleChoiceQuiz";
import SpeakingExercise from "./SpeakingExercise";
import WritingExercise from "./WritingExercise";
import StudentAnalytics from "./StudentAnalytics";
import type { SessionUser } from "@/types/user";
import type { StudentAssignment } from "@/lib/mocks/studentMockData";
import styles from "./StudentDashboard.module.css";

type StudentDashboardProps = {
  user: SessionUser;
  hasActiveClass?: boolean;
};

type ActiveExercise = {
  type: "MULTIPLE_CHOICE" | "SPEAKING" | "WRITING";
  level: string;
  questionCount: number;
} | null;

export default function StudentDashboard({
  user,
  hasActiveClass = true,
}: StudentDashboardProps) {
  const { activeNav } = useDashboard();
  const fullName = `${user.firstName} ${user.lastName}`;
  const [activeExercise, setActiveExercise] = useState<ActiveExercise>(null);

  const handleStartAssignment = useCallback(
    (assignment: StudentAssignment) => {
      setActiveExercise({
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

  // Always show active exercise if one is running, regardless of nav
  if (activeExercise) {
    if (activeExercise.type === "MULTIPLE_CHOICE") {
      return (
        <div className={styles.dashboard}>
          <MultipleChoiceQuiz
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
            level={activeExercise.level}
            onBack={handleBackToAssignments}
          />
        </div>
      );
    }
  }

  if (activeNav === "home") {
    if (!hasActiveClass) {
      return (
        <div className={styles.dashboard} id="student-dashboard">
          <EmptyState userName={fullName} />
        </div>
      );
    }

    return (
      <div className={styles.dashboard} id="student-dashboard">
        <StudentAssignments onStartAssignment={handleStartAssignment} />
      </div>
    );
  }

  // Analytics or fallback
  return (
    <div className={styles.dashboard}>
      <StudentAnalytics />
    </div>
  );
}
