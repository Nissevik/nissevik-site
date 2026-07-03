"use client";

import { Fragment, useEffect, useMemo, useRef, useState } from "react";
import type { Book, BookStatus } from "@/lib/books";
import type { Dictionary } from "@/lib/dictionaries";

// Cachenyckel + version. Bumpa suffixet om formatet ändras.
const COVER_CACHE_KEY = "nissevik:cover-cache:v2";

// Per bok: har vi bekräftat att lokal fil saknas, och vad gav Open Library?
// `ol`: number = hittat cover_i, null = bekräftat saknas hos OL, undefined = ej testat.
type CoverCacheEntry = {
  localMissing?: true;
  ol?: number | null;
};
type CoverCache = Record<string, CoverCacheEntry>;

function coverCacheKey(title: string, author: string): string {
  return `${title.trim().toLowerCase()}::${author.trim().toLowerCase()}`;
}

function readCoverCache(
  title: string,
  author: string,
): CoverCacheEntry | undefined {
  if (typeof window === "undefined") return undefined;
  try {
    const raw = window.localStorage.getItem(COVER_CACHE_KEY);
    if (!raw) return undefined;
    const cache = JSON.parse(raw) as CoverCache;
    return cache[coverCacheKey(title, author)];
  } catch {
    return undefined;
  }
}

// Patchar en enskild entry – bevarar tidigare fält.
function writeCoverCache(
  title: string,
  author: string,
  patch: Partial<CoverCacheEntry>,
) {
  if (typeof window === "undefined") return;
  try {
    const raw = window.localStorage.getItem(COVER_CACHE_KEY);
    const cache = (raw ? JSON.parse(raw) : {}) as CoverCache;
    const key = coverCacheKey(title, author);
    cache[key] = { ...cache[key], ...patch };
    window.localStorage.setItem(COVER_CACHE_KEY, JSON.stringify(cache));
  } catch {
    // Fullt lager eller privat läge – strunt i det, nästa gång får försöka igen.
  }
}

function buildOpenLibraryCoverUrl(coverId: number): string {
  return `https://covers.openlibrary.org/b/id/${coverId}-L.jpg`;
}

