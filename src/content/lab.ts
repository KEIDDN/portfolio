import type { L } from "./i18n";

export type Series = {
  slug: string;
  title: string;
  kind: L;
  year: string;
  note: L;
  images: string[];
};

const W = (p: string) => `/work/${p}`;

export const series: Series[] = [
  {
    slug: "boton-charro",
    title: "Botón Charro",
    kind: { en: "3D · Jewellery", es: "3D · Joyería" },
    year: "2026",
    note: {
      en: "A reinterpretation of the botón charro, the traditional silver button from Salamanca, turned into rings and pendants. Modelled in Blender and finished with AI.",
      es: "Una reinterpretación del botón charro de Salamanca convertida en anillos y colgantes. Modelado en Blender y terminado con IA.",
    },
    images: [W("lab/04.webp"), W("cutouts/charro.webp"), W("cutouts/pendant.webp")],
  },
  {
    slug: "tutto-passa",
    title: "Tutto Passa",
    kind: { en: "Vinyl", es: "Vinilo" },
    year: "2026",
    note: {
      en: "Sleeve, label and inner sleeve for a record about letting things go.",
      es: "Portada, galleta y funda interior para un disco sobre dejar pasar las cosas.",
    },
    images: [W("lab/vinyl-tutto-passa.webp"), ...[1, 2, 3, 4, 5].map((i) => W(`lab/vinyl-tutto-passa-${i}.webp`))],
  },
  {
    slug: "any-kind-of-blues",
    title: "Any Kind of Blues",
    kind: { en: "Vinyl", es: "Vinilo" },
    year: "2026",
    note: {
      en: "A Miles Davis record redesigned in two inks: navy brushstrokes over raw paper.",
      es: "Un disco de Miles Davis rediseñado a dos tintas: pinceladas azul marino sobre papel crudo.",
    },
    images: [W("lab/vinyl-miles.webp"), ...[1, 2, 3, 4].map((i) => W(`lab/vinyl-miles-${i}.webp`))],
  },
  {
    slug: "film-posters",
    title: "Film Posters",
    kind: { en: "Posters", es: "Pósters" },
    year: "2025",
    note: {
      en: "Alternative posters for four films I love: halftones, print textures and big type.",
      es: "Pósters alternativos para cuatro películas que me encantan: tramas, texturas de impresión y tipografía grande.",
    },
    images: [W("posters/01.webp"), W("posters/02.webp"), W("posters/03.webp"), W("posters/04.webp")],
  },
  {
    slug: "jpn-drift",
    title: "Retro JPN Drift",
    kind: { en: "Posters", es: "Pósters" },
    year: "2026",
    note: {
      en: "A triptych for three Japanese icons — Supra, Impreza and Skyline — in a retro key.",
      es: "Un tríptico para tres iconos japoneses —Supra, Impreza y Skyline— en clave retro.",
    },
    images: [1, 2, 3].map((i) => W(`lab/jpn-drift-${i}.webp`)),
  },
  {
    slug: "animal-series",
    title: "ASCII Animal Series",
    kind: { en: "Type · Illustration", es: "Tipografía · Ilustración" },
    year: "2025",
    note: {
      en: "Horse, wolf, eagle and leopard drawn with characters. A series about texture and experimental type.",
      es: "Caballo, lobo, águila y leopardo dibujados con caracteres. Una serie sobre textura y tipografía experimental.",
    },
    images: [W("posters/05.webp")],
  },
  {
    slug: "ceramics",
    title: "Ceramics",
    kind: { en: "3D", es: "3D" },
    year: "2026",
    note: {
      en: "A ceramics collection modelled in Blender and finished with AI: glazes, textures and imperfections.",
      es: "Una colección de cerámica modelada en Blender y terminada con IA: esmaltes, texturas e imperfecciones.",
    },
    images: [W("cutouts/ceramics.webp")],
  },
  {
    slug: "objects",
    title: "Objects",
    kind: { en: "3D", es: "3D" },
    year: "2026",
    note: {
      en: "Things that don't exist: a wax seal with my signature, a chrome keychain and a vulture on a house. Blender + AI.",
      es: "Cosas que no existen: un sello de lacre con mi firma, un llavero cromado y un buitre sobre una casa. Blender + IA.",
    },
    images: [W("lab/03.webp"), W("lab/02.webp"), W("lab/01.webp")],
  },
];

/** Wall pieces: x/y/w in % of the canvas (150vw × 160vh), d = depth for pointer parallax. */
export const wall = [
  { s: "film-posters", src: W("posters/01.webp"), x: 3, y: 4, w: 9, d: 0.6 },
  { s: "boton-charro", src: W("cutouts/charro.webp"), x: 15, y: 8, w: 8, d: 1.2, cut: true },
  { s: "tutto-passa", src: W("lab/vinyl-tutto-passa-1.webp"), x: 27, y: 3, w: 11, d: 0.4 },
  { s: "objects", src: W("cutouts/seal.webp"), x: 42, y: 9, w: 7, d: 1.4, cut: true },
  { s: "film-posters", src: W("posters/02.webp"), x: 53, y: 4, w: 9, d: 0.7 },
  { s: "jpn-drift", src: W("lab/jpn-drift-1.webp"), x: 64, y: 5, w: 8, d: 0.5 },
  { s: "jpn-drift", src: W("lab/jpn-drift-3.webp"), x: 75, y: 10, w: 8, d: 0.8 },
  { s: "objects", src: W("cutouts/keychain.webp"), x: 88, y: 3, w: 5, d: 1.5, cut: true },
  { s: "ceramics", src: W("cutouts/ceramics.webp"), x: 1, y: 40, w: 9, d: 1.1, cut: true },
  { s: "any-kind-of-blues", src: W("lab/vinyl-miles-1.webp"), x: 14, y: 42, w: 11, d: 0.5 },
  { s: "animal-series", src: W("posters/05.webp"), x: 29, y: 44, w: 14, d: 0.6 },
  { s: "objects", src: W("cutouts/vulture.webp"), x: 47, y: 38, w: 6, d: 1.2, cut: true },
  { s: "film-posters", src: W("posters/04.webp"), x: 57, y: 41, w: 8, d: 0.8 },
  { s: "boton-charro", src: W("lab/04.webp"), x: 69, y: 45, w: 13, d: 0.6 },
  { s: "boton-charro", src: W("cutouts/pendant.webp"), x: 86, y: 39, w: 5, d: 1.3, cut: true },
  { s: "film-posters", src: W("posters/03.webp"), x: 6, y: 74, w: 8, d: 0.7 },
  { s: "tutto-passa", src: W("lab/vinyl-tutto-passa-3.webp"), x: 19, y: 78, w: 14, d: 0.5 },
  { s: "any-kind-of-blues", src: W("lab/vinyl-miles-3.webp"), x: 38, y: 76, w: 12, d: 0.6 },
  { s: "objects", src: W("lab/01.webp"), x: 55, y: 77, w: 13, d: 0.5 },
  { s: "tutto-passa", src: W("lab/vinyl-tutto-passa-2.webp"), x: 71, y: 76, w: 15, d: 0.6 },
  { s: "jpn-drift", src: W("lab/jpn-drift-2.webp"), x: 89, y: 70, w: 8, d: 0.9 },
];
