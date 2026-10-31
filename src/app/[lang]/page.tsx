import type { Locale } from "@/content/i18n";
import Hero from "@/components/Hero";
import Intro from "@/components/Intro";
import SelectedWork from "@/components/SelectedWork";
import OxiaBlock from "@/components/OxiaBlock";
import Lab from "@/components/Lab";
import ProjectIndex from "@/components/ProjectIndex";
import Footer from "@/components/Footer";

export default async function Home({ params }: { params: Promise<{ lang: string }> }) {
  const locale = (await params).lang as Locale;
  return (
    <main>
      <Hero locale={locale} />
      <Intro locale={locale} />
      <SelectedWork locale={locale} />
      <OxiaBlock locale={locale} />
      <Lab locale={locale} />
      <ProjectIndex locale={locale} />
      <Footer locale={locale} />
    </main>
  );
}
