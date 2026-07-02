// Stödda språk. `sv` är default, `en` är alternativ.
export const languages = ["sv", "en"] as const;
export type Language = (typeof languages)[number];

export const defaultLanguage: Language = "sv";

export function isLanguage(value: string): value is Language {
  return (languages as readonly string[]).includes(value);
}
