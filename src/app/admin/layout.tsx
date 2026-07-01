import { getSessionUser } from "@/lib/auth/session";
import { redirect } from "next/navigation";
import { DashboardProvider } from "@/contexts/DashboardContext";
import DashboardShell from "@/components/dashboard/layout/DashboardShell";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getSessionUser();

  if (!user) {
    redirect("/login");
  }

  if (user.role !== "ADMIN") {
    redirect("/dashboard");
  }

  return (
    <DashboardProvider userRole={user.role}>
      <DashboardShell user={user}>{children}</DashboardShell>
    </DashboardProvider>
  );
}
