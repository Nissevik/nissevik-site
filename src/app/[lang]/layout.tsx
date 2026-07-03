import { notFound } from "next/navigation";
import { SidebarShell } from "@/components/SidebarShell";
import { isLanguage, languages, type Language } from "@/lib/i18n";

// Statisk generering per språk
export function generateStaticParams() {
  return languages.map((lang) => ({ lang }));
}

export default async function LangLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isLanguage(lang)) notFound();
  const typedLang: Language = lang;

  return <SidebarShell lang={typedLang}>{children}</SidebarShell>;
}
