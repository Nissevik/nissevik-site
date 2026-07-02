"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import type { Dictionary } from "@/lib/dictionaries";

// Tre-vägs tema-toggle: Light / Dark / Auto
type Option = { value: "light" | "dark" | "system"; label: string };

export function ThemeToggle({ dict }: { dict: Dictionary["theme"] }) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // next-themes: undvik hydration-mismatch genom att vänta med att rendera aktiv-state
  useEffect(() => setMounted(true), []);

  const options: Option[] = [
    { value: "light", label: dict.light },
    { value: "dark", label: dict.dark },
    { value: "system", label: dict.system },
  ];

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
        {options.map((opt) => {
          const active = mounted && theme === opt.value;
          return (
            <button
              key={opt.value}
              type="button"
              role="radio"
              aria-checked={active}
              onClick={() => setTheme(opt.value)}
              className={
                "flex-1 rounded px-2 py-1 text-xs transition-colors " +
                (active
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground")
              }
            >
              {opt.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
