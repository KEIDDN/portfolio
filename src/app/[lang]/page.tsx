import type { Locale } from "@/content/i18n";
import Hero from "@/components/Hero";
import HomeAbout from "@/components/HomeAbout";
import Work from "@/components/Work";
import OxiaDoor from "@/components/OxiaDoor";
import LabDoor from "@/components/LabDoor";
import Footer from "@/components/Footer";

/**
 * The home tells one story: the name → 01 who I am → 02 the work →
 * 03 the studio behind it → 04 the Lab (a door to its own universe) → let's talk.
 */
export default async function Home({ params }: { params: Promise<{ lang: string }> }) {
  const locale = (await params).lang as Locale;
  return (
    <main>
      <Hero locale={locale} />
      <HomeAbout locale={locale} />
      <Work locale={locale} />
      <OxiaDoor locale={locale} />
      <LabDoor locale={locale} />
      <Footer locale={locale} />
    </main>
  );
}
