import type { Locale } from "@/content/i18n";
import LabCarousel from "@/components/LabCarousel";

export const metadata = {
  title: "Lab",
  description: "Lab — design experiments by Miki Herrero: objects, records, posters and 3D pieces.",
};

export default async function Page({ params }: { params: Promise<{ lang: string }> }) {
  const locale = (await params).lang as Locale;
  return (
    <main>
      <LabCarousel locale={locale} />
    </main>
  );
}
