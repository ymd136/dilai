"use client";

import type { ReactNode } from "react";
import DashboardSidebar from "@/components/dashboard/layout/DashboardSidebar";
import DashboardNavbar from "@/components/dashboard/layout/DashboardNavbar";
import type { SessionUser } from "@/types/user";
import styles from "@/styles/dashboard.module.css";

type DashboardShellProps = {
  user: SessionUser;
  children: ReactNode;
};

export default function DashboardShell({ user, children }: DashboardShellProps) {
  return (
    <div className={styles.shell}>
      <DashboardSidebar user={user} />
      <div className={styles.main}>
        <DashboardNavbar user={user} />
        <main className={styles.content}>{children}</main>
      </div>
    </div>
  );
}
