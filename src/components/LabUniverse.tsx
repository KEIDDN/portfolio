"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import gsap from "gsap";
import { t, type Locale } from "@/content/i18n";
import { labIntro, series } from "@/content/lab";
import { ratioOf } from "./Media";
import { useLenis } from "./SmoothScroll";
import LabRoom from "./LabRoom";
import styles from "./LabUniverse.module.css";

/**
 * The Lab as a universe: every series is a constellation of its pieces.
 * Wheel/pinch contracts and expands it, drag moves through it, a click flies
 * the camera to a constellation and opens its room.
 */

// constellation centres, in world px (origin = centre of the universe)
const CENTRES: [number, number][] = [
  [-2350, -1500], // botón charro
  [-800, -1700], // miki racing
  [750, -1450], // inhabit
  [2300, -1650], // ipod
  [-1650, -300], // tutto passa
  [0, -150], // any kind of blues
  [1600, -350], // miki
  [-2400, 950], // film posters
  [-850, 1050], // fruy2k
  [700, 900], // jpn drift
  [2350, 1000], // keiddn
  [-1600, 2150], // ascii
  [0, 2250], // ceramics
  [1650, 2100], // objects
];
const STAR = 520; // width of the main piece
const SAT = 300; // width of the satellites
const WORLD = { w: 6400, h: 5200 };

const isCut = (src: string) => src.includes("/cutouts/");

type Piece = {
  src: string;
  x: number;
  y: number;
  w: number;
  d: number;
  star: boolean;
};
type Cluster = {
  i: number;
  cx: number;
  cy: number;
  pieces: Piece[];
  box: { x0: number; y0: number; x1: number; y1: number };
};

function build(): Cluster[] {
  return series.map((s, i) => {
    const [cx, cy] = CENTRES[i];
    const pieces: Piece[] = s.orbit.map((src, k) => {
      const r = ratioOf(src, 1);
      if (k === 0) {
        const w = isCut(src) ? STAR * 0.8 : r < 0.9 ? STAR * 0.82 : STAR;
        return { src, x: -w / 2, y: -w / r / 2, w, d: 0.5, star: true };
      }
      // satellites sit around the star at fixed, hand-feeling angles
      const a = (-0.35 + (k - 1) * 2.15 + i * 0.7) % (Math.PI * 2);
      const w = isCut(src) ? SAT * 0.85 : r < 0.9 ? SAT * 0.85 : SAT;
      const rad = STAR * 0.78 + w * 0.35;
      const x = Math.cos(a) * rad - w / 2;
      const y = Math.sin(a) * rad * 0.82 - w / r / 2;
      return { src, x, y, w, d: 0.9 + k * 0.25, star: false };
    });
    const xs = pieces.flatMap((p) => [p.x, p.x + p.w]);
    const ys = pieces.flatMap((p) => [p.y, p.y + p.w / ratioOf(p.src, 1)]);
    return {
      i,
      cx,
      cy,
      pieces,
      box: {
        x0: Math.min(...xs),
        y0: Math.min(...ys),
        x1: Math.max(...xs),
        y1: Math.max(...ys) + 140,
      },
    };
  });
}