// Slug från titel: gemener, avdiakritiserad, allt icke-alfanumeriskt blir bindestreck.
// Exporteras så att du kan lista vilken fil varje bok förväntar sig under /public/covers/.
export function bookSlug(title: string): string {
  return title
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function buildLocalCoverUrl(title: string): string {
  return `/covers/${bookSlug(title)}.jpg`;
}

// Färgade badges – amber = läser, rosa = vill läsa, grön = läst.
const statusStyles: Record<BookStatus, string> = {
  reading:
    "bg-amber-100 text-amber-900 dark:bg-amber-500/15 dark:text-amber-200",
  wanted: "bg-pink-100 text-pink-900 dark:bg-pink-500/15 dark:text-pink-200",
  read: "bg-emerald-100 text-emerald-900 dark:bg-emerald-500/15 dark:text-emerald-200",
};

type SortKey = "date" | "rating";
type YearFilter = number | "all";
type GenreFilter = string;

export function BookGrid({
  books,
  dict,
}: {
  books: Book[];
  dict: Dictionary["reading"];
}) {
  const [sortKey, setSortKey] = useState<SortKey>("date");
  const [year, setYear] = useState<YearFilter>("all");
  const [genre, setGenre] = useState<GenreFilter>("all");

  // Unika år och genrer utifrån datan
  const years = useMemo(() => {
    const set = new Set<number>();
    for (const b of books) if (typeof b.year === "number") set.add(b.year);
    return [...set].sort((a, b) => b - a);
  }, [books]);

  const genres = useMemo(() => {
    const set = new Set<string>();
    for (const b of books) b.genre?.forEach((g) => set.add(g));
    return [...set].sort((a, b) => a.localeCompare(b, "sv"));
  }, [books]);

  const visible = useMemo(() => {
    const filtered = books.filter((b) => {
      if (year !== "all" && b.year !== year) return false;
      if (genre !== "all" && !b.genre?.includes(genre)) return false;
      return true;
    });
    if (sortKey === "date") {
      // ISO-datum sorteras som strängar, fallande
      filtered.sort((a, b) => (b.date ?? "").localeCompare(a.date ?? ""));
    } else {
      // Böcker utan betyg hamnar sist
      filtered.sort((a, b) => (b.rating ?? -1) - (a.rating ?? -1));
    }
    return filtered;
  }, [books, sortKey, year, genre]);

  return (
    <>
      <Controls
        dict={dict}
        sortKey={sortKey}
        onSortChange={setSortKey}
        year={year}
        onYearChange={setYear}
        years={years}
        genre={genre}
        onGenreChange={setGenre}
        genres={genres}
      />

      <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-4">
        {visible.map((book, i) => (
          <BookCard key={`${book.title}-${i}`} book={book} dict={dict} />
        ))}
      </div>
    </>
  );
}

function Controls({
  dict,
  sortKey,
  onSortChange,
  year,
  onYearChange,
  years,
  genre,
  onGenreChange,
  genres,
}: {
  dict: Dictionary["reading"];
  sortKey: SortKey;
  onSortChange: (v: SortKey) => void;
  year: YearFilter;
  onYearChange: (v: YearFilter) => void;
  years: number[];
  genre: GenreFilter;
  onGenreChange: (v: GenreFilter) => void;
  genres: string[];
}) {
  // Enda kompakt rad utan versala etiketter. Grupperna separeras visuellt av
  // svaga "|"-avdelare istället för prefix-texter.
  return (
    <div className="mb-6 flex flex-wrap items-center gap-x-3 gap-y-2 text-xs">
      <InlineTabs<SortKey>
        ariaLabel={dict.controls.sort}
        value={sortKey}
        onChange={onSortChange}
        options={[
          { value: "date", label: dict.controls.sortDate },
          { value: "rating", label: dict.controls.sortRating },
        ]}
      />

      {years.length > 0 && (
        <>
          <Divider />
          <InlineTabs<YearFilter>
            ariaLabel={dict.controls.year}
            value={year}
            onChange={onYearChange}
            options={[
              { value: "all", label: dict.controls.yearAll },
              ...years.map((y) => ({
                value: y as YearFilter,
                label: String(y),
              })),
            ]}
          />
        </>
      )}

      {genres.length > 0 && (
        <>
          <Divider />
          {/* Minimal select – ingen border, transparent bakgrund. Default-alternativet
              ("Alla genrer" / "All genres") beskriver sig självt utan extern etikett. */}
          <select
            value={genre}
            onChange={(e) => onGenreChange(e.target.value)}
            aria-label={dict.controls.genre}
            className="cursor-pointer border-0 bg-transparent p-0 text-xs text-muted-foreground transition-colors duration-200 ease-out hover:text-foreground focus:text-foreground focus:outline-none"
          >
            <option value="all">{dict.controls.genreAll}</option>
            {genres.map((g) => (
              <option key={g} value={g}>
                {g}
              </option>
            ))}
          </select>
        </>
      )}
    </div>
  );
}

function Divider() {
  return (
    <span aria-hidden className="text-muted-foreground/30">
      |
    </span>
  );
}

// Diskreta inline-flikar – aktiv i foreground, övriga dämpade, "·" som avdelare.
// ariaLabel beskriver gruppen för skärmläsare, eftersom vi inte har någon visuell etikett.
function InlineTabs<T extends string | number>({
  options,
  value,
  onChange,
  ariaLabel,
}: {
  options: { value: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
  ariaLabel: string;
}) {
  return (
    <div
      role="group"
      aria-label={ariaLabel}
      className="flex flex-wrap items-center gap-x-1.5 gap-y-1"
    >
      {options.map((opt, i) => {
        const active = opt.value === value;
        return (
          <Fragment key={String(opt.value)}>
            {i > 0 && (
              <span aria-hidden className="text-muted-foreground/50">
                ·
              </span>
            )}
            <button
              type="button"
              onClick={() => onChange(opt.value)}
              aria-pressed={active}
              className={
                "transition-colors duration-200 ease-out " +
                (active
                  ? "font-medium text-foreground"
                  : "text-muted-foreground hover:text-foreground")
              }
            >
              {opt.label}
            </button>
          </Fragment>
        );
      })}
    </div>
  );
}

function BookCard({
  book,
  dict,
}: {
  book: Book;
  dict: Dictionary["reading"];
}) {
  const inner = (
    <>
      <div className="relative aspect-[2/3] w-full overflow-hidden rounded-md bg-muted transition-transform duration-200 ease-out group-hover:-translate-y-0.5">
        <BookCover book={book} />
        {book.url && (
          <span className="absolute right-1.5 top-1.5 inline-flex h-6 w-6 items-center justify-center rounded-full bg-background/85 text-muted-foreground shadow-sm transition-colors duration-200 ease-out group-hover:text-foreground">
            <IconArrowUpRight />
          </span>
        )}
      </div>

      {/* Titel + författare */}
      <div className="mt-3 text-sm font-medium leading-snug text-foreground">
        {book.title}
      </div>
      <div className="mt-0.5 text-xs text-muted-foreground">{book.author}</div>

      {/* Kompakt metarad: status-badge + betyg + årtal på samma rad */}
      <div className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1">
        <span
          className={
            "rounded-full px-2 py-0.5 text-[10px] font-medium " +
            statusStyles[book.status]
          }
        >
          {dict.status[book.status]}
        </span>
        {(book.rating != null || book.year != null) && (
          <span className="text-xs text-muted-foreground/80">
            {book.rating != null && <span>{book.rating}/10</span>}
            {book.rating != null && book.year != null && (
              <span aria-hidden> · </span>
            )}
            {book.year != null && <span>{book.year}</span>}
          </span>
        )}
      </div>
    </>
  );

  const className = "group flex flex-col";

  // Länkade kort blir <a>, annars <div>. `group` styr hover-effekten på omslaget.
  if (book.url) {
    return (
      <a
        href={book.url}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
      >
        {inner}
      </a>
    );
  }
  return <div className={className}>{inner}</div>;
}

// Cover-router: manuell override slår alltid auto-hämtningen från Open Library.
function BookCover({ book }: { book: Book }) {
  if (book.cover) {
    // Manuell override – lokal sökväg i public/ eller extern URL. Vi använder <img>
    // för att slippa konfigurera next/image remotePatterns för godtyckliga värdar.
    // eslint-disable-next-line @next/next/no-img-element
    return (
      <img
        src={book.cover}
        alt=""
        className="h-full w-full object-cover"
      />
    );
  }
  return <AutoBookCover title={book.title} author={book.author} />;
}

// Två-fas cover-fallback: prova lokal fil först, faller tillbaka på Open Library.
// Cachar båda utfallen så att vi inte fejlar samma request om och om igen.
function AutoBookCover({
  title,
  author,
}: {
  title: string;
  author: string;
}) {
  // "local" = testar /covers/{slug}.jpg, "open-library" = lokal saknas, kör OL.
  const [phase, setPhase] = useState<"local" | "open-library">("local");
  const [localLoaded, setLocalLoaded] = useState(false);

  // Om cachen redan säger att lokal fil saknas, hoppa direkt till OL vid mount.
  useEffect(() => {
    const cached = readCoverCache(title, author);
    if (cached?.localMissing) setPhase("open-library");
  }, [title, author]);

  if (phase === "open-library") {
    return <OpenLibraryCover title={title} author={author} />;
  }

  // Lokal fas: native lazy loading via loading="lazy". Bilden hålls dold tills
  // onLoad triggar, så vi undviker glitchen av broken-image-ikonen vid 404.
  // eslint-disable-next-line @next/next/no-img-element
  return (
    <img
      src={buildLocalCoverUrl(title)}
      alt=""
      loading="lazy"
      onLoad={() => setLocalLoaded(true)}
      onError={() => {
        writeCoverCache(title, author, { localMissing: true });
        setPhase("open-library");
      }}
      className={
        "h-full w-full object-cover transition-opacity duration-150 " +
        (localLoaded ? "opacity-100" : "opacity-0")
      }
    />
  );
}

// Hämtar omslag från Open Library i webbläsaren när kortet skrollas in i vy.
// Resultatet cachas i localStorage så att vi inte slår mot API:et vid varje besök.
function OpenLibraryCover({
  title,
  author,
}: {
  title: string;
  author: string;
}) {
  const placeholderRef = useRef<HTMLDivElement>(null);
  // undefined = ännu inte upplöst, number = hittat cover_i, null = definitivt saknas.
  const [coverId, setCoverId] = useState<number | null | undefined>(undefined);

  useEffect(() => {
    // Cache-hit? Hoppa observer och fetch helt.
    const cached = readCoverCache(title, author);
    if (cached?.ol !== undefined) {
      setCoverId(cached.ol);
      return;
    }

    const node = placeholderRef.current;
    if (!node) return;

    let cancelled = false;

    const fetchCover = async () => {
      try {
        const url =
          "https://openlibrary.org/search.json?title=" +
          encodeURIComponent(title) +
          "&author=" +
          encodeURIComponent(author) +
          "&fields=cover_i&limit=1";
        const res = await fetch(url);
        if (!res.ok) throw new Error("bad response");
        const data = (await res.json()) as {
          docs?: Array<{ cover_i?: number }>;
        };
        const id = data.docs?.[0]?.cover_i;
        const value: number | null = typeof id === "number" ? id : null;
        writeCoverCache(title, author, { ol: value });
        if (!cancelled) setCoverId(value);
      } catch {
        // Nätfel – fall tillbaka till platshållaren utan att cachea. Nästa besök får försöka igen.
        if (!cancelled) setCoverId(null);
      }
    };

    // Lat inladdning: hämta först när kortet närmar sig viewport.
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            io.disconnect();
            void fetchCover();
            break;
          }
        }
      },
      { rootMargin: "200px" },
    );
    io.observe(node);

    return () => {
      cancelled = true;
      io.disconnect();
    };
  }, [title, author]);

  if (typeof coverId === "number") {
    // eslint-disable-next-line @next/next/no-img-element
    return (
      <img
        src={buildOpenLibraryCoverUrl(coverId)}
        alt=""
        loading="lazy"
        className="h-full w-full object-cover"
      />
    );
  }

  // Platshållare visas både innan vi vet något och när omslag saknas.
  return (
    <div ref={placeholderRef} className="h-full w-full">
      <PlaceholderCover title={title} />
    </div>
  );
}

function PlaceholderCover({ title }: { title: string }) {
  // Enkel platshållare tills riktiga omslag finns
  const initial = title.trim().charAt(0).toUpperCase() || "?";
  return (
    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-muted to-muted/60">
      <span className="text-4xl font-semibold text-muted-foreground/50">
        {initial}
      </span>
    </div>
  );
}

function IconArrowUpRight() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <line x1="7" y1="17" x2="17" y2="7" />
      <polyline points="7 7 17 7 17 17" />
    </svg>
  );
}
