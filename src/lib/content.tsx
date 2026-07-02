import type { ComponentType } from "react";
import type { Language } from "./i18n";
import type { Dictionary } from "./dictionaries";

// Statisk mappning från (section, lang) till MDX-modul.
// Statiska imports gör att Next kan analysera och bundla varje MDX vid build.
type SectionKey = keyof Dictionary["nav"];
type MDXModule = { default: ComponentType };

const modules: Record<SectionKey, Record<Language, () => Promise<MDXModule>>> = {
  home: {
    sv: () => import("@content/home/sv.mdx"),
    en: () => import("@content/home/en.mdx"),
  },
  about: {
    sv: () => import("@content/about/sv.mdx"),
    en: () => import("@content/about/en.mdx"),
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
  contact: {
    sv: () => import("@content/contact/sv.mdx"),
    en: () => import("@content/contact/en.mdx"),
  },
};

export async function loadSection(
  section: SectionKey,
  lang: Language,
): Promise<ComponentType> {
  const mod = await modules[section][lang]();
  return mod.default;
}
