import "server-only";
import fs from "fs/promises";
import path from "path";
import type { ComponentType } from "react";
import { languages, type Language } from "./i18n";

// Metadata som varje analys exporterar som `meta` i sin .mdx-fil.
// ISO-datum ("YYYY-MM-DD") räcker för sortering via strängjämförelse.
export type InvestingMeta = {
  title: string;
  date: string;
  thesis: string;
  sector?: string;
  ticker?: string;
  // Egen slutsats/stance (t.ex. "Köp", "Bevaka", "Sälj"). Fri text.
  verdict?: string;
  // Nyckeltal som visas i sammanfattningskortet. Fri label/value på det språk
  // som analysen är skriven på.
  metrics?: { label: string; value: string }[];
  // Sökväg till miniatyrbild i public/ (t.ex. "/investing/evolution.svg").
  // Visas i index-listan om den finns.
  image?: string;
};

export type LoadedAnalysis = {
  slug: string;
  meta: InvestingMeta;
  Content: ComponentType;
};

const INVESTING_DIR = path.join(process.cwd(), "content", "investing");

// Slug-listan = kataloger direkt under content/investing/.
// Om katalogen inte finns (t.ex. innan man skapat något inlägg) svarar vi tomt
// istället för att kasta – då syns bara en tom lista på index-sidan.
export async function listInvestingSlugs(): Promise<string[]> {
  try {
    const entries = await fs.readdir(INVESTING_DIR, { withFileTypes: true });
    return entries.filter((e) => e.isDirectory()).map((e) => e.name);
  } catch {
    return [];
  }
}

// Dynamisk MDX-import, förgrenad per språk för robust bundler-context
// (samma mönster som writing/loader).
async function importAnalysis(slug: string, lang: Language) {
  const mod =
    lang === "sv"
      ? await import(`@content/investing/${slug}/sv.mdx`)
      : await import(`@content/investing/${slug}/en.mdx`);
  return mod as { default: ComponentType; meta: InvestingMeta };
}

// Laddar en enskild analys eller returnerar null om filen saknas.
export async function loadAnalysis(
  slug: string,
  lang: Language,
): Promise<LoadedAnalysis | null> {
  try {
    const mod = await importAnalysis(slug, lang);
    return { slug, meta: mod.meta, Content: mod.default };
  } catch {
    return null;
  }
}

// Alla analyser på ett språk, sorterade nyast först.
// Analyser som saknar det efterfrågade språket hoppas tyst över.
export async function listAnalyses(
  lang: Language,
): Promise<LoadedAnalysis[]> {
  const slugs = await listInvestingSlugs();
  const settled = await Promise.all(slugs.map((s) => loadAnalysis(s, lang)));
  const items = settled.filter((a): a is LoadedAnalysis => a !== null);
  items.sort((a, b) => b.meta.date.localeCompare(a.meta.date));
  return items;
}

// (slug, lang)-par för alla språk och alla analyser – för generateStaticParams.
export async function listAllAnalysisParams(): Promise<
  { lang: Language; slug: string }[]
> {
  const slugs = await listInvestingSlugs();
  return languages.flatMap((lang) => slugs.map((slug) => ({ lang, slug })));
}
