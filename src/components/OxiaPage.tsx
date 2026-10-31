"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { t, type L, type Locale } from "@/content/i18n";
import { MaterialSwitch } from "./OxiaBlock";
import type { MaterialName } from "./Emblem3D";
import { useTheme } from "./CaseStudy";
import Objects from "./Objects";
import styles from "./OxiaPage.module.css";

const Emblem3D = dynamic(() => import("./Emblem3D"), { ssr: false });

const manifesto: L = {
  en: "No brief. No client. No direction but forward. If an idea excites us, we build it — and we don't stop until it feels right.",
  es: "Sin brief. Sin cliente. Sin más dirección que hacia delante. Si una idea nos emociona, la construimos, y no paramos hasta que se siente bien.",
};

const story: L[] = [
  {
    en: "OXIA Labs started as something I had always wanted: a studio of my own, a place to launch products without anyone asking for them.",
    es: "OXIA Labs nació de algo que siempre había querido: un estudio propio, un sitio desde el que lanzar productos sin que nadie los pida.",
  },
  {
    en: "It lives where my two worlds meet — more than ten years producing music and a career designing digital products. That is why everything we make is audiovisual at heart: games that sound like records, apps that breathe, plugins you can see.",
    es: "Vive justo donde se cruzan mis dos mundos: más de diez años produciendo música y una carrera diseñando producto digital. Por eso todo lo que hacemos es audiovisual por dentro: juegos que suenan como un disco, apps que respiran, plugins que se pueden ver.",
  },
  {
    en: "Today OXIA is an independent umbrella brand — and these are real products, not mockups. A game you can download, an app you can use, audio plugins that run in your DAW.",
    es: "Hoy OXIA es una marca paraguas independiente, y esto son productos reales, no mockups. Un juego que puedes descargar, una app que puedes usar, plugins de audio que funcionan en tu DAW.",
  },
];

const facts: { k: L; v: L }[] = [
  { k: { en: "Founded", es: "Fundado" }, v: { en: "2026", es: "2026" } },
  { k: { en: "Founder", es: "Fundador" }, v: { en: "Miki Herrero", es: "Miki Herrero" } },
  { k: { en: "Disciplines", es: "Disciplinas" }, v: { en: "Product design, creative technology, sound, real-time 3D", es: "Diseño de producto, creative technology, sonido, 3D en tiempo real" } },
  { k: { en: "Products", es: "Productos" }, v: { en: "4 built — games, wellbeing, audio", es: "4 construidos — juego, bienestar, audio" } },
];

const principles: { title: L; body: L }[] = [
  {
    title: { en: "Technology is a material", es: "La tecnología es un material" },
    body: {
      en: "WebGL, audio engines and AI models are treated like paper or ink: something to shape, not just to use.",
      es: "WebGL, motores de audio y modelos de IA se tratan como el papel o la tinta: algo que moldear, no solo usar.",
    },
  },
  {
    title: { en: "Made to be felt", es: "Hecho para sentirse" },
    body: {
      en: "Every project starts from a sensation — calm, rhythm, depth — and works backwards to the interface.",
      es: "Cada proyecto empieza en una sensación — calma, ritmo, profundidad — y trabaja hacia atrás hasta la interfaz.",
    },
  },
  {
    title: { en: "Shipped, not pitched", es: "Lanzado, no presentado" },
    body: {
      en: "Experiments only count when they are live. Prototype fast, polish obsessively, publish.",
      es: "Un experimento solo cuenta cuando está online. Prototipar rápido, pulir con obsesión, publicar.",
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
    media: { video: "/work/tetra/experience.mp4", img: "/work/tetra/cover.webp" },
    url: "https://tetra-blocks.vercel.app/",
  },
  {
    name: "Tendu",
    slug: "tendu",
    type: { en: "Wellbeing app · Real-time 3D", es: "App de bienestar · 3D en tiempo real" },
    status: "Beta",
    media: { video: "/work/tendu/onboarding.mp4", img: "/work/tendu/cover.webp" },
    url: "https://tendu-beta.vercel.app/",
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
              ? "A geometric grotesk wordmark set tight, and an angular emblem built from chamfered strokes — an α and an X folded into one mark. The emblem is designed to live as an object: chrome, glass, moss, cracked crystal. The studio's identity is not a logo on a page, it is something you can light."
              : "Un wordmark en grotesca geométrica muy ajustado y un emblema angular hecho de trazos achaflanados — una α y una X plegadas en una sola marca. El emblema está pensado para vivir como objeto: cromo, cristal, musgo, cristal roto. La identidad del estudio no es un logo en una página, es algo que se puede iluminar."}
          </p>
          <div className={styles.idImg}>
            <Objects
              srcs={["/work/cutouts/emblem-chrome.webp", "/work/cutouts/emblem-glass.webp", "/work/cutouts/emblem-moss.webp", "/work/cutouts/emblem-crystal.webp"]}
              captions={["Chrome", "Glass", "Moss", "Cracked crystal"]}
            />
          </div>
        </div>
      </section>

      <section className={styles.next}>
        <span className="mono muted">{locale === "en" ? "Coming next" : "Lo siguiente"}</span>
        <p className={`display ${styles.nextText}`}>
          {locale === "en" ? "oxialabs — its own home. Soon." : "oxialabs — su propia casa. Pronto."}
        </p>
      </section>
    </div>
  );
}
