import { loadIcon, type IconName } from "@/lib/marginIcons";
import { MarginIcon } from "./MarginIcon";

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

type Placement = {
  name: IconName;
  side: "left" | "right";
  top: string;
  offset: string;
  size: string;
  rot: number;
  delay: number;
  color: PaletteName;
};

// 28 ikoner. Lodrät fördelning medvetet ojämn: några ligger tätt i kluster,
// andra har större luft omkring sig, så det inte känns regelbundet. Storleks-
// spannet går från size-10 (40px) till size-24 (96px) med tre "hero"-ikoner i
// max-storleken (dragon, zeus, atom). Avståndet till rutnätet varieras också:
// vissa nära första kortet, andra långt ut mot viewport-kanten. Regeln
// offset (px) + size (px) ≤ ~100px håller alla inom safe zone för 1280px.
const placements: Placement[] = [
  // Kluster A överst
  { name: "book-open",              side: "left",  top: "1%",  offset: "1.5rem",  size: "size-14", rot: -8,  delay: 0,    color: "terracotta" },
  { name: "saturn",                 side: "right", top: "3%",  offset: "2.5rem",  size: "size-14", rot: 12,  delay: 45,   color: "slate"      },
  { name: "atom",                   side: "left",  top: "6%",  offset: "0.75rem", size: "size-16", rot: 6,   delay: 90,   color: "ochre"      },
  // Luft
  { name: "open-mind",              side: "right", top: "12%", offset: "1rem",    size: "size-20", rot: -4,  delay: 135,  color: "teal"       },
  { name: "compass",                side: "left",  top: "14%", offset: "3rem",    size: "size-12", rot: 8,   delay: 180,  color: "plum"       },
  { name: "globe",                  side: "right", top: "16%", offset: "1.5rem",  size: "size-16", rot: -10, delay: 225,  color: "olive"      },
  { name: "complexity",             side: "left",  top: "19%", offset: "0.5rem",  size: "size-14", rot: 5,   delay: 270,  color: "terracotta" },
  // Luft
  { name: "molecule",               side: "right", top: "25%", offset: "2rem",    size: "size-16", rot: 4,   delay: 315,  color: "slate"      },
  { name: "newtons-cradle",         side: "left",  top: "28%", offset: "0.5rem",  size: "size-20", rot: -6,  delay: 360,  color: "teal"       },
  { name: "tulip",                  side: "right", top: "30%", offset: "3rem",    size: "size-12", rot: 14,  delay: 405,  color: "plum"       },
  // Luft, sedan hero
  { name: "dragon",                 side: "left",  top: "36%", offset: "0.25rem", size: "size-24", rot: -8,  delay: 450,  color: "terracotta" },
  { name: "branch",                 side: "right", top: "39%", offset: "1rem",    size: "size-20", rot: -14, delay: 495,  color: "olive"      },
  { name: "moon-landing",           side: "left",  top: "41%", offset: "0.75rem", size: "size-16", rot: 10,  delay: 540,  color: "slate"      },
  { name: "partly-sunny",           side: "right", top: "43%", offset: "2rem",    size: "size-14", rot: 12,  delay: 585,  color: "ochre"      },
  // Luft
  { name: "robot-love",             side: "left",  top: "49%", offset: "2.5rem",  size: "size-10", rot: -12, delay: 630,  color: "plum"       },
  { name: "falling-leaf",           side: "right", top: "52%", offset: "0.5rem",  size: "size-14", rot: 18,  delay: 675,  color: "olive"      },
  { name: "zeus",                   side: "left",  top: "54%", offset: "0rem",    size: "size-24", rot: 6,   delay: 720,  color: "terracotta" },
  // Luft
  { name: "tea",                    side: "right", top: "60%", offset: "1.5rem",  size: "size-14", rot: -6,  delay: 765,  color: "teal"       },
  { name: "conical-chemical-flask", side: "left",  top: "62%", offset: "1rem",    size: "size-16", rot: -10, delay: 810,  color: "ochre"      },
  { name: "abacus",                 side: "right", top: "65%", offset: "2.5rem",  size: "size-12", rot: 8,   delay: 855,  color: "slate"      },
  // Kluster
  { name: "clover",                 side: "left",  top: "71%", offset: "0.75rem", size: "size-14", rot: -4,  delay: 900,  color: "olive"      },
  { name: "sunset",                 side: "right", top: "73%", offset: "1rem",    size: "size-16", rot: 10,  delay: 945,  color: "terracotta" },
  { name: "odd-pinnate-leaf",       side: "left",  top: "76%", offset: "3rem",    size: "size-10", rot: -8,  delay: 990,  color: "plum"       },
  { name: "flame",                  side: "right", top: "78%", offset: "0.25rem", size: "size-20", rot: -10, delay: 1035, color: "ochre"      },
  // Kluster
  { name: "rose-2",                 side: "left",  top: "83%", offset: "1.5rem",  size: "size-16", rot: -5,  delay: 1080, color: "teal"       },
  { name: "atom",                   side: "right", top: "85%", offset: "0.25rem", size: "size-24", rot: 12,  delay: 1125, color: "plum"       },
  { name: "tulip",                  side: "left",  top: "87%", offset: "3rem",    size: "size-12", rot: 8,   delay: 1170, color: "olive"      },
  // Luft, avslut
  { name: "the-road",               side: "right", top: "95%", offset: "1rem",    size: "size-16", rot: -8,  delay: 1215, color: "terracotta" },
];

export function ReadingDecor() {
  return (
    <div
      aria-hidden
      // Full bredd via inset-0 mot den relative-wrappade Reading-sidan (som i sin
      // tur är full viewport-bredd). Positioneringen är alltså räknad från
      // viewport-kanten. xl:block – gäller från 1280px och uppåt.
      className="pointer-events-none absolute inset-0 hidden overflow-hidden xl:block"
    >
      {placements.map((p, i) => {
        const asset = loadIcon(p.name);
        const style: React.CSSProperties = {
          position: "absolute",
          top: p.top,
          [p.side]: p.offset,
        };
        return (
          <MarginIcon
            // Vissa ikoner används två gånger – gör nyckeln unik per placering.
            key={`${p.name}-${i}`}
            viewBox={asset.viewBox}
            inner={asset.inner}
            className={p.size}
            style={style}
            delayMs={p.delay}
            rotationDeg={p.rot}
            color={PALETTE[p.color]}
          />
        );
      })}
    </div>
  );
}
