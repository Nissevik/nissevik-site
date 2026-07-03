import { notFound } from "next/navigation";
import { SidebarShell } from "@/components/SidebarShell";
import { IslandShell } from "@/components/IslandShell";
import { isLanguage, languages, type Language } from "@/lib/i18n";
import { NAV_STYLE } from "@/lib/config";

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

  // Skal utifrån NAV_STYLE i src/lib/config.ts
  if (NAV_STYLE === "island") {
    return <IslandShell lang={typedLang}>{children}</IslandShell>;
  }
  return <SidebarShell lang={typedLang}>{children}</SidebarShell>;
}
