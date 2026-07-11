"use client";

import { useDashboard } from "@/contexts/DashboardContext";
import TeacherWelcomeBanner from "./TeacherWelcomeBanner";
import TeacherAssistantCards from "./TeacherAssistantCards";
import ClassManagement from "./ClassManagement";
import AssignmentTracker from "./AssignmentTracker";
import CreateAssignment from "./CreateAssignment";
import TeacherAnalytics from "./TeacherAnalytics";
import type { SessionUser } from "@/types/user";
import styles from "./TeacherDashboard.module.css";

type TeacherDashboardProps = {
  user: SessionUser;
};

export default function TeacherDashboard({ user }: TeacherDashboardProps) {
  const { activeNav } = useDashboard();

  if (activeNav === "home") {
    return (
      <div className={styles.dashboard} id="teacher-dashboard">
        <TeacherWelcomeBanner user={user} />

        <div className={styles.aiSection}>
          <TeacherAssistantCards />
        </div>

        <div className={styles.managementSection}>
          <ClassManagement />
          <AssignmentTracker />
        </div>
      </div>
    );
  }

  if (activeNav === "classes") {
    return (
      <div className={styles.dashboard}>
        <ClassManagement />
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

  return (
    <div className={styles.dashboard}>
      <TeacherAnalytics />
    </div>
  );
}
