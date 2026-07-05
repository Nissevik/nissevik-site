"use client";

import { useEffect, useRef, useState } from "react";

// Wrappar en inline-SVG och lyssnar med IntersectionObserver på när elementet
// skrollas in i vy. När det syns läggs klassen .is-drawn på, vilket triggar
// stroke-dashoffset-animationen som är definierad i globals.css.
export function MarginIcon({
  viewBox,
  inner,
  className = "",
  style,
  delayMs = 0,
  rotationDeg = 0,
  color,
}: {
  viewBox: string;
  inner: string;
  className?: string;
  style?: React.CSSProperties;
  delayMs?: number;
  rotationDeg?: number;
  // Färg för stroke. Sätts som `color` på wrappern, SVG:n plockar upp den
  // via `stroke: currentColor` som är definierat i globals.css.
  color?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const [drawn, setDrawn] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setDrawn(true);
            io.disconnect();
            break;
          }
        }
      },
      // Trigga innan ikonen faktiskt syns – 20% viewport-höjd extra observation
      // nedåt gör att uppritningen är i gång innan man har den i vy vid skroll.
      { rootMargin: "0px 0px 20% 0px" },
    );
    io.observe(node);
    return () => io.disconnect();
  }, []);

  // CSS-variabler mata in per-ikon-parametrar (bas-rotation, staggerad fördröjning).
  const cssVars = {
    "--margin-icon-delay": `${delayMs}ms`,
    "--margin-icon-rot": `${rotationDeg}deg`,
  } as React.CSSProperties;

  return (
    <span
      ref={ref}
      aria-hidden
      className={"margin-icon " + (drawn ? "is-drawn " : "") + className}
      style={{ ...cssVars, ...(color ? { color } : {}), ...style }}
    >
      <svg
        viewBox={viewBox}
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        dangerouslySetInnerHTML={{ __html: inner }}
      />
    </span>
  );
}
