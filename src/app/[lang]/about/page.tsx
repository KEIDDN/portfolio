import type { Locale } from "@/content/i18n";
import About from "@/components/About";
import Footer from "@/components/Footer";

export const metadata = { title: "About" };

export default async function Page({ params }: { params: Promise<{ lang: string }> }) {
  const locale = (await params).lang as Locale;
  return (
    <main>
      <About locale={locale} />
      <Footer locale={locale} />
    </main>
  );
}
