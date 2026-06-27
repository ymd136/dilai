import { getSessionUser } from "@/lib/auth/session";
import StudentDashboard from "@/components/dashboard/student/StudentDashboard";
import TeacherDashboard from "@/components/dashboard/teacher/TeacherDashboard";

export default async function DashboardPage() {
  const user = await getSessionUser();

  if (user.role === "TEACHER") {
    return <TeacherDashboard user={user} />;
  }

  if (user.role === "STUDENT") {
    return <StudentDashboard user={user} hasActiveClass={false} />;
  }

  return (
    <div style={{ padding: "var(--space-8)", textAlign: "center" }}>
      <h2 className="section-title">Yönetici Paneli</h2>
      <p className="section-subtitle" style={{ margin: "0 auto" }}>
        Yönetici dashboard&apos;u henüz geliştirilmedi.
      </p>
    </div>
  );
}
