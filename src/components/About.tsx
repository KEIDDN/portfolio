"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { t, type L, type Locale } from "@/content/i18n";
import styles from "./About.module.css";

const bio: L[] = [
  {
    en: "I'm Miguel Ángel Herrero — Miki to almost everyone. A product designer from Salamanca, based in London, obsessed with things making sense and looking perfect.",
    es: "Soy Miguel Ángel Herrero, Miki para casi todo el mundo. Diseñador de producto de Salamanca, afincado en Londres y obsesionado con que las cosas tengan sentido y se vean perfectas.",
  },
  {
    en: "I studied Advertising and Public Relations at UPSA, where I learned to tell an idea so it sticks. Design became the way to build it. A year of Erasmus in Rome filled me with art, and I haven't stopped making things since.",
    es: "Estudié Publicidad y Relaciones Públicas en la UPSA, donde aprendí a contar una idea para que se recuerde. El diseño se convirtió en la forma de construirla. Un año de Erasmus en Roma me llenó de arte y desde entonces no he parado de crear.",
  },
  {
    en: "Today I'm a product designer at VIOOH, in London. I design interfaces and experiences, research users and their needs, shape new features alongside design and product, and build AI agents that review our UI and propose improvements.",
    es: "Hoy soy diseñador de producto en VIOOH, en Londres. Diseño interfaces y experiencias, investigo a los usuarios y sus necesidades, defino nuevas funcionalidades junto a diseño y producto, y creo agentes de IA que revisan nuestra UI y proponen mejoras.",
  },
  {
    en: "In parallel I run OXIA Labs, the studio where I launch my own products: TETRA, Tendu, Unwind and Dark Matter.",
    es: "En paralelo dirijo OXIA Labs, el estudio desde el que lanzo mis propios productos: TETRA, Tendu, Unwind y Dark Matter.",
  },
];

const outside: { k: L; v: L }[] = [
  {
    k: { en: "Music", es: "Música" },
    v: {
      en: "Over ten years producing electronic music as KEIDDN, self-taught. It's why sound matters so much in what I design.",
      es: "Más de diez años produciendo música electrónica como KEIDDN, de forma autodidacta. Por eso el sonido pesa tanto en lo que diseño.",
    },
  },
  {
    k: { en: "Film", es: "Cine" },
    v: { en: "A die-hard film lover. Some favourites ended up as posters in the Lab.", es: "Cinéfilo empedernido. Algunas favoritas han acabado como pósters en el Lab." },
  },
  {
    k: { en: "References", es: "Referentes" },
    v: {
      en: "Dieter Rams, for less but better. Steve Jobs, for design as the way something works.",
      es: "Dieter Rams, por el menos pero mejor. Steve Jobs, por entender el diseño como la forma en que algo funciona.",
    },
  },
];

const experience = [
  { years: "2026 — Now", role: { en: "Product Designer", es: "Diseñador de producto" }, place: "VIOOH — London" },
  { years: "2026 — Now", role: { en: "Founder", es: "Fundador" }, place: "OXIA Labs" },
];
const education = [
  { years: "2022 — 2026", role: { en: "BA Advertising & Public Relations", es: "Grado en Publicidad y RRPP" }, place: "UPSA — Salamanca" },
  { years: "2024 — 2025", role: { en: "Erasmus year", es: "Año de Erasmus" }, place: "LUMSA — Rome" },
];
const capabilities: L[] = [
  { en: "Product design", es: "Diseño de producto" },
  { en: "UX / UI", es: "UX / UI" },
  { en: "Creative direction", es: "Dirección creativa" },
  { en: "Brand identity", es: "Identidad de marca" },
  { en: "Creative technology", es: "Creative technology" },
  { en: "AI-driven workflows", es: "Flujos con IA" },
  { en: "Real-time 3D", es: "3D en tiempo real" },
  { en: "Prototyping", es: "Prototipado" },
];
const tools = ["Figma", "Adobe CC", "Blender", "TypeScript", "React", "Three.js", "Claude & AI tools", "Ableton Live"];

export default function About({ locale }: { locale: Locale }) {
  const root = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from("[data-a-line]", { yPercent: 110, duration: 1.5, ease: "expo.out", delay: 0.2 });
      gsap.fromTo("[data-a-img]", { clipPath: "inset(100% 0 0 0)" }, { clipPath: "inset(0% 0 0 0)", duration: 1.6, ease: "expo.inOut", delay: 0.3 });
      gsap.utils.toArray<HTMLElement>("[data-a-reveal]").forEach((el) =>
        gsap.from(el, { y: 50, opacity: 0, duration: 1.2, ease: "expo.out", scrollTrigger: { trigger: el, start: "top 90%" } }),
      );
    }, root);
    return () => ctx.revert();
  }, []);

  const List = ({ title, rows }: { title: string; rows: typeof experience }) => (
    <div className={styles.list} data-a-reveal>
      <span className="mono muted">{title}</span>
      <ul>
        {rows.map((r) => (
          <li key={r.place + r.years}>
            <span className="mono muted">{r.years}</span>
            <span className={styles.role}>{t(r.role, locale)}</span>
            <span className="mono">{r.place}</span>
          </li>
        ))}
      </ul>
    </div>
  );

  return (
    <div ref={root} className={styles.page}>
      <section className={styles.hero}>
        <h1 className={`display ${styles.title}`}>
          <span className="line-mask"><span data-a-line>{locale === "en" ? "About" : "Sobre mí"}</span></span>
        </h1>
        <div className={`${styles.portrait} img-grain`} data-a-img>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/about/portrait.webp" alt="Miguel Ángel (Miki) Herrero" />
        </div>
      </section>
      <section className={styles.bio}>
        <span className="mono muted">( Miguel Ángel Herrero )</span>
        <div className={styles.bioText}>
          {bio.map((p, i) => (
            <p key={i} data-a-reveal className={i === 0 ? styles.lead : ""}>{t(p, locale)}</p>
          ))}
        </div>
      </section>
      <section className={styles.cols}>
        <List title={locale === "en" ? "Experience" : "Experiencia"} rows={experience} />
        <List title={locale === "en" ? "Education" : "Formación"} rows={education} />
        <div className={styles.list} data-a-reveal>
          <span className="mono muted">{locale === "en" ? "Capabilities" : "Capacidades"}</span>
          <div className={styles.tags}>
            {capabilities.map((c) => <span key={c.en} className={styles.tag}>{t(c, locale)}</span>)}
          </div>
        </div>
        <div className={styles.list} data-a-reveal>
          <span className="mono muted">{locale === "en" ? "Tools" : "Herramientas"}</span>
          <div className={styles.tags}>
            {tools.map((c) => <span key={c} className={styles.tag}>{c}</span>)}
          </div>
          <span className="mono muted" style={{ marginTop: 24 }}>{locale === "en" ? "Languages" : "Idiomas"}</span>
          <p className={styles.role}>{locale === "en" ? "Spanish (native) · English (C1) · Italian (A2–B1)" : "Español (nativo) · Inglés (C1) · Italiano (A2–B1)"}</p>
        </div>
      </section>
      <section className={styles.outside}>
        <span className="mono muted">{locale === "en" ? "Outside design" : "Fuera del diseño"}</span>
        <div className={styles.outGrid}>
          {outside.map((o) => (
            <div key={o.k.en} data-a-reveal>
              <span className="mono">{t(o.k, locale)}</span>
              <p>{t(o.v, locale)}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
