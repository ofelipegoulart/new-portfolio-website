import type { Metadata } from "next";
import { Manrope, Schibsted_Grotesk } from "next/font/google";
import "./globals.css";

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "optional",
  preload: false,
  variable: "--font-manrope",
});
const schibstedGrotesk = Schibsted_Grotesk({
  subsets: ["latin"],
  weight: "600",
  display: "optional",
  preload: false,
  variable: "--font-schibsted-grotesk",
});

export const metadata: Metadata = {
  title: "Felipe — Desenvolvedor criativo",
  description:
    "Desenvolvedor de software. Transformo ideias complexas em experiências digitais simples, úteis e cheias de personalidade.",
  openGraph: {
    title: "Felipe — Desenvolvedor criativo",
    description: "Ideias cuidadosas, produtos digitais marcantes.",
    images: ["/images/felipe.webp"],
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="pt-BR"
      className={`${manrope.variable} ${schibstedGrotesk.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
