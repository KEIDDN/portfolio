import type { Locale } from "@/content/i18n";
import Hero from "@/components/Hero";
import Intro from "@/components/Intro";
import Work from "@/components/Work";
import OxiaDoor from "@/components/OxiaDoor";
import Lab from "@/components/Lab";
import Footer from "@/components/Footer";

/**
 * The home tells one story: who (hero) → how I think (intro) →
 * 01 Product → 02 Studio (door to OXIA Labs) → 03 Graphic (Lab) → let's talk.
 */
export default async function Home({ params }: { params: Promise<{ lang: string }> }) {
  const locale = (await params).lang as Locale;
  return (
    <main>
      <Hero locale={locale} />
      <Intro locale={locale} />
      <Work locale={locale} />
      <OxiaDoor locale={locale} />
      <Lab locale={locale} />
      <Footer locale={locale} />
    </main>
  );
}
