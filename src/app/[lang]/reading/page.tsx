import { notFound } from "next/navigation";
import { isLanguage } from "@/lib/i18n";
import { loadSection } from "@/lib/content";
import { getDictionary } from "@/lib/dictionaries";
import { books } from "@/lib/books";
import { BookGrid } from "@/components/BookGrid";
import { Page, Prose } from "@/components/Page";
import { ReadingDecor } from "@/components/ReadingDecor";

export default async function ReadingPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isLanguage(lang)) notFound();
  const Content = await loadSection("reading", lang);
  const dict = getDictionary(lang);

  return (
    // Relative-wrappern låter dekor-overlayen ligga absolut över hela sidhöjden.
    <div className="relative">
      <ReadingDecor />
      <Page wide>
        {/* Introtexten hålls i behaglig textbredd även om sidan i övrigt är bred */}
        <div className="max-w-2xl">
          <Prose>
            <Content />
          </Prose>
        </div>
        <div className="mt-8">
          <BookGrid books={books} dict={dict.reading} />
        </div>
      </Page>
    </div>
  );
}
