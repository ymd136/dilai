import { getSessionUser } from "@/lib/auth/session";
import { redirect } from "next/navigation";
import CompanyDashboard from "@/components/dashboard/company/CompanyDashboard";
import { prisma } from "@/lib/prisma";

export default async function CompanyPage() {
  const user = await getSessionUser();

  if (!user || !user.institutionId) {
    redirect("/login");
  }

  // Sadece bu kurum yöneticisinin kurumuna ait verileri çek
  const [
    totalUsers,
    totalStudents,
    totalTeachers,
    recentUsers,
  ] = await Promise.all([
    prisma.user.count({ where: { institutionId: user.institutionId } }),
    prisma.user.count({ where: { role: "STUDENT", institutionId: user.institutionId } }),
    prisma.user.count({ where: { role: "TEACHER", institutionId: user.institutionId } }),
    prisma.user.findMany({
      where: { institutionId: user.institutionId },
      orderBy: { createdAt: "desc" },
      take: 10,
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        role: true,
        status: true,
        createdAt: true,
      },
    }),
  ]);

  const stats = {
    totalUsers,
    totalStudents,
    totalTeachers,
  };

  const serializedUsers = recentUsers.map((u) => ({
    ...u,
    createdAt: u.createdAt.toISOString(),
  }));

  return (
    <CompanyDashboard
      user={user}
      stats={stats}
      recentUsers={serializedUsers}
    />
  );
}
