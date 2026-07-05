import "server-only";
import fs from "fs";
import path from "path";

// Källor: SVG-filer i public/reading/ (svgrepo-namngivning behålls).
// Vi läser dem vid startup och cachar det normaliserade resultatet.
const READING_DIR = path.join(process.cwd(), "public", "reading");

// Hela pool:en – inte alla används i placeringarna, men mappningen finns här
// så nya ikoner kan plockas in i ReadingDecor utan att röra loader-koden.
const filenames = {
  "book-open": "book-open-svgrepo-com.svg",
  "open-mind": "open-mind-svgrepo-com.svg",
  abacus: "abacus-svgrepo-com.svg",
  complexity: "complexity-svgrepo-com.svg",
  atom: "atom-svgrepo-com.svg",
  molecule: "molecule-svgrepo-com.svg",
  "conical-chemical-flask": "conical-chemical-flask-svgrepo-com.svg",
  "newtons-cradle": "newtons-cradle-svgrepo-com.svg",
  saturn: "saturn-svgrepo-com.svg",
  "moon-landing": "moon-landing-svgrepo-com.svg",
  globe: "globe-svgrepo-com.svg",
  "partly-sunny": "partly-sunny-svgrepo-com.svg",
  sunset: "sunset-svgrepo-com.svg",
  branch: "branch-svgrepo-com.svg",
  "falling-leaf": "falling-leaf-svgrepo-com.svg",
  "odd-pinnate-leaf": "odd-pinnate-leaf-svgrepo-com.svg",
  "rose-2": "rose-2-svgrepo-com.svg",
  tulip: "tulip-svgrepo-com.svg",
  clover: "clover-svgrepo-com.svg",
  compass: "compass-svgrepo-com.svg",
  "the-road": "the-road-svgrepo-com.svg",
  flame: "flame-svgrepo-com.svg",
  dragon: "dragon-svgrepo-com.svg",
  zeus: "zeus-svgrepo-com.svg",
  "robot-love": "robot-love-svgrepo-com.svg",
  tea: "tea-svgrepo-com.svg",
} as const;

export type IconName = keyof typeof filenames;

export type IconAsset = {
  viewBox: string;
  inner: string;
};

// Normalisera SVG-innehåll:
// - Plocka bort hårdkodad stroke-färg och stroke-opacity så temats currentColor
//   och vår CSS-opacitet får bestämma.
// - Lägg till pathLength="1" på alla streck-element så att draw-animationen
//   tar exakt lika lång tid oavsett faktisk kurvlängd.
function normalize(raw: string): IconAsset {
  const viewBoxMatch = raw.match(/viewBox="([^"]+)"/);
  const viewBox = viewBoxMatch ? viewBoxMatch[1] : "0 0 400 400";

  const innerMatch = raw.match(/<svg[^>]*>([\s\S]*?)<\/svg>/);
  let inner = innerMatch ? innerMatch[1] : "";

  inner = inner
    .replace(/\s+stroke="[^"]*"/g, "")
    .replace(/\s+stroke-opacity="[^"]*"/g, "");

  inner = inner.replace(
    /<(path|line|polyline|polygon|circle|ellipse|rect)(\s)/g,
    '<$1 pathLength="1"$2',
  );

  return { viewBox, inner };
}

const cache = new Map<string, IconAsset>();

export function loadIcon(name: IconName): IconAsset {
  const cached = cache.get(name);
  if (cached) return cached;
  const filename = filenames[name];
  const raw = fs.readFileSync(path.join(READING_DIR, filename), "utf8");
  const asset = normalize(raw);
  cache.set(name, asset);
  return asset;
}
