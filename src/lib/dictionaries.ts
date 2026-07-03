import type { Language } from "./i18n";

// All UI-text bor här. Komponenter hårdkodar inga strängar.
export type Dictionary = {
  siteTitle: string;
  siteTagline: string;
  nav: {
    projects: string;
    writing: string;
    reading: string;
    investments: string;
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
  sidebar: {
    open: string;
    close: string;
  };
  breadcrumb: {
    label: string;
  };
  writing: {
    back: string;
    postedOn: string;
  };
  papers: {
    heading: string;
    course: string;
    year: string;
    coauthors: string;
    abstract: string;
    openPdf: string;
    externalLink: string;
    back: string;
  };
  reading: {
    status: {
      reading: string;
      wanted: string;
      read: string;
    };
    controls: {
      sort: string;
      sortDate: string;
      sortRating: string;
      year: string;
      yearAll: string;
      genre: string;
      genreAll: string;
    };
  };
};

const en: Dictionary = {
  siteTitle: "Nissevik",
  siteTagline: "A quiet corner on the web.",
  nav: {
    projects: "Projects",
    writing: "Writing",
    reading: "Reading",
    investments: "Investing",
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
  sidebar: {
    open: "Open menu",
    close: "Close menu",
  },
  breadcrumb: {
    label: "Breadcrumb",
  },
  writing: {
    back: "Back to Writing",
    postedOn: "Posted on",
  },
  papers: {
    heading: "Academic writing",
    course: "Course",
    year: "Year",
    coauthors: "Co-authors",
    abstract: "Abstract",
    openPdf: "Open PDF",
    externalLink: "External link",
    back: "Back to Projects",
  },
  reading: {
    status: {
      reading: "Reading",
      wanted: "To read",
      read: "Read",
    },
    controls: {
      sort: "Sort",
      sortDate: "Latest read",
      sortRating: "Highest rating",
      year: "Year",
      yearAll: "All",
      genre: "Genre",
      genreAll: "All genres",
    },
  },
};

const sv: Dictionary = {
  siteTitle: "Nissevik",
  siteTagline: "En tyst plats på nätet.",
  nav: {
    projects: "Projekt",
    writing: "Skrivande",
    reading: "Läsning",
    investments: "Investering",
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
  sidebar: {
    open: "Öppna meny",
    close: "Stäng meny",
  },
  breadcrumb: {
    label: "Brödsmulor",
  },
  writing: {
    back: "Tillbaka till Skrivande",
    postedOn: "Publicerat",
  },
  papers: {
    heading: "Akademiska texter",
    course: "Kurs",
    year: "År",
    coauthors: "Medförfattare",
    abstract: "Sammanfattning",
    openPdf: "Öppna PDF",
    externalLink: "Extern länk",
    back: "Tillbaka till Projekt",
  },
  reading: {
    status: {
      reading: "Läser",
      wanted: "Vill läsa",
      read: "Läst",
    },
    controls: {
      sort: "Sortera",
      sortDate: "Senast läst",
      sortRating: "Högst betyg",
      year: "År",
      yearAll: "Alla",
      genre: "Genre",
      genreAll: "Alla genrer",
    },
  },
};

const dictionaries: Record<Language, Dictionary> = { sv, en };

export function getDictionary(lang: Language): Dictionary {
  return dictionaries[lang];
}
