import type { Language } from "./i18n";

// All UI-text bor här. Komponenter hårdkodar inga strängar.
export type Dictionary = {
  siteTitle: string;
  siteTagline: string;
  nav: {
    home: string;
    about: string;
    projects: string;
    writing: string;
    reading: string;
    investments: string;
    contact: string;
  };
  theme: {
    label: string;
    light: string;
    dark: string;
    system: string;
  };
  language: {
    label: string;
    sv: string;
    en: string;
  };
};

const en: Dictionary = {
  siteTitle: "Nissevik",
  siteTagline: "A quiet corner on the web.",
  nav: {
    home: "Home",
    about: "About",
    projects: "Projects",
    writing: "Writing",
    reading: "Reading list",
    investments: "Investments",
    contact: "Contact",
  },
  theme: {
    label: "Theme",
    light: "Light",
    dark: "Dark",
    system: "Auto",
  },
  language: {
    label: "Language",
    sv: "SV",
    en: "EN",
  },
};

const sv: Dictionary = {
  siteTitle: "Nissevik",
  siteTagline: "En tyst plats på nätet.",
  nav: {
    home: "Hem",
    about: "Om",
    projects: "Projekt",
    writing: "Texter",
    reading: "Läslista",
    investments: "Investeringar",
    contact: "Kontakt",
  },
  theme: {
    label: "Tema",
    light: "Ljust",
    dark: "Mörkt",
    system: "Auto",
  },
  language: {
    label: "Språk",
    sv: "SV",
    en: "EN",
  },
};

const dictionaries: Record<Language, Dictionary> = { sv, en };

export function getDictionary(lang: Language): Dictionary {
  return dictionaries[lang];
}
