"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { dict, type Locale } from "@/content/i18n";
import ChapterHead from "./ChapterHead";
import styles from "./OxiaDoor.module.css";

const VARIANTS = [
  { src: "/work/oxia/v-chrome.webp", name: "Chrome" },
  { src: "/work/oxia/v-glass.webp", name: "Glass" },
  { src: "/work/oxia/v-moss.webp", name: "Moss" },
  { src: "/work/oxia/v-crystal.webp", name: "Crystal" },
];

/** The home only opens the door. OXIA Labs lives on its own page. */
export default function OxiaDoor({ locale }: { locale: Locale }) {
  const root = useRef<HTMLElement>(null);
  const [i, setI] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setI((v) => (v + 1) % VARIANTS.length), 2600);
    const ctx = gsap.context(() => {
      gsap.fromTo("[data-stage]", { clipPath: "inset(20% 20% 20% 20%)" }, {
        clipPath: "inset(0% 0% 0% 0%)",
        ease: "none",
        scrollTrigger: { trigger: "[data-stage]", start: "top 95%", end: "top 30%", scrub: true },
      });
      gsap.from("[data-o]", { y: 30, opacity: 0, duration: 1.3, ease: "expo.out", stagger: 0.08, scrollTrigger: { trigger: "[data-copy]", start: "top 85%" } });
    }, root);
    return () => {
      clearInterval(id);
      ctx.revert();
    };
  }, []);

  return (
    <section ref={root} id="oxia" className={styles.section}>
      <ChapterHead n="02" kicker={dict.ch2[locale]} title="OXIA Labs" sub={dict.oxiaTitle[locale]} />
      <Link href={`/${locale}/oxia-labs`} className={styles.door}>
        <div className={`${styles.stage} img-grain`} data-stage>
          {VARIANTS.map((v, k) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img key={v.src} src={v.src} alt={`OXIA emblem — ${v.name}`} className={k === i ? styles.on : ""} loading="lazy" />
          ))}
          <span className={`mono ${styles.variant}`}>
            {String(i + 1).padStart(2, "0")} / {VARIANTS[i].name}
          </span>
        </div>
        <div className={styles.copy} data-copy>
          <p data-o className={styles.title}>{dict.oxiaTitle[locale]}</p>
          <p data-o className={styles.line}>{dict.oxiaLine[locale]}</p>
          <span data-o className={styles.cta}>
            {dict.oxiaCta[locale]} <span aria-hidden>↗</span>
          </span>
        </div>
      </Link>
    </section>
  );
}
