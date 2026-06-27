"use client";

import { useDashboard } from "@/contexts/DashboardContext";
import EmptyState from "@/components/dashboard/shared/EmptyState";
import type { SessionUser } from "@/types/user";
import styles from "./StudentDashboard.module.css";

type StudentDashboardProps = {
  user: SessionUser;
  hasActiveClass?: boolean;
};

function NavPlaceholder({
  title,
  description,
  icon,
}: {
  title: string;
  description: string;
  icon: string;
}) {
  return (
    <div className={`glass-card ${styles.placeholder}`}>
      <span className={styles.placeholderIcon} aria-hidden="true">
        {icon}
      </span>
      <h2 className={styles.placeholderTitle}>{title}</h2>
      <p className={styles.placeholderDesc}>{description}</p>
      <button type="button" className="btn btn-secondary">
        Yakında
      </button>
    </div>
  );
}

export default function StudentDashboard({
  user,
  hasActiveClass = false,
}: StudentDashboardProps) {
  const { activeNav } = useDashboard();
  const fullName = `${user.firstName} ${user.lastName}`;

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
        <NavPlaceholder
          icon="📚"
          title="Aktif Ödevlerin"
          description="Kayıtlı olduğun sınıflardaki ödevler burada listelenecek."
        />
      </div>
    );
  }

  if (activeNav === "classes") {
    return (
      <div className={styles.dashboard}>
        <NavPlaceholder
          icon="🏫"
          title="Sınıflarım & Ödevlerim"
          description="Kayıtlı olduğun sınıflar ve atanmış ödevler bu bölümde görünecek."
        />
      </div>
    );
  }

  if (activeNav === "ai-room") {
    return (
      <div className={styles.dashboard}>
        <NavPlaceholder
          icon="🤖"
          title="Yapılandırılmış AI Çalışma Odası"
          description="AI destekli konuşma ve yazma pratiği odası yakında aktif olacak."
        />
      </div>
    );
  }

  return (
    <div className={styles.dashboard}>
      <NavPlaceholder
        icon="📈"
        title="Gelişim Analitiği"
        description="Performans grafiklerin ve gelişim raporların burada yer alacak."
      />
    </div>
  );
}
