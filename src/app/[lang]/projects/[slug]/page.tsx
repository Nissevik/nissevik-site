import Link from "next/link";
import { notFound } from "next/navigation";
import { isLanguage, languages, type Language } from "@/lib/i18n";
import { getDictionary } from "@/lib/dictionaries";
import { findPaper, listEmbeddablePapers } from "@/lib/papers";
import { Page } from "@/components/Page";

// Endast poster med inbäddad fulltext får en detaljsida. Länk-bara-poster
// hoppas över helt – dynamicParams=false gör dem till 404.
export async function generateStaticParams() {
  return listEmbeddablePapers().flatMap((p) =>
    languages.map((lang) => ({ lang, slug: p.slug })),
  );
}
export const dynamicParams = false;

export default async function PaperPage({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}) {
  const { lang, slug } = await params;
  if (!isLanguage(lang)) notFound();
  const typedLang: Language = lang;
  const dict = getDictionary(typedLang);
  const paper = findPaper(slug);
  // 404 om posten saknas eller om den råkar sakna fulltext (borde inte
  // hända med dynamicParams=false, men vi säkerställer det ändå).
  if (!paper || !paper.file) notFound();

  return (
    <Page>
      <Link
        href={`/${typedLang}/projects`}
        className="mb-8 inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors duration-75 ease-out hover:text-foreground"
      >
        <span aria-hidden>←</span>
        {dict.papers.back}
      </Link>

      <article>
        <h1 className="text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
          {paper.title}
        </h1>

        {/* Metadata som liten definitions­lista – kompakt och skanbar */}
        <dl className="mt-5 grid grid-cols-[auto_minmax(0,1fr)] gap-x-4 gap-y-1 text-sm">
          <dt className="text-muted-foreground">{dict.papers.course}</dt>
          <dd className="text-foreground">{paper.course}</dd>

          <dt className="text-muted-foreground">{dict.papers.year}</dt>
          <dd className="text-foreground">{paper.year}</dd>

          {paper.coauthors && paper.coauthors.length > 0 && (
            <>
              <dt className="text-muted-foreground">
                {dict.papers.coauthors}
              </dt>
              <dd className="text-foreground">{paper.coauthors.join(", ")}</dd>
            </>
          )}
        </dl>

        {paper.abstract && (
          <section className="mt-8">
            <h2 className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              {dict.papers.abstract}
            </h2>
            <p className="mt-3 text-base leading-relaxed text-foreground">
              {paper.abstract}
            </p>
          </section>
        )}

        {/* Inline PDF – webbläsarens egen visning. Iframen får ordentlig höjd så
            man kan läsa i den direkt. Öppna-länken (och ev. extern länk) är
            fallback för klienter utan inbyggd PDF-visning. */}
        <div className="mt-10">
          <iframe
            src={paper.file}
            title={paper.title}
            className="h-[85vh] w-full rounded-md border border-border bg-muted"
          />
          <p className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs">
            <a
              href={paper.file}
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground underline underline-offset-2 transition-colors duration-75 ease-out hover:text-foreground"
            >
              {dict.papers.openPdf} ↗
            </a>
            {paper.link && (
              <a
                href={paper.link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground underline underline-offset-2 transition-colors duration-75 ease-out hover:text-foreground"
              >
                {dict.papers.externalLink} ↗
              </a>
            )}
          </p>
        </div>
      </article>
    </Page>
  );
}
