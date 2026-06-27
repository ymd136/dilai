import { MOCK_STUDENT, MOCK_TEACHER } from "@/lib/mocks/sessionUser";
import type { SessionUser, UserRole } from "@/types/user";

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK !== "false";

function resolveMockUser(): SessionUser {
  const mockRole = process.env.NEXT_PUBLIC_MOCK_ROLE as UserRole | undefined;
  if (mockRole === "TEACHER") return MOCK_TEACHER;
  if (mockRole === "ADMIN") {
    return { ...MOCK_TEACHER, role: "ADMIN", firstName: "Admin", lastName: "User" };
  }
  return MOCK_STUDENT;
}

export async function getSessionUser(): Promise<SessionUser> {
  if (USE_MOCK) {
    return resolveMockUser();
  }

  // TODO: NextAuth entegrasyonu tamamlandığında auth() ile değiştirilecek
  throw new Error("Auth henüz yapılandırılmadı. NEXT_PUBLIC_USE_MOCK=true kullanın.");
}
