"use client";

import Link from "next/link";
import { useState } from "react";
import {
  useDashboard,
  type DashboardNavItem,
} from "@/contexts/DashboardContext";
import type { SessionUser } from "@/types/user";
import {
  usePendingAssignmentCount,
  usePendingGradingCount,
  useStudentClasses,
  useTeacherClasses,
} from "@/hooks/useAssignmentStore";
import styles from "./DashboardSidebar.module.css";

type NavEntry = {
  id: DashboardNavItem;
  label: string;
  icon: React.ReactNode;
};

const homeIcon = (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H5a1 1 0 01-1-1V9.5z" />
    <path d="M9 21V12h6v9" />
  </svg>
);

const analyticsIcon = (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M18 20V10M12 20V4M6 20v-6" />
  </svg>
);

const classesIcon = (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
  </svg>
);

const createClassIcon = (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <circle cx="12" cy="12" r="9" />
    <path d="M12 8v8M8 12h8" />
  </svg>
);

const aiRoomIcon = (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M12 2a4 4 0 014 4v1h2a2 2 0 012 2v3a2 2 0 01-2 2h-1v4a4 4 0 01-8 0v-4H6a2 2 0 01-2-2V9a2 2 0 012-2h2V6a4 4 0 014-4z" />
    <circle cx="9" cy="11" r="1" fill="currentColor" />
    <circle cx="15" cy="11" r="1" fill="currentColor" />
  </svg>
);

const assignmentsIcon = (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2" />
    <rect x="9" y="3" width="6" height="4" rx="1" />
    <path d="M9 12h6M9 16h4" />
  </svg>
);

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
    icon: classesIcon,
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
    icon: classesIcon,
  },
];

