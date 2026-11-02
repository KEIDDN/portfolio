"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { dict, type Locale } from "@/content/i18n";
import { useLenis } from "./SmoothScroll";
import styles from "./ChapterIndex.module.css";

/** Right after the intro: everything the visitor is about to see, in order. */
export default function ChapterIndex({ locale }: { locale: Locale }) {
  const root = useRef<HTMLElement>(null);
  const lenis = useLenis();
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from("[data-ci]", { y: 40, opacity: 0, duration: 1.3, ease: "expo.out", stagger: 0.08, scrollTrigger: { trigger: root.current, start: "top 85%" } });
    }, root);
    return () => ctx.revert();
  }, []);
  const go = (id: string) => (e: React.MouseEvent) => {
    const el = document.getElementById(id);
    if (!el) return;
    e.preventDefault();
    lenis ? lenis.scrollTo(el, { duration: 1.8 }) : el.scrollIntoView({ behavior: "smooth" });
  };
  return (
    <nav ref={root} className={styles.index} aria-label="Chapters">
      {dict.index.map((c) => (
        <Link key={c.id} href={`/${locale}#${c.id}`} onClick={go(c.id)} className={styles.item} data-ci>
          <span className="mono muted">{c.n}</span>
          <span className={styles.title}>{locale === "en" ? c.en : c.es}</span>
          <span className={styles.sub}>{locale === "en" ? c.sen : c.ses}</span>
          <span className={`mono ${styles.arrow}`}>↓</span>
        </Link>
      ))}
    </nav>
  );
}
