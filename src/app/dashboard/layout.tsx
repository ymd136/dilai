import { DashboardProvider } from "@/contexts/DashboardContext";
import DashboardShell from "@/components/dashboard/layout/DashboardShell";
import { getSessionUser } from "@/lib/auth/session";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getSessionUser();

  return (
    <DashboardProvider userRole={user.role}>
      <DashboardShell user={user}>{children}</DashboardShell>
    </DashboardProvider>
  );
}
