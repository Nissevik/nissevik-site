import { notFound } from "next/navigation";
import { isLanguage, type Language } from "@/lib/i18n";
import { getDictionary, type Dictionary } from "@/lib/dictionaries";
import { formatDate } from "@/lib/date";
import {
  listAllAnalysisParams,
  loadAnalysis,
  type InvestingMeta,
} from "@/lib/investing";
import { Page, Prose } from "@/components/Page";

// Prerendera alla (lang, slug)-par vid build. Okända slugs → 404.
export async function generateStaticParams() {
  return await listAllAnalysisParams();
}
export const dynamicParams = false;

export default async function AnalysisPage({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}) {
  const { lang, slug } = await params;
  if (!isLanguage(lang)) notFound();
  const typedLang: Language = lang;
  const dict = getDictionary(typedLang);
  const analysis = await loadAnalysis(slug, typedLang);
  if (!analysis) notFound();

  return (
    <Page>
      <article>
        <h1 className="text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
          {analysis.meta.title}
        </h1>
        <p className="mt-3 text-sm text-muted-foreground">
          {formatDate(analysis.meta.date, typedLang)}
        </p>

        <SummaryCard meta={analysis.meta} dict={dict.investing} />

        <Prose>
          <analysis.Content />
        </Prose>
      </article>
    </Page>
  );
}

// Litet sammanfattningskort ovanför brödtexten. Diskret kant + varm muted-bakgrund
// via befintliga tokens, funkar automatiskt i både ljust och mörkt läge.
function SummaryCard({
  meta,
  dict,
}: {
  meta: InvestingMeta;
  dict: Dictionary["investing"];
}) {
  // Endast rader som är satta visas. Verdict / sektor / ticker kondenseras till
  // en definitions­lista; metrics till ett eget rutnät under en tunn avdelare.
  const facts: { label: string; value: string }[] = [];
  if (meta.sector) facts.push({ label: dict.sector, value: meta.sector });
  if (meta.ticker) facts.push({ label: dict.ticker, value: meta.ticker });
  if (meta.verdict) facts.push({ label: dict.verdict, value: meta.verdict });

  return (
    <aside className="my-8 rounded-lg border border-border bg-muted/40 p-6">
      <p className="text-base leading-relaxed text-foreground">
        {meta.thesis}
      </p>

      {facts.length > 0 && (
        <dl className="mt-5 grid grid-cols-[auto_minmax(0,1fr)] gap-x-4 gap-y-1.5 text-sm">
          {facts.map((f) => (
            <div key={f.label} className="contents">
              <dt className="text-muted-foreground">{f.label}</dt>
              <dd className="text-foreground">{f.value}</dd>
            </div>
          ))}
        </dl>
      )}

      {meta.metrics && meta.metrics.length > 0 && (
        <>
          <div className="my-5 h-px w-full bg-border/60" aria-hidden />
          <dl className="grid grid-cols-2 gap-x-6 gap-y-4 sm:grid-cols-3">
            {meta.metrics.map((m) => (
              <div key={m.label}>
                <dt className="text-xs uppercase tracking-wider text-muted-foreground">
                  {m.label}
                </dt>
                <dd className="mt-1 text-base font-medium text-foreground">
                  {m.value}
                </dd>
              </div>
            ))}
          </dl>
        </>
      )}
    </aside>
  );
}
