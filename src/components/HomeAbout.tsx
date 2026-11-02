"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { dict, t, type Locale } from "@/content/i18n";
import { useLenis } from "./SmoothScroll";
import styles from "./HomeAbout.module.css";

const facts = [
  { k: { en: "Now", es: "Ahora" }, v: { en: "Product Designer — VIOOH, London", es: "Diseñador de producto — VIOOH, Londres" } },
  { k: { en: "Studio", es: "Estudio" }, v: { en: "Founder — OXIA Labs", es: "Fundador — OXIA Labs" } },
  { k: { en: "Background", es: "Formación" }, v: { en: "Advertising — UPSA, Salamanca · Rome", es: "Publicidad — UPSA, Salamanca · Roma" } },
];

/** 01 — who I am, right after the name. */
export default function HomeAbout({ locale }: { locale: Locale }) {
  const root = useRef<HTMLElement>(null);
  const lenis = useLenis();
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo("[data-w]", { opacity: 0.12 }, {
        opacity: 1, stagger: 0.08, ease: "none",
        scrollTrigger: { trigger: "[data-big]", start: "top 80%", end: "bottom 45%", scrub: true },
      });
      gsap.fromTo("[data-pic]", { clipPath: "inset(14% 14% 14% 14%)" }, {
        clipPath: "inset(0% 0% 0% 0%)", ease: "none",
        scrollTrigger: { trigger: "[data-pic]", start: "top 95%", end: "center 60%", scrub: true },
      });
      gsap.fromTo("[data-pic] img", { scale: 1.18 }, {
        scale: 1, ease: "none",
        scrollTrigger: { trigger: "[data-pic]", start: "top bottom", end: "bottom top", scrub: true },
      });
      gsap.from("[data-a]", { y: 28, opacity: 0, duration: 1.3, ease: "expo.out", stagger: 0.07, scrollTrigger: { trigger: "[data-copy]", start: "top 85%" } });
      gsap.from("[data-ix]", { y: 24, opacity: 0, duration: 1.2, ease: "expo.out", stagger: 0.07, scrollTrigger: { trigger: "[data-index]", start: "top 92%" } });
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
    <section ref={root} id="about" className={styles.section}>
      <div className={styles.label}>
        <span className="mono">01 — {dict.nav.about[locale]}</span>
      </div>

      <p data-big className={`display ${styles.big}`}>
        {dict.intro[locale].split(" ").map((w, i) => (
          <span key={i} data-w>{w} </span>
        ))}
      </p>

      <div className={styles.grid}>
        <Link href={`/${locale}/about`} className={`${styles.pic} img-grain`} data-pic data-cursor={dict.aboutCta[locale]}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/about/portrait.webp" alt="Miguel Ángel (Miki) Herrero" loading="lazy" />
        </Link>
        <div className={styles.copy} data-copy>
          <p data-a className={styles.lead}>{dict.introSmall[locale]}</p>
          <dl className={styles.facts}>
            {facts.map((f) => (
              <div key={f.k.en} data-a className={styles.fact}>
                <dt className="mono muted">{t(f.k, locale)}</dt>
                <dd>{t(f.v, locale)}</dd>
              </div>
            ))}
          </dl>
          <Link data-a href={`/${locale}/about`} className={styles.cta}>
            {dict.aboutCta[locale]} <span aria-hidden>→</span>
          </Link>
        </div>
      </div>

      <nav className={styles.index} data-index aria-label="Chapters">
        {dict.index.filter((c) => c.id !== "about").map((c) => (
          <a key={c.id} href={`#${c.id}`} onClick={go(c.id)} className={styles.ix} data-ix>
            <span className="mono muted">{c.n}</span>
            <span className={styles.ixTitle}>{locale === "en" ? c.en : c.es}</span>
            <span className="mono muted">↓</span>
          </a>
        ))}
      </nav>
    </section>
  );
}
