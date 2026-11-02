"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { dict, t, type Locale } from "@/content/i18n";
import { getProject, projects, workSlugs } from "@/content/projects";
import ChapterHead from "./ChapterHead";
import styles from "./Work.module.css";

const LAYOUT = ["big", "small", "small", "big"] as const;

export default function Work({ locale }: { locale: Locale }) {
  const root = useRef<HTMLElement>(null);
  const work = workSlugs.map((s) => getProject(s)!);
  const archive = projects.filter((p) => p.archive);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>("[data-card]").forEach((el) => {
        const media = el.querySelector("[data-media]");
        gsap.fromTo(media, { clipPath: "inset(12% 6% 12% 6%)" }, {
          clipPath: "inset(0% 0% 0% 0%)",
          duration: 1.6,
          ease: "expo.out",
          scrollTrigger: { trigger: el, start: "top 88%" },
        });
        gsap.from(el.querySelectorAll("[data-txt]"), {
          yPercent: 110,
          duration: 1.2,
          ease: "expo.out",
          stagger: 0.05,
          delay: 0.15,
          scrollTrigger: { trigger: el, start: "top 88%" },
        });
      });
      gsap.from("[data-arch]", { opacity: 0, y: 24, duration: 1, ease: "expo.out", stagger: 0.06, scrollTrigger: { trigger: "[data-arch]", start: "top 92%" } });
    }, root);

    const vids = root.current!.querySelectorAll("video");
    const io = new IntersectionObserver((es) =>
      es.forEach((e) => {
        const v = e.target as HTMLVideoElement;
        if (e.isIntersecting) v.play().catch(() => {});
        else v.pause();
      }),
    );
    vids.forEach((v) => io.observe(v));
    return () => {
      ctx.revert();
      io.disconnect();
    };
  }, []);

  return (
    <section ref={root} id="work" className={styles.section}>
      <ChapterHead n="01" kicker={dict.ch1[locale]} title={dict.work[locale]} sub={dict.workSub[locale]} />
      <div className={styles.grid}>
        {work.map((p, i) => (
          <Link key={p.slug} href={`/${locale}/work/${p.slug}`} className={`${styles.card} ${styles[LAYOUT[i]]}`} data-card>
            <div className={styles.media} data-media>
              {p.coverVideo ? (
                <video src={p.coverVideo} poster={p.cover} muted loop playsInline preload="metadata" />
              ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={p.cover} alt={p.title} loading="lazy" />
              )}
              <span className={`mono ${styles.tag}`}>{p.label}</span>
            </div>
            <div className={styles.info}>
              <span className="line-mask"><span data-txt className={`display ${styles.title}`}>{p.title}</span></span>
              <span className="line-mask"><span data-txt className="mono muted">{p.year}</span></span>
            </div>
            <span className="line-mask"><span data-txt className={styles.summary}>{t(p.summary, locale)}</span></span>
          </Link>
        ))}
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
