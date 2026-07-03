import Link from "next/link";
import { notFound } from "next/navigation";
import { isLanguage, type Language } from "@/lib/i18n";
import { getDictionary } from "@/lib/dictionaries";
import { loadSection } from "@/lib/content";
import { listPapers } from "@/lib/papers";
import { Page, Prose } from "@/components/Page";

export default async function ProjectsPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isLanguage(lang)) notFound();
  const typedLang: Language = lang;
  const dict = getDictionary(typedLang);
  const Content = await loadSection("projects", typedLang);
  const papers = listPapers();

  return (
    <Page>
      <Prose>
        <Content />
      </Prose>

      {papers.length > 0 && (
        <section className="mt-16">
          <h2 className="text-lg font-semibold tracking-tight text-foreground">
            {dict.papers.heading}
          </h2>
          <ul className="mt-6 space-y-5">
            {papers.map((p) => {
              // Poster med egen fulltext går till detaljsidan. Rena länk-poster
              // pekar direkt ut – ingen detaljsida görs för dem.
              const hasFile = Boolean(p.file);
              const inner = (
                <>
                  <span className="text-base font-medium text-foreground group-hover:underline">
                    {p.title}
                    {!hasFile && (
                      <IconArrowUpRight className="ml-1 inline-block align-[-1px]" />
                    )}
                  </span>
                  <span className="mt-0.5 block text-xs text-muted-foreground">
                    {p.course} · {p.year}
                  </span>
                  {p.coauthors && p.coauthors.length > 0 && (
                    <span className="mt-0.5 block text-xs text-muted-foreground/80">
                      {p.coauthors.join(", ")}
                    </span>
                  )}
                </>
              );

              return (
                <li key={p.slug}>
                  {hasFile ? (
                    <Link
                      href={`/${typedLang}/projects/${p.slug}`}
                      className="group block"
                    >
                      {inner}
                    </Link>
                  ) : (
                    <a
                      href={p.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group block"
                    >
                      {inner}
                    </a>
                  )}
                </li>
              );
            })}
          </ul>
        </section>
      )}
    </Page>
  );
}

// Liten diagonal pil för externa länkar – återanvänder ingen import, bara inline SVG.
function IconArrowUpRight({ className }: { className?: string }) {
  return (
    <svg
      width="10"
      height="10"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      <line x1="7" y1="17" x2="17" y2="7" />
      <polyline points="7 7 17 7 17 17" />
    </svg>
  );
}
