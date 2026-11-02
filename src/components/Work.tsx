"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { dict, t, type Locale } from "@/content/i18n";
import { getProject, projects, workSlugs } from "@/content/projects";
import ChapterHead from "./ChapterHead";
import { morphTo } from "./morph";
import styles from "./Work.module.css";

/**
 * Stacked cards: one screen per project. Each new card rises over the last,
 * which sinks back, smaller and darker. A click grows the cover into the case.
 */
export default function Work({ locale }: { locale: Locale }) {
  const root = useRef<HTMLElement>(null);
  const router = useRouter();
  const work = workSlugs.map((s) => getProject(s)!);
  const archive = projects.filter((p) => p.archive);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const cards = gsap.utils.toArray<HTMLElement>("[data-card]");
      cards.forEach((card, i) => {
        const inner = card.querySelector<HTMLElement>("[data-inner]")!;
        const shade = card.querySelector<HTMLElement>("[data-shade]")!;
        // the card's own entrance: the frame opens as it arrives
        gsap.fromTo(
          card.querySelector("[data-frame]"),
          { clipPath: "inset(10% 6% 10% 6% round 14px)" },
          { clipPath: "inset(0% 0% 0% 0% round 10px)", ease: "none", scrollTrigger: { trigger: card, start: "top bottom", end: "top top", scrub: true } },
        );
        gsap.from(card.querySelectorAll("[data-t]"), {
          yPercent: 110, duration: 1.2, ease: "expo.out", stagger: 0.06,
          scrollTrigger: { trigger: card, start: "top 45%" },
        });
        const next = cards[i + 1];
        if (!next) return;
        // …and sinks back as the next one covers it
        gsap.to(inner, { scale: 0.9, ease: "none", scrollTrigger: { trigger: next, start: "top bottom", end: "top top", scrub: true } });
        gsap.to(shade, { opacity: 0.75, ease: "none", scrollTrigger: { trigger: next, start: "top bottom", end: "top top", scrub: true } });
      });
      gsap.from("[data-arch]", { opacity: 0, y: 24, duration: 1, ease: "expo.out", stagger: 0.06, scrollTrigger: { trigger: "[data-arch]", start: "top 92%" } });
    }, root);
    return () => ctx.revert();
  }, []);

  // only the card on screen plays
  useEffect(() => {
    const vids = Array.from(root.current!.querySelectorAll<HTMLVideoElement>("[data-card] video"));
    const io = new IntersectionObserver(
      (es) => es.forEach((e) => (e.isIntersecting ? (e.target as HTMLVideoElement).play().catch(() => {}) : (e.target as HTMLVideoElement).pause())),
      { threshold: 0.6 },
    );
    vids.forEach((v) => io.observe(v));
    return () => io.disconnect();
  }, []);

  const open = (slug: string) => (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey) return;
    e.preventDefault();
    const frame = e.currentTarget.closest("[data-card]")!.querySelector<HTMLElement>("[data-frame]")!;
    morphTo(frame, `/${locale}/work/${slug}`, router.push);
  };

  return (
    <section ref={root} id="work" className={styles.section}>
      <ChapterHead n="02" kicker={dict.ch1[locale]} title={dict.work[locale]} sub={dict.workSub[locale]} />

      <div className={styles.stack}>
        {work.map((p, i) => (
          <article key={p.slug} className={styles.card} data-card data-stop>
            <div className={styles.inner} data-inner>
              <Link
                href={`/${locale}/work/${p.slug}`}
                onClick={open(p.slug)}
                className={styles.frame}
                data-frame
                data-cursor={dict.view[locale]}
                aria-label={p.title}
              >
                {p.coverVideo ? (
                  <video src={p.coverVideo} poster={p.cover} muted loop playsInline preload={i === 0 ? "auto" : "metadata"} />
                ) : (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={p.cover} alt={p.title} loading="lazy" />
                )}
                <span className={styles.grad} />
                <span className={styles.top}>
                  <span className="line-mask"><span data-t className="mono">{String(i + 1).padStart(2, "0")} / {String(work.length).padStart(2, "0")}</span></span>
                  <span className="line-mask"><span data-t className="mono">{p.label} — {p.year}</span></span>
                </span>
                <span className={styles.bottom}>
                  <span className={`display ${styles.title}`}>
                    <span className="line-mask"><span data-t>{p.title}</span></span>
                  </span>
                  <span className={styles.side}>
                    <span className="line-mask"><span data-t className={styles.summary}>{t(p.summary, locale)}</span></span>
                    <span className="line-mask"><span data-t className={`mono ${styles.cta}`}>{dict.view[locale]} →</span></span>
                  </span>
                </span>
              </Link>
              <span className={styles.shade} data-shade />
            </div>
          </article>
        ))}
      </div>

      <div className={styles.archive}>
        <div className={styles.archHead}>
          <span className="mono">{dict.archive[locale]}</span>
          <span className="mono muted">{dict.archiveSub[locale]}</span>
        </div>
        {archive.map((p) => (
          <Link key={p.slug} href={`/${locale}/work/${p.slug}`} className={styles.archRow} data-arch data-title={p.title}>
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
