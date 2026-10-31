"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { dict, t, type Locale } from "@/content/i18n";
import { projects } from "@/content/projects";
import styles from "./ProjectIndex.module.css";

export default function ProjectIndex({ locale }: { locale: Locale }) {
  const preview = useRef<HTMLDivElement>(null);
  const root = useRef<HTMLElement>(null);
  const [img, setImg] = useState<string | null>(null);

  const rows = [
    ...projects.map((p) => ({
      href: `/${locale}/work/${p.slug}`,
      title: p.title,
      year: p.year,
      type: t(p.type, locale),
      label: p.label,
      img: p.cover,
    })),
    {
      href: `/${locale}/oxia-labs`,
      title: "OXIA Labs — Identity",
      year: "2026",
      type: locale === "en" ? "Studio identity & 3D" : "Identidad de estudio y 3D",
      label: "Oxia Labs",
      img: "/work/oxia/03.webp",
    },
  ].sort((a, b) => Number(b.year) - Number(a.year));

  useEffect(() => {
    const el = preview.current!;
    const xTo = gsap.quickTo(el, "x", { duration: 0.6, ease: "power3" });
    const yTo = gsap.quickTo(el, "y", { duration: 0.6, ease: "power3" });
    const move = (e: PointerEvent) => {
      xTo(e.clientX);
      yTo(e.clientY);
    };
    window.addEventListener("pointermove", move);
    const ctx = gsap.context(() => {
      gsap.from("[data-row]", {
        yPercent: 60,
        opacity: 0,
        stagger: 0.05,
        duration: 1,
        ease: "expo.out",
        scrollTrigger: { trigger: "[data-rows]", start: "top 85%" },
      });
    }, root);
    return () => {
      window.removeEventListener("pointermove", move);
      ctx.revert();
    };
  }, []);

  return (
    <section ref={root} id="index" className={styles.section}>
      <div className={styles.head}>
        <span className="mono muted">( 05 )</span>
        <h2 className={`display ${styles.title}`}>{dict.index[locale]}</h2>
        <span className="mono muted">{dict.indexSub[locale]}</span>
      </div>
      <div className={`${styles.row} ${styles.labels} mono muted`}>
        <span>{dict.year[locale]}</span>
        <span>{locale === "en" ? "Project" : "Proyecto"}</span>
        <span>{dict.type[locale]}</span>
        <span>{locale === "en" ? "Context" : "Contexto"}</span>
      </div>
      <ul data-rows className={styles.list} onPointerLeave={() => setImg(null)}>
        {rows.map((r) => (
          <li key={r.href} data-row>
            <Link href={r.href} className={styles.row} onPointerEnter={() => setImg(r.img)}>
              <span className="mono">{r.year}</span>
              <span className={styles.name}>{r.title}</span>
              <span className="mono muted">{r.type}</span>
              <span className="mono">{r.label}</span>
            </Link>
          </li>
        ))}
      </ul>
      <div ref={preview} className={`${styles.preview} ${img ? styles.show : ""}`} aria-hidden>
        {rows.map((r) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img key={r.href} src={r.img} alt="" className={img === r.img ? styles.active : ""} loading="lazy" />
        ))}
      </div>
    </section>
  );
}
