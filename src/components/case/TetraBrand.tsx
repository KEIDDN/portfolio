"use client";

import { useEffect, useRef, useState } from "react";
import type { Locale } from "@/content/i18n";
import styles from "./TetraBrand.module.css";

/** The mark exactly as the game draws it: four minos on a 64 grid, building a T. */
const CELLS: [number, number][] = [
  [4, 12],
  [23.5, 12],
  [43, 12],
  [23.5, 31.5],
];

/** The logo, built from minos the way the game opens: cells drop one by one, the word rises. Loops while on screen. */
export function TetraLogo() {
  const root = useRef<HTMLDivElement>(null);
  const [k, setK] = useState(0);
  const [on, setOn] = useState(false);
  useEffect(() => {
    const io = new IntersectionObserver(([e]) => setOn(e.isIntersecting), { threshold: 0.4 });
    io.observe(root.current!);
    return () => io.disconnect();
  }, []);
  useEffect(() => {
    if (!on) return;
    const id = setInterval(() => setK((v) => v + 1), 4200);
    return () => clearInterval(id);
  }, [on]);
  return (
    <div ref={root} className={styles.logo} aria-label="TETRA" role="img">
      {on && (
        <div className={styles.lockup} key={k}>
          <svg viewBox="0 0 64 64" className={styles.mark} aria-hidden>
            {CELLS.map(([x, y], i) => (
              <rect key={i} x={x} y={y} width="17" height="17" rx="4.5" className={styles.cell} style={{ animationDelay: `${i * 110}ms` }} />
            ))}
          </svg>
          <span className={styles.word}>TETRA</span>
        </div>
      )}
    </div>
  );
}

const PIECES: { name: string; c: string; cells: [number, number][] }[] = [
  { name: "I", c: "#4cc3f2", cells: [[0, 0], [1, 0], [2, 0], [3, 0]] },
  { name: "O", c: "#f6c445", cells: [[0, 0], [1, 0], [0, 1], [1, 1]] },
  { name: "T", c: "#a46ef0", cells: [[0, 0], [1, 0], [2, 0], [1, 1]] },
  { name: "S", c: "#43c776", cells: [[1, 0], [2, 0], [0, 1], [1, 1]] },
  { name: "Z", c: "#f0595a", cells: [[0, 0], [1, 0], [1, 1], [2, 1]] },
  { name: "J", c: "#4a78f5", cells: [[0, 0], [0, 1], [1, 1], [2, 1]] },
  { name: "L", c: "#f58b42", cells: [[2, 0], [0, 1], [1, 1], [2, 1]] },
];

/** Near-absolute black, one colour per piece, two families: the whole palette of the game. */
export function TetraPalette({ locale }: { locale: Locale }) {
  return (
    <div className={styles.palette}>
      <div className={styles.pieces}>
        {PIECES.map((p, i) => (
          <figure key={p.name} className={styles.piece} style={{ ["--d" as string]: `${i * 70}ms` }}>
            <svg viewBox="-2 -2 44 24" aria-hidden>
              {p.cells.map(([x, y]) => (
                <rect key={`${x}${y}`} x={x * 10 + 0.6} y={y * 10 + 0.6} width="8.8" height="8.8" rx="2.4" fill={p.c} />
              ))}
            </svg>
            <figcaption>
              <span className={styles.pname}>{p.name}</span>
              <span className={styles.hex}>{p.c.toUpperCase()}</span>
            </figcaption>
          </figure>
        ))}
      </div>
      <div className={styles.type}>
        <div>
          <span className={styles.tLabel}>Plus Jakarta Sans — {locale === "en" ? "interface" : "interfaz"}</span>
          <span className={styles.jakarta}>Feel the blocks.</span>
        </div>
        <div>
          <span className={styles.tLabel}>Geist Mono — {locale === "en" ? "every number" : "todas las cifras"}</span>
          <span className={styles.geist}>
            00:41.218 <i>40L</i> 2.84 <i>PPS</i> 96 <i>APM</i>
          </span>
        </div>
      </div>
    </div>
  );
}
