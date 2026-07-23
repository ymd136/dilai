import { getSessionUser } from "@/lib/auth/session";
import { redirect } from "next/navigation";
import StudentDashboard from "@/components/dashboard/student/StudentDashboard";

export default async function StudentPage() {
  const user = await getSessionUser();

  if (!user) {
    redirect("/login");
  }

  return <StudentDashboard user={user} hasActiveClass={true} />;
}
