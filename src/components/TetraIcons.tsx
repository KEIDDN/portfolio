"use client";

import { useEffect, useRef, useState } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import gsap from "gsap";
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

function Glyph({ rows, big = false }: { rows: readonly string[]; big?: boolean }) {
  // every cell of the 5×5 grid is drawn; empty ones stay as a faint guide on the big one
  return (
    <svg viewBox="0 0 50 50" aria-hidden>
      {rows.flatMap((row, y) =>
        [...row].map((c, x) => (
          <rect
            key={`${x}-${y}`}
            x={x * 10 + 1}
            y={y * 10 + 1}
            width="8"
            height="8"
            rx="2.2"
            className={c === "#" ? styles.on : big ? styles.ghost : styles.off}
          />
        )),
      )}
    </svg>
  );
}

/**
 * TETRA's icon dictionary, from the game's source. The section stays on screen
 * while you scroll: each step brings the next icon into the big viewer, and
 * hovering any icon shows it straight away.
 */
export default function TetraIcons({ locale }: { locale: Locale }) {
  const root = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [hover, setHover] = useState<number | null>(null);
  const i = hover ?? active;
  const [name, rows] = entries[i];
  const cells = rows.join("").split("").filter((c) => c === "#").length;

  useEffect(() => {
    const el = root.current!;
    const st = ScrollTrigger.create({
      trigger: el,
      start: "top top",
      end: "bottom bottom",
      onUpdate: (s) => setActive(Math.min(entries.length - 1, Math.floor(s.progress * entries.length))),
    });
    const ctx = gsap.context(() => {
      gsap.from("[data-ic]", {
        opacity: 0,
        y: 20,
        duration: 0.9,
        ease: "expo.out",
        stagger: { each: 0.015, from: "start" },
        scrollTrigger: { trigger: el, start: "top 70%" },
      });
    }, el);
    return () => {
      st.kill();
      ctx.revert();
    };
  }, []);

  return (
    <div ref={root} className={styles.pin} data-stop>
      <div className={styles.sticky}>
        <div className={styles.viewer} style={{ ["--c" as string]: COLORS[i % COLORS.length] }}>
          <div className={styles.big} key={name}>
            <Glyph rows={rows} big />
          </div>
          <div className={styles.meta}>
            <span className="mono muted">{String(i + 1).padStart(2, "0")} / {entries.length}</span>
            <span className={styles.name}>{LABEL[name]?.[locale === "en" ? 0 : 1] ?? name}</span>
            <span className="mono muted">{name} · 5×5 · {cells} {locale === "en" ? "cells" : "celdas"}</span>
          </div>
        </div>
        <div className={styles.grid}>
          {entries.map(([n, r], k) => (
            <button
              key={n}
              type="button"
              data-ic
              className={`${styles.icon} ${k === i ? styles.iconOn : ""}`}
              style={{ ["--c" as string]: COLORS[k % COLORS.length] }}
              onPointerEnter={() => setHover(k)}
              onPointerLeave={() => setHover(null)}
              aria-label={LABEL[n]?.[locale === "en" ? 0 : 1] ?? n}
            >
              <Glyph rows={r} />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
