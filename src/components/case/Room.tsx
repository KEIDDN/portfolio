"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { t, type L, type Locale } from "@/content/i18n";
import { Media, ratioOf } from "../Media";
import styles from "./Room.module.css";

export type RoomItem = { src: string; poster?: string; caption: L; phone?: boolean };

/**
 * The case's own museum room, like the Lab's: a label on the left and the
 * material hung whole along a wall that slides by as you scroll.
 */
export default function Room({ title, body, items, locale }: { title: L; body: L; items: RoomItem[]; locale: Locale }) {
  const root = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const ctx = gsap.context(() => {
      const tr = track.current!;
      const dist = () => Math.max(0, tr.scrollWidth - tr.parentElement!.clientWidth);
      gsap.to(tr, {
        x: () => -dist(),
        ease: "none",
        scrollTrigger: { trigger: root.current, start: "top top", end: "bottom bottom", scrub: 0.6, invalidateOnRefresh: true },
      });
    }, root);
    return () => ctx.revert();
  }, []);
  return (
    <section ref={root} className={styles.room} style={{ height: `${100 + items.length * 55}svh` }}>
      <div className={styles.pin}>
        <aside className={styles.label}>
          <h3 className={styles.title}>{t(title, locale)}</h3>
          <p className={styles.body}>{t(body, locale)}</p>
          <span className="mono muted">{String(items.length).padStart(2, "0")} {locale === "en" ? "pieces" : "piezas"} →</span>
        </aside>
        <div className={styles.wall}>
          <div ref={track} className={styles.track}>
            {items.map((it, i) => (
              <figure key={it.src} className={`${styles.fig} ${it.phone ? styles.phone : ""}`}>
                <div className={styles.media} style={{ aspectRatio: ratioOf(it.poster ?? it.src, 16 / 9) }}>
                  <Media src={it.src} poster={it.poster} alt={t(it.caption, locale)} grain={false} ratio={ratioOf(it.poster ?? it.src, 16 / 9)} />
                </div>
                <figcaption>
                  <span className="mono muted">{String(i + 1).padStart(2, "0")}</span>
                  <span>{t(it.caption, locale)}</span>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </div>
      {items.map((it, i) => (
        <span key={it.src} data-stop className={styles.stop} style={{ top: `${i * 55}svh` }} aria-hidden />
      ))}
    </section>
  );
}
