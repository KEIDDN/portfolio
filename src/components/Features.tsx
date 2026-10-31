"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { t, type L, type Locale } from "@/content/i18n";
import type { Feature } from "@/content/projects";
import { Browser, Media, Phone } from "./Media";
import styles from "./Features.module.css";

export default function Features({ label, items, locale, url }: { label: L; items: Feature[]; locale: Locale; url?: string }) {
  const root = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>("[data-feat]").forEach((el, i) => {
        ScrollTrigger.create({
          trigger: el,
          start: "top 55%",
          end: "bottom 55%",
          onToggle: (s) => s.isActive && setActive(i),
        });
      });
    }, root);
    return () => ctx.revert();
  }, []);

  const render = (f: Feature) =>
    f.frame === "phone" ? (
      <div className={styles.phoneWrap}><Phone src={f.media} poster={f.poster} /></div>
    ) : f.frame === "browser" ? (
      <Browser src={f.media} poster={f.poster} url={url ?? ""} />
    ) : (
      <Media src={f.media} poster={f.poster} />
    );

  return (
    <section ref={root} className={styles.wrap}>
      <span className={`mono muted ${styles.label}`}>{t(label, locale)}</span>
      <div className={styles.grid}>
        <div className={styles.list}>
          {items.map((f, i) => (
            <div key={i} data-feat className={`${styles.item} ${active === i ? styles.on : ""}`}>
              <span className="mono muted">{String(i + 1).padStart(2, "0")}</span>
              <h3 className={`display ${styles.title}`}>{t(f.title, locale)}</h3>
              <p className={styles.body}>{t(f.body, locale)}</p>
              <div className={styles.inlineMedia}>{render(f)}</div>
            </div>
          ))}
        </div>
        <div className={styles.sticky}>
          <div className={styles.stage}>
            {items.map((f, i) => (
              <div key={i} className={`${styles.slide} ${active === i ? styles.slideOn : ""}`}>
                {render(f)}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
