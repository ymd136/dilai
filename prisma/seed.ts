import * as dotenv from "dotenv";
import * as path from "path";
dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });
dotenv.config({ path: path.resolve(process.cwd(), ".env") });

async function main() {
  console.log("🌱 Veritabanı tohumlama işlemi başladı...");
  console.log("DATABASE_URL:", process.env.DATABASE_URL);

  const { prisma } = await import("../src/lib/prisma");

  // Mevcut kurumları temizle/temizleme (isteğe bağlı, duplicate hatası almamak için upsert kullanıyoruz)
  const institutions = [
    {
      name: "Ankara Üniversitesi",
      domain: "ankara.edu.tr",
    },
    {
      name: "Hacettepe Üniversitesi",
      domain: "hacettepe.edu.tr",
    },
    {
      name: "Orta Doğu Teknik Üniversitesi",
      domain: "metu.edu.tr",
    },
    {
      name: "DilAI Akademisi",
      domain: "dilai.edu",
    },
  ];

  for (const inst of institutions) {
    const created = await prisma.institution.upsert({
      where: { domain: inst.domain },
      update: {},
      create: {
        name: inst.name,
        domain: inst.domain,
      },
    });
    console.log(`✅ Kurum hazırlandı: ${created.name} (${created.domain})`);
  }

  // Kurumlar oluştuktan sonra örnek kullanıcılar oluştur
  const usersToCreate = [
    {
      email: "batuhan@dilai.com",
      password: "123",
      name: "Batuhan Bilgili",
      firstName: "Batuhan",
      lastName: "Bilgili",
    },
    {
      email: "admin@ankara.edu.tr",
      password: "123",
      name: "Ankara Yönetici",
      firstName: "Ankara",
      lastName: "Yönetici",
    },
    {
      email: "admin@hacettepe.edu.tr",
      password: "123",
      name: "Hacettepe Yönetici",
      firstName: "Hacettepe",
      lastName: "Yönetici",
    }
  ];

  const { auth } = await import("../src/lib/auth/auth");

  for (const u of usersToCreate) {
    try {
      // Önce mevcut kullanıcıyı silelim ki temiz oluşsun (duplicate hatası almamak için)
      const existingUser = await prisma.user.findUnique({
        where: { email: u.email }
      });
      if (existingUser) {
        await prisma.$transaction([
          prisma.session.deleteMany({ where: { userId: existingUser.id } }),
          prisma.account.deleteMany({ where: { userId: existingUser.id } }),
          prisma.user.delete({ where: { id: existingUser.id } }),
        ]);
      }

      await auth.api.signUpEmail({
        body: {
          email: u.email,
          password: u.password,
          name: u.name,
          firstName: u.firstName,
          lastName: u.lastName,
        }
      });
      console.log(`✅ Kullanıcı hazırlandı: ${u.name} (${u.email})`);
    } catch (err) {
      console.error(`❌ Kullanıcı oluşturulamadı: ${u.email}`, err);
    }
  }

  console.log("🌱 Tohumlama başarıyla tamamlandı!");
  await prisma.$disconnect();
}

main()
  .catch((e) => {
    console.error("Tohumlama sırasında bir hata oluştu:", e);
    process.exit(1);
  });


