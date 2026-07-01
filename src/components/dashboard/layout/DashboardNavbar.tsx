"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useDashboard } from "@/contexts/DashboardContext";
import ExamSelector from "@/components/dashboard/shared/ExamSelector";
import { signOut } from "@/lib/auth/auth-client";
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
  const router = useRouter();
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const initials = `${(user.firstName?.[0] ?? "")}${(user.lastName?.[0] ?? "")}`.toUpperCase() || "U";
  const pageTitle = pageTitles[user.role] ?? "Panel";
  const roleLabel = roleLabels[user.role] ?? user.role;

  const handleSignOut = async () => {
    setIsSigningOut(true);
    try {
      await signOut({
        fetchOptions: {
          onSuccess: () => {
            router.push("/login");
            router.refresh();
          },
        },
      });
    } catch {
      router.push("/login");
    } finally {
      setIsSigningOut(false);
      setShowUserMenu(false);
    }
  };

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
        <div className={styles.profileWrapper}>
          <button
            type="button"
            className={styles.profile}
            id="dashboard-profile"
            onClick={() => setShowUserMenu((v) => !v)}
            aria-haspopup="true"
            aria-expanded={showUserMenu}
          >
            <div className={styles.avatar} aria-hidden="true">
              {initials}
            </div>
            <div className={styles.profileInfo}>
              <span className={styles.profileName}>
                {user.firstName} {user.lastName}
              </span>
              <span className={styles.profileRole}>
                {roleLabel}
                {user.institutionName ? ` · ${user.institutionName}` : ""}
              </span>
            </div>
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className={`${styles.chevron} ${showUserMenu ? styles.chevronUp : ""}`}
            >
              <path d="M6 9l6 6 6-6" />
            </svg>
          </button>

          {showUserMenu && (
            <div className={styles.userMenu} role="menu">
              <div className={styles.userMenuHeader}>
                <span className={styles.userMenuEmail}>{user.email}</span>
                <div className={styles.userMenuBadges}>
                  <span className={styles.userMenuRoleBadge}>{roleLabel}</span>
                  {user.institutionName && (
                    <span className={styles.userMenuInstBadge}>{user.institutionName}</span>
                  )}
                </div>
              </div>
              <div className={styles.userMenuDivider} />
              <button
                type="button"
                className={styles.userMenuItem}
                role="menuitem"
                id="logout-btn"
                onClick={handleSignOut}
                disabled={isSigningOut}
              >
                {isSigningOut ? (
                  <span className={styles.menuSpinner} />
                ) : (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
                    <polyline points="16 17 21 12 16 7" />
                    <line x1="21" y1="12" x2="9" y2="12" />
                  </svg>
                )}
                {isSigningOut ? "Çıkış yapılıyor..." : "Çıkış Yap"}
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
