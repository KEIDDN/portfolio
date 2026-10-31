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
}: {
  src: string;
  poster?: string;
  alt?: string;
  ratio?: number;
  grain?: boolean;
  className?: string;
  priority?: boolean;
}) {
  const r = ratio ?? (isVideo(src) ? ratioOf(poster ?? "", 16 / 10) : ratioOf(src));
  const v = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const el = v.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => (e.isIntersecting ? el.play().catch(() => {}) : el.pause()), {
      rootMargin: "10%",
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <div className={`${styles.media} ${grain ? "img-grain" : ""} ${className}`} style={{ aspectRatio: r }}>
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
