import { notFound } from "next/navigation";
import { isLanguage } from "@/lib/i18n";
import { loadSection } from "@/lib/content";

export default async function ContactPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isLanguage(lang)) notFound();
  const Content = await loadSection("contact", lang);
  return <Content />;
}
