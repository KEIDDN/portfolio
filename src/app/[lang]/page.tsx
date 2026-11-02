import type { Locale } from "@/content/i18n";
import Hero from "@/components/Hero";
import Intro from "@/components/Intro";
import Work from "@/components/Work";
import OxiaDoor from "@/components/OxiaDoor";
import Lab from "@/components/Lab";
import AboutTeaser from "@/components/AboutTeaser";
import ChapterIndex from "@/components/ChapterIndex";
import ChapterRail from "@/components/ChapterRail";
import Footer from "@/components/Footer";

/**
 * The home tells one story: who (hero) → how I think (intro) →
 * chapter index → 01 Work → 02 OXIA Labs → 03 Lab → 04 About → let's talk.
 */
export default async function Home({ params }: { params: Promise<{ lang: string }> }) {
  const locale = (await params).lang as Locale;
  return (
    <main>
      <Hero locale={locale} />
      <Intro locale={locale} />
      <ChapterIndex locale={locale} />
      <Work locale={locale} />
      <OxiaDoor locale={locale} />
      <Lab locale={locale} />
      <AboutTeaser locale={locale} />
      <Footer locale={locale} />
      <ChapterRail locale={locale} />
    </main>
  );
}
