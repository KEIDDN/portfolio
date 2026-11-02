"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { dict, t, type Locale } from "@/content/i18n";
import { series } from "@/content/lab";
import styles from "./LabRoom.module.css";

const L = {
  origin: { en: "Origin", es: "Origen" },
  experiment: { en: "Experiment", es: "Experimento" },
  format: { en: "Format", es: "Formato" },
  next: { en: "Next series", es: "Siguiente serie" },
};

/**
 * A series as a museum room: the label on the left, the pieces hung in a row.
 * Wheel, drag, the side zones or ← → walk along the wall. Pieces are shown
 * whole and never larger than their real size.
 */
export default function LabRoom({
  index,
  locale,
  onClose,
  onGo,
}: {
  index: number;
  locale: Locale;
  onClose: () => void;
  onGo: (i: number) => void;
}) {
  const s = series[index];
  const n = s.images.length;
  const root = useRef<HTMLDivElement>(null);
  const area = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const [i, setI] = useState(0);
  const bar = useRef<HTMLSpanElement>(null);
  const step = useRef<(d: number) => void>(() => {});

  const close = () =>
    gsap.to(root.current, { clipPath: "inset(0 0 100% 0)", duration: 0.8, ease: "expo.inOut", onComplete: onClose });

  useEffect(() => {
    const el = root.current!;
    const ar = area.current!;
    const tr = track.current!;
    gsap.fromTo(el, { clipPath: "inset(100% 0 0 0)" }, { clipPath: "inset(0% 0 0 0)", duration: 1, ease: "expo.inOut" });
    gsap.from(el.querySelectorAll("[data-c]"), { y: 30, opacity: 0, duration: 1.2, ease: "expo.out", stagger: 0.06, delay: 0.5 });
    gsap.from(tr.children, { x: 220, opacity: 0, duration: 1.6, ease: "expo.out", stagger: 0.08, delay: 0.45 });

    const pos = { x: 0 };
    let target = 0;
    const max = () => Math.max(0, tr.scrollWidth - ar.clientWidth);
    const centres = () =>
      Array.from(tr.children as HTMLCollectionOf<HTMLElement>).map((c) =>
        Math.min(max(), Math.max(0, c.offsetLeft + c.offsetWidth / 2 - ar.clientWidth / 2)),
      );
    const current = () => {
      const cs = centres();
      let best = 0;
      cs.forEach((v, k) => Math.abs(v - pos.x) < Math.abs(cs[best] - pos.x) && (best = k));
      return best;
    };
    const tick = () => {
      pos.x += (target - pos.x) * 0.1;
      tr.style.transform = `translate3d(${-pos.x}px, 0, 0)`;
      const m = max();
      if (bar.current) bar.current.style.transform = `scaleX(${n > 1 && m ? Math.max(0.02, pos.x / m) : 1})`;
      const c = current();
      setI((p) => (p === c ? p : c));
    };
    gsap.ticker.add(tick);
    step.current = (d: number) => {
      const cs = centres();
      const k = Math.max(0, Math.min(cs.length - 1, current() + d));
      target = cs[k];
    };

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      target = Math.max(0, Math.min(max(), target + (Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY)));
    };
    let down = false;
    let sx = 0;
    let ox = 0;
    let moved = 0;
    const onDown = (e: PointerEvent) => {
      down = true;
      sx = e.clientX;
      ox = target;
      moved = 0;
    };
    const onMove = (e: PointerEvent) => {
      if (!down) return;
      moved = Math.abs(e.clientX - sx);
      target = Math.max(0, Math.min(max(), ox - (e.clientX - sx) * 1.4));
    };
    const onUp = () => (down = false);
    const onClick = (e: MouseEvent) => {
      if (moved > 6) {
        e.preventDefault();
        e.stopPropagation();
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      else if (["ArrowRight", "ArrowDown", "PageDown", " "].includes(e.key)) {
        e.preventDefault();
        e.stopImmediatePropagation();
        step.current(1);
      } else if (["ArrowLeft", "ArrowUp", "PageUp"].includes(e.key)) {
        e.preventDefault();
        e.stopImmediatePropagation();
        step.current(-1);
      }
    };
    ar.addEventListener("wheel", onWheel, { passive: false });
    ar.addEventListener("pointerdown", onDown);
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    ar.addEventListener("click", onClick, true);
    window.addEventListener("keydown", onKey, true);
    return () => {
      gsap.ticker.remove(tick);
      ar.removeEventListener("wheel", onWheel);
      ar.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      ar.removeEventListener("click", onClick, true);
      window.removeEventListener("keydown", onKey, true);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const nextIdx = (index + 1) % series.length;

  return (
    <div ref={root} className={styles.room} role="dialog" aria-label={s.title}>
      <header className={styles.head}>
        <span className="mono">Lab — {String(index + 1).padStart(2, "0")} / {String(series.length).padStart(2, "0")}</span>
        <button type="button" className="mono ulink" onClick={close}>{dict.close[locale]} ✕</button>
      </header>

      <aside className={styles.label}>
        <h2 data-c className={`display ${styles.title}`}>{s.title}</h2>
        <span data-c className="mono muted">{t(s.kind, locale)} — {s.year}</span>
        <dl className={styles.dl}>
          {(["origin", "experiment", "format"] as const).map((k) => (
            <div key={k} data-c className={styles.row}>
              <dt className="mono muted">{t(L[k], locale)}</dt>
              <dd>{t(s[k], locale)}</dd>
            </div>
          ))}
        </dl>
        <button data-c type="button" className={styles.next} onClick={() => onGo(nextIdx)}>
          <span className="mono muted">{t(L.next, locale)}</span>
          <span className={styles.nextTitle}>{series[nextIdx].title} →</span>
        </button>
      </aside>

      <div ref={area} className={styles.area}>
        <div ref={track} className={styles.track}>
          {s.images.map((src, k) => (
            <figure key={src} className={styles.fig}>
              <div className={src.includes("/cutouts/") ? styles.cut : "img-grain"}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={src} alt={`${s.title} — ${k + 1}`} draggable={false} />
              </div>
              <figcaption className="mono muted">
                {String(k + 1).padStart(2, "0")} / {String(n).padStart(2, "0")}
              </figcaption>
            </figure>
          ))}
        </div>
        {n > 1 && (
          <>
            <button type="button" className={`${styles.zone} ${styles.zl}`} data-cursor="←" aria-label="Previous" onClick={() => step.current(-1)} disabled={i === 0} />
            <button type="button" className={`${styles.zone} ${styles.zr}`} data-cursor="→" aria-label="Next" onClick={() => step.current(1)} disabled={i === n - 1} />
          </>
        )}
      </div>

      <footer className={styles.foot}>
        <span className="mono">{String(i + 1).padStart(2, "0")} / {String(n).padStart(2, "0")}</span>
        <span className={styles.bar}><span ref={bar} /></span>
        <span className="mono muted">{locale === "en" ? "Scroll or ← →" : "Rueda o ← →"}</span>
      </footer>
    </div>
  );
}
