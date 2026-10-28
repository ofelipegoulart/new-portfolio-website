import type { Metadata } from "next";
import { Manrope, Schibsted_Grotesk } from "next/font/google";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://felipegoulart.dev";
const siteName = "Felipe Goulart";
const siteDescription =
  "Desenvolvedor de software que transforma ideias complexas em experiências digitais simples, úteis e cheias de personalidade.";

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
  metadataBase: new URL(siteUrl),
  title: {
    default: "Felipe Goulart — Desenvolvedor criativo",
    template: "%s | Felipe Goulart",
  },
  description: siteDescription,
  applicationName: siteName,
  authors: [{ name: siteName, url: siteUrl }],
  creator: siteName,
  keywords: [
    "Felipe Goulart",
    "desenvolvedor de software",
    "desenvolvedor web",
    "desenvolvimento de sites",
    "produtos digitais",
    "Santa Catarina",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Felipe Goulart — Desenvolvedor criativo",
    description: siteDescription,
    url: siteUrl,
    siteName,
    locale: "pt_BR",
    images: ["/images/felipe.webp"],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Felipe Goulart — Desenvolvedor criativo",
    description: siteDescription,
    images: ["/images/felipe.webp"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
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
