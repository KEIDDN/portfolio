"use client";

import { useEffect, useRef, useState } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { t, type L, type Locale } from "@/content/i18n";
import { ratioOf } from "../Media";
import styles from "./Evolution.module.css";

export type Step = { src: string; label: L; body?: L };

/**
 * How a design got where it is. The versions stay pinned in one frame and
 * replace each other as you scroll; the list on the side says which one you're
 * looking at and why it moved on.
 */
export default function Evolution({ n, title, body, steps, locale }: { n: string; title: L; body: L; steps: Step[]; locale: Locale }) {
  const root = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);
  useEffect(() => {
    const els = Array.from(root.current!.querySelectorAll<HTMLElement>("[data-ev]"));
    const sts = els.map((el, i) =>
      ScrollTrigger.create({ trigger: el, start: "top 55%", end: "bottom 55%", onToggle: (s) => s.isActive && setActive(i) }),
    );
    return () => sts.forEach((s) => s.kill());
  }, []);
  const ratio = ratioOf(steps[0].src, 16 / 9);
  return (
    <section ref={root} className={styles.ev}>
      <div className={styles.pin}>
        <div className={styles.side}>
          <span className="mono muted">{n}</span>
          <h3 className={styles.title}>{t(title, locale)}</h3>
          <p className={styles.body}>{t(body, locale)}</p>
          <ol className={styles.list}>
            {steps.map((s, i) => (
              <li key={s.src} className={i === active ? styles.on : i < active ? styles.past : ""}>
                <span className="mono">{String(i + 1).padStart(2, "0")}</span>
                <span className={styles.lLabel}>{t(s.label, locale)}</span>
                {s.body && <span className={styles.lBody}>{t(s.body, locale)}</span>}
              </li>
            ))}
          </ol>
        </div>
        <div className={styles.frame} style={{ aspectRatio: ratio }}>
          {steps.map((s, i) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img key={s.src} src={s.src} alt={t(s.label, locale)} className={i === active ? styles.shown : i < active ? styles.gone : ""} loading="lazy" />
          ))}
          <span className={`mono ${styles.count}`}>
            {String(active + 1).padStart(2, "0")} / {String(steps.length).padStart(2, "0")}
          </span>
        </div>
      </div>
      <div className={styles.track} aria-hidden>
        {steps.map((s) => (
          <div key={s.src} data-ev data-stop className={styles.beat} />
        ))}
      </div>
    </section>
  );
}
