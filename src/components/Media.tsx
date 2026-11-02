"use client";

import { useEffect, useRef, useState } from "react";
import ratios from "@/data/media.json";
import styles from "./Media.module.css";

const R = ratios as Record<string, number>;
export const ratioOf = (src: string, fallback = 16 / 10) => R[src] ?? fallback;
const isVideo = (s: string) => /\.(mp4|webm)$/i.test(s);

export function Media({
  src,
  poster,
  alt = "",
  ratio,
  grain = true,
  className = "",
  priority = false,
  sound,
}: {
  src: string;
  poster?: string;
  alt?: string;
  ratio?: number;
  grain?: boolean;
  className?: string;
  priority?: boolean;
  sound?: { on: string; off: string };
}) {
  const r = ratio ?? (isVideo(src) ? ratioOf(poster ?? "", 16 / 10) : ratioOf(src));
  const v = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const el = v.current;
    if (!el) return;
    // buffer well before it arrives, play only while it's on screen
    const near = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && el.preload !== "auto") el.preload = "auto";
    }, { rootMargin: "150% 0px" });
    const io = new IntersectionObserver(([e]) => (e.isIntersecting ? el.play().catch(() => {}) : el.pause()), {
      threshold: 0.15,
    });
    near.observe(el);
    io.observe(el);
    return () => {
      near.disconnect();
      io.disconnect();
    };
  }, []);
  const [muted, setMuted] = useState(true);
  useEffect(() => {
    // only one video speaks at a time
    const other = (e: Event) => {
      if ((e as CustomEvent).detail !== v.current && v.current) {
        v.current.muted = true;
        setMuted(true);
      }
    };
    window.addEventListener("mh:sound", other);
    return () => window.removeEventListener("mh:sound", other);
  }, []);
  const toggle = () => {
    const el = v.current;
    if (!el) return;
    el.muted = !el.muted;
    setMuted(el.muted);
    if (!el.muted) {
      window.dispatchEvent(new CustomEvent("mh:sound", { detail: el }));
      el.play().catch(() => {});
    }
  };
  return (
    <div className={`${styles.media} ${grain ? "img-grain" : ""} ${className}`} style={{ aspectRatio: r }}>
      {sound && isVideo(src) && (
        <button type="button" className={`mono ${styles.sound} ${muted ? "" : styles.soundOn}`} onClick={toggle}>
          <span className={styles.eq} aria-hidden><i /><i /><i /></span>
          {muted ? sound.on : sound.off}
        </button>
      )}
      {isVideo(src) ? (
        <video ref={v} src={src} poster={poster} muted loop playsInline preload="metadata" />
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt={alt} loading={priority ? "eager" : "lazy"} />
      )}
    </div>
  );
}

/** Justified row: every item keeps its full image, all share the same height. */
export function Row({ srcs, alt }: { srcs: string[]; alt: string }) {
  return (
    <div className={styles.row}>
      {srcs.map((s) => (
        <div key={s} style={{ flex: `${ratioOf(s)} 1 0` }}>
          <Media src={s} alt={alt} />
        </div>
      ))}
    </div>
  );
}

export function Browser({ src, poster, url }: { src: string; poster?: string; url: string }) {
  return (
    <div className={styles.browser}>
      <div className={styles.bar}>
        <span className={styles.dots}>
          <i />
          <i />
          <i />
        </span>
        <span className={styles.url}>{url.replace(/^https?:\/\//, "").replace(/\/$/, "")}</span>
        <span />
      </div>
      <Media src={src} poster={poster} grain={false} />
    </div>
  );
}

export function Phone({ src, poster }: { src: string; poster?: string }) {
  return (
    <div className={styles.phone}>
      <div className={styles.screen}>
        <Media src={src} poster={poster} grain={false} ratio={390 / 844} />
      </div>
    </div>
  );
}

export function Embed({
  url,
  title,
  note,
  blocked,
  mobile,
  cta,
}: {
  url: string;
  title: string;
  note: string;
  blocked?: boolean;
  mobile?: boolean;
  cta: string;
}) {
  const [on, setOn] = useState(false);
  return (
    <div className={`${styles.embed} ${mobile ? styles.embedMobile : ""}`}>
      <div className={styles.bar}>
        <span className={styles.dots}>
          <i />
          <i />
          <i />
        </span>
        <span className={styles.url}>{url.replace(/^https?:\/\//, "").replace(/\/$/, "")}</span>
        <a href={url} target="_blank" rel="noreferrer" className="mono">↗</a>
      </div>
      <div className={styles.frame}>
        {on && !blocked ? (
          <iframe src={url} title={title} allow="autoplay; fullscreen; gamepad; accelerometer" />
        ) : (
          <button
            className={styles.play}
            onClick={() => (blocked ? window.open(url, "_blank", "noopener") : setOn(true))}
          >
            <span className={styles.playIcon}>▶</span>
            <span className="display">{cta}</span>
            <span className="mono muted">{note}</span>
          </button>
        )}
      </div>
    </div>
  );
}
