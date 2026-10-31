import type { Metadata, Viewport } from "next";
import { Geist_Mono } from "next/font/google";
import { notFound } from "next/navigation";
import "../globals.css";
import { isLocale, locales, type Locale } from "@/content/i18n";
import SmoothScroll from "@/components/SmoothScroll";
import Loader from "@/components/Loader";
import Nav from "@/components/Nav";

const mono = Geist_Mono({ subsets: ["latin"], variable: "--font-mono", display: "swap" });

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const es = lang === "es";
  const description = es
    ? "Miki Herrero — Product Designer especializado en Creative Technology e IA. Fundador de OXIA Labs."
    : "Miki Herrero — Product Designer focused on Creative Technology & AI. Founder of OXIA Labs.";
  return {
    title: { default: "Miki Herrero — Product Designer", template: "%s — Miki Herrero" },
    description,
    metadataBase: new URL(
      process.env.NEXT_PUBLIC_SITE_URL ??
        (process.env.VERCEL_PROJECT_PRODUCTION_URL
          ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
          : "http://localhost:3000"),
    ),
    openGraph: { title: "Miki Herrero", description, images: ["/og.jpg"], type: "website" },
    twitter: { card: "summary_large_image", images: ["/og.jpg"] },
    alternates: { languages: { en: "/en", es: "/es" } },
    icons: { icon: "/favicon.svg" },
  };
}

export const viewport: Viewport = { themeColor: "#050505" };

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const locale = lang as Locale;
  return (
    <html lang={locale} className={`${mono.variable}`}>
      <body>
        <SmoothScroll>
          <Loader locale={locale} />
          <Nav locale={locale} />
          {children}
        </SmoothScroll>
        <div className="grain" aria-hidden />
      </body>
    </html>
  );
}
