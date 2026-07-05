"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { IconAsset } from "@/lib/marginIcons";
import { MarginIcon } from "./MarginIcon";

// Deterministisk pseudo-random utifrån ett heltal. Ger stabila positioner och
// motiv per slot-index så samma ikon står kvar på samma plats när sidan
// växer/krymper – bara sista slot:en dyker upp/försvinner.
function pseudoRandom(seed: number): number {
  let x = (seed + 1) * 2654435761;
  x = (x ^ (x >>> 16)) >>> 0;
  return x / 4294967295;
}

// Stil för en slot: allt utom motivvalet. Färgen är redan resolved till hex.
export type SlotStyle = {
  side: "left" | "right";
  offset: string;
  size: string;
  rot: number;
  color: string;
};

export function DecorLayer({
  motifs,
  styles,
}: {
  motifs: IconAsset[];
  styles: SlotStyle[];
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  // Monotont max: värdet växer, krymper aldrig. På så vis slutar slots att
  // unmountas vid filter (som krymper sidan) och remountas när filter rensas
  // (som växer sidan igen). Utan detta triggades uppritningen om varje gång.
  // Klipp av det som hamnar utanför aktuell sidhöjd tar overflow-hidden hand om.
  const [maxHeight, setMaxHeight] = useState(0);
  // Vilka slots har någonsin ritats i denna DecorLayer-instans? Ref:en överlever
  // re-renders och orsakar inte omrendering – vi läser den bara vid mount av
  // varje MarginIcon för att sätta initialDrawn. Kvarstår som extra skydd även
  // om maxHeight-strategin skulle missa någon kant.
  const drawnSlotsRef = useRef<Set<number>>(new Set());

  const handleSlotDrawn = useCallback((slot: number) => {
    drawnSlotsRef.current.add(slot);
  }, []);

  useEffect(() => {
    const node = containerRef.current;
    if (!node) return;
    // Rundar av mätvärdet till närmaste 80px så små layout-fluktuationer inte
    // triggar onödiga uppdateringar. Sedan pusshöjden bara uppåt.
    const update = (raw: number) => {
      const rounded = Math.round(raw / 80) * 80;
      setMaxHeight((prev) => (rounded > prev ? rounded : prev));
    };
    const observer = new ResizeObserver((entries) => {
      for (const e of entries) update(e.contentRect.height);
    });
    observer.observe(node);
    update(node.getBoundingClientRect().height);
    return () => observer.disconnect();
  }, []);

  // Placeringar byggs sekventiellt nedåt i pixlar utifrån maxHeight. Steget
  // varierar 220–320px via pseudoRandom(index) → jitter är stabil per slot.
  // Både stil och motiv väljs deterministiskt utifrån slot-index, så identitet
  // bevaras när sidan krymper och växer.
  const placements = useMemo(() => {
    const items: {
      key: number;
      top: number;
      style: SlotStyle;
      asset: IconAsset;
      delay: number;
    }[] = [];
    if (maxHeight < 240) return items;
    const startY = 40;
    const bottomBuffer = 100;
    let y = startY;
    let index = 0;
    while (y + bottomBuffer < maxHeight) {
      const step = 220 + Math.floor(pseudoRandom(index) * 100);
      const style = styles[index % styles.length];
      const motifIdx = Math.floor(
        pseudoRandom(index * 7 + 3) * motifs.length,
      );
      const asset = motifs[motifIdx];
      items.push({
        key: index,
        top: y,
        style,
        asset,
        delay: Math.min(index * 45, 900),
      });
      y += step;
      index++;
    }
    return items;
  }, [maxHeight, motifs, styles]);

  return (
    <div
      ref={containerRef}
      aria-hidden
      className="pointer-events-none absolute inset-0 hidden overflow-hidden xl:block"
    >
      {placements.map((p) => (
        <MarginIcon
          key={p.key}
          viewBox={p.asset.viewBox}
          inner={p.asset.inner}
          className={p.style.size}
          style={{
            position: "absolute",
            top: `${p.top}px`,
            [p.style.side]: p.style.offset,
          }}
          delayMs={p.delay}
          rotationDeg={p.style.rot}
          color={p.style.color}
          // Om denna slot redan ritats – mount:a direkt i statiskt läge.
          initialDrawn={drawnSlotsRef.current.has(p.key)}
          onDrawn={() => handleSlotDrawn(p.key)}
        />
      ))}
    </div>
  );
}
