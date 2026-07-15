import { getSessionUser } from "@/lib/auth/session";
import { redirect } from "next/navigation";
import TeacherDashboard from "@/components/dashboard/teacher/TeacherDashboard";

export default async function TeacherPage() {
  const user = await getSessionUser();

  if (!user) {
    redirect("/login");
  }

  return <TeacherDashboard user={user} />;
}