import type { Locale } from "@/content/i18n";
import About from "@/components/About";
import Footer from "@/components/Footer";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
  return { title: (await params).lang === "en" ? "About" : "Sobre mí" };
}

export default async function Page({ params }: { params: Promise<{ lang: string }> }) {
  const locale = (await params).lang as Locale;
  return (
    <main>
      <About locale={locale} />
      <Footer locale={locale} />
    </main>
  );
}
