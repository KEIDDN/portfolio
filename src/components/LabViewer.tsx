"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { dict, t, type Locale } from "@/content/i18n";
import type { Series } from "@/content/lab";
import { useLenis } from "./SmoothScroll";
import styles from "./Lab.module.css";

export default function LabViewer({ s, locale, onClose }: { s: Series; locale: Locale; onClose: () => void }) {
  const root = useRef<HTMLDivElement>(null);
  const lenis = useLenis();

  useEffect(() => {
    lenis?.stop();
    const el = root.current!;
    gsap.fromTo(el, { clipPath: "inset(100% 0 0 0)" }, { clipPath: "inset(0% 0 0 0)", duration: 0.9, ease: "expo.inOut" });
    gsap.from(el.querySelectorAll("[data-v]"), { y: 40, opacity: 0, duration: 1.2, ease: "expo.out", stagger: 0.06, delay: 0.4 });
    const key = (e: KeyboardEvent) => e.key === "Escape" && close();
    window.addEventListener("keydown", key);
    return () => {
      window.removeEventListener("keydown", key);
      lenis?.start();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const close = () =>
    gsap.to(root.current, { clipPath: "inset(0 0 100% 0)", duration: 0.7, ease: "expo.inOut", onComplete: onClose });

  return (
    <div ref={root} className={styles.viewer} data-lenis-prevent role="dialog" aria-label={s.title}>
      <div className={styles.vHead}>
        <span className="mono">{t(s.kind, locale)} — {s.year}</span>
        <button type="button" className="mono ulink" onClick={close}>{dict.close[locale]} ✕</button>
      </div>
      <h3 data-v className={`display ${styles.vTitle}`}>{s.title}</h3>
      <p data-v className={styles.vNote}>{t(s.note, locale)}</p>
      <div className={styles.vImages}>
        {s.images.map((src) => (
          <div key={src} data-v className={src.includes("cutouts") ? styles.vCut : "img-grain"}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={src} alt={s.title} />
          </div>
        ))}
      </div>
    </div>
  );
}
