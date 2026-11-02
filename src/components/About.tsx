"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { t, type L, type Locale } from "@/content/i18n";
import styles from "./About.module.css";

const bio: L[] = [
  {
    en: "I'm Miki Herrero, a product designer from Spain. I care about every decision having a reason behind it, and about clean, modern design that you can feel when you use it.",
    es: "Soy Miki Herrero, diseñador de producto. Me importa que cada decisión tenga un porqué detrás y que el diseño sea limpio, actual y se note al usarlo.",
  },
  {
    en: "I currently work as a Product Designer at VIOOH in London, the programmatic platform behind digital out-of-home advertising. On the side I run OXIA Labs, my personal studio, where I design and launch my own projects like TETRA and Tendu.",
    es: "Ahora trabajo como Product Designer en VIOOH, en Londres, la plataforma programática detrás de la publicidad exterior digital. En paralelo llevo OXIA Labs, mi estudio personal, donde diseño y lanzo mis propios proyectos, como TETRA y Tendu.",
  },
  {
    en: "I studied Advertising and Public Relations, spent a year studying in Rome, and learned the rest by making things: brands, apps, 3D, music and AI tools. I'm still learning every day.",
    es: "Estudié Publicidad y Relaciones Públicas, pasé un año estudiando en Roma y el resto lo he aprendido haciendo cosas: marcas, apps, 3D, música y herramientas de IA. Sigo aprendiendo cada día.",
  },
];

const experience = [
  { years: "2026 — Now", role: { en: "Product Designer", es: "Product Designer" }, place: "VIOOH — London" },
  { years: "2026 — Now", role: { en: "Founder & Design Lead", es: "Fundador y Design Lead" }, place: "OXIA Labs" },
  { years: "2025", role: { en: "Brand Designer", es: "Diseñador de marca" }, place: "More Vintage — Salamanca" },
];
const education = [
  { years: "2022 — 2026", role: { en: "BA Advertising & Public Relations", es: "Grado en Publicidad y RRPP" }, place: "UPSA — Salamanca" },
  { years: "2024 — 2025", role: { en: "International academic year", es: "Año académico internacional" }, place: "LUMSA — Rome" },
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
const tools = ["Figma", "Adobe CC", "Blender", "Three.js", "Claude & AI tools", "Ableton Live", "Logic Pro"];

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
          {/* Replace /about/portrait.webp with the real portrait */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/about/portrait.webp" alt="Miki Herrero" />
        </div>
      </section>
      <section className={styles.bio}>
        <span className="mono muted">( Miki Herrero )</span>
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
          <p className={styles.role}>{locale === "en" ? "Spanish (native) · English (professional) · Italian (basic)" : "Español (nativo) · Inglés (profesional) · Italiano (básico)"}</p>
        </div>
      </section>
    </div>
  );
}
