"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { getDictionary } from "@/lib/dictionaries";
import { primaryNav, secondaryNav } from "@/lib/nav";
import type { Language } from "@/lib/i18n";
import { SidebarNav } from "./SidebarNav";
import { ThemeToggle } from "./ThemeToggle";
import { LanguageToggle } from "./LanguageToggle";

// Nyckel för att komma ihåg desktop-läge mellan sidladdningar
const STORAGE_KEY = "nissevik:sidebar-open";
// md-breakpoint enligt Tailwind (768px)
const DESKTOP_QUERY = "(min-width: 768px)";

// Enkel media-query-hook, undviker extra beroende
function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);
  useEffect(() => {
    const mql = window.matchMedia(query);
    const update = () => setMatches(mql.matches);
    update();
    mql.addEventListener("change", update);
    return () => mql.removeEventListener("change", update);
  }, [query]);
  return matches;
}

export function SidebarShell({
  lang,
  children,
}: {
  lang: Language;
  children: React.ReactNode;
}) {
  const dict = getDictionary(lang);

  const isDesktop = useMediaQuery(DESKTOP_QUERY);
  // På desktop kommer vi ihåg valet. Default: öppen.
  const [desktopOpen, setDesktopOpen] = useState(true);
  // På mobil är menyn alltid stängd som utgångsläge – glider in som overlay.
  const [mobileOpen, setMobileOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  const asideRef = useRef<HTMLElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  // Läs sparat läge vid mount
  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored !== null) setDesktopOpen(stored === "true");
    } catch {
      // localStorage kan vara blockerat i vissa lägen – strunt i det
    }
    setHydrated(true);
  }, []);

  // Persistera desktop-läget
  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, String(desktopOpen));
    } catch {
      // ignorera
    }
  }, [desktopOpen, hydrated]);

  // Stäng mobilmenyn om man klickar utanför den
  useEffect(() => {
    if (!mobileOpen) return;
    const onPointer = (e: MouseEvent) => {
      const target = e.target as Node;
      if (asideRef.current?.contains(target)) return;
      if (toggleRef.current?.contains(target)) return;
      setMobileOpen(false);
    };
    document.addEventListener("mousedown", onPointer);
    return () => document.removeEventListener("mousedown", onPointer);
  }, [mobileOpen]);

  // Escape stänger mobilmenyn
  useEffect(() => {
    if (!mobileOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [mobileOpen]);

  // Synligt läge, för aria + ikonval. Innan hydration antar vi desktop-open för att
  // matcha SSR-utskriften.
  const isOpen = isDesktop
    ? hydrated
      ? desktopOpen
      : true
    : mobileOpen;

  const toggle = () => {
    if (isDesktop) setDesktopOpen((v) => !v);
    else setMobileOpen((v) => !v);
  };

  // Stäng mobilmenyn när ett menyval klickas
  const handleNavClick = () => {
    if (!isDesktop) setMobileOpen(false);
  };

  // Hitta aktuell sektion utifrån URL. Segmentet efter språket matchar `href` i nav-listan.
  const pathname = usePathname() ?? `/${lang}`;
  const segments = pathname.split("/").filter(Boolean);
  const sectionSegment = segments[1] ?? "";
  const currentSection = [...primaryNav, ...secondaryNav].find(
    (item) => item.href === sectionSegment,
  );

  return (
    <div className="relative min-h-screen">
      {/* Overlay-backdrop, endast på mobil när menyn är öppen */}
      <div
        onClick={() => setMobileOpen(false)}
        className={
          "fixed inset-0 z-30 bg-black/40 transition-opacity duration-200 md:hidden " +
          (mobileOpen
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0")
        }
        aria-hidden="true"
      />

      {/* Topprad: toggle-knapp + brödsmulor. Ligger fixerad över menyn (z-50 > aside z-40). */}
      <div className="fixed left-4 top-4 z-50 flex items-center gap-3">
        <button
          ref={toggleRef}
          type="button"
          onClick={toggle}
          aria-label={isOpen ? dict.sidebar.close : dict.sidebar.open}
          aria-expanded={isOpen}
          aria-controls="site-sidebar"
          className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-border bg-background text-foreground shadow-sm transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/30"
        >
          {isOpen ? <IconClose /> : <IconMenu />}
        </button>

        <nav
          aria-label={dict.breadcrumb.label}
          className="flex items-center gap-2 text-sm"
        >
          <Link
            href={`/${lang}`}
            onClick={handleNavClick}
            className="font-medium text-foreground hover:underline"
          >
            {dict.siteTitle}
          </Link>
          {/* Ingen tail på hemsidan – där matchar `sectionSegment` inget nav-item */}
          {currentSection && (
            <>
              <span aria-hidden className="text-muted-foreground">
                /
              </span>
              <span className="text-muted-foreground">
                {dict.nav[currentSection.id]}
              </span>
            </>
          )}
        </nav>
      </div>

      <aside
        id="site-sidebar"
        ref={asideRef}
        aria-hidden={!isOpen}
        aria-label={dict.siteTitle}
        className={
          "fixed inset-y-0 left-0 z-40 flex w-64 flex-col bg-background px-5 pb-6 pt-16 transition-transform duration-200 ease-in-out " +
          (mobileOpen ? "translate-x-0 " : "-translate-x-full ") +
          (desktopOpen ? "md:translate-x-0 " : "md:-translate-x-full ")
        }
      >
        {/* Rubrikblocket är borttaget – brödsmulorna i topraden visar redan sidnamnet. */}
        <nav
          aria-label={dict.siteTitle}
          className="flex-1 overflow-y-auto"
          onClick={handleNavClick}
        >
          <SidebarNav items={primaryNav} lang={lang} navDict={dict.nav} />
          {/* Avdelaren + sekundärlistan renderas bara om det finns sekundärposter */}
          {secondaryNav.length > 0 && (
            <>
              <div className="my-4 h-px w-8 bg-border" aria-hidden />
              <SidebarNav items={secondaryNav} lang={lang} navDict={dict.nav} />
            </>
          )}
        </nav>

        {/* Minimala kontroller: ikon-knapp för tema + kompakt SV/EN-växlare */}
        <div className="mt-6 flex items-center gap-4">
          <ThemeToggle dict={dict.theme} />
          <LanguageToggle current={lang} dict={dict.language} />
        </div>
      </aside>

      {/* Innehållet ligger stilla oavsett om menyn är öppen – menyn overlay:ar ovanpå.
          Bredd och padding sätts av varje sida via <Page> så att t.ex. Läslistan får bli bredare. */}
      <main>{children}</main>
    </div>
  );
}

function IconMenu() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <line x1="4" y1="7" x2="20" y2="7" />
      <line x1="4" y1="12" x2="20" y2="12" />
      <line x1="4" y1="17" x2="20" y2="17" />
    </svg>
  );
}

function IconClose() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <line x1="6" y1="6" x2="18" y2="18" />
      <line x1="18" y1="6" x2="6" y2="18" />
    </svg>
  );
}
