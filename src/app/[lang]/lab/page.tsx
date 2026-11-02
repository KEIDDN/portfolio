import type { Locale } from "@/content/i18n";
import LabUniverse from "@/components/LabUniverse";

export const metadata = {
  title: "Lab",
  description: "Lab — a laboratory of design experiments by Miki Herrero.",
};

export default async function Page({ params }: { params: Promise<{ lang: string }> }) {
  const locale = (await params).lang as Locale;
  return (
    <main>
      <LabUniverse locale={locale} />
    </main>
  );
}
