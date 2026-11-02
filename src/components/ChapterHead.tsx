"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import styles from "./ChapterHead.module.css";

/** Same header for every home chapter, so you always know where you are. */
export default function ChapterHead({ n, kicker, title, sub }: { n: string; kicker: string; title: string; sub?: string }) {
  const root = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo("[data-rule]", { scaleX: 0 }, { scaleX: 1, duration: 1.6, ease: "expo.out", scrollTrigger: { trigger: root.current, start: "top 85%" } });
      gsap.from("[data-ln]", { yPercent: 110, duration: 1.3, ease: "expo.out", stagger: 0.06, scrollTrigger: { trigger: root.current, start: "top 80%" } });
    }, root);
    return () => ctx.revert();
  }, []);
  return (
    <div ref={root} className={styles.head}>
      <span data-rule className={styles.rule} />
      <div className={styles.row}>
        <span className="line-mask"><span data-ln className="mono">{n} — {kicker}</span></span>
        {sub && <span className="line-mask"><span data-ln className={`mono muted ${styles.sub}`}>{sub}</span></span>}
      </div>
      <h2 className={`display ${styles.title}`}>
        <span className="line-mask"><span data-ln>{title}</span></span>
      </h2>
    </div>
  );
}
