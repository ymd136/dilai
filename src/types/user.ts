export type UserRole = "STUDENT" | "TEACHER" | "ADMIN";

export type SessionUser = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  avatar?: string | null;
  institutionName?: string | null;
  institutionId?: string | null;
};

export function toPrismaRole(role: "student" | "teacher" | "admin"): UserRole {
  return role.toUpperCase() as UserRole;
}
