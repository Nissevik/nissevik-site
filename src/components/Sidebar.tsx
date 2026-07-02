import Link from "next/link";
import type { Language } from "@/lib/i18n";
import { getDictionary } from "@/lib/dictionaries";
import { primaryNav, secondaryNav } from "@/lib/nav";
import { SidebarNav } from "./SidebarNav";
import { ThemeToggle } from "./ThemeToggle";
import { LanguageToggle } from "./LanguageToggle";

// Fast vänster sidomeny. Servern renderar layouten; klientdelarna hydreras.
export function Sidebar({ lang }: { lang: Language }) {
  const dict = getDictionary(lang);

  return (
    <aside className="fixed inset-y-0 left-0 z-20 hidden w-64 flex-col border-r border-border bg-background px-5 py-6 md:flex">
      <div className="mb-6">
        <Link
          href={`/${lang}`}
          className="text-base font-semibold tracking-tight text-foreground"
        >
          {dict.siteTitle}
        </Link>
        <p className="mt-1 text-xs text-muted-foreground">{dict.siteTagline}</p>
      </div>

      <nav aria-label={dict.nav.home} className="flex-1 overflow-y-auto">
        <SidebarNav items={primaryNav} lang={lang} navDict={dict.nav} />

        <div className="my-4 border-t border-border" aria-hidden />

        <SidebarNav items={secondaryNav} lang={lang} navDict={dict.nav} />
      </nav>

      <div className="mt-6 space-y-3">
        <ThemeToggle dict={dict.theme} />
        <LanguageToggle current={lang} dict={dict.language} />
      </div>
    </aside>
  );
}
