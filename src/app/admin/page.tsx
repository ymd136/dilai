import { getSessionUser } from "@/lib/auth/session";
import { redirect } from "next/navigation";
import AdminDashboard from "@/components/dashboard/admin/AdminDashboard";
import { prisma } from "@/lib/prisma";

export default async function AdminPage() {
  const user = await getSessionUser();

  if (!user) {
    redirect("/login");
  }

  // Admin'in kurumuna bağlı verileri çek
  const [
    totalUsers,
    totalStudents,
    totalTeachers,
    totalAdmins,
    totalInstitutions,
    totalCourses,
    recentUsers,
    institutions,
  ] = await Promise.all([
    prisma.user.count({ where: { institutionId: user.institutionId ?? undefined } }),
    prisma.user.count({ where: { role: "STUDENT", institutionId: user.institutionId ?? undefined } }),
    prisma.user.count({ where: { role: "TEACHER", institutionId: user.institutionId ?? undefined } }),
    prisma.user.count({ where: { role: "ADMIN", institutionId: user.institutionId ?? undefined } }),
    prisma.institution.count(),
    prisma.course.count(),
    prisma.user.findMany({
      where: { institutionId: user.institutionId ?? undefined },
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