function StudentSidebarNav() {
  const {
    activeNav,
    selectedClassId,
    selectHome,
    selectClass,
    setActiveNav,
    sidebarCollapsed,
  } = useDashboard();
  const pendingAssignmentCount = usePendingAssignmentCount();
  const studentClasses = useStudentClasses();
  const [classesOpen, setClassesOpen] = useState(true);

  const homeActive = activeNav === "home" && !selectedClassId;
  const analyticsActive = activeNav === "analytics";
  const classesSectionActive = activeNav === "classes" || !!selectedClassId;

  return (
    <>
      <button
        type="button"
        className={`${styles.navItem} ${homeActive ? styles.active : ""}`}
        onClick={selectHome}
        id="nav-home"
      >
        <span className={styles.navIcon}>{homeIcon}</span>
        <span className={styles.navLabel}>Ana Sayfa</span>
        {pendingAssignmentCount > 0 && !sidebarCollapsed && (
          <span className={styles.navBadge}>{pendingAssignmentCount}</span>
        )}
      </button>

      <button
        type="button"
        className={`${styles.navItem} ${analyticsActive ? styles.active : ""}`}
        onClick={() => setActiveNav("analytics")}
        id="nav-analytics"
      >
        <span className={styles.navIcon}>{analyticsIcon}</span>
        <span className={styles.navLabel}>Kişisel Analiz</span>
      </button>

      <div className={styles.accordion}>
        <button
          type="button"
          className={`${styles.navItem} ${styles.accordionTrigger} ${
            classesSectionActive ? styles.active : ""
          }`}
          onClick={() => {
            if (sidebarCollapsed) {
              setClassesOpen(true);
              if (studentClasses[0]) selectClass(studentClasses[0].id);
              return;
            }
            setClassesOpen((open) => !open);
          }}
          aria-expanded={classesOpen && !sidebarCollapsed}
          id="nav-classes"
        >
          <span className={styles.navIcon}>{classesIcon}</span>
          <span className={styles.navLabel}>Sınıflarım</span>
          {!sidebarCollapsed && (
            <span
              className={`${styles.accordionChevron} ${
                classesOpen ? styles.accordionChevronOpen : ""
              }`}
              aria-hidden
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M6 9l6 6 6-6" />
              </svg>
            </span>
          )}
        </button>

        {!sidebarCollapsed && (
          <div
            className={`${styles.accordionPanel} ${
              classesOpen ? styles.accordionPanelOpen : ""
            }`}
          >
            <div className={styles.accordionList}>
              {studentClasses.length === 0 ? (
                <p className={styles.accordionEmpty}>Henüz sınıf yok</p>
              ) : (
                studentClasses.map((cls) => (
                  <button
                    key={cls.id}
                    type="button"
                    className={`${styles.subNavItem} ${
                      selectedClassId === cls.id ? styles.subNavItemActive : ""
                    }`}
                    onClick={() => selectClass(cls.id)}
                    id={`nav-class-${cls.id}`}
                  >
                    <span className={styles.subNavDot} aria-hidden />
                    <span className={styles.subNavLabel}>{cls.name}</span>
                  </button>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
}

function TeacherSidebarNav() {
  const {
    activeNav,
    selectedClassId,
    selectHome,
    selectClass,
    setActiveNav,
    sidebarCollapsed,
  } = useDashboard();
  const teacherClasses = useTeacherClasses();
  const pendingGradingCount = usePendingGradingCount();
  const [classesOpen, setClassesOpen] = useState(true);

  const homeActive = activeNav === "home" && !selectedClassId;
  const classesSectionActive = activeNav === "classes" || !!selectedClassId;

  return (
    <>
      <button
        type="button"
        className={`${styles.navItem} ${homeActive ? styles.active : ""}`}
        onClick={selectHome}
        id="nav-home"
      >
        <span className={styles.navIcon}>{homeIcon}</span>
        <span className={styles.navLabel}>Ana Sayfa</span>
      </button>

      <div className={styles.accordion}>
        <button
          type="button"
          className={`${styles.navItem} ${styles.accordionTrigger} ${
            classesSectionActive ? styles.active : ""
          }`}
          onClick={() => {
            if (sidebarCollapsed) {
              setClassesOpen(true);
              if (teacherClasses[0]) selectClass(teacherClasses[0].id);
              return;
            }
            setClassesOpen((open) => !open);
          }}
          aria-expanded={classesOpen && !sidebarCollapsed}
          id="nav-classes"
        >
          <span className={styles.navIcon}>{classesIcon}</span>
          <span className={styles.navLabel}>Sınıflarım</span>
          {!sidebarCollapsed && (
            <span
              className={`${styles.accordionChevron} ${
                classesOpen ? styles.accordionChevronOpen : ""
              }`}
              aria-hidden
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M6 9l6 6 6-6" />
              </svg>
            </span>
          )}
        </button>

        {!sidebarCollapsed && (
          <div
            className={`${styles.accordionPanel} ${
              classesOpen ? styles.accordionPanelOpen : ""
            }`}
          >
            <div className={styles.accordionList}>
              {teacherClasses.length === 0 ? (
                <p className={styles.accordionEmpty}>Henüz sınıf yok</p>
              ) : (
                teacherClasses.map((cls) => (
                  <button
                    key={cls.id}
                    type="button"
                    className={`${styles.subNavItem} ${
                      selectedClassId === cls.id ? styles.subNavItemActive : ""
                    }`}
                    onClick={() => selectClass(cls.id)}
                    id={`nav-class-${cls.id}`}
                  >
                    <span className={styles.subNavDot} aria-hidden />
                    <span className={styles.subNavLabel}>{cls.name}</span>
                  </button>
                ))
              )}
            </div>
          </div>
        )}
      </div>

      <button
        type="button"
        className={`${styles.navItem} ${
          activeNav === "create-class" ? styles.active : ""
        }`}
        onClick={() => setActiveNav("create-class")}
        id="nav-create-class"
      >
        <span className={styles.navIcon}>{createClassIcon}</span>
        <span className={styles.navLabel}>Yeni Sınıf Oluştur</span>
      </button>

      <button
        type="button"
        className={`${styles.navItem} ${
          activeNav === "ai-room" ? styles.active : ""
        }`}
        onClick={() => setActiveNav("ai-room")}
        id="nav-ai-room"
      >
        <span className={styles.navIcon}>{aiRoomIcon}</span>
        <span className={styles.navLabel}>AI ile Ödev Hazırla</span>
      </button>

      <button
        type="button"
        className={`${styles.navItem} ${
          activeNav === "assignments" ? styles.active : ""
        }`}
        onClick={() => setActiveNav("assignments")}
        id="nav-assignments"
      >
        <span className={styles.navIcon}>{assignmentsIcon}</span>
        <span className={styles.navLabel}>Ödev Takip</span>
        {pendingGradingCount > 0 && !sidebarCollapsed && (
          <span className={styles.navBadge}>{pendingGradingCount}</span>
        )}
      </button>
    </>
  );
}

export default function DashboardSidebar({ user }: DashboardSidebarProps) {
  const { sidebarCollapsed, toggleSidebar, activeNav, setActiveNav, userRole } =
    useDashboard();

  const isSuperAdmin = user?.role === "ADMIN" && !user?.institutionId;
  const isStudent = userRole === "STUDENT";
  const isTeacher = userRole === "TEACHER";

  const navItems =
    userRole === "ADMIN"
      ? isSuperAdmin
        ? superAdminNavItems
        : companyAdminNavItems
      : [];

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
        {isStudent ? (
          <StudentSidebarNav />
        ) : isTeacher ? (
          <TeacherSidebarNav />
        ) : (
          navItems.map((item) => (
            <button
              key={item.id}
              type="button"
              className={`${styles.navItem} ${activeNav === item.id ? styles.active : ""}`}
              onClick={() => setActiveNav(item.id)}
              id={`nav-${item.id}`}
            >
              <span className={styles.navIcon}>{item.icon}</span>
              <span className={styles.navLabel}>{item.label}</span>
            </button>
          ))
        )}
      </nav>

      <div className={styles.footer}>
        <p className={styles.footerHint}>DilAI v0.1 — Sprint 1</p>
      </div>
    </aside>
  );
}
