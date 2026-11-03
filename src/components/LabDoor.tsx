"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { dict, t, type Locale } from "@/content/i18n";
import { labIntro, series } from "@/content/lab";
import type { ModelKey } from "@/content/models";
import { ratioOf } from "./Media";
import styles from "./LabDoor.module.css";

const ModelViewer = dynamic(() => import("./ModelViewer"), { ssr: false });

/** The pieces that take turns at the centre, and the series each one belongs to. */
const STARS: { key: ModelKey; slug: string }[] = [
  { key: "ring", slug: "boton-charro" },
  { key: "ipod", slug: "ipod" },
  { key: "lego", slug: "miki" },
];

/**
 * 04 — the door to the Lab, on black like its rooms. While the section is
 * pinned, real 3D pieces take turns at the centre and the rest of the
 * collection passes underneath, moved only by the scroll.
 */
export default function LabDoor({ locale }: { locale: Locale }) {
  const root = useRef<HTMLElement>(null);
  const strip = useRef<HTMLDivElement>(null);
  const [i, setI] = useState(0);
  const pieces = series.flatMap((s) => s.orbit.slice(0, 2).map((src) => ({ src, s })));
  const total = series.reduce((n, s) => n + s.images.length + (s.models?.length ?? 0), 0);
  const star = series.find((s) => s.slug === STARS[i].slug)!;

  useEffect(() => {
    const ctx = gsap.context(() => {
      const st = { trigger: root.current, start: "top top", end: "bottom bottom", scrub: 0.8 };
      gsap.to(strip.current, { x: () => -(strip.current!.scrollWidth - window.innerWidth * 0.6), ease: "none", scrollTrigger: { ...st, invalidateOnRefresh: true } });
      gsap.to({}, {
        scrollTrigger: {
          trigger: root.current,
          start: "top top",
          end: "bottom bottom",
          onUpdate: (s) => setI(Math.min(STARS.length - 1, Math.floor(s.progress * STARS.length * 0.999))),
        },
      });
      gsap.from("[data-l]", { yPercent: 115, duration: 1.4, ease: "expo.out", stagger: 0.07, scrollTrigger: { trigger: root.current, start: "top 60%" } });
      gsap.from("[data-stage]", { scale: 0.7, opacity: 0, duration: 1.8, ease: "expo.out", scrollTrigger: { trigger: root.current, start: "top 50%" } });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={root} id="lab" className={styles.section}>
      <div className={styles.pin}>
        <div className={styles.top}>
          <span className="mono">04 — {dict.ch3[locale]}</span>
          <span className="mono muted">
            {series.length} series · {total} {locale === "en" ? "pieces" : "piezas"}
          </span>
        </div>

        <div className={styles.stage} data-stage>
          <ModelViewer keys={STARS.map((s) => s.key)} active={i} label={locale === "en" ? "Drag" : "Gira"} />
        </div>

        <div className={styles.now} key={star.slug}>
          <span className="mono muted">{String(i + 1).padStart(2, "0")} / {String(STARS.length).padStart(2, "0")}</span>
          <span className={styles.nowTitle}>{star.title}</span>
          <span className="mono muted">{t(star.kind, locale)}</span>
        </div>

        <div className={styles.copy}>
          <h2 className={`display ${styles.title}`}>
            <span className="line-mask"><span data-l>Lab</span></span>
          </h2>
          <p className={styles.line}>
            <span className="line-mask"><span data-l>{t(labIntro, locale)}</span></span>
          </p>
          <span className="line-mask">
            <span data-l>
              <Link href={`/${locale}/lab`} className={styles.cta} data-title="Lab">
                {locale === "en" ? "Enter the Lab" : "Entrar en el Lab"} <span aria-hidden>→</span>
              </Link>
            </span>
          </span>
        </div>

        <div className={styles.stripWrap} aria-hidden>
          <div ref={strip} className={styles.strip}>
            {pieces.map((p, k) => (
              <Link key={k} href={`/${locale}/lab`} tabIndex={-1} className={styles.piece} data-title="Lab" style={{ aspectRatio: ratioOf(p.src) }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={p.src} alt="" loading="lazy" draggable={false} />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
