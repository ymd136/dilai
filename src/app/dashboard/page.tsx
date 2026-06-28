import { getSessionUser } from "@/lib/auth/session";
import { redirect } from "next/navigation";

/**
 * /dashboard artık bir yönlendirici sayfa.
 * Kullanıcının rolüne göre doğru panele redirect eder.
 */
export default async function DashboardPage() {
  const user = await getSessionUser();

  if (!user) {
    redirect("/login");
  }

  switch (user.role) {
    case "ADMIN":
      if (user.institutionId) {
        redirect("/company");
      } else {
        redirect("/admin");
      }
    case "TEACHER":
      redirect("/teacher");
    case "STUDENT":
    default:
      redirect("/student");
  }
}
