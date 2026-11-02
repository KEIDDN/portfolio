"use client";

import { useEffect, useRef, useState } from "react";
import type { Locale } from "@/content/i18n";
import { GLYPHS } from "@/data/tetraIcons";
import styles from "./TetraIcons.module.css";

const COLORS = ["#4cc3f2", "#f6c445", "#a46ef0", "#43c776", "#f0595a", "#4a78f5", "#f58b42"];

const LABEL: Record<string, [string, string]> = {
  back: ["Back", "Atrás"],
  next: ["Next", "Siguiente"],
  play: ["Play", "Jugar"],
  pause: ["Pause", "Pausa"],
  retry: ["Retry", "Reintentar"],
  close: ["Close", "Cerrar"],
  check: ["Confirm", "Confirmar"],
  settings: ["Settings", "Ajustes"],
  profile: ["Profile", "Perfil"],
  experience: ["Experience", "Experiencia"],
  focus: ["Focus", "Concentración"],
  sound: ["Sound", "Sonido"],
  music: ["Music", "Música"],
  headphones: ["Headphones", "Auriculares"],
  visuals: ["Visuals", "Visuales"],
  controls: ["Controls", "Controles"],
  keyboard: ["Keyboard", "Teclado"],
  handling: ["Handling", "Respuesta"],
  accessibility: ["Accessibility", "Accesibilidad"],
  developer: ["Developer", "Desarrollador"],
  lock: ["Locked", "Bloqueado"],
  trophy: ["Cups", "Copas"],
  versus: ["Versus", "Versus"],
  records: ["Records", "Récords"],
  info: ["Info", "Información"],
  edit: ["Edit", "Editar"],
  skin: ["Skin", "Skin"],
  download: ["Download", "Descargar"],
  feedback: ["Feedback", "Comentarios"],
};

const entries = Object.entries(GLYPHS) as [string, readonly string[]][];

/** Cells of a glyph, bottom row first: the order in which they land, like pieces stacking. */
function cellsOf(rows: readonly string[]) {
  const out: [number, number][] = [];
  for (let y = rows.length - 1; y >= 0; y--) for (let x = 0; x < rows[y].length; x++) if (rows[y][x] === "#") out.push([x, y]);
  return out;
}

/**
 * The big viewer: every cell of the icon falls from the top of the grid and
 * lands in place, bottom row first — the icon is built the way TETRA is played.
 */
function Builder({ rows, color, k }: { rows: readonly string[]; color: string; k: number }) {
  const cells = cellsOf(rows);
  return (
    <svg viewBox="0 0 50 50" className={styles.builder} aria-hidden key={k}>
      {Array.from({ length: 25 }, (_, i) => (
        <rect key={`g${i}`} x={(i % 5) * 10 + 1} y={Math.floor(i / 5) * 10 + 1} width="8" height="8" rx="2.2" className={styles.ghost} />
      ))}
      {cells.map(([x, y], i) => (
        <rect
          key={`${x}-${y}`}
          x={x * 10 + 1}
          y={y * 10 + 1}
          width="8"
          height="8"
          rx="2.2"
          fill={color}
          className={styles.fall}
          style={{ ["--from" as string]: `${-(y + 1) * 10 - 6}px`, animationDelay: `${i * 75}ms, ${i * 75 + 520}ms` }}
        />
      ))}
    </svg>
  );
}

function Glyph({ rows }: { rows: readonly string[] }) {
  return (
    <svg viewBox="0 0 50 50" aria-hidden>
      {cellsOf(rows).map(([x, y]) => (
        <rect key={`${x}-${y}`} x={x * 10 + 1} y={y * 10 + 1} width="8" height="8" rx="2.2" />
      ))}
    </svg>
  );
}

/**
 * TETRA's icon dictionary, from the game's source. A viewer builds one icon at a
 * time, on a loop; hovering any icon in the grid builds that one instead.
 */
export default function TetraIcons({ locale }: { locale: Locale }) {
  const root = useRef<HTMLDivElement>(null);
  const [i, setI] = useState(0);
  const [hold, setHold] = useState(false);
  const [seen, setSeen] = useState(false);
  const [name, rows] = entries[i];
  const color = COLORS[i % COLORS.length];
  const cells = cellsOf(rows).length;

  useEffect(() => {
    const io = new IntersectionObserver(([e]) => setSeen(e.isIntersecting), { threshold: 0.35 });
    io.observe(root.current!);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!seen || hold) return;
    const id = setInterval(() => setI((v) => (v + 1) % entries.length), 3000);
    return () => clearInterval(id);
  }, [seen, hold]);

  return (
    <div ref={root} className={styles.dict} data-stop>
      <div className={styles.viewer} style={{ ["--c" as string]: color }}>
        <div className={styles.stage}>{seen && <Builder rows={rows} color={color} k={i} />}</div>
        <div className={styles.meta}>
          <span className="mono muted">
            {String(i + 1).padStart(2, "0")} / {entries.length}
          </span>
          <span className={styles.name} key={name}>
            {LABEL[name]?.[locale === "en" ? 0 : 1] ?? name}
          </span>
          <span className="mono muted">
            {name} · 5×5 · {cells} {locale === "en" ? "cells" : "celdas"}
          </span>
        </div>
      </div>
      <div className={styles.grid} onPointerLeave={() => setHold(false)}>
        {entries.map(([n, r], k) => (
          <button
            key={n}
            type="button"
            className={`${styles.icon} ${k === i ? styles.on : ""}`}
            style={{ ["--c" as string]: COLORS[k % COLORS.length] }}
            onPointerEnter={() => {
              setHold(true);
              setI(k);
            }}
            onFocus={() => {
              setHold(true);
              setI(k);
            }}
            aria-label={LABEL[n]?.[locale === "en" ? 0 : 1] ?? n}
          >
            <Glyph rows={r} />
          </button>
        ))}
      </div>
    </div>
  );
}
