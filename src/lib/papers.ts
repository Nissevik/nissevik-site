// Akademiska texter som listas under Projects.
// En post kan vara antingen (a) inbäddad fulltext med egen detaljsida, (b) ren
// länk-post (t.ex. DiVA) utan detaljsida, eller (c) båda samtidigt.
// Titlar och sammanfattningar är enspråkiga – texten skrivs på det språk
// den var skriven i. Sidokrom (rubriker, "Kurs", "År" osv) översätts via dictionary.
export type Paper = {
  // URL-segment. Måste vara unikt, används för /[lang]/projects/[slug]/ när file finns.
  slug: string;
  title: string;
  course: string;
  year: number;
  // Kort sammanfattning (valfri). Visas som brödtext på detaljsidan.
  abstract?: string;
  // Sökväg till PDF:en i public/papers/ (t.ex. "/papers/min-rapport.pdf").
  // Om den saknas har posten ingen detaljsida – bara en extern länk räknas.
  file?: string;
  // Extern URL (t.ex. DiVA). Om file saknas länkar listan direkt hit.
  link?: string;
  // Valfri lista med medförfattare.
  coauthors?: string[];
};

// Parkerad tills vidare: inga publicerbara texter än (exjobbet skrivs våren 2027,
// resten är samförfattat). Sektionen döljs automatiskt när listan är tom.
// Lägg tillbaka poster här när det finns något att visa, så dyker sektionen upp igen.
export const papers: Paper[] = [];

// Alla poster sorterade nyast först – används av index-sidan.
export function listPapers(): Paper[] {
  return [...papers].sort((a, b) => b.year - a.year);
}

// Bara de poster som har inbäddad fulltext – används av detaljsidans
// generateStaticParams. Länk-bara-poster får därför ingen egen sida.
export function listEmbeddablePapers(): Paper[] {
  return papers.filter((p): p is Paper & { file: string } => Boolean(p.file));
}

export function findPaper(slug: string): Paper | undefined {
  return papers.find((p) => p.slug === slug);
}