export default function LabUniverse({ locale }: { locale: Locale }) {
  const root = useRef<HTMLDivElement>(null);
  const world = useRef<HTMLDivElement>(null);
  const clusters = useMemo(build, []);
  const [hover, setHover] = useState<number | null>(null);
  const [focus, setFocus] = useState<number | null>(null);
  const [room, setRoom] = useState<number | null>(null);
  const zbar = useRef<HTMLSpanElement>(null);
  const cam = useRef({ x: 0, y: 0, z: 0.3 });
  const api = useRef<{
    fly: (x: number, y: number, z: number, d?: number) => Promise<void>;
    fit: () => number;
  } | null>(null);
  const lenis = useLenis();

  // the page is the universe: no document scroll, presenter keys off
  useEffect(() => {
    lenis?.stop();
    const html = document.documentElement;
    html.style.overflow = "hidden";
    html.dataset.modal = "1";
    document.body.style.background = "var(--cream)";
    return () => {
      lenis?.start();
      html.style.overflow = "";
      delete html.dataset.modal;
      document.body.style.background = "";
    };
  }, [lenis]);

  useEffect(() => {
    const vp = root.current!;
    const wd = world.current!;
    const c = cam.current;
    const fit = () =>
      Math.min(vp.clientWidth / WORLD.w, (vp.clientHeight - 150) / WORLD.h) *
      1.08;
    let minZ = fit() * 0.75;
    const maxZ = 1.5;
    const apply = () => {
      wd.style.transform = `translate3d(${vp.clientWidth / 2 - c.x * c.z}px, ${vp.clientHeight / 2 - c.y * c.z}px, 0) scale(${c.z})`;
      if (zbar.current)
        zbar.current.style.transform = `scaleX(${Math.max(0.02, (c.z - minZ) / (maxZ - minZ))})`;
    };
    const clampCam = () => {
      c.z = Math.min(maxZ, Math.max(minZ, c.z));
      c.x = Math.min(WORLD.w / 2, Math.max(-WORLD.w / 2, c.x));
      c.y = Math.min(WORLD.h / 2, Math.max(-WORLD.h / 2, c.y));
    };
    let tween: gsap.core.Tween | null = null;
    const fly = (x: number, y: number, z: number, d = 1.4) =>
      new Promise<void>((res) => {
        tween?.kill();
        tween = gsap.to(c, {
          x,
          y,
          z,
          duration: d,
          ease: "expo.inOut",
          onUpdate: apply,
          onComplete: () => res(),
        });
      });
    api.current = { fly, fit };

    // big bang: the universe expands out of a single point
    c.z = fit() * 0.12;
    c.x = 0;
    c.y = 0;
    apply();
    gsap.to(c, {
      z: fit(),
      duration: 3,
      ease: "power4.out",
      delay: 0.15,
      onUpdate: apply,
    });
    const els = Array.from(wd.querySelectorAll<HTMLElement>("[data-piece]"));
    gsap.fromTo(
      els,
      {
        x: (i, el) => -parseFloat(el.dataset.ox!) * 0.9,
        y: (i, el) => -parseFloat(el.dataset.oy!) * 0.9,
        scale: 0.5,
        opacity: 0,
      },
      {
        x: 0,
        y: 0,
        scale: 1,
        opacity: 1,
        duration: 2.8,
        ease: "power4.out",
        stagger: { each: 0.03, from: "center" },
        delay: 0.1,
      },
    );
    gsap.from(vp.querySelectorAll("[data-hud]"), {
      opacity: 0,
      y: 16,
      duration: 1.2,
      ease: "expo.out",
      stagger: 0.06,
      delay: 1.1,
    });

    // drag with inertia
    let down = false;
    let moved = 0;
    let lx = 0,
      ly = 0,
      vx = 0,
      vy = 0,
      lt = 0;
    const onDown = (e: PointerEvent) => {
      if ((e.target as HTMLElement).closest("[data-ui]")) return;
      down = true;
      moved = 0;
      lx = e.clientX;
      ly = e.clientY;
      lt = performance.now();
      vx = vy = 0;
      tween?.kill();
      vp.classList.add(styles.grabbing);
    };
    const parallax = Array.from(
      wd.querySelectorAll<HTMLElement>("[data-d]"),
    ).map((el) => ({
      d: parseFloat(el.dataset.d!),
      x: gsap.quickTo(el, "x", { duration: 1.6, ease: "power3.out" }),
      y: gsap.quickTo(el, "y", { duration: 1.6, ease: "power3.out" }),
    }));
    const onMove = (e: PointerEvent) => {
      const mx = e.clientX / vp.clientWidth - 0.5;
      const my = e.clientY / vp.clientHeight - 0.5;
      parallax.forEach((p) => {
        p.x(-mx * p.d * 40);
        p.y(-my * p.d * 40);
      });
      if (!down) return;
      const now = performance.now();
      const dx = e.clientX - lx;
      const dy = e.clientY - ly;
      const dt = Math.max(1, now - lt);
      vx = dx / dt;
      vy = dy / dt;
      lx = e.clientX;
      ly = e.clientY;
      lt = now;
      moved += Math.abs(dx) + Math.abs(dy);
      c.x -= dx / c.z;
      c.y -= dy / c.z;
      clampCam();
      apply();
    };
    const onUp = () => {
      if (!down) return;
      down = false;
      vp.classList.remove(styles.grabbing);
      const tx = c.x - (vx * 320) / c.z;
      const ty = c.y - (vy * 320) / c.z;
      tween = gsap.to(c, {
        x: Math.min(WORLD.w / 2, Math.max(-WORLD.w / 2, tx)),
        y: Math.min(WORLD.h / 2, Math.max(-WORLD.h / 2, ty)),
        duration: 1.1,
        ease: "power3.out",
        onUpdate: apply,
      });
    };
    const onClick = (e: MouseEvent) => {
      if (moved > 8) {
        e.preventDefault();
        e.stopPropagation();
      }
    };
    // wheel / pinch: zoom around the pointer
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      tween?.kill();
      const k = Math.exp(-e.deltaY * (e.ctrlKey ? 0.01 : 0.0016));
      const px = (e.clientX - vp.clientWidth / 2) / c.z + c.x;
      const py = (e.clientY - vp.clientHeight / 2) / c.z + c.y;
      const z = Math.min(maxZ, Math.max(minZ, c.z * k));
      c.x = px - (e.clientX - vp.clientWidth / 2) / z;
      c.y = py - (e.clientY - vp.clientHeight / 2) / z;
      c.z = z;
      clampCam();
      apply();
    };
    // a living universe: every piece floats a little
    const floaters = Array.from(
      wd.querySelectorAll<HTMLElement>("[data-float]"),
    ).map((el, i) => ({ el, a: i * 1.7, s: 0.5 + (i % 5) * 0.12 }));
    const tick = (time: number) => {
      floaters.forEach((f) => {
        f.el.style.transform = `translate3d(${Math.sin(time * f.s * 0.6 + f.a) * 7}px, ${Math.cos(time * f.s * 0.5 + f.a) * 9}px, 0)`;
      });
    };
    gsap.ticker.add(tick);
    const onResize = () => {
      minZ = fit() * 0.75;
      clampCam();
      apply();
    };

    vp.addEventListener("pointerdown", onDown);
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    vp.addEventListener("click", onClick, true);
    vp.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("resize", onResize);
    return () => {
      tween?.kill();
      gsap.ticker.remove(tick);
      vp.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      vp.removeEventListener("click", onClick, true);
      vp.removeEventListener("wheel", onWheel);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  const frame = useCallback(
    (i: number) => {
      const vp = root.current!;
      const cl = clusters[i];
      const bw = cl.box.x1 - cl.box.x0;
      const bh = cl.box.y1 - cl.box.y0;
      const z = Math.min(
        (vp.clientWidth * 0.62) / bw,
        (vp.clientHeight * 0.7) / bh,
        1.2,
      );
      return {
        x: cl.cx + (cl.box.x0 + cl.box.x1) / 2,
        y: cl.cy + (cl.box.y0 + cl.box.y1) / 2,
        z,
      };
    },
    [clusters],
  );

  const from = useRef<{ rect: DOMRect; src: string } | null>(null);
  const enter = useCallback(
    async (i: number, el?: HTMLElement | null) => {
      setFocus(i);
      const f = frame(i);
      await api.current?.fly(f.x, f.y, f.z * 1.25, 1.3);
      // the piece you clicked (or the constellation's star) flies into the room
      const img = el?.querySelector("img") ?? root.current!.querySelector<HTMLImageElement>(`[data-cl="${i}"] [data-star] img`);
      from.current = img ? { rect: img.getBoundingClientRect(), src: img.currentSrc || img.src } : null;
      setRoom(i);
    },
    [frame],
  );
  const flyTo = useCallback(
    (i: number) => {
      setFocus(i);
      const f = frame(i);
      api.current?.fly(f.x, f.y, f.z);
    },
    [frame],
  );
  const overview = useCallback(() => {
    setFocus(null);
    api.current && api.current.fly(0, 0, api.current.fit(), 1.4);
  }, []);
  const zoomBy = (k: number) => {
    const c = cam.current;
    api.current?.fly(c.x, c.y, Math.min(1.5, Math.max(0.05, c.z * k)), 0.8);
  };

  // keys: ← → travel between constellations, Enter opens, Esc steps back out
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (room !== null) return;
      const n = series.length;
      if (["ArrowRight", "ArrowDown", "PageDown", " "].includes(e.key)) {
        e.preventDefault();
        flyTo(focus === null ? 0 : (focus + 1) % n);
      } else if (["ArrowLeft", "ArrowUp", "PageUp"].includes(e.key)) {
        e.preventDefault();
        flyTo(focus === null ? n - 1 : (focus - 1 + n) % n);
      } else if (e.key === "Enter" && focus !== null) {
        enter(focus);
      } else if (e.key === "Escape") {
        overview();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [focus, room, flyTo, enter, overview]);

  const lit = hover ?? focus;

  return (
    <div ref={root} className={styles.universe}>
      <div ref={world} className={styles.world}>
        {clusters.map((cl) => {
          const s = series[cl.i];
          return (
            <div
              key={s.slug}
              className={`${styles.cluster} ${lit !== null && lit !== cl.i ? styles.dim : ""} ${lit === cl.i ? styles.lit : ""}`}
              data-cl={cl.i}
              style={{ left: cl.cx, top: cl.cy }}
              onPointerEnter={() => setHover(cl.i)}
              onPointerLeave={() => setHover(null)}
            >
              <svg className={styles.lines} aria-hidden>
                {cl.pieces.slice(1).map((p, k) => {
                  const a = cl.pieces[0];
                  const ax = a.x + a.w / 2, ay = a.y + a.w / ratioOf(a.src, 1) / 2;
                  const bx = p.x + p.w / 2, by = p.y + p.w / ratioOf(p.src, 1) / 2;
                  return (
                    <g key={k}>
                      <line x1={ax} y1={ay} x2={bx} y2={by} pathLength={1} style={{ transitionDelay: `${k * 0.12}s` }} />
                      <circle cx={bx} cy={by} r={5} />
                    </g>
                  );
                })}
              </svg>
              {cl.pieces.map((p) => (
                <button
                  key={p.src}
                  type="button"
                  className={styles.piece}
                  style={{ left: p.x, top: p.y, width: p.w }}
                  data-piece
                  data-star={p.star ? "" : undefined}
                  data-ox={p.x + p.w / 2 + cl.cx}
                  data-oy={p.y + cl.cy}
                  data-cursor={locale === "en" ? "View" : "Ver"}
                  onClick={(e) => enter(cl.i, e.currentTarget)}
                  aria-label={s.title}
                >
                  <span data-d={p.d} className={styles.depth}>
                    <span
                      data-float
                      className={`${styles.img} ${isCut(p.src) ? styles.cut : "img-grain"}`}
                      style={{ aspectRatio: ratioOf(p.src, 1) }}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={p.src}
                        alt=""
                        draggable={false}
                        loading={cl.i < 5 ? "eager" : "lazy"}
                      />
                    </span>
                  </span>
                </button>
              ))}
              <div className={styles.tag} style={{ top: cl.box.y1 - 100 }}>
                <span className={styles.tagN}>
                  {String(cl.i + 1).padStart(2, "0")}
                </span>
                <span className={styles.tagTitle}>{s.title}</span>
                <span className={styles.tagKind}>
                  {t(s.kind, locale)}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      <div className={styles.intro} data-hud data-ui>
        <h1 className={`display ${styles.h1}`}>Lab</h1>
        <p className={styles.lead}>{t(labIntro, locale)}</p>
      </div>

      <div className={styles.hint} data-hud>
        <span className="mono">
          {locale === "en"
            ? "Drag to move · Scroll to zoom · Click to enter"
            : "Arrastra para moverte · Rueda para acercar · Clic para entrar"}
        </span>
      </div>

      <div className={styles.fade} aria-hidden />
      <nav className={styles.index} data-hud data-ui aria-label="Series">
        {series.map((s, i) => (
          <button
            key={s.slug}
            type="button"
            className={`${styles.ix} ${lit === i ? styles.ixOn : ""}`}
            onPointerEnter={() => setHover(i)}
            onPointerLeave={() => setHover(null)}
            onClick={() => enter(i)}
          >
            <span className="mono">{String(i + 1).padStart(2, "0")}</span>
            <span>{s.title}</span>
          </button>
        ))}
      </nav>

      <div className={styles.zoom} data-hud data-ui>
        <button
          type="button"
          className="mono"
          onClick={() => zoomBy(1 / 1.5)}
          aria-label="Zoom out"
        >
          −
        </button>
        <span className={styles.zbar}>
          <span ref={zbar} />
        </span>
        <button
          type="button"
          className="mono"
          onClick={() => zoomBy(1.5)}
          aria-label="Zoom in"
        >
          +
        </button>
        <button
          type="button"
          className={`mono ${styles.all}`}
          onClick={overview}
        >
          {locale === "en" ? "See all" : "Ver todo"}
        </button>
      </div>

      {room !== null &&
        createPortal(
          <LabRoom
            key={room}
            index={room}
            locale={locale}
            from={from.current}
            onClose={() => {
              setRoom(null);
              const f = frame(room);
              api.current?.fly(f.x, f.y, f.z, 1.1);
            }}
            onGo={(i) => {
              from.current = null;
              setRoom(i);
              setFocus(i);
              const f = frame(i);
              api.current?.fly(f.x, f.y, f.z * 1.25, 0.01);
            }}
          />,
          document.body,
        )}
    </div>
  );
}
