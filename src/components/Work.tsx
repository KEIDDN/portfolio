"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { dict, t, type Locale } from "@/content/i18n";
import { getProject, projects, workSlugs } from "@/content/projects";
import ChapterHead from "./ChapterHead";
import { morphTo } from "./morph";
import styles from "./Work.module.css";

/** Splits a title into letters that roll up on hover, a copy waiting underneath. Words stay whole when the line wraps. */
function Roll({ text }: { text: string }) {
  let n = 0;
  return (
    <span className={styles.roll} aria-hidden>
      {text.split(" ").map((w, wi) => (
        <span key={wi} className={styles.word}>
          {w.split("").map((ch) => {
            const i = n++;
            return (
              <span key={i} className={styles.ch} style={{ ["--i" as string]: i }}>
                <span>{ch}</span>
                <span>{ch}</span>
              </span>
            );
          })}
        </span>
      ))}
    </span>
  );
}

/**
 * The work as an editorial index: one large line per project. Hovering a line
 * brings a preview that follows the cursor (the projects sit in it like a reel
 * and slide to the one you're on); a click grows that preview into the case.
 */
export default function Work({ locale }: { locale: Locale }) {
  const root = useRef<HTMLElement>(null);
  const prev = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const work = workSlugs.map((s) => getProject(s)!);
  const archive = projects.filter((p) => p.archive);
  const [active, setActive] = useState<number | null>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>("[data-row]").forEach((row) => {
        const tl = gsap.timeline({ scrollTrigger: { trigger: row, start: "top 90%" } });
        tl.fromTo(row.querySelector("[data-rule]"), { scaleX: 0 }, { scaleX: 1, duration: 1.4, ease: "expo.inOut" })
          .from(row.querySelectorAll("[data-t]"), { yPercent: 115, duration: 1.2, ease: "expo.out", stagger: 0.05 }, 0.25);
      });
      gsap.from("[data-ihead] > *", { opacity: 0, y: 12, duration: 1, ease: "expo.out", stagger: 0.05, scrollTrigger: { trigger: "[data-ihead]", start: "top 92%" } });
    }, root);
    return () => ctx.revert();
  }, []);

  // the preview trails the cursor and leans into the movement
  useEffect(() => {
    const el = prev.current!;
    const x = gsap.quickTo(el, "x", { duration: 0.7, ease: "power3.out" });
    const y = gsap.quickTo(el, "y", { duration: 0.7, ease: "power3.out" });
    const r = gsap.quickTo(el, "rotation", { duration: 0.9, ease: "power3.out" });
    let lx = 0;
    const move = (e: PointerEvent) => {
      x(e.clientX);
      y(e.clientY);
      r(gsap.utils.clamp(-7, 7, (e.clientX - lx) * 0.35));
      lx = e.clientX;
    };
    window.addEventListener("pointermove", move);
    return () => window.removeEventListener("pointermove", move);
  }, []);

  // only the clip in view plays
  useEffect(() => {
    prev.current!.querySelectorAll<HTMLVideoElement>("video").forEach((v, i) => {
      if (i === active) v.play().catch(() => {});
      else v.pause();
    });
  }, [active]);

  const open = (slug: string, i: number) => (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey) return;
    // without the preview on screen (keyboard, touch), the curtain takes over
    if (active !== i || !matchMedia("(hover: hover)").matches) return;
    e.preventDefault();
    const frame = prev.current!.querySelector<HTMLElement>(`[data-slide="${i}"]`)!;
    setActive(null);
    morphTo(frame, `/${locale}/work/${slug}`, router.push);
  };

  return (
    <section ref={root} id="work" className={styles.section}>
      <ChapterHead n="02" kicker={dict.ch1[locale]} title={dict.work[locale]} sub={dict.workSub[locale]} />

      <div className={styles.ihead} data-ihead>
        <span className="mono muted">{locale === "en" ? "Project" : "Proyecto"}</span>
        <span className="mono muted">{locale === "en" ? "Discipline" : "Disciplina"}</span>
        <span className="mono muted">{locale === "en" ? "Year" : "Año"}</span>
      </div>

      <ol className={`${styles.list} ${active !== null ? styles.hovering : ""}`} onPointerLeave={() => setActive(null)}>
        {work.map((p, i) => (
          <li key={p.slug} className={`${styles.row} ${active === i ? styles.on : ""}`} data-row data-stop>
            <span className={styles.rule} data-rule />
            <Link
              href={`/${locale}/work/${p.slug}`}
              onClick={open(p.slug, i)}
              onPointerEnter={() => setActive(i)}
              onFocus={() => setActive(i)}
              onBlur={() => setActive(null)}
              className={styles.link}
              data-title={p.title}
              data-cursor={dict.view[locale]}
              aria-label={`${p.title}: ${t(p.summary, locale)}`}
            >
              <span className={`mono ${styles.n}`}>
                <span className="line-mask"><span data-t>{String(i + 1).padStart(2, "0")}</span></span>
              </span>
              <span className={`display ${styles.title}`}>
                <span className="line-mask"><span data-t><Roll text={p.title} /></span></span>
              </span>
              <span className={styles.meta}>
                <span className="line-mask"><span data-t className={styles.summary}>{t(p.summary, locale)}</span></span>
                <span className="line-mask"><span data-t className="mono muted">{t(p.type, locale)}</span></span>
              </span>
              <span className={`mono ${styles.year}`}>
                <span className="line-mask"><span data-t>{p.year}</span></span>
                <span className={styles.arrow} aria-hidden>↗</span>
              </span>
              {/* phones and touch: the cover sits inside the row */}
              <span className={styles.thumb} aria-hidden>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={p.cover} alt="" loading="lazy" />
              </span>
            </Link>
          </li>
        ))}
        <li className={styles.endRule} aria-hidden />
      </ol>

      {/* the preview: every project in one window, stacked like a reel */}
      <div ref={prev} className={`${styles.preview} ${active !== null ? styles.previewOn : ""}`} aria-hidden>
        <div className={styles.reel} style={{ transform: `translateY(${-(active ?? 0) * 100}%)` }}>
          {work.map((p, i) => (
            <div key={p.slug} className={styles.slide} data-slide={i}>
              {p.coverVideo ? (
                <video src={p.coverVideo} poster={p.cover} muted loop playsInline preload="metadata" />
              ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={p.cover} alt="" />
              )}
            </div>
          ))}
        </div>
      </div>

      <div className={styles.archive}>
        <div className={styles.archHead}>
          <span className="mono">{dict.archive[locale]}</span>
          <span className="mono muted">{dict.archiveSub[locale]}</span>
        </div>
        {archive.map((p) => (
          <Link key={p.slug} href={`/${locale}/work/${p.slug}`} className={styles.archRow} data-title={p.title}>
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
