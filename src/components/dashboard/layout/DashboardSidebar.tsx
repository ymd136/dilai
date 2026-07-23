"use client";

import Link from "next/link";
import {
  useDashboard,
  type DashboardNavItem,
} from "@/contexts/DashboardContext";
import styles from "./DashboardSidebar.module.css";

type NavEntry = {
  id: DashboardNavItem;
  label: string;
  icon: React.ReactNode;
  hasBadge?: boolean;
};

const studentNavItems: NavEntry[] = [
  {
    id: "home",
    label: "Ana Panel",
    hasBadge: true,
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H5a1 1 0 01-1-1V9.5z" />
        <path d="M9 21V12h6v9" />
      </svg>
    ),
  },
  {
    id: "analytics",
    label: "Gelişim Analitiği",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M18 20V10M12 20V4M6 20v-6" />
      </svg>
    ),
  },
];

const teacherNavItems: NavEntry[] = [
  {
    id: "home",
    label: "Genel Panel",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H5a1 1 0 01-1-1V9.5z" />
        <path d="M9 21V12h6v9" />
      </svg>
    ),
  },
  {
    id: "classes",
    label: "Sınıflarım & Öğrencilerim",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
      </svg>
    ),
  },
  {
    id: "ai-room",
    label: "AI ile Ödev Hazırlama Odası",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M12 2a4 4 0 014 4v1h2a2 2 0 012 2v3a2 2 0 01-2 2h-1v4a4 4 0 01-8 0v-4H6a2 2 0 01-2-2V9a2 2 0 012-2h2V6a4 4 0 014-4z" />
        <circle cx="9" cy="11" r="1" fill="currentColor" />
        <circle cx="15" cy="11" r="1" fill="currentColor" />
      </svg>
    ),
  },
  {
    id: "analytics",
    label: "Sınav Başarı Analitiği",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M18 20V10M12 20V4M6 20v-6" />
      </svg>
    ),
  },
];

import type { SessionUser } from "@/types/user";
import { MOCK_STUDENT_ASSIGNMENTS } from "@/lib/mocks/studentMockData";

type DashboardSidebarProps = {
  user?: SessionUser;
};

const superAdminNavItems: NavEntry[] = [
  {
    id: "home",
    label: "Genel Bakış",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
        <rect x="14" y="14" width="7" height="7" rx="1" />
      </svg>
    ),
  },
  {
    id: "classes",
    label: "Tüm Kullanıcılar",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
      </svg>
    ),
  },
  {
    id: "ai-room",
    label: "Kurum Yönetimi",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
      </svg>
    ),
  },
];

const companyAdminNavItems: NavEntry[] = [
  {
    id: "home",
    label: "Genel Bakış",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
        <rect x="14" y="14" width="7" height="7" rx="1" />
      </svg>
    ),
  },
  {
    id: "classes",
    label: "Kişi Yönetimi",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
      </svg>
    ),
  },
];

export default function DashboardSidebar({ user }: DashboardSidebarProps) {
  const { sidebarCollapsed, toggleSidebar, activeNav, setActiveNav, userRole } =
    useDashboard();

  const isSuperAdmin = user?.role === "ADMIN" && !user?.institutionId;

  const navItems =
    userRole === "TEACHER"
      ? teacherNavItems
      : userRole === "ADMIN"
      ? isSuperAdmin
        ? superAdminNavItems
        : companyAdminNavItems
      : studentNavItems;



  return (
    <aside
      className={`${styles.sidebar} ${sidebarCollapsed ? styles.collapsed : ""}`}
      id="dashboard-sidebar"
    >
      <div className={styles.header}>
        <Link href="/dashboard" className={styles.logo}>
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
            <rect width="28" height="28" rx="8" fill="url(#dash-logo)" />
            <path d="M8 10h4v8H8V10zm8 0h4v8h-4V10z" fill="white" opacity="0.9" />
            <path d="M12 13h4v2h-4v-2z" fill="white" opacity="0.7" />
            <defs>
              <linearGradient id="dash-logo" x1="0" y1="0" x2="28" y2="28">
                <stop stopColor="#6366f1" />
                <stop offset="1" stopColor="#a855f7" />
              </linearGradient>
            </defs>
          </svg>
          <span>
            Dil<span className={styles.logoHighlight}>AI</span>
          </span>
        </Link>
        <button
          type="button"
          className={styles.toggleBtn}
          onClick={toggleSidebar}
          aria-label={sidebarCollapsed ? "Menüyü genişlet" : "Menüyü daralt"}
          id="sidebar-toggle"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            {sidebarCollapsed ? (
              <path d="M9 18l6-6-6-6" />
            ) : (
              <path d="M15 18l-6-6 6-6" />
            )}
          </svg>
        </button>
      </div>

      <nav className={styles.nav} aria-label="Dashboard navigasyonu">
        {navItems.map((item) => (
          <button
            key={item.id}
            type="button"
            className={`${styles.navItem} ${activeNav === item.id ? styles.active : ""}`}
            onClick={() => setActiveNav(item.id)}
            id={`nav-${item.id}`}
          >
            <span className={styles.navIcon}>{item.icon}</span>
            <span className={styles.navLabel}>{item.label}</span>
            {item.hasBadge && MOCK_STUDENT_ASSIGNMENTS.filter((a) => a.status === "PENDING").length > 0 && !sidebarCollapsed && (
              <span className={styles.navBadge}>
                {MOCK_STUDENT_ASSIGNMENTS.filter((a) => a.status === "PENDING").length}
              </span>
            )}
          </button>
        ))}
      </nav>

      <div className={styles.footer}>
        <p className={styles.footerHint}>DilAI v0.1 — Sprint 1</p>
      </div>
    </aside>
  );
}
