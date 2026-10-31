"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { dict, t, type Locale } from "@/content/i18n";
import { getProject, selectedSlugs } from "@/content/projects";
import styles from "./SelectedWork.module.css";

export default function SelectedWork({ locale }: { locale: Locale }) {
  const root = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const items = selectedSlugs.map((s) => getProject(s)!);

  useEffect(() => {
    const mm = gsap.matchMedia();
    mm.add("(min-width: 900px)", () => {
      const tr = track.current!;
      const medias = gsap.utils.toArray<HTMLElement>("[data-media]", tr);
      const inners = gsap.utils.toArray<HTMLElement>("[data-inner]", tr);
      const skewTo = medias.map((m) => gsap.quickTo(m, "skewX", { duration: 0.5, ease: "power3" }));
      const scaleTo = medias.map((m) => gsap.quickTo(m, "scaleY", { duration: 0.5, ease: "power3" }));
      const dist = () => tr.scrollWidth - window.innerWidth;
      const tween = gsap.to(tr, {
        x: () => -dist(),
        ease: "none",
        scrollTrigger: {
          trigger: root.current,
          start: "top top",
          end: () => `+=${dist()}`,
          pin: true,
          scrub: 0.6,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            const v = gsap.utils.clamp(-14, 14, self.getVelocity() / -260);
            skewTo.forEach((f) => f(v));
            scaleTo.forEach((f) => f(1 - Math.abs(v) * 0.006));
            const cx = window.innerWidth / 2;
            inners.forEach((el) => {
              const r = el.parentElement!.getBoundingClientRect();
              const off = (r.left + r.width / 2 - cx) / window.innerWidth;
              gsap.set(el, { xPercent: -off * 12 });
            });
          },
        },
      });
      return () => tween.kill();
    });
    mm.add("(max-width: 899px)", () => {
      gsap.utils.toArray<HTMLElement>("[data-card]").forEach((c) =>
        gsap.from(c, { y: 60, opacity: 0, duration: 1.1, ease: "expo.out", scrollTrigger: { trigger: c, start: "top 88%" } }),
      );
    });
    // play videos only when visible
    const vids = root.current!.querySelectorAll("video");
    const io = new IntersectionObserver((es) =>
      es.forEach((e) => {
        const v = e.target as HTMLVideoElement;
        e.isIntersecting ? v.play().catch(() => {}) : v.pause();
      }),
    );
    vids.forEach((v) => io.observe(v));
    requestAnimationFrame(() => ScrollTrigger.refresh());
    return () => {
      mm.revert();
      io.disconnect();
    };
  }, []);

  return (
    <div id="work">
    <section ref={root} className={styles.section}>
      <div className={styles.head}>
        <h2 className={`display ${styles.title}`}>{dict.selected[locale]}</h2>
        <div className={styles.headMeta}>
          <span className="mono muted">( 02 )</span>
          <span className="mono muted">{dict.selectedSub[locale]}</span>
          <span className="mono">{String(items.length).padStart(2, "0")} {locale === "en" ? "projects" : "proyectos"}</span>
        </div>
      </div>
      <div ref={track} className={styles.track}>
        {items.map((p, i) => (
          <Link
            key={p.slug}
            href={`/${locale}/work/${p.slug}`}
            className={styles.card}
            data-card
            style={{ "--card-accent": p.theme.accent } as React.CSSProperties}
          >
            <div className={styles.cardTop}>
              <span className="mono">{String(i + 1).padStart(2, "0")}</span>
              <span className={`mono ${styles.label}`}>{p.label}</span>
            </div>
            <div className={`${styles.media} img-grain`} data-media style={{ background: p.theme.bg }}>
              <div className={styles.inner} data-inner>
                {p.coverVideo ? (
                  <video src={p.coverVideo} poster={p.cover} muted loop playsInline preload="metadata" />
                ) : (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={p.cover} alt={p.title} loading="lazy" />
                )}
              </div>
            </div>
            <div className={styles.cardBottom}>
              <h3 className={`display ${styles.name}`}>{p.title}</h3>
              <div className={styles.cardInfo}>
                <span className="mono muted">{t(p.type, locale)}</span>
                <span className="mono muted">{p.year}</span>
              </div>
              <span className={`mono ${styles.cta}`}>{dict.view[locale]} ↗</span>
            </div>
          </Link>
        ))}
        <a href="#index" className={styles.end}>
          <span className="mono muted">{locale === "en" ? "Everything else" : "Todo lo demás"}</span>
          <span className={`display ${styles.endBig}`}>{dict.index[locale]} ↓</span>
        </a>
      </div>
    </section>
    </div>
  );
}
