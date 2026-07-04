import "server-only";
import fs from "fs/promises";
import path from "path";
import type { ComponentType } from "react";
import { languages, type Language } from "./i18n";

// Metadata som varje inlägg exporterar som `meta` i sin .mdx-fil.
// ISO-datum ("YYYY-MM-DD") gör att stränge­jämförelse räcker för sortering.
export type WritingMeta = {
  title: string;
  date: string;
};

export type LoadedPost = {
  slug: string;
  meta: WritingMeta;
  Content: ComponentType;
};

const WRITING_DIR = path.join(process.cwd(), "content", "writing");

// Slug-listan är kataloger direkt under content/writing/.
// Läses vid build-tid för generateStaticParams och för index-sidans flöde.
export async function listWritingSlugs(): Promise<string[]> {
  const entries = await fs.readdir(WRITING_DIR, { withFileTypes: true });
  return entries.filter((e) => e.isDirectory()).map((e) => e.name);
}

// Dynamisk MDX-import. Vi delar på språk så att bundlern får en enkel-variabel-
// kontext per gren – mer robust än att stoppa in två variabler i template-strängen.
async function importPost(slug: string, lang: Language) {
  const mod =
    lang === "sv"
      ? await import(`@content/writing/${slug}/sv.mdx`)
      : await import(`@content/writing/${slug}/en.mdx`);
  return mod as { default: ComponentType; meta: WritingMeta };
}

// Laddar ett enskilt inlägg, eller returnerar null om filen saknas.
export async function loadPost(
  slug: string,
  lang: Language,
): Promise<LoadedPost | null> {
  try {
    const mod = await importPost(slug, lang);
    return { slug, meta: mod.meta, Content: mod.default };
  } catch {
    return null;
  }
}

// Alla inlägg på ett språk, sorterade nyast först.
// Inlägg som saknar det efterfrågade språket hoppas tyst över.
export async function listPosts(lang: Language): Promise<LoadedPost[]> {
  const slugs = await listWritingSlugs();
  const settled = await Promise.all(slugs.map((s) => loadPost(s, lang)));
  const posts = settled.filter((p): p is LoadedPost => p !== null);
  posts.sort((a, b) => b.meta.date.localeCompare(a.meta.date));
  return posts;
}

// (slug, lang)-par för alla språk och alla inlägg – för generateStaticParams.
export async function listAllPostParams(): Promise<
  { lang: Language; slug: string }[]
> {
  const slugs = await listWritingSlugs();
  return languages.flatMap((lang) => slugs.map((slug) => ({ lang, slug })));
}

// Datumformattering delas med investing-sektionen – finns i src/lib/date.ts.
// Re-exporteras här så befintliga call-sites (writing/page.tsx m.fl.) inte behöver ändras.
export { formatDate } from "./date";
