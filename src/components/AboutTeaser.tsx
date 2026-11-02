"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { dict, type Locale } from "@/content/i18n";
import ChapterHead from "./ChapterHead";
import styles from "./AboutTeaser.module.css";

export default function AboutTeaser({ locale }: { locale: Locale }) {
  const root = useRef<HTMLElement>(null);
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo("[data-pic]", { clipPath: "inset(18% 12% 18% 12%)" }, {
        clipPath: "inset(0% 0% 0% 0%)",
        ease: "none",
        scrollTrigger: { trigger: "[data-pic]", start: "top 95%", end: "center 55%", scrub: true },
      });
      gsap.fromTo("[data-pic] img", { scale: 1.2 }, {
        scale: 1,
        ease: "none",
        scrollTrigger: { trigger: "[data-pic]", start: "top bottom", end: "bottom top", scrub: true },
      });
      gsap.from("[data-at]", { y: 30, opacity: 0, duration: 1.3, ease: "expo.out", stagger: 0.08, scrollTrigger: { trigger: "[data-at]", start: "top 88%" } });
    }, root);
    return () => ctx.revert();
  }, []);
  return (
    <section ref={root} id="about" className={styles.section}>
      <ChapterHead n="04" kicker={dict.ch4[locale]} title={dict.aboutTitle[locale]} />
      <Link href={`/${locale}/about`} className={styles.grid}>
        <div className={`${styles.pic} img-grain`} data-pic>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/about/portrait-wide.webp" alt="Miguel Ángel (Miki) Herrero" loading="lazy" />
        </div>
        <div className={styles.copy}>
          <p data-at className={styles.line}>{dict.aboutLine[locale]}</p>
          <span data-at className={styles.cta}>{dict.aboutCta[locale]} →</span>
        </div>
      </Link>
    </section>
  );
}
