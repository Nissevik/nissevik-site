"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Language } from "@/lib/i18n";
import type { Dictionary } from "@/lib/dictionaries";
import type { NavItem } from "@/lib/nav";

// Klientdel av sidomenyn: markerar aktiv rad utifrån current pathname
export function SidebarNav({
  items,
  lang,
  navDict,
}: {
  items: NavItem[];
  lang: Language;
  navDict: Dictionary["nav"];
}) {
  const pathname = usePathname() || `/${lang}`;
  const basePath = `/${lang}`;

  return (
    <ul className="space-y-0.5">
      {items.map((item) => {
        const href = item.href ? `${basePath}/${item.href}` : basePath;
        const active =
          item.href === ""
            ? pathname === basePath || pathname === `${basePath}/`
            : pathname === href || pathname.startsWith(`${href}/`);
        return (
          <li key={item.id}>
            {/* inline-block så att markeringen enbart hamnar runt själva texten,
                inte hela radens bredd. */}
            <Link
              href={href}
              aria-current={active ? "page" : undefined}
              className={
                "inline-block rounded-md px-2 py-1 text-sm transition-colors duration-150 ease-out " +
                (active
                  ? "bg-muted text-foreground"
                  : "text-muted-foreground hover:bg-muted/70 hover:text-foreground active:bg-muted active:text-foreground")
              }
            >
              {navDict[item.id]}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
