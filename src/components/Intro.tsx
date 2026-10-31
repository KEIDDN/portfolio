"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { dict, type Locale } from "@/content/i18n";
import styles from "./Intro.module.css";

export default function Intro({ locale }: { locale: Locale }) {
  const root = useRef<HTMLElement>(null);
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        "[data-w]",
        { opacity: 0.12 },
        {
          opacity: 1,
          stagger: 0.05,
          ease: "none",
          scrollTrigger: { trigger: "[data-big]", start: "top 80%", end: "bottom 45%", scrub: true },
        },
      );
      gsap.from("[data-small]", {
        y: 40,
        opacity: 0,
        duration: 1.2,
        ease: "expo.out",
        scrollTrigger: { trigger: "[data-small]", start: "top 90%" },
      });
    }, root);
    return () => ctx.revert();
  }, [locale]);

  const words = dict.intro[locale].split(" ");
  return (
    <section ref={root} className={styles.intro}>
      <span className="mono muted">( 01 — {locale === "en" ? "Intro" : "Intro"} )</span>
      <p data-big className={styles.big}>
        {words.map((w, i) => (
          <span key={i} data-w>
            {w}{" "}
          </span>
        ))}
      </p>
      <p data-small className={styles.small}>
        {dict.introSmall[locale]}
      </p>
    </section>
  );
}
