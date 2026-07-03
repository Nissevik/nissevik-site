"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Fragment } from "react";
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
    <div
      aria-label={dict.label}
      className="flex items-center gap-1.5 text-xs font-medium"
    >
      {languages.map((lang, i) => {
        const active = lang === current;
        return (
          <Fragment key={lang}>
            {/* Diskret separator mellan språkkoderna */}
            {i > 0 && (
              <span aria-hidden className="text-muted-foreground/60">
                /
              </span>
            )}
            <Link
              href={swapLangSegment(pathname, lang)}
              aria-current={active ? "true" : undefined}
              className={
                "transition duration-200 ease-out " +
                (active
                  ? "text-foreground"
                  : "text-muted-foreground hover:text-foreground")
              }
            >
              {dict[lang]}
            </Link>
          </Fragment>
        );
      })}
    </div>
  );
}
