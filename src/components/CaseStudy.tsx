"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { dict, t, type Locale } from "@/content/i18n";
import type { Project, Theme } from "@/content/projects";
import styles from "./CaseStudy.module.css";

const DEFAULT: Theme = { bg: "#050505", fg: "#efefed", accent: "#c4161c", muted: "#7a7875" };

export function applyTheme(th: Theme) {
  const s = document.documentElement.style;
  s.setProperty("--bg", th.bg);
  s.setProperty("--fg", th.fg);
  s.setProperty("--accent", th.accent);
  s.setProperty("--muted", th.muted ?? th.fg);
}

export function useTheme(theme: Theme) {
  useEffect(() => {
    applyTheme(theme);
    return () => applyTheme(DEFAULT);
  }, [theme]);
}

function Media({ src, alt }: { src: string; alt: string }) {
  return (
    <div className={`${styles.media} img-grain`} data-reveal>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt={alt} loading="lazy" data-parallax />
    </div>
  );
}

export default function CaseStudy({ project, next, locale }: { project: Project; next: Project; locale: Locale }) {
  const root = useRef<HTMLDivElement>(null);
  useTheme(project.theme);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from("[data-h-line]", { yPercent: 110, duration: 1.4, ease: "expo.out", stagger: 0.08, delay: 0.2 });
      gsap.from("[data-h-fade]", { y: 20, opacity: 0, duration: 1.2, ease: "expo.out", stagger: 0.05, delay: 0.5 });
      gsap.fromTo("[data-cover]", { clipPath: "inset(18% 8% 0 8%)" }, {
        clipPath: "inset(0% 0% 0 0%)",
        ease: "none",
        scrollTrigger: { trigger: "[data-cover]", start: "top 95%", end: "top 15%", scrub: true },
      });
      gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((el) => {
        gsap.from(el, { y: 80, opacity: 0, duration: 1.3, ease: "expo.out", scrollTrigger: { trigger: el, start: "top 90%" } });
      });
      gsap.utils.toArray<HTMLElement>("[data-parallax]").forEach((el) => {
        gsap.fromTo(el, { yPercent: -6, scale: 1.12 }, {
          yPercent: 6,
          ease: "none",
          scrollTrigger: { trigger: el.parentElement, start: "top bottom", end: "bottom top", scrub: true },
        });
      });
      gsap.utils.toArray<HTMLElement>("[data-theme-idx]").forEach((el) => {
        const idx = Number(el.dataset.themeIdx);
        const blk = project.blocks[idx];
        if (blk.kind !== "theme") return;
        const prev = [...project.blocks.slice(0, idx)].reverse().find((b) => b.kind === "theme");
        const prevTheme = prev && prev.kind === "theme" ? prev.theme : project.theme;
        ScrollTrigger.create({
          trigger: el,
          start: "top 55%",
          onEnter: () => applyTheme(blk.theme),
          onLeaveBack: () => applyTheme(prevTheme),
        });
      });
      gsap.utils.toArray<HTMLVideoElement>("video").forEach((v) => {
        ScrollTrigger.create({
          trigger: v,
          start: "top bottom",
          end: "bottom top",
          onToggle: (s) => (s.isActive ? v.play().catch(() => {}) : v.pause()),
        });
      });
    }, root);
    return () => ctx.revert();
  }, [project]);

  return (
    <div ref={root} className={styles.page}>
      <header className={styles.hero}>
        <div className={styles.heroTop}>
          <Link href={`/${locale}#work`} className="mono ulink" data-h-fade>← {dict.back[locale]}</Link>
          <span className={`mono ${styles.pill}`} data-h-fade>{project.label}</span>
        </div>
        <h1 className={`display ${styles.title}`}>
          <span className="line-mask"><span data-h-line>{project.title}</span></span>
        </h1>
        <div className={styles.heroBottom}>
          <p className={styles.summary} data-h-fade>{t(project.summary, locale)}</p>
          <dl className={styles.meta}>
            <div data-h-fade><dt className="mono muted">{dict.year[locale]}</dt><dd>{project.year}</dd></div>
            <div data-h-fade><dt className="mono muted">{dict.type[locale]}</dt><dd>{t(project.type, locale)}</dd></div>
            <div data-h-fade><dt className="mono muted">{dict.roleLabel[locale]}</dt><dd>{t(project.role, locale)}</dd></div>
            <div data-h-fade><dt className="mono muted">{dict.tools[locale]}</dt><dd>{project.tools}</dd></div>
            {project.url && (
              <div data-h-fade>
                <dt className="mono muted">Live</dt>
                <dd><a href={project.url} target="_blank" rel="noreferrer" className={`ulink ${styles.accent}`}>{dict.visit[locale]} ↗</a></dd>
              </div>
            )}
          </dl>
        </div>
      </header>

      <div className={`${styles.cover} img-grain`} data-cover>
        {project.coverVideo ? (
          <video src={project.coverVideo} poster={project.cover} muted loop playsInline autoPlay />
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={project.cover} alt={project.title} />
        )}
      </div>

      <div className={styles.blocks}>
        {project.blocks.map((b, i) => {
          switch (b.kind) {
            case "text":
              return (
                <section key={i} className={styles.text} data-reveal>
                  <span className="mono muted">{t(b.label, locale)}</span>
                  <div>
                    {b.title && <h2 className={`display ${styles.textTitle}`}>{t(b.title, locale)}</h2>}
                    <p className={styles.body}>{t(b.body, locale)}</p>
                  </div>
                </section>
              );
            case "image":
              return (
                <div key={i} className={`${styles.img} ${styles[b.layout ?? "wide"]}`}>
                  <Media src={b.src} alt={b.alt} />
                </div>
              );
            case "pair":
              return (
                <div key={i} className={styles.pair}>
                  <Media src={b.srcs[0]} alt={b.alt} />
                  <Media src={b.srcs[1]} alt={b.alt} />
                </div>
              );
            case "video":
              return (
                <div key={i} className={`${styles.img} ${styles[b.layout ?? "wide"]}`}>
                  <div className={`${styles.media} img-grain`} data-reveal>
                    <video src={b.src} poster={b.poster} muted loop playsInline preload="metadata" />
                  </div>
                </div>
              );
            case "statement":
              return (
                <p key={i} className={`display ${styles.statement}`} data-reveal>
                  {t(b.body, locale)}
                </p>
              );
            case "theme":
              return (
                <div key={i} data-theme-idx={i} className={styles.themeMark}>
                  {b.label && <span className={`display ${styles.chapter}`}>{t(b.label, locale)}</span>}
                </div>
              );
          }
        })}
      </div>

      <Link href={`/${locale}/work/${next.slug}`} className={styles.next}>
        <span className="mono muted">{dict.nextProject[locale]} →</span>
        <span className={`display ${styles.nextTitle}`}>{next.title}</span>
        <div className={`${styles.nextImg} img-grain`}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={next.cover} alt={next.title} loading="lazy" />
        </div>
      </Link>
    </div>
  );
}
