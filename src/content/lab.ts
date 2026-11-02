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
      en: "I'm from Salamanca, and the botón charro is part of my culture: a very baroque silver button. I wanted to bring it into a more modern aesthetic as rings and pendants. Modelled with Blender and AI MCPs.",
      es: "Soy de Salamanca y el botón charro es parte de mi cultura: un botón de plata muy barroco. Quise llevarlo a una estética más moderna en forma de anillos y colgantes. Modelado con Blender y MCPs de IA.",
    },
    images: [W("lab/04.webp"), W("cutouts/charro.webp"), W("cutouts/pendant.webp")],
  },
  {
    slug: "inhabit",
    title: "Inhabit",
    kind: { en: "3D · Concept", es: "3D · Concepto" },
    year: "2026",
    note: {
      en: "An artistic critique of the housing crisis: a vulture perched on a house, and a house squeezed until it bends. About vulture funds and how hard it has become to have a home, in Spain and everywhere.",
      es: "Una crítica artística al problema de la vivienda: un buitre posado sobre una casa y una casa estrujada hasta deformarse. Sobre los fondos buitre y lo difícil que se ha vuelto tener un hogar, en España y en todas partes.",
    },
    images: [W("lab/01.webp"), W("lab/inhabit-house.webp")],
  },
  {
    slug: "tutto-passa",
    title: "Tutto Passa",
    kind: { en: "Vinyl", es: "Vinilo" },
    year: "2026",
    note: {
      en: "An invented Neapolitan record. 'Tutto passa' — everything passes, the good and the bad — is a phrase I have tattooed. Sleeve, label, booklet and inner sleeve around a photo I love.",
      es: "Un disco napolitano inventado. «Tutto passa», todo pasa, lo bueno y lo malo, es una frase que llevo tatuada. Portada, galleta, libreto y funda interior alrededor de una foto que me encanta.",
    },
    images: [W("lab/vinyl-tutto-passa.webp"), ...[1, 2, 3, 4, 5].map((i) => W(`lab/vinyl-tutto-passa-${i}.webp`))],
  },
  {
    slug: "any-kind-of-blues",
    title: "Any Kind of Blues",
    kind: { en: "Vinyl", es: "Vinilo" },
    year: "2026",
    note: {
      en: "I love jazz. An imagined Miles Davis record with a more Japanese, abstract aesthetic: navy brushstrokes over raw paper, closer to art than to a cover.",
      es: "Me encanta el jazz. Un disco imaginado de Miles Davis con una estética más japonesa y abstracta: pinceladas azul marino sobre papel crudo, más cerca del arte que de una portada.",
    },
    images: [W("lab/vinyl-miles.webp"), ...[1, 2, 3, 4].map((i) => W(`lab/vinyl-miles-${i}.webp`))],
  },
  {
    slug: "film-posters",
    title: "Film Posters",
    kind: { en: "Posters", es: "Pósters" },
    year: "2025",
    note: {
      en: "I'm a die-hard film lover, and these are four of my favourite films. Alternative posters with halftones, print textures and big type.",
      es: "Soy un cinéfilo empedernido y estas son cuatro de mis películas favoritas. Pósters alternativos con tramas, texturas de impresión y tipografía grande.",
    },
    images: [W("posters/01.webp"), W("posters/02.webp"), W("posters/03.webp"), W("posters/04.webp")],
  },
  {
    slug: "jpn-drift",
    title: "Retro JPN Drift",
    kind: { en: "Posters", es: "Pósters" },
    year: "2026",
    note: {
      en: "I'm a huge fan of Japanese cars. My own take on retro posters for three I love: Supra, Impreza and Skyline.",
      es: "Soy un gran fanático de los coches japoneses. Mi propia versión de pósters retro para tres que me encantan: Supra, Impreza y Skyline.",
    },
    images: [1, 2, 3].map((i) => W(`lab/jpn-drift-${i}.webp`)),
  },
  {
    slug: "animal-series",
    title: "ASCII Animal Series",
    kind: { en: "Type · Illustration", es: "Tipografía · Ilustración" },
    year: "2025",
    note: {
      en: "ASCII was one of the first ways images were drawn on screens. I wanted to play with it in a retro-futuristic key, and animals felt like a curious subject: horse, wolf, eagle and leopard.",
      es: "El ASCII fue una de las primeras formas de dibujar imágenes en pantalla. Quise jugar con él en clave retrofuturista, y los animales me parecieron un tema curioso: caballo, lobo, águila y leopardo.",
    },
    images: [W("posters/05.webp")],
  },
  {
    slug: "ceramics",
    title: "Ceramics",
    kind: { en: "3D", es: "3D" },
    year: "2026",
    note: {
      en: "I really like ceramics. A collection of pieces made with Blender through Claude's MCP: glazes, speckles and imperfections, up close.",
      es: "Me gusta mucho la cerámica. Una colección de piezas hechas con Blender a través del MCP de Claude: esmaltes, motas e imperfecciones, de cerca.",
    },
    images: [W("cutouts/ceramics.webp"), W("lab/ceramics-detail.webp")],
  },
  {
    slug: "objects",
    title: "Objects",
    kind: { en: "3D", es: "3D" },
    year: "2026",
    note: {
      en: "Experiments with my own name: a wax seal and a chrome keychain.",
      es: "Experimentos con mi propio nombre: un sello de lacre y un llavero cromado.",
    },
    images: [W("lab/03.webp"), W("lab/02.webp")],
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
  { s: "inhabit", src: W("cutouts/vulture.webp"), x: 47, y: 38, w: 6, d: 1.2, cut: true },
  { s: "film-posters", src: W("posters/04.webp"), x: 57, y: 41, w: 8, d: 0.8 },
  { s: "boton-charro", src: W("lab/04.webp"), x: 69, y: 45, w: 13, d: 0.6 },
  { s: "boton-charro", src: W("cutouts/pendant.webp"), x: 86, y: 39, w: 5, d: 1.3, cut: true },
  { s: "film-posters", src: W("posters/03.webp"), x: 6, y: 74, w: 8, d: 0.7 },
  { s: "tutto-passa", src: W("lab/vinyl-tutto-passa-3.webp"), x: 19, y: 78, w: 14, d: 0.5 },
  { s: "any-kind-of-blues", src: W("lab/vinyl-miles-3.webp"), x: 38, y: 76, w: 12, d: 0.6 },
  { s: "inhabit", src: W("lab/inhabit-house.webp"), x: 55, y: 75, w: 12, d: 0.5 },
  { s: "tutto-passa", src: W("lab/vinyl-tutto-passa-2.webp"), x: 71, y: 76, w: 15, d: 0.6 },
  { s: "jpn-drift", src: W("lab/jpn-drift-2.webp"), x: 89, y: 70, w: 8, d: 0.9 },
];
