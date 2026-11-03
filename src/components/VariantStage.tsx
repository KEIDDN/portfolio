"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import type { ModelKey } from "@/content/models";
import styles from "./VariantStage.module.css";

const ModelViewer = dynamic(() => import("./ModelViewer"), { ssr: false });

export const VARIANTS: { key: ModelKey; name: string }[] = [
  { key: "oxia-chrome", name: "Chrome" },
  { key: "oxia-prismatic", name: "Prismatic" },
  { key: "oxia-mossy", name: "Moss" },
];

/** The emblem in its three materials, in real 3D: one sign that changes skin. Drag to turn it. */
export default function VariantStage({ auto = true }: { auto?: boolean }) {
  const [i, setI] = useState(0);
  const [hold, setHold] = useState(false);
  useEffect(() => {
    if (!auto || hold) return;
    const id = setInterval(() => setI((v) => (v + 1) % VARIANTS.length), 4200);
    return () => clearInterval(id);
  }, [auto, hold]);
  return (
    <div className={styles.wrap}>
      <div className={styles.stage} onPointerDown={() => setHold(true)}>
        <ModelViewer keys={VARIANTS.map((v) => v.key)} active={i} label="⟲" />
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
