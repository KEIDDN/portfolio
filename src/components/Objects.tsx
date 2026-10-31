"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ratioOf } from "./Media";
import styles from "./Objects.module.css";

/** Background-free 3D renders floating on the page, reacting to the cursor. */
export default function Objects({ srcs, captions, size = "md" }: { srcs: string[]; captions?: string[]; size?: "sm" | "md" | "lg" }) {
  const root = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const els = gsap.utils.toArray<HTMLElement>("[data-obj]", root.current);
    const tweens = els.map((el, i) =>
      gsap.to(el, { y: -14, rotation: i % 2 ? 1.5 : -1.5, duration: 2.6 + i * 0.3, ease: "sine.inOut", yoyo: true, repeat: -1 }),
    );
    const qx = els.map((el) => gsap.quickTo(el, "x", { duration: 1, ease: "power3" }));
    const move = (e: PointerEvent) => {
      const nx = e.clientX / window.innerWidth - 0.5;
      qx.forEach((f, i) => f(nx * (12 + i * 6)));
    };
    window.addEventListener("pointermove", move);
    const st = gsap.from(els, {
      y: 80,
      opacity: 0,
      duration: 1.4,
      ease: "expo.out",
      stagger: 0.1,
      scrollTrigger: { trigger: root.current, start: "top 85%" },
    });
    return () => {
      tweens.forEach((t) => t.kill());
      st.scrollTrigger?.kill();
      st.kill();
      window.removeEventListener("pointermove", move);
    };
  }, []);
  return (
    <div ref={root} className={`${styles.row} ${styles[size]}`}>
      {srcs.map((s, i) => (
        <figure key={s} className={styles.fig} style={{ flex: `${ratioOf(s, 1)} 1 0` }}>
          <div data-obj className={styles.obj}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={s} alt={captions?.[i] ?? ""} loading="lazy" />
          </div>
          {captions?.[i] && <figcaption className="mono muted">{captions[i]}</figcaption>}
        </figure>
      ))}
    </div>
  );
}
