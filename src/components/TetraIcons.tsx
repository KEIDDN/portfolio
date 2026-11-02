"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { GLYPHS } from "@/data/tetraIcons";
import styles from "./TetraIcons.module.css";

const COLORS = ["#4cc3f2", "#f6c445", "#a46ef0", "#43c776", "#f0595a", "#4a78f5", "#f58b42"];

/** TETRA's own icon set, rendered from the game's source data. */
export default function TetraIcons() {
  const root = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from("[data-cell]", {
        opacity: 0,
        scale: 0.2,
        duration: 0.6,
        ease: "back.out(2)",
        stagger: { each: 0.0025, from: "random" },
        scrollTrigger: { trigger: root.current, start: "top 75%" },
      });
    }, root);
    return () => ctx.revert();
  }, []);
  return (
    <div ref={root} className={styles.grid}>
      {Object.entries(GLYPHS).map(([name, rows], i) => (
        <div key={name} className={styles.icon} style={{ ["--c" as string]: COLORS[i % COLORS.length] }}>
          <svg viewBox="0 0 50 50" aria-hidden>
            {rows.flatMap((row, y) =>
              [...row].map((c, x) =>
                c === "#" ? <rect key={`${x}-${y}`} data-cell x={x * 10 + 1} y={y * 10 + 1} width="8" height="8" rx="2.2" /> : null,
              ),
            )}
          </svg>
          <span className="mono">{name}</span>
        </div>
      ))}
    </div>
  );
}
