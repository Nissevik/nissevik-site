// Statusar som förekommer på boklistan. Etiketterna översätts i UI:t via dictionary.
export type BookStatus = "reading" | "wanted" | "read";

export type Book = {
  title: string;
  author: string;
  status: BookStatus;
  // Betyg på skala 0–10. null = ej betygsatt (visas då utan betyg).
  rating: number | null;
  // Läsdatum (ISO) för sortering. Utelämnas om okänt.
  date?: string;
  // Läsår (visas på kortet). Härleds oftast ur date.
  year?: number;
  // Genrer. Delas mellan språken tills vidare (svenska etiketter).
  genre?: string[];
  // Valfri: sökväg i public/ (t.ex. "/covers/babel.jpg") eller extern URL.
  // Saknas den visas en platshållare med bokens initial.
  cover?: string;
  // Valfri länk (t.ex. Goodreads) – visar en pil-ikon uppe till höger.
  url?: string;
};

// Listan delas mellan språken. Sorterad nyast läst först.
// Omslag läggs till efter hand i public/covers/ och pekas ut via `cover`.
export const books: Book[] = [
  { title: "Ship of Magic", author: "Robin Hobb", status: "read", rating: 8, date: "2026-06-28", year: 2026, genre: ["Fantasy"], url: "https://www.goodreads.com/book/show/45100.Ship_of_Magic" },
  { title: "Assassin's Quest", author: "Robin Hobb", status: "read", rating: 7, date: "2026-06-01", year: 2026, genre: ["Fantasy"], url: "https://www.goodreads.com/book/show/33396914-assassin-s-quest" },
  { title: "Royal Assassin", author: "Robin Hobb", status: "read", rating: 7, date: "2026-05-24", year: 2026, genre: ["Fantasy"], url: "https://www.goodreads.com/book/show/25300956-royal-assassin" },
  { title: "Assassin's Apprentice", author: "Robin Hobb", status: "read", rating: 8, date: "2026-05-15", year: 2026, genre: ["Fantasy"], url: "https://www.goodreads.com/book/show/77197.Assassin_s_Apprentice" },
  { title: "Abundance", author: "Ezra Klein, Derek Thompson", status: "read", rating: null, date: "2026-04-06", year: 2026, genre: ["Politik", "Ekonomi"], url: "https://www.goodreads.com/book/show/176444106-abundance" },
  { title: "Blood Meridian", author: "Cormac McCarthy", status: "read", rating: 5, date: "2026-03-15", year: 2026, genre: ["Skönlitteratur", "Western"], url: "https://www.goodreads.com/book/show/394535.Blood_Meridian_or_the_Evening_Redness_in_the_West" },
  { title: "Babel", author: "R.F. Kuang", status: "read", rating: 8, date: "2026-01-20", year: 2026, genre: ["Fantasy", "Historisk fiktion"], url: "https://www.goodreads.com/book/show/57945316-babel" },
  { title: "Autocracy, Inc.", author: "Anne Applebaum", status: "read", rating: 7, date: "2026-01-16", year: 2026, genre: ["Politik", "Samhälle"], url: "https://www.goodreads.com/book/show/183932735-autocracy-inc" },
  { title: "Tokyo Express", author: "Seichō Matsumoto", status: "read", rating: 7, date: "2026-01-14", year: 2026, genre: ["Deckare", "Thriller"], url: "https://www.goodreads.com/book/show/38588764-tokyo-express" },
  { title: "Utopia", author: "Thomas More", status: "read", rating: 4, date: "2026-01-13", year: 2026, genre: ["Filosofi", "Klassiker"], url: "https://www.goodreads.com/book/show/18414.Utopia" },
  { title: "The Wager", author: "David Grann", status: "read", rating: 8, date: "2026-01-07", year: 2026, genre: ["Facklitteratur", "Historia"], url: "https://www.goodreads.com/book/show/61714633-the-wager" },
  { title: "The Return of the King", author: "J.R.R. Tolkien", status: "read", rating: 9, date: "2026-01-05", year: 2026, genre: ["Fantasy"], url: "https://www.goodreads.com/book/show/61215384-the-return-of-the-king" },
  { title: "The Iliad", author: "Homer", status: "read", rating: 6, date: "2025-12-09", year: 2025, genre: ["Klassiker", "Epos"], url: "https://www.goodreads.com/book/show/77265004-the-iliad" },
  { title: "Chip War", author: "Chris Miller", status: "read", rating: 8, date: "2025-11-29", year: 2025, genre: ["Facklitteratur", "Historia", "Teknik"], url: "https://www.goodreads.com/book/show/60321447-chip-war" },
  { title: "The Two Towers", author: "J.R.R. Tolkien", status: "read", rating: 8, date: "2025-11-19", year: 2025, genre: ["Fantasy"], url: "https://www.goodreads.com/book/show/61215372-the-two-towers" },
  { title: "The Fellowship of the Ring", author: "J.R.R. Tolkien", status: "read", rating: 8, date: "2025-10-26", year: 2025, genre: ["Fantasy"], url: "https://www.goodreads.com/book/show/61215351-the-fellowship-of-the-ring" },
  { title: "A Darkness at Sethanon", author: "Raymond E. Feist", status: "read", rating: 6, date: "2025-10-01", year: 2025, genre: ["Fantasy"], url: "https://www.goodreads.com/book/show/13813.A_Darkness_at_Sethanon" },
  { title: "Silverthorn", author: "Raymond E. Feist", status: "read", rating: 6, date: "2025-09-23", year: 2025, genre: ["Fantasy"], url: "https://www.goodreads.com/book/show/149302.Silverthorn" },
  { title: "What I Talk About When I Talk About Running", author: "Haruki Murakami", status: "read", rating: 6, date: "2025-09-13", year: 2025, genre: ["Memoar", "Essä"], url: "https://www.goodreads.com/book/show/2195464.What_I_Talk_About_When_I_Talk_About_Running" },
  { title: "Magician", author: "Raymond E. Feist", status: "read", rating: 7, date: "2025-09-07", year: 2025, genre: ["Fantasy"], url: "https://www.goodreads.com/book/show/43916.Magician" },
  { title: "39 sanningar om presentationer", author: "Marie Gladare, Lisa Engström", status: "read", rating: 4, date: "2025-08-10", year: 2025, genre: ["Facklitteratur"] },
  { title: "On Tyranny", author: "Timothy Snyder", status: "read", rating: 7, date: "2025-07-15", year: 2025, genre: ["Politik", "Historia"], url: "https://www.goodreads.com/book/show/33917107-on-tyranny" },
  { title: "Norwegian Wood", author: "Haruki Murakami", status: "read", rating: 8, date: "2025-06-30", year: 2025, genre: ["Skönlitteratur"], url: "https://www.goodreads.com/book/show/11297.Norwegian_Wood" },
  { title: "Small Things Like These", author: "Claire Keegan", status: "read", rating: 8, date: "2025-06-10", year: 2025, genre: ["Skönlitteratur"], url: "https://www.goodreads.com/book/show/220251642-small-things-like-these" },
  { title: "Heartburn", author: "Nora Ephron", status: "read", rating: null, date: "2025-05-29", year: 2025, genre: ["Skönlitteratur", "Humor"], url: "https://www.goodreads.com/book/show/225343.Heartburn" },
  { title: "Only Dull People Are Brilliant at Breakfast", author: "Oscar Wilde", status: "read", rating: 3, date: "2025-04-01", year: 2025, genre: ["Essä", "Klassiker"], url: "https://www.goodreads.com/book/show/29081916-only-dull-people-are-brilliant-at-breakfast" },
  { title: "Big Panda & Tiny Dragon", author: "James Norbury", status: "read", rating: 8, date: "2025-03-28", year: 2025, genre: ["Filosofi"], url: "https://www.goodreads.com/book/show/55926835-big-panda-tiny-dragon" },
  { title: "White Nights", author: "Fyodor Dostoevsky", status: "read", rating: 7, date: "2025-03-26", year: 2025, genre: ["Klassiker", "Skönlitteratur"], url: "https://www.goodreads.com/book/show/1772910.White_Nights" },
  { title: "Foster", author: "Claire Keegan", status: "read", rating: 9, date: "2025-03-22", year: 2025, genre: ["Skönlitteratur"], url: "https://www.goodreads.com/book/show/60797399-foster" },
  { title: "The Nose, The Overcoat & Memoirs of a Madman", author: "Nikolai Gogol", status: "read", rating: 6, date: "2025-03-09", year: 2025, genre: ["Klassiker", "Novell"], url: "https://www.goodreads.com/book/show/24874312-the-nose" },
  { title: "Stardust", author: "Neil Gaiman", status: "read", rating: 7, date: "2025-03-08", year: 2025, genre: ["Fantasy"], url: "https://www.goodreads.com/book/show/16793.Stardust" },
  { title: "Neverwhere", author: "Neil Gaiman", status: "read", rating: 8, date: "2025-02-26", year: 2025, genre: ["Fantasy"], url: "https://www.goodreads.com/book/show/14497.Neverwhere" },
  { title: "How the Marquis Got His Coat Back", author: "Neil Gaiman", status: "read", rating: 7, date: "2025-02-26", year: 2025, genre: ["Fantasy", "Novell"], url: "https://www.goodreads.com/book/show/26838903-how-the-marquis-got-his-coat-back" },
  { title: "Prisoners of Geography", author: "Tim Marshall", status: "read", rating: 7, date: "2025-02-23", year: 2025, genre: ["Geopolitik", "Facklitteratur"], url: "https://www.goodreads.com/book/show/25135194-prisoners-of-geography" },
  { title: "Candide", author: "Voltaire", status: "read", rating: 6, date: "2025-02-19", year: 2025, genre: ["Klassiker", "Filosofi", "Satir"], url: "https://www.goodreads.com/book/show/19380.Candide" },
  { title: "The Ocean at the End of the Lane", author: "Neil Gaiman", status: "read", rating: 8, date: "2025-02-18", year: 2025, genre: ["Fantasy"], url: "https://www.goodreads.com/book/show/18505792-the-ocean-at-the-end-of-the-lane" },
  { title: "Sapiens: A Brief History of Humankind", author: "Yuval Noah Harari", status: "read", rating: 8, date: "2025-02-15", year: 2025, genre: ["Facklitteratur", "Historia"], url: "https://www.goodreads.com/book/show/23692271-sapiens" },
  { title: "Doktor Glas", author: "Hjalmar Söderberg", status: "read", rating: 6, date: "2025-02-05", year: 2025, genre: ["Klassiker", "Svensk skönlitteratur"], url: "https://www.goodreads.com/book/show/10780909-doktor-glas" },
  { title: "The Invisible Library", author: "Genevieve Cogman", status: "read", rating: 7, date: "2025-01-31", year: 2025, genre: ["Fantasy", "Deckare", "Steampunk"], url: "https://www.goodreads.com/book/show/21416690-the-invisible-library" },
  { title: "The Alchemist", author: "Paulo Coelho", status: "read", rating: 8, date: "2024-12-22", year: 2024, genre: ["Skönlitteratur", "Filosofi"], url: "https://www.goodreads.com/book/show/18144590-the-alchemist" },
  { title: "Ho Chi Minh Biography", author: "Ho Chi Minh Museum", status: "read", rating: 2, date: "2024-12-18", year: 2024, genre: ["Biografi"], url: "https://www.goodreads.com/book/show/51118062-ho-chi-minh-biography" },
  { title: "The Vegetarian", author: "Han Kang", status: "read", rating: 7, date: "2024-12-18", year: 2024, genre: ["Skönlitteratur"], url: "https://www.goodreads.com/book/show/25489025-the-vegetarian" },
  { title: "Why Empires Fall", author: "Peter Heather & John Rapley", status: "read", rating: 5, date: "2024-12-13", year: 2024, genre: ["Historia", "Politik"], url: "https://www.goodreads.com/book/show/60108476-why-empires-fall" },
  { title: "Notes from Underground", author: "Fyodor Dostoevsky", status: "read", rating: 9, date: "2024-12-02", year: 2024, genre: ["Klassiker", "Filosofi", "Psykologi"], url: "https://www.goodreads.com/book/show/49455.Notes_from_Underground" },
  { title: "Alice's Adventures in Wonderland", author: "Lewis Carroll", status: "read", rating: 7, date: "2024-11-08", year: 2024, genre: ["Klassiker", "Fantasy", "Barnbok"], url: "https://www.goodreads.com/book/show/60671823-alice-s-adventures-in-wonderland" },
  { title: "On Consolation: Finding Solace in Dark Times", author: "Michael Ignatieff", status: "read", rating: null, date: "2024-11-07", year: 2024, genre: ["Essä", "Filosofi"], url: "https://www.goodreads.com/book/show/14936858-on-consolation" },
  { title: "Before the Coffee Gets Cold", author: "Toshikazu Kawaguchi", status: "read", rating: 7, date: "2024-11-06", year: 2024, genre: ["Skönlitteratur"], url: "https://www.goodreads.com/book/show/44421460-before-the-coffee-gets-cold" },
  { title: "Essays in Love", author: "Alain de Botton", status: "read", rating: 9, date: "2024-11-02", year: 2024, genre: ["Filosofi", "Skönlitteratur"], url: "https://www.goodreads.com/book/show/23427.Essays_in_Love" },
  { title: "Tao Te Ching", author: "Lao Tzu", status: "read", rating: 7.5, date: "2024-10-31", year: 2024, genre: ["Filosofi", "Klassiker"], url: "https://www.goodreads.com/book/show/67896.Tao_Te_Ching" },
  { title: "The Greatest Evil Is War", author: "Chris Hedges", status: "read", rating: 9, date: "2024-10-26", year: 2024, genre: ["Politik", "Facklitteratur"], url: "https://www.goodreads.com/book/show/60836825-the-greatest-evil-is-war" },
  { title: "The Last Lecture", author: "Randy Pausch", status: "read", rating: 9, date: "2024-10-12", year: 2024, genre: ["Memoar"], url: "https://www.goodreads.com/book/show/40611510-the-last-lecture" },
  { title: "Zero to One", author: "Peter Thiel", status: "read", rating: 7, date: "2024-10-01", year: 2024, genre: ["Ekonomi", "Entreprenörskap"], url: "https://www.goodreads.com/book/show/18050143-zero-to-one" },
  { title: "Crack-Up Capitalism", author: "Quinn Slobodian", status: "read", rating: 7, date: "2024-09-25", year: 2024, genre: ["Ekonomi", "Historia"], url: "https://www.goodreads.com/book/show/60784541-crack-up-capitalism" },
  { title: "Thud!", author: "Terry Pratchett", status: "read", rating: 7, date: "2024-09-01", year: 2024, genre: ["Fantasy", "Humor"], url: "https://www.goodreads.com/book/show/62530.Thud_" },
  { title: "Självbetraktelser", author: "Marcus Aurelius", status: "read", rating: null, date: "2024-07-10", year: 2024, genre: ["Filosofi", "Klassiker"], url: "https://www.goodreads.com/book/show/30659.Meditations" },
  { title: "Den lille prinsen", author: "Antoine de Saint-Exupéry", status: "read", rating: 9, date: "2024-06-29", year: 2024, genre: ["Barnbok", "Filosofi"], url: "https://www.goodreads.com/book/show/157993.The_Little_Prince" },
  { title: "Mannen som planterade träd", author: "Jean Giono", status: "read", rating: 8, date: "2024-06-26", year: 2024, genre: ["Novell", "Skönlitteratur"], url: "https://www.goodreads.com/book/show/757438.The_Man_Who_Planted_Trees" },
  { title: "I Shall Wear Midnight", author: "Terry Pratchett", status: "read", rating: 8, date: "2024-02-07", year: 2024, genre: ["Fantasy", "Humor", "Ungdom"], url: "https://www.goodreads.com/book/show/7576115-i-shall-wear-midnight" },
  { title: "Siddhartha", author: "Hermann Hesse", status: "read", rating: 8, date: "2024-01-01", year: 2024, genre: ["Filosofi", "Klassiker"], url: "https://www.goodreads.com/book/show/52036.Siddhartha" },
  { title: "Wintersmith", author: "Terry Pratchett", status: "read", rating: null, date: "2023-07-10", year: 2023, genre: ["Fantasy", "Humor"], url: "https://www.goodreads.com/book/show/34492.Wintersmith" },
  { title: "A Hat Full of Sky", author: "Terry Pratchett", status: "read", rating: null, date: "2023-06-28", year: 2023, genre: ["Fantasy", "Humor"], url: "https://www.goodreads.com/book/show/34501.A_Hat_Full_of_Sky" },
  { title: "Titanens förbannelse", author: "Rick Riordan", status: "read", rating: null, date: "2023-06-27", year: 2023, genre: ["Ungdom", "Fantasy", "Äventyr"], url: "https://www.goodreads.com/book/show/17259889-titanens-forbannelse" },
  { title: "The Wee Free Men", author: "Terry Pratchett", status: "read", rating: null, date: "2023-06-23", year: 2023, genre: ["Fantasy", "Humor"], url: "https://www.goodreads.com/book/show/34494.The_Wee_Free_Men" },
  { title: "1984", author: "George Orwell", status: "read", rating: null, date: "2023-05-01", year: 2023, genre: ["Dystopi", "Klassiker"], url: "https://www.goodreads.com/book/show/61439040-1984" },
  { title: "Life, the Universe and Everything", author: "Douglas Adams", status: "read", rating: null, date: "2023-04-28", year: 2023, genre: ["Sci-fi", "Humor"], url: "https://www.goodreads.com/book/show/8694.Life_the_Universe_and_Everything" },
  { title: "The Restaurant at the End of the Universe", author: "Douglas Adams", status: "read", rating: null, date: "2023-04-21", year: 2023, genre: ["Sci-fi", "Humor"], url: "https://www.goodreads.com/book/show/8695.The_Restaurant_at_the_End_of_the_Universe" },
  { title: "Mostly Harmless", author: "Douglas Adams", status: "read", rating: null, date: "2023-04-10", year: 2023, genre: ["Sci-fi", "Humor"], url: "https://www.goodreads.com/book/show/569429.Mostly_Harmless" },
  { title: "So Long, and Thanks for All the Fish", author: "Douglas Adams", status: "read", rating: null, date: "2023-04-03", year: 2023, genre: ["Sci-fi", "Humor"], url: "https://www.goodreads.com/book/show/6091075-so-long-and-thanks-for-all-the-fish" },
  { title: "The Hitchhiker's Guide to the Galaxy", author: "Douglas Adams", status: "read", rating: null, date: "2023-04-03", year: 2023, genre: ["Sci-fi", "Humor"], url: "https://www.goodreads.com/book/show/11.The_Hitchhiker_s_Guide_to_the_Galaxy" },
  { title: "Eldens arvtagare", author: "Sarah J. Maas", status: "read", rating: null, date: "2023-01-04", year: 2023, genre: ["Fantasy", "Ungdom"], url: "https://www.goodreads.com/book/show/35388088-eldens-arvtagare" },
  { title: "Midnattskronan", author: "Sarah J. Maas", status: "read", rating: null, date: "2022-12-13", year: 2022, genre: ["Fantasy", "Ungdom"], url: "https://www.goodreads.com/book/show/33018075-midnattskronan" },
  { title: "Glastronen", author: "Sarah J. Maas", status: "read", rating: null, date: "2022-11-29", year: 2022, genre: ["Fantasy", "Ungdom"], url: "https://www.goodreads.com/book/show/27400329-glastronen" },
  { title: "Det främmande landet", author: "Kristin Cashore", status: "read", rating: null, date: "2022-11-09", year: 2022, genre: ["Ungdom", "Fantasy"], url: "https://www.goodreads.com/book/show/59191851-det-fr-mmande-landet" },
  { title: "Hemligheternas rike", author: "Kristin Cashore", status: "read", rating: null, date: "2022-11-02", year: 2022, genre: ["Ungdom", "Fantasy"], url: "https://www.goodreads.com/book/show/22487896" },
  { title: "Humankind: A Hopeful History", author: "Rutger Bregman", status: "wanted", rating: null, genre: ["Facklitteratur", "Historia"], url: "https://www.goodreads.com/book/show/52879286-humankind" },
];
