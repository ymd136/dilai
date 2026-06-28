import { getSessionUser } from "@/lib/auth/session";
import { redirect } from "next/navigation";
import StudentDashboard from "@/components/dashboard/student/StudentDashboard";
import TeacherDashboard from "@/components/dashboard/teacher/TeacherDashboard";
import AdminDashboard from "@/components/dashboard/admin/AdminDashboard";
import { prisma } from "@/lib/prisma";

export default async function DashboardPage() {
  const user = await getSessionUser();

  if (!user) {
    redirect("/login");
  }

  if (user.role === "TEACHER") {
    return <TeacherDashboard user={user} />;
  }

  if (user.role === "STUDENT") {
    return <StudentDashboard user={user} hasActiveClass={false} />;
  }

  // ADMIN — verileri çek
  const [totalUsers, totalStudents, totalTeachers, totalAdmins, totalInstitutions, totalCourses, recentUsers, institutions] =
    await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { role: "STUDENT" } }),
      prisma.user.count({ where: { role: "TEACHER" } }),
      prisma.user.count({ where: { role: "ADMIN" } }),
      prisma.institution.count(),
      prisma.course.count(),
      prisma.user.findMany({
        orderBy: { createdAt: "desc" },
        take: 10,
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          role: true,
          createdAt: true,
        },
      }),
      prisma.institution.findMany({
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          name: true,
          domain: true,
          createdAt: true,
        },
      }),
    ]);

  const stats = {
    totalUsers,
    totalStudents,
    totalTeachers,
    totalAdmins,
    totalInstitutions,
    totalCourses,
  };

  const serializedUsers = recentUsers.map((u) => ({
    ...u,
    createdAt: u.createdAt.toISOString(),
  }));

  const serializedInstitutions = institutions.map((i) => ({
    ...i,
    createdAt: i.createdAt.toISOString(),
  }));

  return (
    <AdminDashboard
      user={user}
      stats={stats}
      institutions={serializedInstitutions}
      recentUsers={serializedUsers}
    />
  );
}
