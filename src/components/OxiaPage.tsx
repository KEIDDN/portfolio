"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { t, type L, type Locale } from "@/content/i18n";
import { useTheme } from "./CaseStudy";
import VariantStage from "./VariantStage";
import NextChapter from "./NextChapter";
import styles from "./OxiaPage.module.css";

const Emblem3D = dynamic(() => import("./Emblem3D"), { ssr: false });


const manifesto: L = {
  en: "No brief, no client. If an idea excites me, I build it — and I keep polishing until it feels right.",
  es: "Sin brief y sin cliente. Si una idea me emociona, la construyo, y la pulo hasta que se siente bien.",
};

const story: L[] = [
  {
    en: "OXIA Labs is my personal, independent studio. I founded it in 2026 because I wanted my own place to launch creative products without waiting for anyone to ask for them.",
    es: "OXIA Labs es mi estudio personal e independiente. Lo creé en 2026 porque quería un sitio propio desde el que lanzar productos creativos sin esperar a que nadie me los pidiera.",
  },
  {
    en: "The name comes from Original eXperiments + IA, and the emblem is an O and an X folded into one abstract mark. For an idea to become an OXIA project it has to go further: not something you just look at, but something immersive you can interact with, built on very polished design.",
    es: "El nombre viene de Original eXperiments + IA, y el emblema es una O y una X plegadas en una marca abstracta. Para que una idea se convierta en proyecto de OXIA tiene que ir más allá: no algo que solo se mira, sino algo inmersivo con lo que interactuar, construido sobre un diseño muy pulido.",
  },
  {
    en: "So far that has meant a game, a wellbeing app and two audio plugins — music is part of some of them, because it's part of me, but not everything here will be musical. Right now most of the work goes into TETRA. More will come.",
    es: "Hasta ahora eso ha sido un juego, una app de bienestar y dos plugins de audio. La música está en algunos porque forma parte de mí, pero no todo lo que salga de aquí será musical. Ahora mismo casi todo el trabajo va a TETRA. Vendrán más cosas.",
  },
];

const facts: { k: L; v: L }[] = [
  { k: { en: "Founded", es: "Fundado" }, v: { en: "2026", es: "2026" } },
  { k: { en: "Founder", es: "Fundador" }, v: { en: "Miki Herrero", es: "Miki Herrero" } },
  { k: { en: "Name", es: "Nombre" }, v: { en: "Original eXperiments + IA", es: "Original eXperiments + IA" } },
  { k: { en: "Products", es: "Productos" }, v: { en: "4 — a game, an app, two plugins", es: "4: un juego, una app y dos plugins" } },
];

const principles: { title: L; body: L }[] = [
  {
    title: { en: "Original", es: "Original" },
    body: {
      en: "If it already exists, it doesn't need me. Every project has to bring something of its own.",
      es: "Si ya existe, no me necesita. Cada proyecto tiene que aportar algo propio.",
    },
  },
  {
    title: { en: "To be lived", es: "Para vivirlo" },
    body: {
      en: "Not a static design you look at and forget, but an experience you play with, hear and feel.",
      es: "No un diseño estático que miras y olvidas, sino una experiencia que juegas, escuchas y sientes.",
    },
  },
  {
    title: { en: "Polished to the end", es: "Pulido hasta el final" },
    body: {
      en: "Every decision with a reason, every detail looked after. That's the part I enjoy most.",
      es: "Cada decisión con un porqué y cada detalle cuidado. Es la parte que más disfruto.",
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
    media: { video: "/work/tendu/v/days.mp4", img: "/work/tendu/v/days.webp" },
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
          <h2 className={`display ${styles.secTitle}`}>{locale === "en" ? "Identity" : "Identidad"}</h2>
          <span className="mono muted">Wordmark · Emblem · Materials</span>
        </div>
        <div className={styles.idGrid}>
          <div className={styles.idWord} data-x-reveal>
            <span className={styles.wordmark}>OXIA Labs</span>
          </div>
          <p className={styles.idText} data-x-reveal>
            {locale === "en"
              ? "The wordmark is Garet Regular set tight, at −75 tracking. The emblem, an O and an X folded together, lives in black and white — and as an object, rendered in chrome, glass, moss and crystal with AI, so the brand can change skin without losing its shape."
              : "El wordmark es Garet Regular muy ajustada, a −75 de tracking. El emblema, una O y una X plegadas, vive en blanco y negro, y también como objeto: renderizado con IA en cromo, cristal, musgo y cristal roto, para que la marca cambie de piel sin perder su forma."}
          </p>
          <div className={styles.variants} data-x-reveal>
            <VariantStage />
          </div>
        </div>
      </section>

      <NextChapter
        next={{
          href: `/${locale}#lab`,
          title: "Lab",
          kicker: locale === "en" ? "Next — 03 · Design experiments" : "Siguiente — 03 · Experimentos de diseño",
          img: "/work/lab/vinyl-tutto-passa-1.webp",
        }}
      />
    </div>
  );
}
