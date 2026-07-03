"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { getDictionary } from "@/lib/dictionaries";
import { primaryNav, secondaryNav, type NavItem } from "@/lib/nav";
import type { Language } from "@/lib/i18n";
import { ThemeToggle } from "./ThemeToggle";
import { LanguageToggle } from "./LanguageToggle";

// Alla nav-länkar i naturlig ordning från nav.ts. Ligger direkt i raden.
const navItems: NavItem[] = [...primaryNav, ...secondaryNav];

export function IslandShell({
  lang,
  children,
}: {
  lang: Language;
  children: React.ReactNode;
}) {
  const dict = getDictionary(lang);
  const basePath = `/${lang}`;
  const pathname = usePathname() || basePath;

  // Endast en menytillstånd nu – hamburgaren på smala skärmar.
  const [mobileOpen, setMobileOpen] = useState(false);
  const mobileBtnRef = useRef<HTMLButtonElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  // Auto-hide: göm nav vid nedåtskroll, visa vid uppåtskroll. Alltid synlig
  // nära toppen. rAF-throttlar scroll-eventet så det inte flimrar.
  const [hidden, setHidden] = useState(false);
  useEffect(() => {
    let lastY = window.scrollY;
    let ticking = false;
    const update = () => {
      const y = window.scrollY;
      const delta = y - lastY;
      if (y < 20) {
        setHidden(false);
      } else if (delta > 6) {
        setHidden(true);
      } else if (delta < -6) {
        setHidden(false);
      }
      lastY = y;
      ticking = false;
    };
    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(update);
        ticking = true;
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Klick utanför mobilmenyn stänger den
  useEffect(() => {
    if (!mobileOpen) return;
    const onPointer = (e: MouseEvent) => {
      const t = e.target as Node;
      if (mobileMenuRef.current?.contains(t)) return;
      if (mobileBtnRef.current?.contains(t)) return;
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

  const isActive = (item: NavItem) => {
    const href = item.href ? `${basePath}/${item.href}` : basePath;
    if (item.href === "") {
      return pathname === basePath || pathname === `${basePath}/`;
    }
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  // Nissevik-brandet är hem-länk och räknas som aktiv bara när vi står på startsidan.
  const homeActive = pathname === basePath || pathname === `${basePath}/`;

  const closeMobile = () => setMobileOpen(false);

  // Om mobilmenyn är öppen tvingar vi fram islanden även vid nedåtskroll.
  const shouldHide = hidden && !mobileOpen;

  return (
    <div className="relative min-h-screen">
      {/* Island uppe till vänster. Lätt rundade hörn (rounded-lg) – inte helrund pill.
          Glider bort uppåt vid nedåtskroll för en mer uppslukande läskänsla. */}
      <div
        className={
          "fixed left-4 top-4 z-40 max-w-[calc(100%-2rem)] transition-transform duration-200 ease-out " +
          (shouldHide ? "-translate-y-[150%]" : "translate-y-0")
        }
      >
        <div className="relative">
          <nav
            aria-label={dict.siteTitle}
            className="flex items-center gap-1 rounded-lg border border-border bg-background/85 px-2 py-1.5 shadow-sm backdrop-blur"
          >
            {/* Nissevik = brand + hem-länk. Bold/markerad endast när vi är på startsidan. */}
            <Link
              href={basePath}
              onClick={closeMobile}
              aria-current={homeActive ? "page" : undefined}
              className={
                "rounded-md px-2.5 py-1 text-sm tracking-tight transition-colors duration-75 ease-out " +
                (homeActive
                  ? "font-semibold text-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground")
              }
            >
              {dict.siteTitle}
            </Link>

            {/* Alla länkar syns direkt på desktop – ett klick från vart som helst */}
            <div className="hidden items-center gap-0.5 md:flex">
              {navItems.map((item) => {
                const href = item.href ? `${basePath}/${item.href}` : basePath;
                const active = isActive(item);
                return (
                  <Link
                    key={item.id}
                    href={href}
                    aria-current={active ? "page" : undefined}
                    className={
                      "whitespace-nowrap rounded-md px-2.5 py-1 text-sm transition-colors duration-75 ease-out " +
                      (active
                        ? "font-semibold text-foreground"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground active:bg-muted active:text-foreground")
                    }
                  >
                    {dict.nav[item.id]}
                  </Link>
                );
              })}
            </div>

            {/* Hamburgare – bara på smala skärmar */}
            <button
              ref={mobileBtnRef}
              type="button"
              onClick={() => setMobileOpen((v) => !v)}
              aria-label={mobileOpen ? dict.sidebar.close : dict.sidebar.open}
              aria-expanded={mobileOpen}
              aria-controls="island-mobile-menu"
              className="inline-flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors duration-75 ease-out hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/30 md:hidden"
            >
              {mobileOpen ? <IconClose /> : <IconMenu />}
            </button>
          </nav>

          {/* Mobil-meny – alla länkar. Ligger vänsterjusterad under islanden. */}
          {mobileOpen && (
            <div
              id="island-mobile-menu"
              ref={mobileMenuRef}
              className="absolute left-0 top-full mt-2 w-56 rounded-lg border border-border bg-background/95 p-2 shadow-sm backdrop-blur md:hidden"
            >
              <ul className="flex flex-col">
                {navItems.map((item) => {
                  const href = item.href ? `${basePath}/${item.href}` : basePath;
                  const active = isActive(item);
                  return (
                    <li key={item.id}>
                      <Link
                        href={href}
                        aria-current={active ? "page" : undefined}
                        onClick={closeMobile}
                        className={
                          "block rounded-md px-3 py-1.5 text-sm transition-colors duration-75 ease-out " +
                          (active
                            ? "font-semibold text-foreground"
                            : "text-muted-foreground hover:bg-muted hover:text-foreground")
                        }
                      >
                        {dict.nav[item.id]}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Tema/språk-kontroll i övre högra hörnet – ren text, ingen bakgrund.
          Glider bort tillsammans med islanden vid nedåtskroll. */}
      <div
        aria-hidden={shouldHide}
        className={
          "fixed right-4 top-4 z-40 flex items-center gap-3 transition-all duration-200 ease-out " +
          (shouldHide
            ? "pointer-events-none -translate-y-[150%] opacity-0"
            : "translate-y-0 opacity-100")
        }
      >
        <ThemeToggle dict={dict.theme} />
        <LanguageToggle current={lang} dict={dict.language} />
      </div>

      {/* Innehållet börjar en bit under islanden. Page.tsx står för max-width och egen padding. */}
      <main className="pt-6">{children}</main>
    </div>
  );
}

function IconMenu() {
  return (
    <svg
      width="16"
      height="16"
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
      width="16"
      height="16"
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
