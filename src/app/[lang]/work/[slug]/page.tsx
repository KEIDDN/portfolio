import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { locales, t, type Locale } from "@/content/i18n";
import { getProject, nextAfter, projects } from "@/content/projects";
import CaseStudy from "@/components/CaseStudy";
import Footer from "@/components/Footer";

export function generateStaticParams() {
  return locales.flatMap((lang) => projects.map((p) => ({ lang, slug: p.slug })));
}

export async function generateMetadata({ params }: { params: Promise<{ lang: string; slug: string }> }): Promise<Metadata> {
  const { lang, slug } = await params;
  const p = getProject(slug);
  if (!p) return {};
  return { title: p.title, description: t(p.summary, lang as Locale), openGraph: { images: [p.cover] } };
}

export default async function Page({ params }: { params: Promise<{ lang: string; slug: string }> }) {
  const { lang, slug } = await params;
  const p = getProject(slug);
  if (!p) notFound();
  return (
    <main>
      <CaseStudy project={p} next={nextAfter(slug, lang as Locale)} locale={lang as Locale} />
      <Footer locale={lang as Locale} />
    </main>
  );
}
