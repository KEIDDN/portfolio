"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import type { Locale } from "@/content/i18n";
import skins from "@/data/tetraSkins.json";
import styles from "./TetraSkins.module.css";

const ORDER = ["studio", "clay", "gem", "crystal", "glass", "neon", "aurora", "ember", "mono", "bevel", "wire", "nes", "gameboy", "brut", "corten"];

/** All fifteen TETRA skins, painted by the game's own renderer (apps/web/src/game/skins.ts). */
export default function TetraSkins({ locale }: { locale: Locale }) {
  const root = useRef<HTMLDivElement>(null);
  const list = ORDER.map((id) => skins.find((s) => s.id === id)!).filter(Boolean);
  const studio = skins.find((s) => s.id === "studio")!;
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from("[data-skin]", {
        opacity: 0,
        y: 40,
        duration: 1.2,
        ease: "expo.out",
        stagger: { each: 0.05, grid: "auto", from: "start" },
        scrollTrigger: { trigger: root.current, start: "top 80%" },
      });
    }, root);
    return () => ctx.revert();
  }, []);
  return (
    <div ref={root} className={styles.wrap}>
      <div className={styles.grid}>
        {list.map((s, i) => (
          <figure key={s.id} className={styles.card} data-skin tabIndex={0}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={`/work/tetra/skins/${s.id}.webp`} alt={`TETRA — ${s.name}`} loading="lazy" />
            <figcaption className={styles.glass}>
              <span className={styles.name}>
                <span className="mono">{String(i + 1).padStart(2, "0")}</span> {s.name}
              </span>
              <span className={styles.desc}>{locale === "en" ? s.en : s.es}</span>
            </figcaption>
          </figure>
        ))}
      </div>
      <div className={styles.palette}>
        <span className="mono muted">Studio palette</span>
        <div>
          {Object.entries(studio.colors)
            .filter(([k]) => k !== "garbage")
            .map(([k, c]) => (
              <span key={k} className={styles.swatch} style={{ background: c as string }}>
                <span className="mono">{k}</span>
                <span className="mono">{(c as string).toUpperCase()}</span>
              </span>
            ))}
        </div>
      </div>
    </div>
  );
}
