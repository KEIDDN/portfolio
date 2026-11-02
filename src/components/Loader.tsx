"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { dict, type Locale } from "@/content/i18n";
import styles from "./Loader.module.css";

export const LOADER_EVENT = "mh:loaded";
export const loaderDone = () =>
  typeof window !== "undefined" && (window as unknown as { __mhLoaded?: boolean }).__mhLoaded === true;

const pad = (n: number) => String(n).padStart(3, "0");

/**
 * Counter 000 → 100 set at the same size and position as the hero name.
 * At 100 the digits slide out through their mask while the name rises into
 * the same place — the loader hands over to the hero without a cut.
 */
export default function Loader({ locale }: { locale: Locale }) {
  const root = useRef<HTMLDivElement>(null);
  const digits = useRef<HTMLSpanElement>(null);
  const [n, setN] = useState(0);
  const [gone, setGone] = useState(false);

  useEffect(() => {
    const w = window as unknown as { __mhLoaded?: boolean };
    const finish = () => {
      if (w.__mhLoaded) return;
      w.__mhLoaded = true;
      window.dispatchEvent(new Event(LOADER_EVENT));
      try {
        sessionStorage.setItem("mh-loaded", "1");
      } catch {}
    };
    let seen = false;
    try {
      seen = sessionStorage.getItem("mh-loaded") === "1";
    } catch {}
    if (seen) {
      setGone(true);
      finish();
      return;
    }

    document.documentElement.style.overflow = "hidden";
    document.documentElement.dataset.modal = "1";
    const el = root.current!;
    const state = { v: 0 };
    const ready = Promise.all([
      document.fonts.ready,
      new Promise((r) => (document.readyState === "complete" ? r(0) : window.addEventListener("load", r, { once: true }))),
    ]);

    const tl = gsap.timeline();
    // run to ~86 on a curve, then wait for the page, then finish
    tl.to(state, { v: 86, duration: 1.7, ease: "power2.inOut", onUpdate: () => setN(Math.round(state.v)) });
    tl.add(() => {
      tl.pause();
      ready.then(() => tl.resume());
    });
    tl.to(state, { v: 100, duration: 0.5, ease: "power3.out", onUpdate: () => setN(Math.round(state.v)) });
    tl.to(el.querySelectorAll("[data-ch]"), { yPercent: -105, duration: 0.8, ease: "expo.in", stagger: 0.05 }, "+=0.15");
    tl.to(el.querySelectorAll("[data-meta]"), { opacity: 0, duration: 0.4 }, "<");
    tl.add(finish, "-=0.15");
    tl.to(el, { opacity: 0, duration: 0.6, ease: "power2.out" }, "-=0.05");
    tl.add(() => {
      document.documentElement.style.overflow = "";
      delete document.documentElement.dataset.modal;
      setGone(true);
    });

    return () => {
      tl.kill();
      document.documentElement.style.overflow = "";
      delete document.documentElement.dataset.modal;
    };
  }, []);

  if (gone) return null;
  const s = pad(n);
  return (
    <div ref={root} className={styles.loader} aria-hidden>
      <div className={styles.top} data-meta>
        <span className="mono">Miki Herrero</span>
        <span className="mono muted">{dict.loading[locale]}</span>
        <span className="mono muted">Portfolio ©2026</span>
      </div>
      <div className={styles.bottom}>
        <div className={styles.line} data-meta>
          <span style={{ transform: `scaleX(${n / 100})` }} />
        </div>
        <span ref={digits} className={`display ${styles.count}`}>
          {[...s].map((c, i) => (
            <span key={i} className={styles.mask}>
              <span data-ch>{c}</span>
            </span>
          ))}
        </span>
      </div>
    </div>
  );
}
