"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { t, type L, type Locale } from "@/content/i18n";
import { useTheme } from "./CaseStudy";
import { VARIANTS } from "./VariantStage";
import NextChapter from "./NextChapter";
import styles from "./OxiaPage.module.css";

const Emblem3D = dynamic(() => import("./Emblem3D"), { ssr: false });


const manifesto: L = {
  en: "No brief. No client. Only ideas that deserve to exist, polished down to the last detail.",
  es: "Sin brief. Sin cliente. Solo ideas que merecen existir, pulidas hasta el último detalle.",
};

const story: L[] = [
  {
    en: "OXIA Labs is an independent studio for design and creative technology, founded in 2026 by Miki Herrero.",
    es: "OXIA Labs es un estudio independiente de diseño y tecnología creativa, fundado en 2026 por Miki Herrero.",
  },
  {
    en: "Original eXperiments + IA. Products that aren't just looked at: they're played, heard and inhabited. Each one starts from an original idea and is built to the same standard — impeccable design, with technology in service of the experience.",
    es: "Original eXperiments + IA. Productos que no se limitan a mirarse: se juegan, se escuchan y se habitan. Cada uno nace de una idea propia y se construye con el mismo estándar: un diseño impecable y la tecnología al servicio de la experiencia.",
  },
  {
    en: "Today the catalogue is an audiovisual game, a wellbeing app and two audio plugins. TETRA is the current focus. The next one is already underway.",
    es: "Hoy su catálogo lo forman un juego audiovisual, una app de bienestar y dos plugins de audio. TETRA es el foco actual. El siguiente ya está en marcha.",
  },
];

const facts: { k: L; v: L }[] = [
  { k: { en: "Founded", es: "Fundado" }, v: { en: "2026", es: "2026" } },
  { k: { en: "Founder", es: "Fundador" }, v: { en: "Miki Herrero", es: "Miki Herrero" } },
  { k: { en: "Name", es: "Nombre" }, v: { en: "Original eXperiments + IA", es: "Original eXperiments + IA" } },
  { k: { en: "Catalogue", es: "Catálogo" }, v: { en: "4 products", es: "4 productos" } },
];

const principles: { title: L; body: L }[] = [
  {
    title: { en: "Original", es: "Original" },
    body: {
      en: "If it already exists, it doesn't need another version. Every product brings something of its own.",
      es: "Si ya existe, no necesita otra versión. Cada producto aporta algo propio.",
    },
  },
  {
    title: { en: "Immersive", es: "Inmersivo" },
    body: {
      en: "Experiences you play, hear and feel. Not screens you look at and forget.",
      es: "Experiencias que se juegan, se escuchan y se sienten. No pantallas que se miran y se olvidan.",
    },
  },
  {
    title: { en: "Polished", es: "Pulido" },
    body: {
      en: "Every decision has a reason. Every detail gets its time.",
      es: "Cada decisión tiene un porqué. Cada detalle, su tiempo.",
    },
  },
];

type Product = {
  name: string;
  slug: string;
  type: L;
  status: string;
  media: { video?: string; img: string };
  url?: string;
};

const products: Product[] = [
  {
    name: "TETRA",
    slug: "tetra",
    type: { en: "Audiovisual game · Spatial audio", es: "Juego audiovisual · Audio espacial" },
    status: "Live",
    media: { video: "/work/tetra/v/game.mp4", img: "/work/tetra/v/game.webp" },
    url: "https://tetra-blocks.vercel.app/",
  },
  {
    name: "Tendu",
    slug: "tendu",
    type: { en: "Wellbeing app · Real-time 3D", es: "App de bienestar · 3D en tiempo real" },
    status: "Beta",
    media: { video: "/work/tendu/v/i-days.mp4", img: "/work/tendu/v/i-days.webp" },
  },
  {
    name: "Unwind",
    slug: "unwind-dark-matter",
    type: { en: "Tape manipulation instrument · Plugin", es: "Instrumento de manipulación de cinta · Plugin" },
    status: "Built",
    media: { img: "/work/unwind/01.webp" },
  },
  {
    name: "Dark Matter",
    slug: "unwind-dark-matter",
    type: { en: "Space reverb · Plugin", es: "Reverb espacial · Plugin" },
    status: "Built",
    media: { img: "/work/dark-matter/02.webp" },
  },
];

const THEME = { bg: "#000000", fg: "#f2f2f0", accent: "#ffffff", muted: "#77736f" };

