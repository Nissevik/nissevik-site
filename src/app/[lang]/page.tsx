import { notFound } from "next/navigation";
import { isLanguage } from "@/lib/i18n";
import { loadSection } from "@/lib/content";

export default async function HomePage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isLanguage(lang)) notFound();
  const Content = await loadSection("home", lang);
  return <Content />;
}
