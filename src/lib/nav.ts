import type { Dictionary } from "./dictionaries";

// Navigationsstruktur. `href` är relativt till /[lang].
// Nissevik-brand (i skalet) fungerar som hem-länk – ingen egen Home-post här.
export type NavItem = {
  id: keyof Dictionary["nav"];
  href: string;
};

export const primaryNav: NavItem[] = [
  { id: "projects", href: "projects" },
  { id: "writing", href: "writing" },
  { id: "reading", href: "reading" },
  { id: "investments", href: "investments" },
];

// Tom tills vidare. Kvar för framtida sekundärsektioner (och sidomenyns valfria avdelare).
export const secondaryNav: NavItem[] = [];

// Alla sektioner – behålls som referens för framtida bruk
export const allSections = [...primaryNav, ...secondaryNav].map((n) => n.id);
export type SectionId = (typeof allSections)[number];
