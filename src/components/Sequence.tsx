"use client";

import { useEffect, useRef, useState } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { t, type L, type Locale } from "@/content/i18n";
import { ratioOf } from "./Media";
import styles from "./Sequence.module.css";

type Item = { title: L; body: L; media: string; poster: string };

/**
 * A pinned screen on one side; the copy scrolls past on the other and the
 * screen changes with it. Only the active clip plays.
 */
export default function Sequence({ items, locale }: { items: Item[]; locale: Locale }) {
  const root = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const steps = Array.from(root.current!.querySelectorAll<HTMLElement>("[data-step]"));
    const sts = steps.map((el, i) =>
      ScrollTrigger.create({ trigger: el, start: "top 60%", end: "bottom 60%", onToggle: (s) => s.isActive && setActive(i) }),
    );
    return () => sts.forEach((s) => s.kill());
  }, []);

  useEffect(() => {
    root.current!.querySelectorAll<HTMLVideoElement>("[data-screen] video").forEach((v, i) => {
      if (i === active) {
        v.currentTime = 0;
        v.play().catch(() => {});
      } else v.pause();
    });
  }, [active]);

  return (
    <section ref={root} className={styles.seq}>
      <div className={styles.stageWrap}>
        <div className={styles.stage} data-screen>
          {items.map((it, i) => (
            <div key={it.media} className={`${styles.screen} ${i === active ? styles.on : ""}`} style={{ aspectRatio: ratioOf(it.poster, 0.68) }}>
              <video src={it.media} poster={it.poster} muted loop playsInline preload={i < 2 ? "auto" : "metadata"} />
            </div>
          ))}
        </div>
      </div>
      <div className={styles.steps}>
        {items.map((it, i) => (
          <div key={it.media} className={`${styles.step} ${i === active ? styles.stepOn : ""}`} data-step data-stop>
            <span className="mono muted">{String(i + 1).padStart(2, "0")} / {String(items.length).padStart(2, "0")}</span>
            <h3 className={styles.title}>{t(it.title, locale)}</h3>
            <p className={styles.body}>{t(it.body, locale)}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
