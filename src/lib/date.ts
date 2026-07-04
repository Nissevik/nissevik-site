import type { Language } from "./i18n";

// Formatterar ett ISO-datum ("YYYY-MM-DD") som lång dag enligt språket:
//   sv: "17 december 2025"
//   en: "December 17, 2025"
export function formatDate(iso: string, lang: Language): string {
  const date = new Date(`${iso}T00:00:00Z`);
  const locale = lang === "sv" ? "sv-SE" : "en-US";
  return new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  }).format(date);
}
