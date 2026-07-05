import { loadIcon, type IconName } from "@/lib/marginIcons";
import { DecorLayer, type SlotStyle } from "./DecorLayer";

// Palett – dova, jordnära nyanser som funkar mot både cream och dark bg.
const PALETTE = {
  terracotta: "#c4623d",
  teal: "#2f8f83",
  ochre: "#c99a2e",
  olive: "#6f8f5a",
  plum: "#8a5a8f",
  slate: "#5877a8",
} as const;
type PaletteName = keyof typeof PALETTE;

// 20 stilar som cyklar per slot-index. Sekvensen är ordnad så att sida, avstånd
// till rutnätet, storlek och färg växlar naturligt mellan grannar. Regeln
// offset (px) + size (px) ≤ 100px håller alla inom safe zone för 1280px.
const STYLE_RECIPES: {
  side: "left" | "right";
  offset: string;
  size: string;
  rot: number;
  color: PaletteName;
}[] = [
  { side: "left",  offset: "1.5rem",  size: "size-14", rot: -8,  color: "terracotta" },
  { side: "right", offset: "2.5rem",  size: "size-14", rot: 12,  color: "slate"      },
  { side: "left",  offset: "0.75rem", size: "size-16", rot: 6,   color: "ochre"      },
  { side: "right", offset: "1rem",    size: "size-20", rot: -4,  color: "teal"       },
  { side: "left",  offset: "3rem",    size: "size-12", rot: 8,   color: "plum"       },
  { side: "right", offset: "1.5rem",  size: "size-16", rot: -10, color: "olive"      },
  { side: "left",  offset: "0.5rem",  size: "size-14", rot: 5,   color: "terracotta" },
  { side: "right", offset: "2rem",    size: "size-16", rot: 4,   color: "slate"      },
  { side: "left",  offset: "0.5rem",  size: "size-20", rot: -6,  color: "teal"       },
  { side: "right", offset: "3rem",    size: "size-12", rot: 14,  color: "plum"       },
  { side: "left",  offset: "0.25rem", size: "size-24", rot: -8,  color: "terracotta" },
  { side: "right", offset: "1rem",    size: "size-20", rot: -14, color: "olive"      },
  { side: "left",  offset: "0.75rem", size: "size-16", rot: 10,  color: "slate"      },
  { side: "right", offset: "2rem",    size: "size-14", rot: 12,  color: "ochre"      },
  { side: "left",  offset: "2.5rem",  size: "size-10", rot: -12, color: "plum"       },
  { side: "right", offset: "0.5rem",  size: "size-14", rot: 18,  color: "olive"      },
  { side: "left",  offset: "0rem",    size: "size-24", rot: 6,   color: "terracotta" },
  { side: "right", offset: "1.5rem",  size: "size-14", rot: -6,  color: "teal"       },
  { side: "left",  offset: "1rem",    size: "size-16", rot: -10, color: "ochre"      },
  { side: "right", offset: "0.25rem", size: "size-24", rot: 12,  color: "plum"       },
];

// Alla ikon-motiv som finns tillgängliga. DecorLayer väljer pseudo-slumpmässigt
// bland dessa per slot så vilka motiv som syns varierar oberoende av stilen.
const MOTIF_NAMES: IconName[] = [
  "book-open", "open-mind", "abacus", "complexity", "atom", "molecule",
  "conical-chemical-flask", "newtons-cradle", "saturn", "moon-landing",
  "globe", "partly-sunny", "sunset", "branch", "falling-leaf",
  "odd-pinnate-leaf", "rose-2", "tulip", "clover", "compass", "the-road",
  "flame", "dragon", "zeus", "robot-love", "tea",
];

// Resolvar färgnamn till hex före klientlagret – slippar tvinga klienten att
// ha palett-referensen.
const STYLES: SlotStyle[] = STYLE_RECIPES.map((s) => ({
  side: s.side,
  offset: s.offset,
  size: s.size,
  rot: s.rot,
  color: PALETTE[s.color],
}));

export function ReadingDecor() {
  // Ladda SVG-assets server-side (fs) och skicka ner till klientlagret som
  // sköter mätning och pixelbaserad placering.
  const motifs = MOTIF_NAMES.map((n) => loadIcon(n));
  return <DecorLayer motifs={motifs} styles={STYLES} />;
}
