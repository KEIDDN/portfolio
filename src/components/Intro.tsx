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
        { opacity: 0.14 },
        { opacity: 1, stagger: 0.08, ease: "none", scrollTrigger: { trigger: "[data-big]", start: "top 75%", end: "bottom 50%", scrub: true } },
      );
      gsap.from("[data-small]", { y: 30, opacity: 0, duration: 1.4, ease: "expo.out", scrollTrigger: { trigger: "[data-small]", start: "top 88%" } });
    }, root);
    return () => ctx.revert();
  }, [locale]);

  return (
    <section ref={root} className={styles.intro}>
      <p data-big className={`display ${styles.big}`}>
        {dict.intro[locale].split(" ").map((w, i) => (
          <span key={i} data-w>{w} </span>
        ))}
      </p>
      <p data-small className={styles.small}>{dict.introSmall[locale]}</p>
    </section>
  );
}
