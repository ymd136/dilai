"use client";

import type { ReactNode } from "react";
import DashboardSidebar from "@/components/dashboard/layout/DashboardSidebar";
import DashboardNavbar from "@/components/dashboard/layout/DashboardNavbar";
import type { SessionUser } from "@/types/user";
import styles from "@/app/dashboard/dashboard.module.css";

type DashboardShellProps = {
  user: SessionUser;
  children: ReactNode;
};

export default function DashboardShell({ user, children }: DashboardShellProps) {
  return (
    <div className={styles.shell}>
      <DashboardSidebar />
      <div className={styles.main}>
        <DashboardNavbar user={user} />
        <main className={styles.content}>{children}</main>
      </div>
    </div>
  );
}
