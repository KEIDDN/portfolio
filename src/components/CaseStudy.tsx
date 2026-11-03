"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { dict, t, type Locale } from "@/content/i18n";
import type { Project, Theme } from "@/content/projects";
import { Media, Row, ratioOf } from "./Media";
import TetraIcons from "./TetraIcons";
import TetraSkins from "./TetraSkins";
import Sequence from "./Sequence";
import Evolution from "./case/Evolution";
import Room from "./case/Room";
import { TetraLogo, TetraPalette } from "./case/TetraBrand";
import NextChapter, { type NextTarget } from "./NextChapter";
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

export default function CaseStudy({ project, next, locale }: { project: Project; next: NextTarget; locale: Locale }) {
  const root = useRef<HTMLDivElement>(null);
  useTheme(project.theme);
  const sound = { on: dict.soundOn[locale], off: dict.soundOff[locale] };

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo("[data-hero-media]", { scale: 1.12 }, { scale: 1, duration: 2.2, ease: "expo.out" });
      gsap.from("[data-h-line]", { yPercent: 110, duration: 1.5, ease: "expo.out", stagger: 0.08, delay: 0.25 });
      gsap.from("[data-h-fade]", { y: 16, opacity: 0, duration: 1.2, ease: "expo.out", stagger: 0.05, delay: 0.5 });
      // hero media drifts slower than the page
      gsap.to("[data-hero-media]", {
        yPercent: 14,
        ease: "none",
        scrollTrigger: { trigger: "[data-hero]", start: "top top", end: "bottom top", scrub: true },
      });
      gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((el) => {
        gsap.from(el, { y: 60, opacity: 0, duration: 1.4, ease: "expo.out", scrollTrigger: { trigger: el, start: "top 88%" } });
      });
      gsap.utils.toArray<HTMLElement>("[data-clip]").forEach((el) => {
        gsap.fromTo(el, { clipPath: "inset(8% 4% 8% 4%)" }, {
          clipPath: "inset(0% 0% 0% 0%)",
          duration: 1.6,
          ease: "expo.out",
          scrollTrigger: { trigger: el, start: "top 85%" },
        });
      });
      gsap.utils.toArray<HTMLElement>("[data-theme-idx]").forEach((el) => {
        const idx = Number(el.dataset.themeIdx);
        const blk = project.blocks[idx];
        if (blk.kind !== "chapter") return;
        const prev = [...project.blocks.slice(0, idx)].reverse().find((b) => b.kind === "chapter");
        const prevTheme = prev && prev.kind === "chapter" ? prev.theme : project.theme;
        ScrollTrigger.create({
          trigger: el,
          start: "top 60%",
          onEnter: () => applyTheme(blk.theme),
          onLeaveBack: () => applyTheme(prevTheme),
        });
      });
    }, root);
    return () => ctx.revert();
  }, [project]);

  const meta = [
    { k: dict.year[locale], v: project.year },
    { k: dict.type[locale], v: t(project.type, locale) },
    { k: dict.roleLabel[locale], v: t(project.role, locale) },
    project.platforms ? { k: dict.platforms[locale], v: t(project.platforms, locale) } : null,
    { k: dict.tools[locale], v: project.tools },
  ].filter(Boolean) as { k: string; v: string }[];

  return (
    <div ref={root} className={styles.page}>
      <header className={`${styles.hero} ${project.hero === "contain" ? styles.heroContain : ""}`} data-hero>
        <div className={styles.heroMedia} data-hero-media>
          {project.heroVideo || project.coverVideo ? (
            <video src={project.heroVideo ?? project.coverVideo} poster={project.heroPoster ?? project.cover} autoPlay muted loop playsInline />
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={project.cover} alt={project.title} />
          )}
        </div>
        {project.hero !== "contain" && <div className={styles.heroShade} />}
        <div className={styles.heroTop}>
          <Link href={`/${locale}#work`} className="mono ulink" data-h-fade>← {dict.back[locale]}</Link>
          <span className={`mono ${styles.pill}`} data-h-fade>{project.label}</span>
        </div>
        <h1 className={`display ${styles.title}`}>
          <span className="line-mask"><span data-h-line>{project.title}</span></span>
        </h1>
      </header>

      <section className={styles.intro}>
        <p className={`display ${styles.summary}`} data-reveal>{t(project.summary, locale)}</p>
        <dl className={styles.meta} data-reveal>
          {meta.map((m) => (
            <div key={m.k}>
              <dt className="mono muted">{m.k}</dt>
              <dd>{m.v}</dd>
            </div>
          ))}
          {project.url && (
            <div>
              <dt className="mono muted">Live</dt>
              <dd>
                <a href={project.url} target="_blank" rel="noreferrer" className={styles.live}>{dict.visit[locale]} ↗</a>
              </dd>
            </div>
          )}
        </dl>
      </section>

      {project.label === "OXIA Labs" && (
        <Link href={`/${locale}/oxia-labs`} className={styles.madeAt}>
          <span className={styles.emblem} aria-hidden />
          <span>{dict.madeAt[locale]}</span>
          <span className="mono muted">{dict.madeAtSub[locale]}</span>
          <span className="mono">↗</span>
        </Link>
      )}

      <div className={styles.blocks}>
        {project.blocks.map((b, i) => {
          switch (b.kind) {
            case "stage":
              return (
                <div key={i} className={styles.stage} data-stop data-reveal>
                  <span className="mono">{b.n}</span>
                  <span className="mono">{t(b.label, locale)}</span>
                </div>
              );
            case "idea":
              return (
                <section key={i} className={styles.idea}>
                  <h2 className={`display ${styles.h2}`} data-reveal>{t(b.title, locale)}</h2>
                  <p className={styles.body} data-reveal>{t(b.body, locale)}</p>
                </section>
              );
            case "moment": {
              const full = b.layout === "full";
              const plain = b.layout === "plain";
              return (
                <section key={i} className={`${styles.moment} ${full ? styles.momentFull : ""} ${plain ? styles.momentPlain : ""}`}>
                  <div className={styles.mMedia} data-clip>
                    <div className={full ? "" : plain ? styles.plainInner : styles.panelInner}>
                      <Media src={b.media} poster={b.poster} alt={t(b.title, locale)} sound={b.sound ? sound : undefined} />
                    </div>
                  </div>
                  {b.also && (
                    <div className={styles.also} data-reveal>
                      {b.also.map((src) => (
                        <div key={src} className={ratioOf(src) < 0.8 ? styles.screen : styles.alsoWide}>
                          <Media src={src} alt={t(b.title, locale)} />
                        </div>
                      ))}
                    </div>
                  )}
                  <div className={styles.caption} data-reveal>
                    <h3 className={styles.h3}>{t(b.title, locale)}</h3>
                    <p className={styles.mBody}>{t(b.body, locale)}</p>
                  </div>
                </section>
              );
            }
            case "screens":
              return (
                <section key={i} className={styles.screens}>
                  {b.items.map((it) => (
                    <figure key={it.media} className={styles.phone} data-reveal>
                      <Media src={it.media} poster={it.poster} alt={t(it.title, locale)} grain={false} ratio={ratioOf(it.poster, 0.46)} />
                      <figcaption>
                        <span className={styles.h3}>{t(it.title, locale)}</span>
                        <span className={styles.mBody}>{t(it.body, locale)}</span>
                      </figcaption>
                    </figure>
                  ))}
                </section>
              );
            case "sequence":
              return <Sequence key={i} items={b.items} locale={locale} />;
            case "image":
              return (
                <div key={i} className={`${styles.img} ${styles[b.layout ?? "wide"]}`} data-clip>
                  <Media src={b.src} alt={b.alt} />
                </div>
              );
            case "pair":
              return (
                <div key={i} className={styles.wide} data-reveal>
                  <Row srcs={b.srcs} alt={b.alt} />
                </div>
              );
            case "icons":
              return (
                <section key={i} className={styles.system}>
                  <div className={styles.idea}>
                    <h2 className={`display ${styles.h2}`} data-reveal>{t(b.title, locale)}</h2>
                    <p className={styles.body} data-reveal>{t(b.body, locale)}</p>
                  </div>
                  <TetraIcons locale={locale} />
                </section>
              );
            case "skins":
              return (
                <section key={i} className={styles.system}>
                  <div className={styles.idea}>
                    <h2 className={`display ${styles.h2}`} data-reveal>{t(b.title, locale)}</h2>
                    <p className={styles.body} data-reveal>{t(b.body, locale)}</p>
                  </div>
                  <div className={styles.wide}>
                    <TetraSkins locale={locale} />
                  </div>
                </section>
              );
            case "details":
              return (
                <section key={i} className={styles.details} data-reveal>
                  {b.items.map((it, k) => (
                    <div key={it.label.en}>
                      <span className="mono muted">{String(k + 1).padStart(2, "0")} — {t(it.label, locale)}</span>
                      <p>{t(it.body, locale)}</p>
                    </div>
                  ))}
                </section>
              );
            case "chapter":
              return (
                <section key={i} className={styles.chapter} data-theme-idx={i} data-stop>
                  <span className="mono muted" data-reveal>{b.kicker}</span>
                  <h2 className={`display ${styles.chTitle}`} data-reveal>{b.title}</h2>
                  <p className={styles.body} data-reveal>{t(b.body, locale)}</p>
                </section>
              );
            case "decision": {
              const pf = b.proof;
              return (
                <section key={i} className={styles.decision}>
                  <div className={styles.dHead}>
                    <span className="mono muted" data-reveal>{b.n}</span>
                    <h2 className={`display ${styles.dTitle}`} data-reveal>{t(b.title, locale)}</h2>
                    <p className={styles.body} data-reveal>{t(b.body, locale)}</p>
                  </div>
                  <div data-reveal>
                    {pf === "icons" ? (
                      <TetraIcons locale={locale} />
                    ) : pf === "skins" ? (
                      <div className={styles.wide}>
                        <TetraSkins locale={locale} />
                      </div>
                    ) : pf === "logo" ? (
                      <TetraLogo />
                    ) : pf === "palette" ? (
                      <TetraPalette locale={locale} />
                    ) : pf.phone ? (
                      <div className={styles.dPhone}>
                        <Media src={pf.media} poster={pf.poster} alt={t(b.title, locale)} grain={false} ratio={ratioOf(pf.poster ?? pf.media, 0.46)} />
                      </div>
                    ) : (
                      <div className={styles.wide}>
                        <Media src={pf.media} poster={pf.poster} alt={t(b.title, locale)} />
                      </div>
                    )}
                  </div>
                </section>
              );
            }
            case "evolution":
              return <Evolution key={i} n={b.n} title={b.title} body={b.body} steps={b.steps} locale={locale} />;
            case "room":
              return <Room key={i} title={b.title} body={b.body} items={b.items} locale={locale} />;
            case "statement":
              return (
                <section key={i} className={styles.closing} data-stop>
                  <p className={`display ${styles.statement}`} data-reveal>{t(b.body, locale)}</p>
                  {b.sub && <p className="mono muted" data-reveal>{t(b.sub, locale)}</p>}
                </section>
              );
          }
        })}
      </div>

      <NextChapter next={next} />
    </div>
  );
}
