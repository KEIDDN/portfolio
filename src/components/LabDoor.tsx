"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { dict, t, type Locale } from "@/content/i18n";
import { labIntro, wall } from "@/content/lab";
import { ratioOf } from "./Media";
import styles from "./LabDoor.module.css";

/** 04 — a window onto the Lab universe. The whole section is the door. */
export default function LabDoor({ locale }: { locale: Locale }) {
  const root = useRef<HTMLElement>(null);
  useEffect(() => {
    const ctx = gsap.context(() => {
      // the field drifts with the scroll at different depths
      gsap.utils.toArray<HTMLElement>("[data-d]").forEach((el) => {
        const d = parseFloat(el.dataset.d!);
        gsap.fromTo(el, { y: 160 * d }, { y: -160 * d, ease: "none", scrollTrigger: { trigger: root.current, start: "top bottom", end: "bottom top", scrub: true } });
      });
      gsap.from("[data-f]", { opacity: 0, scale: 0.6, duration: 1.8, ease: "expo.out", stagger: { each: 0.04, from: "center" }, scrollTrigger: { trigger: root.current, start: "top 70%" } });
      gsap.from("[data-l]", { yPercent: 110, duration: 1.4, ease: "expo.out", stagger: 0.08, scrollTrigger: { trigger: root.current, start: "top 55%" } });
    }, root);
    return () => ctx.revert();
  }, []);

  // the pointer pushes the field a little
  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;
    const el = root.current!;
    const items = Array.from(el.querySelectorAll<HTMLElement>("[data-f]")).map((n) => ({
      d: parseFloat(n.parentElement!.dataset.d!),
      x: gsap.quickTo(n, "x", { duration: 1.4, ease: "power3.out" }),
      y: gsap.quickTo(n, "y", { duration: 1.4, ease: "power3.out" }),
    }));
    const move = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      const mx = (e.clientX - r.left) / r.width - 0.5;
      const my = (e.clientY - r.top) / r.height - 0.5;
      items.forEach((it) => {
        it.x(-mx * it.d * 40);
        it.y(-my * it.d * 40);
      });
    };
    el.addEventListener("pointermove", move);
    return () => el.removeEventListener("pointermove", move);
  }, []);

  return (
    <section ref={root} id="lab" className={styles.section}>
      <div className={styles.label}>
        <span className="mono">04 — {dict.ch3[locale]}</span>
        <span className="mono muted">{locale === "en" ? "9 series" : "9 series"}</span>
      </div>
      <Link href={`/${locale}/lab`} className={styles.door} data-title="Lab" data-cursor={locale === "en" ? "Enter" : "Entrar"}>
        <div className={styles.field} aria-hidden>
          {wall.map((p, i) => (
            <div key={i} className={styles.piece} style={{ left: `${p.x}%`, top: `${p.y * 0.82 + 7}%`, width: `${p.w * 0.95}%` }} data-d={p.d}>
              <div data-f className={p.cut ? styles.cut : "img-grain"} style={{ aspectRatio: ratioOf(p.src) }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={p.src} alt="" loading="lazy" draggable={false} />
              </div>
            </div>
          ))}
        </div>
        <div className={styles.center}>
          <h2 className={`display ${styles.title}`}>
            <span className="line-mask"><span data-l>Lab</span></span>
          </h2>
          <span className="line-mask"><span data-l className={styles.line}>{t(labIntro, locale)}</span></span>
          <span className="line-mask"><span data-l className={styles.cta}>{locale === "en" ? "Enter the Lab" : "Entrar en el Lab"} →</span></span>
        </div>
      </Link>
    </section>
  );
}
