"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { dict, site, type Locale } from "@/content/i18n";
import styles from "./Footer.module.css";

export default function Footer({ locale }: { locale: Locale }) {
  const root = useRef<HTMLElement>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from("[data-f-line]", {
        yPercent: 110,
        duration: 1.4,
        ease: "expo.out",
        stagger: 0.1,
        scrollTrigger: { trigger: root.current, start: "top 70%" },
      });
    }, root);
    return () => ctx.revert();
  }, []);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(site.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      window.location.href = `mailto:${site.email}`;
    }
  };

  return (
    <footer ref={root} id="contact" className={styles.footer}>
      <div className={styles.top}>
        <span className="mono muted">( {dict.nav.contact[locale]} )</span>
        <span className="mono muted">{locale === "en" ? "Open to new projects & collaborations" : "Abierto a nuevos proyectos y colaboraciones"}</span>
      </div>
      <h2 className={`display ${styles.big}`}>
        <span className="line-mask"><span data-f-line>{dict.contactBig[locale]}</span></span>
        <span className="line-mask"><span data-f-line className={styles.dim}>{dict.contactBig2[locale]}</span></span>
      </h2>
      <button className={styles.email} onClick={copy}>
        <span>{site.email}</span>
        <span className="mono">{copied ? dict.copied[locale] : dict.copy[locale]}</span>
      </button>
      <div className={styles.bottom}>
        <div className={styles.socials}>
          {site.socials.map((s) => (
            <a key={s.label} href={s.href} target="_blank" rel="noreferrer" className="mono ulink">
              {s.label} ↗
            </a>
          ))}
          <a href={`mailto:${site.email}`} className="mono ulink">Email ↗</a>
        </div>
        <span className="mono muted">© 2026 Miki Herrero — {dict.rights[locale]}</span>
      </div>
    </footer>
  );
}
