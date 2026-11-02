"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { dict, type Locale } from "@/content/i18n";
import { useLenis } from "./SmoothScroll";
import styles from "./Nav.module.css";

export default function Nav({ locale }: { locale: Locale }) {
  const pathname = usePathname();
  const lenis = useLenis();
  const [hidden, setHidden] = useState(false);
  const [open, setOpen] = useState(false);
  const last = useRef(0);
  const other: Locale = locale === "en" ? "es" : "en";
  const switchHref = pathname.replace(/^\/(en|es)/, `/${other}`);
  const home = `/${locale}`;

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setHidden(y > 200 && y > last.current);
      last.current = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const goto = (id: string) => (e: React.MouseEvent) => {
    setOpen(false);
    if (pathname !== home) return;
    e.preventDefault();
    const el = document.getElementById(id);
    if (el) lenis ? lenis.scrollTo(el, { duration: 1.6 }) : el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <header className={`${styles.nav} ${hidden && !open ? styles.hidden : ""} ${open ? styles.opened : ""}`}>
      <Link href={home} className={styles.brand}>
        Miki Herrero
      </Link>
      <nav className={styles.links}>
        <Link href={`${home}/about`} className="mono ulink">
          {dict.nav.about[locale]}
        </Link>
        <Link href={`${home}#work`} onClick={goto("work")} className="mono ulink">
          {dict.nav.work[locale]}
        </Link>
        <Link href={`${home}/oxia-labs`} className="mono ulink" data-title="OXIA Labs">
          {dict.nav.oxia[locale]}
        </Link>
        <Link href={`${home}/lab`} className="mono ulink" data-title="Lab">
          {dict.nav.lab[locale]}
        </Link>
      </nav>
      <div className={styles.right}>
      <button className={`mono ${styles.menuBtn}`} onClick={() => setOpen((o) => !o)} aria-expanded={open}>
        {open ? (locale === "en" ? "Close" : "Cerrar") : "Menu"}
      </button>
      <Link href={switchHref} className={`mono ${styles.lang}`} aria-label="Switch language">
        <span className={locale === "en" ? styles.on : ""}>EN</span>
        <span>/</span>
        <span className={locale === "es" ? styles.on : ""}>ES</span>
      </Link>
      </div>
      <div className={`${styles.sheet} ${open ? styles.sheetOpen : ""}`}>
        <Link href={`${home}/about`}>{dict.nav.about[locale]}</Link>
        <Link href={`${home}#work`} onClick={goto("work")}>{dict.nav.work[locale]}</Link>
        <Link href={`${home}/oxia-labs`}>{dict.nav.oxia[locale]}</Link>
        <Link href={`${home}/lab`}>{dict.nav.lab[locale]}</Link>
        <Link href={`${home}#contact`} onClick={goto("contact")}>{dict.nav.contact[locale]}</Link>
      </div>
    </header>
  );
}
