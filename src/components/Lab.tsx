"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { dict, type Locale } from "@/content/i18n";
import styles from "./Lab.module.css";

const items = [
  { src: "/work/posters/01.webp", href: "posters", cap: "The Batman", speed: -0.1, cls: "a" },
  { src: "/work/cutouts/seal.webp", href: "3d-experiments", cap: "Wax seal — miki", speed: 0.2, cls: "b", obj: true },
  { src: "/work/posters/04.webp", href: "posters", cap: "Whiplash", speed: -0.05, cls: "c" },
  { src: "/work/cutouts/keychain.webp", href: "3d-experiments", cap: "Chrome keychain", speed: 0.28, cls: "d", obj: true },
  { src: "/work/posters/05.webp", href: "posters", cap: "Animal Series", speed: -0.12, cls: "e" },
  { src: "/work/cutouts/vulture.webp", href: "3d-experiments", cap: "Vulture", speed: 0.16, cls: "f", obj: true },
  { src: "/work/posters/02.webp", href: "posters", cap: "Trainspotting", speed: 0.12, cls: "g" },
  { src: "/work/cutouts/charro.webp", href: "3d-experiments", cap: "Charro button — silver", speed: 0.22, cls: "j", obj: true },
  { src: "/work/posters/03.webp", href: "posters", cap: "Ghost in the Shell", speed: -0.08, cls: "h" },
  { src: "/work/cutouts/pendant.webp", href: "3d-experiments", cap: "Rosette pendant", speed: 0.3, cls: "i", obj: true },
];

export default function Lab({ locale }: { locale: Locale }) {
  const root = useRef<HTMLElement>(null);
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>("[data-speed]").forEach((el) => {
        const s = window.innerWidth < 800 ? 0 : parseFloat(el.dataset.speed!);
        gsap.fromTo(
          el,
          { y: () => s * window.innerHeight },
          {
            y: () => -s * window.innerHeight,
            ease: "none",
            scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true, invalidateOnRefresh: true },
          },
        );
        gsap.from(el.querySelector("img"), {
          scale: 1.25,
          duration: 1.6,
          ease: "expo.out",
          scrollTrigger: { trigger: el, start: "top 95%" },
        });
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={root} id="lab" className={styles.section}>
      <div className={styles.head}>
        <span className="mono muted">( 04 )</span>
        <h2 className={`display ${styles.title}`}>{dict.labTitle[locale]}</h2>
        <p className={styles.sub}>{dict.labSub[locale]}</p>
      </div>
      <div className={styles.wall}>
        {items.map((it) => (
          <Link
            key={it.src}
            href={`/${locale}/work/${it.href}`}
            className={`${styles.item} ${styles[it.cls]}`}
            data-speed={it.speed}
          >
            <div className={it.obj ? styles.obj : "img-grain"}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={it.src} alt={it.cap} loading="lazy" />
            </div>
            <span className="mono muted">{it.cap}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
