"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import type { Dictionary } from "@/lib/dictionaries";

// Tre lägen som cyklas i turordning: Ljust → Mörkt → Auto → Ljust ...
type ThemeValue = "light" | "dark" | "system";
const cycle: ThemeValue[] = ["light", "dark", "system"];

export function ThemeToggle({ dict }: { dict: Dictionary["theme"] }) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Undvik hydration-mismatch – först efter mount vet vi vilket tema användaren har
  useEffect(() => setMounted(true), []);

  const current: ThemeValue = mounted
    ? ((theme ?? "system") as ThemeValue)
    : "system";

  const labelFor = (value: ThemeValue) =>
    value === "light" ? dict.light : value === "dark" ? dict.dark : dict.system;

  const next = () => {
    const idx = cycle.indexOf(current);
    setTheme(cycle[(idx + 1) % cycle.length]);
  };

  return (
    <button
      type="button"
      onClick={next}
      aria-label={`${dict.label}: ${labelFor(current)}`}
      title={`${dict.label}: ${labelFor(current)}`}
      className="inline-flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground transition duration-200 ease-out hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/30"
    >
      {current === "light" ? (
        <IconSun />
      ) : current === "dark" ? (
        <IconMoon />
      ) : (
        <IconMonitor />
      )}
    </button>
  );
}

function IconSun() {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2" />
      <path d="M12 20v2" />
      <path d="m4.93 4.93 1.41 1.41" />
      <path d="m17.66 17.66 1.41 1.41" />
      <path d="M2 12h2" />
      <path d="M20 12h2" />
      <path d="m6.34 17.66-1.41 1.41" />
      <path d="m19.07 4.93-1.41 1.41" />
    </svg>
  );
}

function IconMoon() {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
    </svg>
  );
}

function IconMonitor() {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="2" y="3" width="20" height="14" rx="2" />
      <line x1="8" y1="21" x2="16" y2="21" />
      <line x1="12" y1="17" x2="12" y2="21" />
    </svg>
  );
}
