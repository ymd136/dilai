import { auth } from "@/lib/auth/auth";
import { headers } from "next/headers";
import type { SessionUser } from "@/types/user";

/**
 * Sunucu taraflı session okuma.
 * Başarısız olursa null döner — middleware zaten korumasız erişimi engeller.
 */
export async function getSessionUser(): Promise<SessionUser | null> {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) return null;

  const u = session.user as {
    id: string;
    email: string;
    firstName?: string;
    lastName?: string;
    name?: string;
    image?: string;
    role?: string;
  };

  // firstName / lastName yoksa name'den türet
  let firstName = u.firstName ?? "";
  let lastName = u.lastName ?? "";

  if (!firstName && u.name) {
    const parts = u.name.split(" ");
    firstName = parts[0] ?? "";
    lastName = parts.slice(1).join(" ") || "";
  }

  return {
    id: u.id,
    email: u.email,
    firstName,
    lastName,
    role: (u.role as SessionUser["role"]) ?? "STUDENT",
    avatar: u.image ?? null,
  };
}
