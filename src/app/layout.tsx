import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "DilAI | Yapay Zeka Destekli Dil Eğitimi Platformu",
  description:
    "DilAI; eğitim kurumlarının TOEFL, YDS, YÖKDİL sınav süreçlerini dijitalleştiren ve yapay zeka ile optimize eden platformdur. AI destekli konuşma analizi, otomatik puanlama ve kurumsal ödev yönetimi.",
  keywords: [
    "yapay zeka",
    "dil eğitimi",
    "TOEFL",
    "YDS",
    "YÖKDİL",
    "speaking analizi",
    "LMS",
    "dil kursu",
  ],
  openGraph: {
    title: "DilAI | Yapay Zeka Destekli Dil Eğitimi Platformu",
    description:
      "Eğitim kurumları için AI destekli konuşma analizi, otomatik puanlama ve kurumsal ödev yönetimi.",
    type: "website",
    locale: "tr_TR",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <body>
        <div className="gradient-bg" aria-hidden="true" />
        {children}
      </body>
    </html>
  );
}
