"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { dict, type Locale } from "@/content/i18n";
import styles from "./Loader.module.css";

export const LOADER_EVENT = "mh:loaded";
export const loaderDone = () =>
  typeof window !== "undefined" && (window as unknown as { __mhLoaded?: boolean }).__mhLoaded === true;

export default function Loader({ locale }: { locale: Locale }) {
  const root = useRef<HTMLDivElement>(null);
  const [count, setCount] = useState(0);
  const [gone, setGone] = useState(false);

  useEffect(() => {
    const w = window as unknown as { __mhLoaded?: boolean };
    let seen = false;
    try {
      seen = sessionStorage.getItem("mh-loaded") === "1";
    } catch {}
    const finish = () => {
      w.__mhLoaded = true;
      window.dispatchEvent(new Event(LOADER_EVENT));
      try {
        sessionStorage.setItem("mh-loaded", "1");
      } catch {}
    };
    if (seen) {
      setGone(true);
      finish();
      return;
    }
    document.documentElement.style.overflow = "hidden";
    const el = root.current!;
    const state = { v: 0 };
    const tl = gsap.timeline();
    const fontsReady = document.fonts?.ready ?? Promise.resolve();
    fontsReady.then(() => {
      tl.to(el.querySelector("[data-sig]"), { strokeDashoffset: 0, duration: 2.2, ease: "power2.inOut" }, 0)
        .to(el.querySelector("[data-sig]"), { fillOpacity: 1, duration: 0.6, ease: "power2.out" }, 1.7)
        .to(state, {
          v: 100,
          duration: 2.5,
          ease: "power3.inOut",
          onUpdate: () => setCount(Math.round(state.v)),
        }, 0)
        .to(el.querySelector("[data-bar]"), { scaleX: 1, duration: 2.5, ease: "power3.inOut" }, 0)
        .to(el.querySelector("[data-inner]"), { yPercent: -8, opacity: 0, duration: 0.6, ease: "power2.in" }, 2.7)
        .to(el, {
          clipPath: "inset(0 0 100% 0)",
          duration: 1.1,
          ease: "expo.inOut",
          onStart: finish,
          onComplete: () => {
            document.documentElement.style.overflow = "";
            setGone(true);
          },
        }, 2.95);
    });
    return () => {
      tl.kill();
      document.documentElement.style.overflow = "";
    };
  }, []);

  if (gone) return null;
  return (
    <div ref={root} className={styles.loader} aria-hidden>
      <div data-inner className={styles.inner}>
        <svg className={styles.sig} viewBox="0 0 600 260">
          <text data-sig x="50%" y="62%" textAnchor="middle" className={styles.sigText}>
            Miki
          </text>
        </svg>
        <div className={styles.foot}>
          <span className="mono">Miki Herrero — Portfolio ©2026</span>
          <span className="mono">{dict.loading[locale]}</span>
          <span className={styles.count}>{String(count).padStart(3, "0")}</span>
        </div>
        <div className={styles.bar}>
          <span data-bar />
        </div>
      </div>
    </div>
  );
}
