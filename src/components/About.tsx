"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { t, type L, type Locale } from "@/content/i18n";
import styles from "./About.module.css";

const bio: L[] = [
  {
    en: "I'm Miguel Ángel Herrero, though almost everyone calls me Miki. I'm from Salamanca, and I've always loved design — I'm the kind of person who stops to look at posters, covers and details.",
    es: "Soy Miguel Ángel Herrero, aunque casi todo el mundo me llama Miki. Soy de Salamanca y siempre me ha gustado el diseño: soy de los que se paran a mirar los pósters, las portadas y los detalles.",
  },
  {
    en: "I studied Advertising and Public Relations at UPSA because I think advertising is a wonderful world, but design opened up for me on its own: I'm very creative, I love art and I always need to be making something original. I spent a year on Erasmus in Rome, which filled me with art and culture.",
    es: "Estudié Publicidad y Relaciones Públicas en la UPSA porque la publicidad me parece un mundo maravilloso, pero el diseño se me abrió por su cuenta: soy muy creativo, me encanta el arte y siempre necesito estar haciendo algo original. Pasé un año de Erasmus en Roma, que me llenó de arte y cultura.",
  },
  {
    en: "Today I'm a product designer at VIOOH in London. I design interfaces and experiences, work to understand our users and their needs, help shape new features with design and product managers, and build AI agents that review our UI screens and suggest improvements.",
    es: "Ahora soy diseñador de producto en VIOOH, en Londres. Diseño interfaces y experiencias, trabajo para entender a nuestros usuarios y sus necesidades, ayudo a definir nuevas funciones con el equipo de diseño y los product managers, y creo agentes de IA que analizan pantallas de nuestra UI y proponen mejoras.",
  },
  {
    en: "In 2026 I founded OXIA Labs, my personal and independent studio, to launch my own ideas: creative experiences built on very polished design.",
    es: "En 2026 creé OXIA Labs, mi estudio personal e independiente, para lanzar mis propias ideas: experiencias creativas construidas sobre un diseño muy pulido.",
  },
];

const outside: { k: L; v: L }[] = [
  {
    k: { en: "Music", es: "Música" },
    v: {
      en: "What moves me most outside design. I've been producing electronic music for over ten years as KEIDDN, self-taught, which also gave me an ear for audio engineering.",
      es: "Lo que más me mueve fuera del diseño. Llevo más de diez años produciendo música electrónica como KEIDDN, de forma autodidacta, y eso también me ha dado oído para la ingeniería de audio.",
    },
  },
  {
    k: { en: "Film", es: "Cine" },
    v: { en: "A die-hard film lover. Some of my favourites ended up as posters in the Lab.", es: "Cinéfilo empedernido. Algunas de mis favoritas han acabado como pósters en el Lab." },
  },
  {
    k: { en: "References", es: "Referentes" },
    v: {
      en: "Dieter Rams for his simplicity, and Steve Jobs for the way he understood design: clean, with a reason, a little German.",
      es: "Dieter Rams por su sencillez y Steve Jobs por su forma de entender el diseño: limpio, con un porqué, un punto alemán.",
    },
  },
];

const experience = [
  { years: "2026 — Now", role: { en: "Product Designer", es: "Product Designer" }, place: "VIOOH — London" },
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
const tools = ["Figma", "Adobe CC", "Blender", "Three.js", "Claude & AI tools", "Ableton Live"];

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
