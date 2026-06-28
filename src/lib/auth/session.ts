import { auth } from "@/lib/auth/auth";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";
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

  // Kullanıcının kurum bilgisini veritabanından çek
  let institutionName: string | null = null;
  let institutionId: string | null = null;

  try {
    const dbUser = await prisma.user.findUnique({
      where: { id: u.id },
      select: {
        institutionId: true,
        institution: {
          select: { name: true },
        },
      },
    });

    if (dbUser?.institution) {
      institutionName = dbUser.institution.name;
      institutionId = dbUser.institutionId;
    }
  } catch {
    // DB hatası durumunda kurum bilgisi gösterilmez
  }

  return {
    id: u.id,
    email: u.email,
    firstName,
    lastName,
    role: (u.role as SessionUser["role"]) ?? "STUDENT",
    avatar: u.image ?? null,
    institutionName,
    institutionId,
  };
}
