"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { dict, type Locale } from "@/content/i18n";
import sig from "@/data/signature.json";
import styles from "./Loader.module.css";

export const LOADER_EVENT = "mh:loaded";
export const loaderDone = () =>
  typeof window !== "undefined" && (window as unknown as { __mhLoaded?: boolean }).__mhLoaded === true;

export default function Loader({ locale }: { locale: Locale }) {
  const root = useRef<HTMLDivElement>(null);
  const svg = useRef<SVGSVGElement>(null);
  const [count, setCount] = useState(0);
  const [gone, setGone] = useState(false);

  useEffect(() => {
    const w = window as unknown as { __mhLoaded?: boolean };
    let seen = false;
    try {
      seen = sessionStorage.getItem("mh-loaded") === "1";
    } catch {}
    const finish = () => {
      if (w.__mhLoaded) return;
      w.__mhLoaded = true;
      window.dispatchEvent(new Event(LOADER_EVENT));
      try {
        sessionStorage.setItem("mh-loaded", "1");
      } catch {}
    };
    if (seen) {
      setGone(true);
      finish();
      return;
    }
    document.documentElement.style.overflow = "hidden";
    const el = root.current!;
    const s = svg.current!;
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    s.setAttribute("viewBox", `0 0 ${vw} ${vh}`);

    // place signature centred
    const scale = Math.min((vw * 0.62) / sig.w, (vh * 0.42) / sig.h);
    const ox = (vw - sig.w * scale) / 2;
    const oy = (vh - sig.h * scale) / 2 - vh * 0.04;
    const g = s.querySelector<SVGGElement>("[data-g]")!;
    g.setAttribute("transform", `translate(${ox} ${oy}) scale(${scale})`);

    const strokes = Array.from(s.querySelectorAll<SVGPathElement>("[data-stroke]"));
    const reveals = Array.from(s.querySelectorAll<SVGPathElement>("[data-reveal]"));
    const tail = s.querySelector<SVGPathElement>("[data-tail]")!;

    // tail: continue from the end of the last stroke, sweep off screen
    const last = strokes[strokes.length - 1];
    const end = last.getPointAtLength(last.getTotalLength());
    const ex = ox + end.x * scale;
    const ey = oy + end.y * scale;
    tail.setAttribute(
      "d",
      `M${ex},${ey} C${ex + vw * 0.12},${ey - vh * 0.18} ${ex + vw * 0.02},${vh * 0.95} ${vw * 0.55},${vh * 0.86} S${vw * 0.95},${vh * 0.55} ${vw + 40},${vh * 0.62}`,
    );

    const prep = (p: SVGPathElement) => {
      const L = p.getTotalLength();
      p.style.strokeDasharray = `${L} ${L}`;
      p.style.strokeDashoffset = `${L}`;
      return L;
    };
    const lens = strokes.map(prep);
    reveals.forEach(prep);
    const tailLen = prep(tail);
    const total = lens.reduce((a, b) => a + b, 0);
    g.style.opacity = "1";
    const writeDur = 2.4;

    const state = { v: 0 };
    const tl = gsap.timeline({ delay: 0.25 });
    let t = 0;
    strokes.forEach((p, i) => {
      const d = (lens[i] / total) * writeDur;
      tl.to([p, reveals[i]], { strokeDashoffset: 0, duration: d, ease: "sine.inOut" }, t);
      t += d + 0.04;
    });
    tl.to(s.querySelector("[data-fill]"), { opacity: 1, duration: 0.5, ease: "power2.out" }, t - 0.2)
      .to(strokes, { opacity: 0, duration: 0.5 }, t)
      .to(tail, { strokeDashoffset: 0, duration: 1.1, ease: "power2.inOut" }, t - 0.1)
      .to(state, { v: 100, duration: t + 0.9, ease: "power2.inOut", onUpdate: () => setCount(Math.round(state.v)) }, 0)
      .to(el.querySelector("[data-bar]"), { scaleX: 1, duration: t + 0.9, ease: "power2.inOut" }, 0)
      .to(g, { y: -24, opacity: 0, duration: 0.7, ease: "power2.in" }, t + 0.75)
      .to(el.querySelectorAll("[data-ui]"), { opacity: 0, duration: 0.4 }, t + 0.8)
      .to(el, {
        clipPath: "inset(0 0 100% 0)",
        duration: 1.1,
        ease: "expo.inOut",
        onStart: finish,
        onComplete: () => {
          document.documentElement.style.overflow = "";
          setGone(true);
        },
      }, t + 1.0);
    return () => {
      tl.kill();
      document.documentElement.style.overflow = "";
    };
  }, []);

  if (gone) return null;
  return (
    <div ref={root} className={styles.loader} aria-hidden>
      <svg ref={svg} className={styles.svg} preserveAspectRatio="none">
        <defs>
          <mask id="sig-mask" maskUnits="userSpaceOnUse">
            {sig.strokes.map((d, i) => (
              <path key={i} data-reveal d={d} fill="none" stroke="#fff" strokeWidth={26} strokeLinecap="round" strokeLinejoin="round" />
            ))}
          </mask>
        </defs>
        <g data-g style={{ opacity: 0 }}>
          <path d={sig.glyph} fill="#efefed" mask="url(#sig-mask)" />
          <path data-fill d={sig.glyph} fill="#efefed" opacity={0} />
          {sig.strokes.map((d, i) => (
            <path key={i} data-stroke d={d} fill="none" stroke="#c4161c" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" />
          ))}
        </g>
        <path data-tail fill="none" stroke="#c4161c" strokeWidth={2} strokeLinecap="round" />
      </svg>
      <div className={styles.foot} data-ui>
        <span className="mono">Miki Herrero — Portfolio ©2026</span>
        <span className="mono">{dict.loading[locale]}</span>
        <span className={styles.count}>{String(count).padStart(3, "0")}</span>
      </div>
      <div className={styles.bar} data-ui>
        <span data-bar />
      </div>
    </div>
  );
}
