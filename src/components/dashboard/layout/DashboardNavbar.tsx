"use client";

import { useDashboard } from "@/contexts/DashboardContext";
import ExamSelector from "@/components/dashboard/shared/ExamSelector";
import type { SessionUser } from "@/types/user";
import styles from "./DashboardNavbar.module.css";

type DashboardNavbarProps = {
  user: SessionUser;
};

const roleLabels: Record<string, string> = {
  STUDENT: "Öğrenci",
  TEACHER: "Eğitmen",
  ADMIN: "Yönetici",
};

const pageTitles: Record<string, string> = {
  STUDENT: "Öğrenci Paneli",
  TEACHER: "Eğitmen Paneli",
  ADMIN: "Yönetici Paneli",
};

export default function DashboardNavbar({ user }: DashboardNavbarProps) {
  const { toggleSidebar } = useDashboard();
  const initials = `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();
  const pageTitle = pageTitles[user.role] ?? "Panel";
  const roleLabel = roleLabels[user.role] ?? user.role;

  return (
    <header className={styles.navbar} id="dashboard-navbar">
      <div className={styles.left}>
        <button
          type="button"
          className={styles.mobileMenuBtn}
          onClick={toggleSidebar}
          aria-label="Menüyü aç/kapat"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M3 12h18M3 6h18M3 18h18" />
          </svg>
        </button>
        <h1 className={styles.pageTitle}>{pageTitle}</h1>
      </div>

      <div className={styles.center}>
        <ExamSelector />
      </div>

      <div className={styles.right}>
        <div className={styles.profile} id="dashboard-profile">
          <div className={styles.avatar} aria-hidden="true">
            {initials}
          </div>
          <div className={styles.profileInfo}>
            <span className={styles.profileName}>
              {user.firstName} {user.lastName}
            </span>
            <span className={styles.profileRole}>{roleLabel}</span>
          </div>
        </div>
      </div>
    </header>
  );
}
