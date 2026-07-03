import { notFound } from "next/navigation";
import { isLanguage } from "@/lib/i18n";
import { loadSection } from "@/lib/content";
import { Page, Prose } from "@/components/Page";

export default async function InvestmentsPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isLanguage(lang)) notFound();
  const Content = await loadSection("investments", lang);
  return (
    <Page>
      <Prose>
        <Content />
      </Prose>
    </Page>
  );
}
