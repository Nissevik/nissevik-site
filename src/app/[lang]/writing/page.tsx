import Link from "next/link";
import { notFound } from "next/navigation";
import { isLanguage, type Language } from "@/lib/i18n";
import { getDictionary } from "@/lib/dictionaries";
import { formatDate, listPosts } from "@/lib/writing";
import { Page, Prose } from "@/components/Page";

export default async function WritingPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isLanguage(lang)) notFound();
  const typedLang: Language = lang;
  const dict = getDictionary(typedLang);
  const posts = await listPosts(typedLang);

  return (
    <Page wide>
      <div className="font-editorial">
        {posts.map((post, i) => (
          <article
            key={post.slug}
            className={
              // Två kolumner på md+ (titel/datum till vänster, brödtext till höger),
              // staplade på smala skärmar. Border mellan inlägg spänner hela bredden.
              "grid grid-cols-1 gap-6 md:grid-cols-[18rem_minmax(0,1fr)] md:gap-12 " +
              (i > 0 ? "mt-16 border-t border-border pt-16" : "")
            }
          >
            <header>
              <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">
                <Link
                  href={`/${typedLang}/writing/${post.slug}`}
                  className="hover:underline"
                >
                  {post.meta.title}
                </Link>
              </h2>
              <p className="mt-3 text-sm italic text-muted-foreground">
                {dict.writing.postedOn} {formatDate(post.meta.date, typedLang)}
              </p>
            </header>
            {/* Håll radlängden läsbar även när högerkolumnen är bred. */}
            <div className="max-w-2xl">
              <Prose>
                <post.Content />
              </Prose>
            </div>
          </article>
        ))}
      </div>
    </Page>
  );
}
