import type { Metadata } from "next";
import {
  Fraunces,
  Geist_Mono,
  Instrument_Sans,
  Newsreader,
  Spectral,
} from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";

// Sans för brödtext, UI och kontroller – ersätter Geist Sans.
const instrumentSans = Instrument_Sans({
  variable: "--font-instrument-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
});

// Mono behålls för prose-code och andra monospace-inslag.
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Display-serif för rubriker och brand/nav. Fraunces är variable – vi tar med
// dess opsz (optisk storlek), SOFT (mjukhet) och WONK (egensinne)-axlar och
// spelar med dem via font-variation-settings i globals.css.
const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  style: ["normal"],
  axes: ["SOFT", "WONK", "opsz"],
  display: "swap",
});

// Serif för Writing-sektionen. Newsreader har både normal och italic – italic
// används på publiceringsdatumet.
const newsreader = Newsreader({
  variable: "--font-newsreader",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  display: "swap",
});

// Redaktionell serif för Investing-analyserna. Spectral är en läsvänlig serif
// som passar löpande text och analytiska rubriker – ligger halvvägs mellan
// Newsreader (Writing) och Fraunces (global display).
const spectral = Spectral({
  variable: "--font-spectral",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
});

// Root-metadata. Per-språk-metadata sätts i [lang]/layout.tsx.
export const metadata: Metadata = {
  title: "Nissevik",
  description: "Personal site",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // suppressHydrationWarning krävs av next-themes (klassen sätts före hydration)
  return (
    <html
      lang="sv"
      suppressHydrationWarning
      className={`${instrumentSans.variable} ${geistMono.variable} ${fraunces.variable} ${newsreader.variable} ${spectral.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-background text-foreground">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
