"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { dict, t, type Locale } from "@/content/i18n";
import type { Series } from "@/content/lab";
import { useLenis } from "./SmoothScroll";
import styles from "./LabViewer.module.css";

/**
 * One piece per screen. Images are shown whole and never larger than their real size,
 * so nothing gets cropped or blurred by upscaling. Swipe, arrows or keyboard to move.
 */
export default function LabViewer({ s, locale, onClose }: { s: Series; locale: Locale; onClose: () => void }) {
  const root = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const [i, setI] = useState(0);
  const lenis = useLenis();
  const n = s.images.length;

  const go = (k: number) => {
    const el = track.current!;
    const idx = Math.max(0, Math.min(n - 1, k));
    el.scrollTo({ left: idx * el.clientWidth, behavior: "smooth" });
  };

  const close = () =>
    gsap.to(root.current, { clipPath: "inset(0 0 100% 0)", duration: 0.7, ease: "expo.inOut", onComplete: onClose });

  useEffect(() => {
    lenis?.stop();
    document.documentElement.style.overflow = "hidden";
    const el = root.current!;
    gsap.fromTo(el, { clipPath: "inset(100% 0 0 0)" }, { clipPath: "inset(0% 0 0 0)", duration: 0.9, ease: "expo.inOut" });
    gsap.from(el.querySelectorAll("[data-v]"), { y: 30, opacity: 0, duration: 1.2, ease: "expo.out", stagger: 0.06, delay: 0.45 });
    const tr = track.current!;
    const onScroll = () => setI(Math.round(tr.scrollLeft / tr.clientWidth));
    tr.addEventListener("scroll", onScroll, { passive: true });
    const key = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") go(Math.round(tr.scrollLeft / tr.clientWidth) + 1);
      if (e.key === "ArrowLeft") go(Math.round(tr.scrollLeft / tr.clientWidth) - 1);
    };
    window.addEventListener("keydown", key);
    return () => {
      tr.removeEventListener("scroll", onScroll);
      window.removeEventListener("keydown", key);
      document.documentElement.style.overflow = "";
      lenis?.start();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div ref={root} className={styles.viewer} data-lenis-prevent role="dialog" aria-label={s.title}>
      <header className={styles.head}>
        <span className="mono">{t(s.kind, locale)} — {s.year}</span>
        <button type="button" className="mono ulink" onClick={close}>{dict.close[locale]} ✕</button>
      </header>

      <div className={styles.info}>
        <h3 data-v className={`display ${styles.title}`}>{s.title}</h3>
        <p data-v className={styles.note}>{t(s.note, locale)}</p>
      </div>

      <div ref={track} className={styles.track} data-v>
        {s.images.map((src, k) => (
          <figure key={src} className={styles.slide}>
            <div className={`${styles.frame} ${src.includes("cutouts") ? styles.cut : "img-grain"}`}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt={`${s.title} — ${k + 1}`} loading={k < 2 ? "eager" : "lazy"} draggable={false} />
            </div>
          </figure>
        ))}
      </div>

      <footer className={styles.foot}>
        <span className="mono">
          {String(i + 1).padStart(2, "0")} / {String(n).padStart(2, "0")}
        </span>
        {n > 1 && (
          <div className={styles.arrows}>
            <button type="button" className="mono" onClick={() => go(i - 1)} disabled={i === 0} aria-label="Previous">←</button>
            <button type="button" className="mono" onClick={() => go(i + 1)} disabled={i === n - 1} aria-label="Next">→</button>
          </div>
        )}
      </footer>
    </div>
  );
}
