"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { dict, t, type Locale } from "@/content/i18n";
import { getProject } from "@/content/projects";
import { MATERIALS, type MaterialName } from "./Emblem3D";
import Objects from "./Objects";
import styles from "./OxiaBlock.module.css";

const Emblem3D = dynamic(() => import("./Emblem3D"), { ssr: false });

export function MaterialSwitch({
  value,
  onChange,
  locale,
}: {
  value: MaterialName;
  onChange: (m: MaterialName) => void;
  locale: Locale;
}) {
  return (
    <div className={styles.switch}>
      <span className="mono muted">{dict.material[locale]}</span>
      {MATERIALS.map((m) => (
        <button key={m} onClick={() => onChange(m)} className={`mono ${value === m ? styles.on : ""}`}>
          {m}
        </button>
      ))}
    </div>
  );
}

export default function OxiaBlock({ locale }: { locale: Locale }) {
  const root = useRef<HTMLElement>(null);
  const [mat, setMat] = useState<MaterialName>("chrome");
  const [show3d, setShow3d] = useState(false);
  const products = ["tetra", "tendu", "unwind-dark-matter"].map((s) => getProject(s)!);

  useEffect(() => {
    const io = new IntersectionObserver(([e]) => e.isIntersecting && setShow3d(true), { rootMargin: "50%" });
    io.observe(root.current!);
    const ctx = gsap.context(() => {
      gsap.from("[data-o-line]", {
        yPercent: 110,
        duration: 1.3,
        ease: "expo.out",
        stagger: 0.08,
        scrollTrigger: { trigger: "[data-o-head]", start: "top 80%" },
      });
      gsap.from("[data-o-prod]", {
        y: 50,
        opacity: 0,
        duration: 1.1,
        ease: "expo.out",
        stagger: 0.1,
        scrollTrigger: { trigger: "[data-o-prods]", start: "top 85%" },
      });
    }, root);
    return () => {
      io.disconnect();
      ctx.revert();
    };
  }, []);

  return (
    <section ref={root} id="oxia" className={styles.section}>
      <div className={styles.inner}>
        <div className={styles.topRow}>
          <span className="mono muted">( 03 )</span>
          <span className="mono muted">{dict.oxiaKicker[locale]}</span>
          <span className="mono muted">Est. 2026</span>
        </div>

        <div className={styles.stage}>
          <div className={styles.canvas}>{show3d && <Emblem3D material={mat} />}</div>
          <h2 data-o-head className={`display ${styles.word}`}>
            <span className="line-mask"><span data-o-line>OXIA</span></span>
            <span className="line-mask"><span data-o-line>Labs</span></span>
          </h2>
        </div>

        <div className={styles.row}>
          <p className={styles.line}>{dict.oxiaLine[locale]}</p>
          <MaterialSwitch value={mat} onChange={setMat} locale={locale} />
        </div>

        <Objects
          size="sm"
          srcs={["/work/cutouts/emblem-chrome.webp", "/work/cutouts/emblem-glass.webp", "/work/cutouts/emblem-moss.webp", "/work/cutouts/emblem-crystal.webp"]}
        />

        <div data-o-prods className={styles.products}>
          {products.map((p, i) => (
            <Link data-o-prod key={p.slug} href={`/${locale}/work/${p.slug}`} className={styles.product}>
              <div className={`${styles.thumb} img-grain`}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={p.cover} alt={p.title} loading="lazy" />
              </div>
              <div className={styles.pInfo}>
                <span className="mono muted">{String(i + 1).padStart(2, "0")}</span>
                <span className={styles.pName}>{p.title}</span>
                <span className="mono muted">{t(p.type, locale)}</span>
              </div>
            </Link>
          ))}
        </div>

        <Link href={`/${locale}/oxia-labs`} className={styles.cta}>
          <span className="display">{dict.oxiaCta[locale]}</span>
          <span className={styles.arrow}>→</span>
        </Link>
      </div>
    </section>
  );
}
