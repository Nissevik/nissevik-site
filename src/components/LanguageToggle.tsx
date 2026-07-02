"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { languages, type Language } from "@/lib/i18n";
import type { Dictionary } from "@/lib/dictionaries";

// Byt språk genom att byta ut första path-segmentet (/sv/... <-> /en/...)
function swapLangSegment(pathname: string, next: Language): string {
  const parts = pathname.split("/");
  // parts[0] === "" (leading slash), parts[1] === current lang
  if (parts.length < 2) return `/${next}`;
  parts[1] = next;
  return parts.join("/") || `/${next}`;
}

export function LanguageToggle({
  current,
  dict,
}: {
  current: Language;
  dict: Dictionary["language"];
}) {
  const pathname = usePathname() || `/${current}`;

  return (
    <div>
      <div className="mb-1.5 text-[11px] uppercase tracking-wider text-muted-foreground">
        {dict.label}
      </div>
      <div
        role="radiogroup"
        aria-label={dict.label}
        className="flex rounded-md border border-border bg-muted/40 p-0.5"
      >
        {languages.map((lang) => {
          const active = lang === current;
          const label = dict[lang];
          return (
            <Link
              key={lang}
              href={swapLangSegment(pathname, lang)}
              role="radio"
              aria-checked={active}
              className={
                "flex-1 rounded px-2 py-1 text-center text-xs transition-colors " +
                (active
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground")
              }
            >
              {label}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
