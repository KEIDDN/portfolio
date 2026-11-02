"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { t, type L, type Locale } from "@/content/i18n";
import type { MaterialName } from "./Emblem3D";
import { useTheme } from "./CaseStudy";
import styles from "./OxiaPage.module.css";

const Emblem3D = dynamic(() => import("./Emblem3D"), { ssr: false });

const MATERIALS: MaterialName[] = ["chrome", "steel", "black chrome", "glass"];
function MaterialSwitch({ value, onChange, locale }: { value: MaterialName; onChange: (m: MaterialName) => void; locale: Locale }) {
  return (
    <div className={styles.switch}>
      <span className="mono muted">{locale === "en" ? "Material" : "Material"}</span>
      {MATERIALS.map((m) => (
        <button key={m} onClick={() => onChange(m)} className={`mono ${value === m ? styles.on : ""}`}>
          {m}
        </button>
      ))}
    </div>
  );
}

const VARIANTS = [
  { src: "/work/oxia/v-chrome.webp", name: "Chrome" },
  { src: "/work/oxia/v-glass.webp", name: "Glass" },
  { src: "/work/oxia/v-moss.webp", name: "Moss" },
  { src: "/work/oxia/v-crystal.webp", name: "Crystal" },
];

const manifesto: L = {
  en: "No brief, no client. If an idea excites me, I build it — and I keep polishing until it feels right.",
  es: "Sin brief y sin cliente. Si una idea me emociona, la construyo, y la pulo hasta que se siente bien.",
};

const story: L[] = [
  {
    en: "OXIA Labs is my personal, independent studio. I'd always wanted a place of my own to launch the projects I feel like making, without waiting for anyone to ask.",
    es: "OXIA Labs es mi estudio personal e independiente. Siempre había querido un sitio propio desde el que lanzar los proyectos que me apetece hacer, sin esperar a que nadie me los pida.",
  },
  {
    en: "It's where my two worlds meet: over ten years producing music and designing digital products. So the projects mix very polished design with experiences, music, art, technology and AI.",
    es: "Es donde se cruzan mis dos mundos: más de diez años produciendo música y diseñando producto digital. Por eso los proyectos mezclan un diseño muy pulido con experiencias, música, arte, tecnología e IA.",
  },
  {
    en: "And they're real: a game you can play and download, a wellbeing app in beta, and two audio plugins that work in any DAW.",
    es: "Y son reales: un juego que puedes jugar y descargar, una app de bienestar en beta y dos plugins de audio que funcionan en cualquier DAW.",
  },
];

const facts: { k: L; v: L }[] = [
  { k: { en: "Founded", es: "Fundado" }, v: { en: "2026", es: "2026" } },
  { k: { en: "Founder", es: "Fundador" }, v: { en: "Miki Herrero", es: "Miki Herrero" } },
  { k: { en: "Disciplines", es: "Disciplinas" }, v: { en: "Product design, music, 3D, AI", es: "Diseño de producto, música, 3D, IA" } },
  { k: { en: "Products", es: "Productos" }, v: { en: "4 — a game, an app, two plugins", es: "4: un juego, una app y dos plugins" } },
];

const principles: { title: L; body: L }[] = [
  {
    title: { en: "Technology is a material", es: "La tecnología es un material" },
    body: {
      en: "WebGL, audio and AI are part of the design, like paper or ink. Something to shape, not just to use.",
      es: "WebGL, audio e IA forman parte del diseño, como el papel o la tinta. Algo que moldear, no solo usar.",
    },
  },
  {
    title: { en: "Made to be felt", es: "Hecho para sentirse" },
    body: {
      en: "Every project starts from a feeling — calm, rhythm, depth — and the interface is built to get you there.",
      es: "Cada proyecto empieza en una sensación —calma, ritmo, profundidad— y la interfaz se construye para llevarte a ella.",
    },
  },
  {
    title: { en: "Shipped, not pitched", es: "Lanzado, no presentado" },
    body: {
      en: "An idea only counts once it's live. Prototype fast, polish a lot, publish.",
      es: "Una idea solo cuenta cuando está publicada. Prototipar rápido, pulir mucho y publicar.",
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
  const [mat, setMat] = useState<MaterialName>("chrome");
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
          <Emblem3D material={mat} scale={2.0} />
        </div>
        <div className={styles.heroBottom}>
          <h1 className={`display ${styles.title}`}>
            <span className="line-mask"><span data-x-line>OXIA Labs</span></span>
          </h1>
          <div data-x-fade>
            <MaterialSwitch value={mat} onChange={setMat} locale={locale} />
          </div>
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
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/brand/oxia-wordmark.svg" alt="OXIA Labs wordmark" />
          </div>
          <p className={styles.idText} data-x-reveal>
            {locale === "en"
              ? "A tight geometric wordmark and an angular emblem made of chamfered strokes. In black and white. I render the emblem as an object in different materials — chrome, glass, moss, crystal — so the brand can change skin without losing its shape."
              : "Un wordmark geométrico muy ajustado y un emblema angular hecho de trazos achaflanados. En blanco y negro. El emblema lo renderizo como objeto en distintos materiales —cromo, cristal, musgo, cristal roto— para que la marca cambie de piel sin perder su forma."}
          </p>
          <div className={styles.variants}>
            {VARIANTS.map((v) => (
              <figure key={v.src} data-x-reveal>
                <div className="img-grain">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={v.src} alt={`OXIA emblem — ${v.name}`} loading="lazy" />
                </div>
                <figcaption className="mono muted">{v.name}</figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.next}>
        <span className="mono muted">{locale === "en" ? "Coming next" : "Lo siguiente"}</span>
        <p className={`display ${styles.nextText}`}>
          {locale === "en" ? "More is on the way." : "Vienen más cosas."}
        </p>
      </section>
    </div>
  );
}