export default function OxiaPage({ locale }: { locale: Locale }) {
  const root = useRef<HTMLDivElement>(null);
  useTheme(THEME);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from("[data-x-line]", { yPercent: 110, duration: 1.5, ease: "expo.out", stagger: 0.1, delay: 0.3 });
      gsap.from("[data-x-fade]", { opacity: 0, y: 16, duration: 1.2, ease: "expo.out", stagger: 0.06, delay: 0.6 });
      gsap.fromTo("[data-m-w]", { opacity: 0.1 }, {
        opacity: 1,
        stagger: 0.05,
        ease: "none",
        scrollTrigger: { trigger: "[data-manifesto]", start: "top 80%", end: "bottom 50%", scrub: true },
      });
      gsap.utils.toArray<HTMLElement>("[data-x-reveal]").forEach((el) =>
        gsap.from(el, { y: 70, opacity: 0, duration: 1.3, ease: "expo.out", scrollTrigger: { trigger: el, start: "top 88%" } }),
      );
      gsap.to("[data-x-stage]", {
        scale: 0.86,
        opacity: 0.2,
        ease: "none",
        scrollTrigger: { trigger: "[data-x-hero]", start: "top top", end: "bottom top", scrub: true },
      });
      gsap.utils.toArray<HTMLVideoElement>("video").forEach((v) =>
        ScrollTrigger.create({
          trigger: v,
          start: "top bottom",
          end: "bottom top",
          onToggle: (s) => (s.isActive ? v.play().catch(() => {}) : v.pause()),
        }),
      );
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={root} className={styles.page}>
      <section data-x-hero className={styles.hero}>
        <div className={styles.heroTop}>
          <span className="mono muted" data-x-fade>Creative Technology & Design Studio</span>
          <span className="mono muted" data-x-fade>Est. 2026 — {locale === "en" ? "Founded by Miki Herrero" : "Fundado por Miki Herrero"}</span>
        </div>
        <div data-x-stage className={styles.stage}>
          <Emblem3D material="chrome" scale={2.0} />
        </div>
        <div className={styles.heroBottom}>
          <h1 className={styles.title}>
            <span className="line-mask"><span data-x-line>OXIA Labs</span></span>
          </h1>
        </div>
      </section>

      <section className={styles.story}>
        <span className="mono muted">( {locale === "en" ? "What is OXIA" : "Qué es OXIA"} )</span>
        <div className={styles.storyText}>
          {story.map((p, i) => (
            <p key={i} data-x-reveal className={i === 0 ? styles.storyLead : ""}>{t(p, locale)}</p>
          ))}
        </div>
        <dl className={styles.facts} data-x-reveal>
          {facts.map((f) => (
            <div key={f.k.en}>
              <dt className="mono muted">{t(f.k, locale)}</dt>
              <dd>{t(f.v, locale)}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className={styles.manifesto}>
        <span className="mono muted">( Manifesto )</span>
        <p data-manifesto className={styles.mText}>
          {t(manifesto, locale).split(" ").map((w, i) => (
            <span key={i} data-m-w>{w} </span>
          ))}
        </p>
      </section>

      <section className={styles.principles}>
        {principles.map((p, i) => (
          <div key={i} className={styles.principle} data-x-reveal>
            <span className="mono muted">0{i + 1}</span>
            <h3 className={styles.pTitle}>{t(p.title, locale)}</h3>
            <p className={styles.pBody}>{t(p.body, locale)}</p>
          </div>
        ))}
      </section>

      <section className={styles.products}>
        <div className={styles.secHead}>
          <h2 className={`display ${styles.secTitle}`}>{locale === "en" ? "Products" : "Productos"}</h2>
          <span className="mono muted">04 — 2026</span>
        </div>
        {products.map((p, i) => (
          <article key={p.name} className={styles.product} data-x-reveal>
            <div className={styles.pMeta}>
              <span className="mono muted">{String(i + 1).padStart(2, "0")}</span>
              <h3 className={`display ${styles.pName}`}>{p.name}</h3>
              <span className="mono muted">{t(p.type, locale)}</span>
              <span className={`mono ${styles.status}`} data-status={p.status}>● {p.status}</span>
              <div className={styles.pLinks}>
                <Link href={`/${locale}/work/${p.slug}`} className="mono ulink">{locale === "en" ? "Case study" : "Caso de estudio"} →</Link>
                {p.url && (
                  <a href={p.url} target="_blank" rel="noreferrer" className="mono ulink">{locale === "en" ? "Try it live" : "Probar en vivo"} ↗</a>
                )}
              </div>
            </div>
            <Link href={`/${locale}/work/${p.slug}`} className={`${styles.pMedia} img-grain`}>
              {p.media.video ? (
                <video src={p.media.video} poster={p.media.img} muted loop playsInline preload="metadata" />
              ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={p.media.img} alt={p.name} loading="lazy" />
              )}
            </Link>
          </article>
        ))}
      </section>

      <section className={styles.identity}>
        <div className={styles.secHead}>
          <h2 className={`display ${styles.secTitle}`}>{locale === "en" ? "Emblem" : "Emblema"}</h2>
          <span className="mono muted">{locale === "en" ? "One sign · Four materials" : "Un signo · Cuatro materias"}</span>
        </div>
        <p className={styles.idText} data-x-reveal>
          {locale === "en"
            ? "An O and an X folded into one sign. It changes material without losing its shape."
            : "Una O y una X plegadas en un solo signo. Cambia de materia sin perder la forma."}
        </p>
        <div className={styles.lineup}>
          {VARIANTS.map((v, i) => (
            <figure key={v.name} className={styles.lineItem} data-x-reveal>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={v.src} alt={`OXIA — ${v.name}`} loading="lazy" draggable={false} />
              <figcaption className="mono muted">
                {String(i + 1).padStart(2, "0")} — {v.name}
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      <NextChapter
        next={{
          href: `/${locale}/lab`,
          title: "Lab",
          kicker: locale === "en" ? "Next — 04 · Design experiments" : "Siguiente — 04 · Experimentos de diseño",
          img: "/work/lab/vinyl-tutto-passa-1.webp",
        }}
      />
    </div>
  );
}
