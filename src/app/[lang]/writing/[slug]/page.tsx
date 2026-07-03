import Link from "next/link";
import { notFound } from "next/navigation";
import { isLanguage, type Language } from "@/lib/i18n";
import { getDictionary } from "@/lib/dictionaries";
import { formatDate, listAllPostParams, loadPost } from "@/lib/writing";
import { Page, Prose } from "@/components/Page";

// Prerendera alla (lang, slug)-par vid build. Okända slugs → 404.
export async function generateStaticParams() {
  return await listAllPostParams();
}
export const dynamicParams = false;

export default async function WritingPostPage({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}) {
  const { lang, slug } = await params;
  if (!isLanguage(lang)) notFound();
  const typedLang: Language = lang;
  const dict = getDictionary(typedLang);
  const post = await loadPost(slug, typedLang);
  if (!post) notFound();

  return (
    <Page wide>
      <div className="font-editorial">
        <article className="grid grid-cols-1 gap-6 md:grid-cols-[18rem_minmax(0,1fr)] md:gap-12">
          <header>
            {/* Diskret tillbaka-länk – sans-typsnitt så den skiljer sig från texten */}
            <Link
              href={`/${typedLang}/writing`}
              className="mb-8 inline-flex items-center gap-1 font-sans text-sm text-muted-foreground transition-colors duration-75 ease-out hover:text-foreground"
            >
              <span aria-hidden>←</span>
              {dict.writing.back}
            </Link>
            <h1 className="text-4xl font-semibold tracking-tight md:text-5xl">
              {post.meta.title}
            </h1>
            <p className="mt-4 text-sm italic text-muted-foreground">
              {dict.writing.postedOn} {formatDate(post.meta.date, typedLang)}
            </p>
          </header>
          <div className="max-w-2xl">
            <Prose>
              <post.Content />
            </Prose>
          </div>
        </article>
      </div>
    </Page>
  );
}
