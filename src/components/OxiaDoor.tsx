"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { dict, type Locale } from "@/content/i18n";
import ChapterHead from "./ChapterHead";
import VariantStage from "./VariantStage";
import styles from "./OxiaDoor.module.css";


/** The home only opens the door. OXIA Labs lives on its own page. */
export default function OxiaDoor({ locale }: { locale: Locale }) {
  const root = useRef<HTMLElement>(null);
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo("[data-stage]", { clipPath: "inset(20% 20% 20% 20%)" }, {
        clipPath: "inset(0% 0% 0% 0%)",
        ease: "none",
        scrollTrigger: { trigger: "[data-stage]", start: "top 95%", end: "top 30%", scrub: true },
      });
      gsap.from("[data-o]", { y: 30, opacity: 0, duration: 1.3, ease: "expo.out", stagger: 0.08, scrollTrigger: { trigger: "[data-copy]", start: "top 85%" } });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={root} id="oxia" className={styles.section}>
      <ChapterHead n="03" kicker={dict.ch2[locale]} title="OXIA Labs" />
      <div className={styles.door}>
        <div className={styles.stage} data-stage>
          <VariantStage />
        </div>
        <div className={styles.copy} data-copy>
          <p data-o className={styles.title}>{dict.oxiaTitle[locale]}</p>
          <p data-o className={styles.line}>{dict.oxiaLine[locale]}</p>
          <Link href={`/${locale}/oxia-labs`} data-o data-title="OXIA Labs" className={styles.cta}>
            {dict.oxiaCta[locale]} <span aria-hidden>↗</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
