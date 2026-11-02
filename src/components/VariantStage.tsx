"use client";

import { useEffect, useState } from "react";
import styles from "./VariantStage.module.css";

export const VARIANTS = [
  { src: "/work/oxia/cut-chrome.webp", name: "Chrome" },
  { src: "/work/oxia/cut-glass.webp", name: "Glass" },
  { src: "/work/oxia/cut-moss.webp", name: "Moss" },
  { src: "/work/oxia/cut-crystal.webp", name: "Crystal" },
];

/** The emblem's material renders (cut out, floating on black), one at a time, with a switcher and a grainy wipe. */
export default function VariantStage({ auto = true }: { auto?: boolean }) {
  const [i, setI] = useState(0);
  const [hold, setHold] = useState(false);
  useEffect(() => {
    if (!auto || hold) return;
    const id = setInterval(() => setI((v) => (v + 1) % VARIANTS.length), 3200);
    return () => clearInterval(id);
  }, [auto, hold]);
  return (
    <div className={styles.wrap}>
      <div className={styles.stage}>
        {VARIANTS.map((v, k) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img key={v.src} src={v.src} alt={`OXIA emblem — ${v.name}`} className={k === i ? styles.on : ""} loading="lazy" draggable={false} />
        ))}
      </div>
      <div className={styles.switch} role="tablist">
        {VARIANTS.map((v, k) => (
          <button
            key={v.name}
            type="button"
            role="tab"
            aria-selected={k === i}
            className={`mono ${k === i ? styles.active : ""}`}
            onClick={(e) => {
              e.preventDefault();
              setI(k);
              setHold(true);
            }}
          >
            <span className={styles.n}>{String(k + 1).padStart(2, "0")}</span> {v.name}
            {k === i && !hold && auto && <span className={styles.bar} key={i} />}
          </button>
        ))}
      </div>
    </div>
  );
}
