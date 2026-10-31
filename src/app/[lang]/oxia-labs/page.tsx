import type { Locale } from "@/content/i18n";
import OxiaPage from "@/components/OxiaPage";
import Footer from "@/components/Footer";

export const metadata = {
  title: "OXIA Labs",
  description: "OXIA Labs — Creative Technology & Design Studio founded by Miki Herrero.",
};

export default async function Page({ params }: { params: Promise<{ lang: string }> }) {
  const locale = (await params).lang as Locale;
  return (
    <main>
      <OxiaPage locale={locale} />
      <Footer locale={locale} />
    </main>
  );
}
