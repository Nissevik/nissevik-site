"use client";

import { useEffect, useRef, useState } from "react";

// Tre lägen:
//   "hidden"    – ännu inte skrollad in i vy, streckelementen är osynliga.
//   "animating" – uppritnings-animationen körs just nu (klass .is-drawn).
//   "static"    – redan färdigritad (t.ex. via en tidigare mount i samma sesssion).
//                 Vi hoppar draw-animationen men vaggningen fortsätter (.is-static).
type DrawState = "hidden" | "animating" | "static";

// Wrappar en inline-SVG. Uppritningen är en engångsgrej per slot: när elementet
// skrollas in i vy taggas det som .is-drawn och strecken ritas upp; om det
// senare unmountas och remountas (för att sidhöjden ändrats och slotten kommer
// tillbaka) sätter parent `initialDrawn={true}` så vi renderar .is-static
// direkt utan att animationen kör om.
export function MarginIcon({
  viewBox,
  inner,
  className = "",
  style,
  delayMs = 0,
  rotationDeg = 0,
  color,
  initialDrawn = false,
  onDrawn,
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
  // True om denna slot redan har ritats i den här sessionen – hoppar uppritnings-
  // animationen och mount:ar direkt i färdigt läge.
  initialDrawn?: boolean;
  // Kallas exakt en gång när elementet skrollas in i vy och draw:s.
  onDrawn?: () => void;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  // Lazy initializer: initial state avgörs vid första mount och ändras inte
  // sedan om initialDrawn-propet råkar byta värde för en levande instans.
  const [state, setState] = useState<DrawState>(() =>
    initialDrawn ? "static" : "hidden",
  );

  useEffect(() => {
    // Om vi mount:ades som färdigritade behöver vi ingen observer alls.
    if (state !== "hidden") return;
    const node = ref.current;
    if (!node) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setState("animating");
            onDrawn?.();
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
    // Empty deps – observern sätts upp exakt en gång vid mount; senare state-
    // och prop-ändringar ska inte skapa nya observrar.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // CSS-variabler mata in per-ikon-parametrar (bas-rotation, staggerad fördröjning).
  const cssVars = {
    "--margin-icon-delay": `${delayMs}ms`,
    "--margin-icon-rot": `${rotationDeg}deg`,
  } as React.CSSProperties;

  const stateClass =
    state === "animating"
      ? "is-drawn "
      : state === "static"
        ? "is-static "
        : "";

  return (
    <span
      ref={ref}
      aria-hidden
      className={"margin-icon " + stateClass + className}
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
