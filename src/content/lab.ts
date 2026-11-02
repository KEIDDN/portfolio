import type { L } from "./i18n";

export type Series = {
  slug: string;
  title: string;
  kind: L;
  year: string;
  /** museum label: where it comes from, what was tried, what it is */
  origin: L;
  experiment: L;
  format: L;
  /** the room: every piece, in order */
  images: string[];
  /** the constellation in the universe: up to four pieces, the first one is the star */
  orbit: string[];
};

const W = (p: string) => `/work/${p}`;

export const labIntro: L = {
  en: "A laboratory of design experiments. Pieces with no client and no brief, where I try out techniques, formats and tools.",
  es: "Un laboratorio de experimentos de diseño. Piezas sin cliente ni briefing donde pongo a prueba técnicas, formatos y herramientas.",
};

export const series: Series[] = [
  {
    slug: "boton-charro",
    title: "Botón Charro",
    kind: { en: "3D · Jewellery", es: "3D · Joyería" },
    year: "2026",
    origin: {
      en: "The botón charro is the emblem of Salamanca's silverwork: baroque, meticulous, from another century.",
      es: "El botón charro es el emblema de la platería salmantina: barroco, minucioso, de otro siglo.",
    },
    experiment: {
      en: "Bring it into the present. Rings and pendants that keep its geometry and lose everything else.",
      es: "Traerlo al presente. Anillos y colgantes que conservan su geometría y se quedan solo con lo esencial.",
    },
    format: { en: "3D render · Blender + AI MCPs", es: "Render 3D · Blender + MCPs de IA" },
    images: [W("lab/04.webp"), W("cutouts/charro.webp"), W("cutouts/pendant.webp")],
    orbit: [W("cutouts/charro.webp"), W("lab/04.webp"), W("cutouts/pendant.webp")],
  },
  {
    slug: "inhabit",
    title: "Inhabit",
    kind: { en: "3D · Concept", es: "3D · Concepto" },
    year: "2026",
    origin: {
      en: "Having a home has become a privilege. Vulture funds buy whole neighbourhoods while rents push out the people who live in them.",
      es: "Tener casa se ha convertido en un privilegio. Los fondos buitre compran barrios enteros mientras el alquiler expulsa a quienes viven en ellos.",
    },
    experiment: {
      en: "Two images, one idea: a vulture guarding its prey and a house squeezed until it buckles.",
      es: "Dos imágenes, una idea: un buitre que custodia su presa y una casa estrujada hasta deformarse.",
    },
    format: { en: "3D render · Diptych", es: "Render 3D · Díptico" },
    images: [W("lab/01.webp"), W("lab/inhabit-house.webp")],
    orbit: [W("lab/inhabit-house.webp"), W("cutouts/vulture.webp")],
  },
  {
    slug: "tutto-passa",
    title: "Tutto Passa",
    kind: { en: "Vinyl", es: "Vinilo" },
    year: "2026",
    origin: {
      en: "“Tutto passa”: everything passes, the good and the bad. A phrase I carry tattooed.",
      es: "«Tutto passa»: todo pasa, lo bueno y lo malo. Una frase que llevo tatuada.",
    },
    experiment: {
      en: "The full release of a Neapolitan record that doesn't exist, built around a single photograph.",
      es: "La edición completa de un disco napolitano que no existe, construida alrededor de una sola fotografía.",
    },
    format: { en: "12″ vinyl · Sleeve, label, booklet, inner sleeve", es: "Vinilo 12″ · Portada, galleta, libreto y funda interior" },
    images: [W("lab/vinyl-tutto-passa.webp"), ...[1, 2, 3, 4, 5].map((i) => W(`lab/vinyl-tutto-passa-${i}.webp`))],
    orbit: [W("lab/vinyl-tutto-passa-1.webp"), W("lab/vinyl-tutto-passa-2.webp"), W("lab/vinyl-tutto-passa-3.webp")],
  },
  {
    slug: "any-kind-of-blues",
    title: "Any Kind of Blues",
    kind: { en: "Vinyl", es: "Vinilo" },
    year: "2026",
    origin: {
      en: "An imagined Miles Davis record. A tribute to jazz.",
      es: "Un disco imaginado de Miles Davis. Un homenaje al jazz.",
    },
    experiment: {
      en: "Swap jazz's visual code for Japanese abstraction: navy brushstrokes on raw paper, closer to art than to a cover.",
      es: "Cambiar el código visual del jazz por la abstracción japonesa: pinceladas azul marino sobre papel crudo, más cerca del arte que de una portada.",
    },
    format: { en: "12″ vinyl · Sleeve, label, inner sleeve", es: "Vinilo 12″ · Portada, galleta y funda" },
    images: [W("lab/vinyl-miles.webp"), ...[1, 2, 3, 4].map((i) => W(`lab/vinyl-miles-${i}.webp`))],
    orbit: [W("lab/vinyl-miles-1.webp"), W("lab/vinyl-miles-3.webp"), W("lab/vinyl-miles-2.webp")],
  },
  {
    slug: "film-posters",
    title: "Film Posters",
    kind: { en: "Posters", es: "Pósters" },
    year: "2025",
    origin: { en: "Four of my favourite films.", es: "Cuatro de mis películas favoritas." },
    experiment: {
      en: "Tell each film in a single image: halftones, print textures and type at full scale.",
      es: "Contar cada película en una sola imagen: tramas, texturas de imprenta y tipografía a gran escala.",
    },
    format: { en: "Poster · Series of 4", es: "Póster · Serie de 4" },
    images: [W("posters/01.webp"), W("posters/02.webp"), W("posters/03.webp"), W("posters/04.webp")],
    orbit: [W("posters/02.webp"), W("posters/01.webp"), W("posters/03.webp"), W("posters/04.webp")],
  },
  {
    slug: "jpn-drift",
    title: "Retro JPN Drift",
    kind: { en: "Posters", es: "Pósters" },
    year: "2026",
    origin: {
      en: "Japanese car culture of the nineties: Supra, Impreza and Skyline.",
      es: "La cultura del motor japonés de los noventa: Supra, Impreza y Skyline.",
    },
    experiment: {
      en: "A triptych in the language of the retro poster: flat colour, grain and speed.",
      es: "Un tríptico con el lenguaje del póster retro: color plano, grano y velocidad.",
    },
    format: { en: "Poster · Triptych", es: "Póster · Tríptico" },
    images: [1, 2, 3].map((i) => W(`lab/jpn-drift-${i}.webp`)),
    orbit: [2, 1, 3].map((i) => W(`lab/jpn-drift-${i}.webp`)),
  },
  {
    slug: "animal-series",
    title: "ASCII Animal Series",
    kind: { en: "Type · Illustration", es: "Tipografía · Ilustración" },
    year: "2025",
    origin: {
      en: "ASCII was one of the first ways to draw with a screen.",
      es: "El ASCII fue una de las primeras formas de dibujar con una pantalla.",
    },
    experiment: {
      en: "Portray a horse, a wolf, an eagle and a leopard with nothing but characters, in a retro-futurist key.",
      es: "Retratar un caballo, un lobo, un águila y un leopardo solo con caracteres, en clave retrofuturista.",
    },
    format: { en: "Typographic illustration · Series of 4", es: "Ilustración tipográfica · Serie de 4" },
    images: [W("posters/05.webp")],
    orbit: [W("posters/05.webp")],
  },
  {
    slug: "ceramics",
    title: "Ceramics",
    kind: { en: "3D", es: "3D" },
    year: "2026",
    origin: {
      en: "The oldest material, made with the newest tool.",
      es: "El material más antiguo, hecho con la herramienta más nueva.",
    },
    experiment: {
      en: "Pieces modelled in Blender and directed from Claude through MCP, with glazes, speckles and flaws that feel handmade.",
      es: "Piezas modeladas en Blender y dirigidas desde Claude a través de MCP, con esmaltes, motas e imperfecciones que parecen hechas a mano.",
    },
    format: { en: "3D render · Blender + Claude (MCP)", es: "Render 3D · Blender + Claude (MCP)" },
    images: [W("cutouts/ceramics.webp"), W("lab/ceramics-detail.webp")],
    orbit: [W("cutouts/ceramics.webp"), W("lab/ceramics-detail.webp")],
  },
  {
    slug: "objects",
    title: "Objects",
    kind: { en: "3D", es: "3D" },
    year: "2026",
    origin: { en: "My own name as raw material.", es: "Mi propio nombre como materia prima." },
    experiment: {
      en: "A wax seal and a chrome keychain: a personal identity turned into objects.",
      es: "Un sello de lacre y un llavero cromado: identidad personal convertida en objeto.",
    },
    format: { en: "3D render", es: "Render 3D" },
    images: [W("lab/03.webp"), W("lab/02.webp")],
    orbit: [W("cutouts/seal.webp"), W("cutouts/keychain.webp")],
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
