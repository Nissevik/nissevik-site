import Link from "next/link";
import { notFound } from "next/navigation";
import { isLanguage, type Language } from "@/lib/i18n";
import { formatDate } from "@/lib/date";
import { listAnalyses } from "@/lib/investing";
import { Page } from "@/components/Page";

export default async function InvestingPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isLanguage(lang)) notFound();
  const typedLang: Language = lang;
  const analyses = await listAnalyses(typedLang);

  return (
    <Page>
      {/* Divide-y ger den tunna avdelaren mellan rader; py-8 på varje rad
          håller den luftig, som Not Borings arkiv. */}
      <ul className="divide-y divide-border">
        {analyses.map((a) => {
          const tags = [a.meta.sector, a.meta.ticker].filter(Boolean);
          return (
            <li key={a.slug} className="py-8 first:pt-0 last:pb-0">
              <Link
                href={`/${typedLang}/investments/${a.slug}`}
                className="group flex items-start gap-6"
              >
                <div className="min-w-0 flex-1">
                  <div className="text-base font-semibold text-foreground group-hover:underline">
                    {a.meta.title}
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {a.meta.thesis}
                  </p>
                  <p className="mt-3 text-xs text-muted-foreground/70">
                    {formatDate(a.meta.date, typedLang)}
                    {tags.length > 0 && <> · {tags.join(" · ")}</>}
                  </p>
                </div>
                {a.meta.image && (
                  // Vi använder <img> för att slippa konfigurera next/image för
                  // godtyckliga sökvägar i public/. Alt tomt – dekorativ tumnagel.
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={a.meta.image}
                    alt=""
                    className="h-24 w-24 shrink-0 rounded-md border border-border object-cover"
                  />
                )}
              </Link>
            </li>
          );
        })}
      </ul>
    </Page>
  );
}
