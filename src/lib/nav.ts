import type { Dictionary } from "./dictionaries";

// Navigationsstruktur. `href` är relativt till /[lang]. Contact ligger separerat med en avdelare.
export type NavItem = {
  id: keyof Dictionary["nav"];
  href: string;
};

export const primaryNav: NavItem[] = [
  { id: "home", href: "" },
  { id: "about", href: "about" },
  { id: "projects", href: "projects" },
  { id: "writing", href: "writing" },
  { id: "reading", href: "reading" },
  { id: "investments", href: "investments" },
];

export const secondaryNav: NavItem[] = [
  { id: "contact", href: "contact" },
];

// Alla sektioner – används för MDX-lookup
export const allSections = [...primaryNav, ...secondaryNav].map((n) => n.id);
export type SectionId = (typeof allSections)[number];
