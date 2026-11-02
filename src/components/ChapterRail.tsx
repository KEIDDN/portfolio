"use client";

import { useEffect, useState } from "react";
import { dict, type Locale } from "@/content/i18n";
import { useLenis } from "./SmoothScroll";
import styles from "./ChapterRail.module.css";

/** A quiet, fixed index on the home that marks the chapter you're in. */
export default function ChapterRail({ locale }: { locale: Locale }) {
  const [active, setActive] = useState<string | null>(null);
  const lenis = useLenis();
  useEffect(() => {
    const els = dict.index.map((c) => document.getElementById(c.id)).filter(Boolean) as HTMLElement[];
    const onScroll = () => {
      const mid = window.innerHeight * 0.5;
      let cur: string | null = null;
      for (const el of els) {
        const r = el.getBoundingClientRect();
        if (r.top < mid && r.bottom > mid) cur = el.id;
      }
      setActive(cur);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <nav className={`${styles.rail} ${active ? styles.show : ""}`} aria-label="Chapters">
      {dict.index.map((c) => (
        <button
          key={c.id}
          type="button"
          className={`mono ${active === c.id ? styles.on : ""}`}
          onClick={() => {
            const el = document.getElementById(c.id);
            if (el) lenis ? lenis.scrollTo(el, { duration: 1.6 }) : el.scrollIntoView({ behavior: "smooth" });
          }}
        >
          <span>{c.n}</span>
          <span className={styles.label}>{locale === "en" ? c.en : c.es}</span>
        </button>
      ))}
    </nav>
  );
}
