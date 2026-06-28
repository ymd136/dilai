import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "../prisma";

// ============================================================
// Domain Tespiti
// ============================================================

/**
 * Öğrenci alt-domain kalıpları.
 * Bu kalıplarla başlayan subdomain'ler otomatik STUDENT olur.
 * Örn: ogr.ankara.edu.tr → STUDENT
 */
const STUDENT_SUBDOMAINS = [
  "ogr",
  "ogrenci",
  "student",
  "students",
  "st",
  "stu",
  "ogrencisi",
];

/**
 * Eğitimsel üst-domain sonekleri.
 * Bu son eklerle biten domain'ler eğitim kurumu sayılır.
 */
const EDU_SUFFIXES = [
  ".edu.tr",
  ".edu",
  ".ac.uk",
  ".ac.nz",
  ".ac.za",
  ".ac.jp",
  ".edu.au",
  ".edu.br",
  ".edu.cn",
  ".edu.mx",
  ".edu.sg",
];

/**
 * E-posta domain'inin eğitim kurumuna ait olup olmadığını kontrol eder.
 */
function isEducationalDomain(domain: string): boolean {
  return EDU_SUFFIXES.some((suffix) => domain.endsWith(suffix));
}

/**
 * Domain'in öğrenci subdomain'i içerip içermediğini kontrol eder.
 * Örn: ogr.ankara.edu.tr → true
 *      st.mit.edu → true
 *      ankara.edu.tr → false
 */
function isStudentSubdomain(domain: string): boolean {
  const parts = domain.split(".");
  if (parts.length < 3) return false; // En az 3 parça olmalı (sub.domain.tld)
  const subdomain = parts[0].toLowerCase();
  return STUDENT_SUBDOMAINS.includes(subdomain);
}

/**
 * E-posta adresine bakarak kullanıcı rolünü belirler.
 *
 * Mantık:
 *  1. ogr.edu.tr, st.edu.tr gibi öğrenci subdomain'i → STUDENT
 *  2. Eğitimsel domain (edu.tr, edu) + veritabanında Institution kaydı var → ADMIN
 *  3. Eğitimsel domain ama Institution kaydı yok → TEACHER
 *  4. Diğer tüm domainler → STUDENT
 */
async function detectRoleFromEmail(
  email: string
): Promise<"STUDENT" | "TEACHER" | "ADMIN"> {
  const domain = email.split("@")[1]?.toLowerCase() ?? "";

  if (!isEducationalDomain(domain)) {
    return "STUDENT";
  }

  // Öğrenci alt-domain'i mi?
  if (isStudentSubdomain(domain)) {
    return "STUDENT";
  }

  // Eğitimsel domain — kurumun DB'de kayıtlı olup olmadığına bak
  try {
    // Tam domain eşleşmesi veya üst-domain eşleşmesi
    // Örn: ankara.edu.tr için "ankara.edu.tr" veya "edu.tr" kayıtlı mı?
    const institution = await prisma.institution.findFirst({
      where: {
        domain: {
          in: buildDomainVariants(domain),
        },
      },
    });

    if (institution) {
      return "ADMIN";
    }
  } catch {
    // DB hatası durumunda güvenli varsayılan
  }

  // Eğitimsel domain ama kayıtlı kurum değil → Eğitmen
  return "TEACHER";
}

/**
 * Bir domain için olası eşleşme varyantlarını üretir.
 * Örn: "ogretmen.ankara.edu.tr" → ["ogretmen.ankara.edu.tr", "ankara.edu.tr", "edu.tr"]
 */
function buildDomainVariants(domain: string): string[] {
  const parts = domain.split(".");
  const variants: string[] = [];
  for (let i = 0; i < parts.length - 1; i++) {
    variants.push(parts.slice(i).join("."));
  }
  return variants;
}

// ============================================================
// BetterAuth Yapılandırması
// ============================================================

export const auth = betterAuth({
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  database: prismaAdapter(prisma as any, {
    provider: "postgresql",
  }),

  secret: process.env.BETTER_AUTH_SECRET!,
  baseURL: process.env.BETTER_AUTH_URL ?? "http://localhost:3000",

  emailAndPassword: {
    enabled: true,
    autoSignIn: true,
    minPasswordLength: 8,
  },

  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    },
    microsoft: {
      clientId: process.env.MICROSOFT_CLIENT_ID!,
      clientSecret: process.env.MICROSOFT_CLIENT_SECRET!,
      tenantId: "common",
    },
  },

  // Aynı e-posta adresi farklı provider'larla kullanıldığında tek hesapta birleştir
  account: {
    accountLinking: {
      enabled: true,
      trustedProviders: ["google", "microsoft", "email-password"],
    },
  },

  user: {
    additionalFields: {
      role: {
        type: "string",
        required: false,
        defaultValue: "STUDENT",
        input: false,
      },
      firstName: {
        type: "string",
        required: false,
        input: true,
      },
      lastName: {
        type: "string",
        required: false,
        input: true,
      },
    },
  },

  databaseHooks: {
    user: {
      create: {
        before: async (userData) => {
          const email = (userData as { email: string }).email ?? "";
          const role = await detectRoleFromEmail(email);

          const data = userData as Record<string, unknown>;
          let firstName = data.firstName as string | undefined;
          let lastName = data.lastName as string | undefined;
          const name = data.name as string | undefined;

          if (!firstName && name) {
            const parts = name.split(" ");
            firstName = parts[0] ?? "";
            lastName = parts.slice(1).join(" ") || "";
          }

          return {
            data: {
              ...userData,
              role,
              firstName: firstName ?? "",
              lastName: lastName ?? "",
            },
          };
        },
      },
    },
  },

  trustedOrigins: [process.env.BETTER_AUTH_URL ?? "http://localhost:3000"],
});

export type Auth = typeof auth;
