import type { ComponentType } from "react";
import type { Language } from "./i18n";

// Sektioner som har MDX-innehåll. "home" är inte en menypost men har fortfarande
// en egen sida (renderad av src/app/[lang]/page.tsx).
type SectionKey = "home" | "projects" | "writing" | "reading" | "investments";
type MDXModule = { default: ComponentType };

const modules: Record<SectionKey, Record<Language, () => Promise<MDXModule>>> = {
  home: {
    sv: () => import("@content/home/sv.mdx"),
    en: () => import("@content/home/en.mdx"),
  },
  projects: {
    sv: () => import("@content/projects/sv.mdx"),
    en: () => import("@content/projects/en.mdx"),
  },
  writing: {
    sv: () => import("@content/writing/sv.mdx"),
    en: () => import("@content/writing/en.mdx"),
  },
  reading: {
    sv: () => import("@content/reading/sv.mdx"),
    en: () => import("@content/reading/en.mdx"),
  },
  investments: {
    sv: () => import("@content/investments/sv.mdx"),
    en: () => import("@content/investments/en.mdx"),
  },
};

export async function loadSection(
  section: SectionKey,
  lang: Language,
): Promise<ComponentType> {
  const mod = await modules[section][lang]();
  return mod.default;
}
