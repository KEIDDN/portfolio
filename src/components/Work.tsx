"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { dict, t, type Locale } from "@/content/i18n";
import { getProject, projects, workSlugs } from "@/content/projects";
import { ratioOf } from "./Media";
import ChapterHead from "./ChapterHead";
import styles from "./Work.module.css";

/**
 * Editorial list on the left, one sticky stage on the right.
 * The stage always shows the whole cover (its real ratio) of the project you're reading.
 */
export default function Work({ locale }: { locale: Locale }) {
  const root = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);
  const work = workSlugs.map((s) => getProject(s)!);
  const archive = projects.filter((p) => p.archive);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>("[data-item]").forEach((el, i) => {
        ScrollTrigger.create({ trigger: el, start: "top 55%", end: "bottom 55%", onToggle: (s) => s.isActive && setActive(i) });
      });
      gsap.from("[data-arch]", { opacity: 0, y: 24, duration: 1, ease: "expo.out", stagger: 0.06, scrollTrigger: { trigger: "[data-arch]", start: "top 92%" } });
    }, root);
    return () => ctx.revert();
  }, []);

  // only the visible cover plays
  useEffect(() => {
    root.current!.querySelectorAll<HTMLVideoElement>("[data-stage] video").forEach((v, i) => {
      if (i === active) v.play().catch(() => {});
      else v.pause();
    });
  }, [active]);

  const cover = (p: (typeof work)[number]) =>
    p.coverVideo ? (
      <video src={p.coverVideo} poster={p.cover} muted loop playsInline preload="metadata" />
    ) : (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={p.cover} alt={p.title} loading="lazy" />
    );

  return (
    <section ref={root} id="work" className={styles.section}>
      <ChapterHead n="02" kicker={dict.ch1[locale]} title={dict.work[locale]} sub={dict.workSub[locale]} />
      <div className={styles.layout}>
        <div className={styles.list}>
          {work.map((p, i) => (
            <Link key={p.slug} href={`/${locale}/work/${p.slug}`} className={`${styles.item} ${active === i ? styles.on : ""}`} data-item>
              <div className={styles.itemTop}>
                <span className="mono muted">{String(i + 1).padStart(2, "0")}</span>
                <span className="mono muted">{p.label} — {p.year}</span>
              </div>
              <span className={`display ${styles.title}`}>{p.title}</span>
              <span className={styles.summary}>{t(p.summary, locale)}</span>
              <span className={`mono ${styles.cta}`}>{dict.view[locale]} →</span>
              <div className={styles.mobileCover} style={{ aspectRatio: ratioOf(p.cover, 16 / 9) }}>{cover(p)}</div>
            </Link>
          ))}
        </div>
        <div className={styles.stageWrap}>
          <div className={styles.stage} data-stage>
            {work.map((p, i) => (
              <Link
                key={p.slug}
                href={`/${locale}/work/${p.slug}`}
                className={`${styles.slide} ${active === i ? styles.slideOn : ""} img-grain`}
                style={{ aspectRatio: ratioOf(p.cover, 16 / 9) }}
                tabIndex={-1}
              >
                {cover(p)}
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className={styles.archive}>
        <div className={styles.archHead}>
          <span className="mono">{dict.archive[locale]}</span>
          <span className="mono muted">{dict.archiveSub[locale]}</span>
        </div>
        {archive.map((p) => (
          <Link key={p.slug} href={`/${locale}/work/${p.slug}`} className={styles.archRow} data-arch>
            <span className="mono muted">{p.year}</span>
            <span className={styles.archTitle}>{p.title}</span>
            <span className="mono muted">{t(p.type, locale)}</span>
            <span className="mono">{dict.view[locale]} →</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
