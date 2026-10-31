"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { dict, type Locale } from "@/content/i18n";
import HeroName from "./HeroName";
import { LOADER_EVENT, loaderDone } from "./Loader";
import styles from "./Hero.module.css";

function useClock(tz: string) {
  const [time, setTime] = useState("--:--");
  useEffect(() => {
    const f = new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit", timeZone: tz });
    const up = () => setTime(f.format(new Date()));
    up();
    const id = setInterval(up, 15000);
    return () => clearInterval(id);
  }, [tz]);
  return time;
}

export default function Hero({ locale }: { locale: Locale }) {
  const root = useRef<HTMLElement>(null);
  const time = useClock("Europe/Madrid");

  useEffect(() => {
    const items = root.current!.querySelectorAll("[data-fade]");
    gsap.set(items, { yPercent: 100, opacity: 0 });
    const run = () =>
      gsap.to(items, { yPercent: 0, opacity: 1, duration: 1.2, ease: "expo.out", stagger: 0.06, delay: 0.5 });
    if (loaderDone()) run();
    else window.addEventListener(LOADER_EVENT, run, { once: true });
    return () => window.removeEventListener(LOADER_EVENT, run);
  }, []);

  return (
    <section ref={root} className={styles.hero}>
      <div className={styles.top}>
        <div className={styles.col}>
          <span className="line-mask"><span data-fade className="mono">{dict.role[locale]}</span></span>
        </div>
        <div className={styles.col}>
          <span className="line-mask"><span data-fade className="mono muted">{dict.heroNote[locale]}</span></span>
        </div>
        <div className={`${styles.col} ${styles.right}`}>
          <span className="line-mask"><span data-fade className="mono muted">{locale === "en" ? "Spain" : "España"} — {time}</span></span>
          <span className="line-mask"><span data-fade className="mono muted">Portfolio ©2026</span></span>
        </div>
      </div>

      <div className={styles.bottom}>
        <div className={styles.meta}>
          <span className="line-mask"><span data-fade className="mono">( {dict.scroll[locale]} )</span></span>
          <span className="line-mask"><span data-fade className="mono muted">Product / Brand / Creative Technology / AI</span></span>
        </div>
        <HeroName text="MIKI HERRERO" />
      </div>
    </section>
  );
}
