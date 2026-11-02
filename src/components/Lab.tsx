"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { dict, t, type Locale } from "@/content/i18n";
import { series, wall, type Series } from "@/content/lab";
import { ratioOf } from "./Media";
import ChapterHead from "./ChapterHead";
import LabViewer from "./LabViewer";
import styles from "./Lab.module.css";

const bySlug = (s: string) => series.find((x) => x.slug === s)!;

export default function Lab({ locale }: { locale: Locale }) {
  const root = useRef<HTMLElement>(null);
  const view = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLDivElement>(null);
  const preview = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState<Series | null>(null);
  const [hover, setHover] = useState<string | null>(null);

  // draggable wall with inertia + pointer depth (desktop only)
  useEffect(() => {
    const vp = view.current!;
    const cv = canvas.current!;
    if (window.matchMedia("(max-width: 800px)").matches) return;

    const pos = { x: 0, y: 0 };
    const bounds = () => ({
      minX: vp.clientWidth - cv.offsetWidth,
      minY: vp.clientHeight - cv.offsetHeight,
    });
    const center = () => {
      const b = bounds();
      pos.x = b.minX / 2;
      pos.y = 0;
      gsap.set(cv, { x: pos.x, y: pos.y });
    };
    center();
    const toX = gsap.quickTo(cv, "x", { duration: 0.9, ease: "power3.out" });
    const toY = gsap.quickTo(cv, "y", { duration: 0.9, ease: "power3.out" });
    const items = Array.from(cv.querySelectorAll<HTMLElement>("[data-d]")).map((el) => ({
      d: parseFloat(el.dataset.d!),
      x: gsap.quickTo(el, "x", { duration: 1.4, ease: "power3.out" }),
      y: gsap.quickTo(el, "y", { duration: 1.4, ease: "power3.out" }),
    }));

    let down = false;
    let moved = 0;
    let sx = 0, sy = 0, ox = 0, oy = 0, lx = 0, ly = 0, vx = 0, vy = 0, lt = 0;
    const clamp = (v: number, min: number) => Math.min(0, Math.max(min, v));
    const onDown = (e: PointerEvent) => {
      down = true;
      moved = 0;
      sx = lx = e.clientX;
      sy = ly = e.clientY;
      ox = pos.x;
      oy = pos.y;
      lt = performance.now();
      vp.classList.add(styles.grabbing);
    };
    const onMove = (e: PointerEvent) => {
      const r = vp.getBoundingClientRect();
      const mx = (e.clientX - r.left) / r.width - 0.5;
      const my = (e.clientY - r.top) / r.height - 0.5;
      items.forEach((it) => {
        it.x(-mx * it.d * 22);
        it.y(-my * it.d * 22);
      });
      if (!down) return;
      const now = performance.now();
      const dt = Math.max(1, now - lt);
      vx = (e.clientX - lx) / dt;
      vy = (e.clientY - ly) / dt;
      lx = e.clientX;
      ly = e.clientY;
      lt = now;
      moved = Math.max(moved, Math.hypot(e.clientX - sx, e.clientY - sy));
      const b = bounds();
      pos.x = clamp(ox + e.clientX - sx, b.minX);
      pos.y = clamp(oy + e.clientY - sy, b.minY);
      toX(pos.x);
      toY(pos.y);
    };
    const onUp = () => {
      if (!down) return;
      down = false;
      vp.classList.remove(styles.grabbing);
      const b = bounds();
      pos.x = clamp(pos.x + vx * 260, b.minX);
      pos.y = clamp(pos.y + vy * 260, b.minY);
      toX(pos.x);
      toY(pos.y);
    };
    const onClick = (e: MouseEvent) => {
      if (moved > 6) {
        e.preventDefault();
        e.stopPropagation();
      }
    };
    vp.addEventListener("pointerdown", onDown);
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    vp.addEventListener("click", onClick, true);
    window.addEventListener("resize", center);
    return () => {
      vp.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      vp.removeEventListener("click", onClick, true);
      window.removeEventListener("resize", center);
    };
  }, []);

  // entrances
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from("[data-piece]", {
        opacity: 0,
        scale: 0.9,
        duration: 1.6,
        ease: "expo.out",
        stagger: { each: 0.05, from: "center" },
        scrollTrigger: { trigger: view.current, start: "top 75%" },
      });
      gsap.from("[data-srow]", { opacity: 0, y: 30, duration: 1.2, ease: "expo.out", stagger: 0.05, scrollTrigger: { trigger: "[data-list]", start: "top 85%" } });
    }, root);
    return () => ctx.revert();
  }, []);

  // list preview follows the cursor
  useEffect(() => {
    const el = preview.current!;
    const x = gsap.quickTo(el, "x", { duration: 0.7, ease: "power3.out" });
    const y = gsap.quickTo(el, "y", { duration: 0.7, ease: "power3.out" });
    const move = (e: PointerEvent) => {
      x(e.clientX + 24);
      y(e.clientY - 120);
    };
    window.addEventListener("pointermove", move);
    return () => window.removeEventListener("pointermove", move);
  }, []);

  return (
    <section ref={root} id="lab" className={styles.section}>
      <ChapterHead n="03" kicker={dict.ch3[locale]} title={dict.labTitle[locale]} sub={dict.labSub[locale]} />

      <div ref={view} className={styles.view}>
        <div ref={canvas} className={styles.canvas}>
          {wall.map((p, i) => (
            <button
              key={i}
              type="button"
              className={`${styles.piece} ${p.cut ? styles.cut : ""}`}
              style={{ left: `${p.x}%`, top: `${p.y}%`, width: `${p.w}%` }}
              data-d={p.d}
              data-piece
              onClick={() => setOpen(bySlug(p.s))}
            >
              <span className={p.cut ? "" : "img-grain"} style={{ aspectRatio: ratioOf(p.src) }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={p.src} alt={bySlug(p.s).title} draggable={false} loading="lazy" />
              </span>
              <span className={`mono ${styles.cap}`}>{bySlug(p.s).title}</span>
            </button>
          ))}
        </div>
        <span className={`mono ${styles.hint}`}>{dict.labDrag[locale]}</span>
      </div>

      <div className={styles.list} data-list>
        <div className={styles.listHead}>
          <span className="mono">{dict.labSeries[locale]}</span>
          <span className="mono muted">{series.length}</span>
        </div>
        {series.map((s, i) => (
          <button
            key={s.slug}
            type="button"
            className={styles.srow}
            data-srow
            onClick={() => setOpen(s)}
            onPointerEnter={() => setHover(s.images[0])}
            onPointerLeave={() => setHover(null)}
          >
            <span className="mono muted">{String(i + 1).padStart(2, "0")}</span>
            <span className={`display ${styles.stitle}`}>{s.title}</span>
            <span className="mono muted">{t(s.kind, locale)}</span>
            <span className="mono muted">{s.year}</span>
          </button>
        ))}
      </div>

      <div ref={preview} className={`${styles.preview} ${hover ? styles.previewOn : ""}`} aria-hidden>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        {hover && <img src={hover} alt="" />}
      </div>

      {open && <LabViewer s={open} locale={locale} onClose={() => setOpen(null)} />}
    </section>
  );
}
