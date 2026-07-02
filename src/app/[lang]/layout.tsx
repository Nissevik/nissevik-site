import { notFound } from "next/navigation";
import { Sidebar } from "@/components/Sidebar";
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

  return (
    <div className="min-h-screen">
      <Sidebar lang={typedLang} />
      <main className="md:ml-64">
        <div className="mx-auto max-w-2xl px-6 py-12 md:px-10 md:py-16">
          <article className="prose">{children}</article>
        </div>
      </main>
    </div>
  );
}
