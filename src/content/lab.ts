import type { L } from "./i18n";

import type { ModelKey } from "./models";

export type Series = {
  slug: string;
  title: string;
  kind: L;
  /** museum label: where it comes from and how it was made */
  origin: L;
  process: L;
  format: L;
  /** real 3D pieces, shown first in the room and turnable */
  models?: ModelKey[];
  /** the room: every image, in order */
  images: string[];
  /** the constellation in the universe: up to four pieces, the first one is the star */
  orbit: string[];
};

const W = (p: string) => `/work/${p}`;

export const labIntro: L = {
  en: "Things I make with no client and no brief. Objects, records, posters and versions of myself, made to try out an idea, a technique or a tool.",
  es: "Lo que hago sin cliente y sin briefing. Objetos, discos, pósters y versiones de mí mismo, hechos para probar una idea, una técnica o una herramienta.",
};

export const series: Series[] = [
  {
    slug: "boton-charro",
    title: "Botón Charro",
    kind: { en: "3D · Jewellery", es: "3D · Joyería" },
    origin: {
      en: "The botón charro is the emblem of Salamanca's silverwork: baroque, meticulous, from another century. I wanted to give it a second life in the language of today's jewellery brands.",
      es: "El botón charro es el emblema de la platería salmantina: barroco, minucioso, de otro siglo. Quería darle una segunda vida con el lenguaje de las marcas de joyería de ahora.",
    },
    process: {
      en: "It began as an AI-generated image I didn't like. So I modelled it from scratch in Blender: rings and pendants that keep its geometry and drop everything else.",
      es: "Empezó como una imagen generada por IA que no me convenció. Así que lo modelé de cero en Blender: anillos y colgantes que conservan su geometría y se olvidan del resto.",
    },
    format: { en: "3D render · Blender", es: "Render 3D · Blender" },
    models: ["ring"],
    images: [W("lab/04.webp"), W("cutouts/charro.webp"), W("cutouts/pendant.webp")],
    orbit: [W("cutouts/charro.webp"), W("lab/04.webp"), W("cutouts/pendant.webp")],
  },
  {
    slug: "miki-racing",
    title: "Miki Racing",
    kind: { en: "3D · Helmets", es: "3D · Cascos" },
    origin: {
      en: "I'm hooked on racing, on four wheels and on two. A helmet is a rider's signature: you have to read it at two hundred an hour.",
      es: "Me pierden las carreras, de coches y de motos. Un casco es la firma de un piloto: tiene que leerse a doscientos por hora.",
    },
    process: {
      en: "Two liveries that mix splashes of colour, Japanese type and Y2K stickers. Each helmet in three views, like a homologation sheet.",
      es: "Dos libreas que mezclan salpicaduras de color, tipografía japonesa y pegatinas Y2K. Cada casco en tres vistas, como una ficha de homologación.",
    },
    format: { en: "3D render · 2 liveries", es: "Render 3D · 2 libreas" },
    images: [W("lab/racing-1.webp"), W("lab/racing-2.webp")],
    orbit: [W("lab/racing-1.webp"), W("lab/racing-2.webp")],
  },
  {
    slug: "inhabit",
    title: "Inhabit",
    kind: { en: "3D · Concept", es: "3D · Concepto" },
    origin: {
      en: "Having a home has become a privilege. Vulture funds buy whole neighbourhoods while rents push out the people who live in them. This series is my way of saying so.",
      es: "Tener casa se ha convertido en un privilegio. Los fondos buitre compran barrios enteros mientras el alquiler expulsa a quienes viven en ellos. Esta serie es mi forma de decirlo.",
    },
    process: {
      en: "I draw each piece flat first, in Illustrator and Photoshop, then model it in Blender: a vulture guarding its prey, a house squeezed until it buckles, a house that melts on your keyring.",
      es: "Dibujo cada pieza en plano, en Illustrator y Photoshop, y luego la modelo en Blender: un buitre que custodia su presa, una casa estrujada hasta deformarse, una casa que se derrite en tu llavero.",
    },
    format: { en: "3D sculpture · Series of 3", es: "Escultura 3D · Serie de 3" },
    models: ["vulture", "squeeze", "keychain"],
    images: [],
    orbit: [W("lab/inhabit-house.webp"), W("cutouts/vulture.webp")],
  },
  {
    slug: "ipod",
    title: "iPod Concept",
    kind: { en: "3D · Product", es: "3D · Producto" },
    origin: {
      en: "I've always admired Apple's design, and the iPod is everywhere again. I wanted one of my own.",
      es: "Siempre he admirado el diseño de Apple, y el iPod vuelve a estar en todas partes. Quería el mío.",
    },
    process: {
      en: "A metal shell and a set of my own stickers, from the アイポッド kana to the barcode. It was my school for modelling, materials and texturing in Blender.",
      es: "Carcasa metálica y una colección de pegatinas propias, del kana アイポッド al código de barras. Fue mi escuela de modelado, materiales y texturas en Blender.",
    },
    format: { en: "3D render · Blender", es: "Render 3D · Blender" },
    models: ["ipod"],
    images: [W("lab/ipod.webp")],
    orbit: [W("lab/ipod.webp")],
  },
  {
    slug: "tutto-passa",
    title: "Tutto Passa",
    kind: { en: "Vinyl", es: "Vinilo" },
    origin: {
      en: "“Tutto passa”: everything passes, the good and the bad. A Neapolitan man on the beach and the phrase that goes with him.",
      es: "«Tutto passa»: todo pasa, lo bueno y lo malo. Un napolitano en la playa y la frase que le acompaña.",
    },
    process: {
      en: "I started from that single photograph and built around it the full release of a record that doesn't exist.",
      es: "Partí de esa única fotografía y construí a su alrededor la edición completa de un disco que no existe.",
    },
    format: { en: "12″ vinyl · Sleeve, label, booklet, inner sleeve", es: "Vinilo 12″ · Portada, galleta, libreto y funda interior" },
    images: [W("lab/vinyl-tutto-passa.webp"), ...[1, 2, 3, 4, 5].map((i) => W(`lab/vinyl-tutto-passa-${i}.webp`))],
    orbit: [W("lab/vinyl-tutto-passa-1.webp"), W("lab/vinyl-tutto-passa-2.webp"), W("lab/vinyl-tutto-passa-3.webp")],
  },
  {
    slug: "any-kind-of-blues",
    title: "Any Kind of Blues",
    kind: { en: "Vinyl", es: "Vinilo" },
    origin: {
      en: "An imagined Miles Davis record. I redesign covers often, and I make my own.",
      es: "Un disco imaginado de Miles Davis. Rediseño portadas a menudo, y también hago las mías.",
    },
    process: {
      en: "Jazz can be pure abstraction, so I took it all the way: navy brushstrokes on raw paper, with a Japanese hand. Closer to art than to a cover.",
      es: "El jazz a veces es abstracción pura, así que la llevé al extremo: pinceladas azul marino sobre papel crudo, con mano japonesa. Más cerca del arte que de una portada.",
    },
    format: { en: "12″ vinyl · Sleeve, label, inner sleeve", es: "Vinilo 12″ · Portada, galleta y funda" },
    images: [W("lab/vinyl-miles.webp"), ...[1, 2, 3, 4].map((i) => W(`lab/vinyl-miles-${i}.webp`))],
    orbit: [W("lab/vinyl-miles-1.webp"), W("lab/vinyl-miles-3.webp"), W("lab/vinyl-miles-2.webp")],
  },
  {
    slug: "miki",
    title: "Miki",
    kind: { en: "3D · Self-portrait", es: "3D · Autorretrato" },
    origin: {
      en: "I like dropping myself into worlds that aren't mine. Exaggerated versions of me.",
      es: "Me gusta meterme en universos que no son el mío. Versiones exageradas de mí mismo.",
    },
    process: {
      en: "A Lego minifigure, a realistic street version, and a low-poly character straight out of the PlayStation 2, to me the peak of video game design. The series is still open: more worlds are on the way.",
      es: "Una figura de Lego, una versión realista de calle y un personaje low poly salido de la PlayStation 2, para mí la cumbre del diseño de videojuegos. La serie sigue abierta: vienen más universos.",
    },
    format: { en: "3D render · Open series", es: "Render 3D · Serie abierta" },
    models: ["lego", "street"],
    images: [W("lab/miki-lego.webp"), W("lab/miki-lowpoly.webp")],
    orbit: [W("lab/miki-lego.webp"), W("lab/miki-lowpoly.webp")],
  },
  {
    slug: "film-posters",
    title: "Film Posters",
    kind: { en: "Posters", es: "Pósters" },
    origin: { en: "Four of my favourite films.", es: "Cuatro de mis películas favoritas." },
    process: {
      en: "Each film told in a single image, in Photoshop and Illustrator: halftones, print textures and type at full scale.",
      es: "Cada película contada en una sola imagen, en Photoshop e Illustrator: tramas, texturas de imprenta y tipografía a gran escala.",
    },
    format: { en: "Poster · Series of 4", es: "Póster · Serie de 4" },
    images: [W("posters/01.webp"), W("posters/02.webp"), W("posters/03.webp"), W("posters/04.webp")],
    orbit: [W("posters/02.webp"), W("posters/01.webp"), W("posters/03.webp"), W("posters/04.webp")],
  },
  {
    slug: "fruy2k",
    title: "FruY2K",
    kind: { en: "Image · Still life", es: "Imagen · Bodegón" },
    origin: {
      en: "The most everyday thing in the house, dressed in the loudest graphics of the 2000s.",
      es: "Lo más cotidiano de la casa, vestido con la gráfica más ruidosa de los 2000.",
    },
    process: {
      en: "An apple, an orange, a lemon, a pear and a plum, composed in Photoshop and covered in holographic stickers, chrome and pixels.",
      es: "Manzana, naranja, limón, pera y ciruela, compuestas en Photoshop y cubiertas de pegatinas holográficas, cromados y píxeles.",
    },
    format: { en: "Photoshop · Composition and 5 details", es: "Photoshop · Composición y 5 detalles" },
    images: [W("lab/fruy2k.webp"), ...[1, 2, 3, 4, 5].map((i) => W(`lab/fruy2k-${i}.webp`))],
    orbit: [W("lab/fruy2k.webp")],
  },
  {
    slug: "jpn-drift",
    title: "Retro JPN Drift",
    kind: { en: "Posters", es: "Pósters" },
    origin: {
      en: "Cars and Japanese design: two of my weaknesses. Supra, Impreza and Skyline, the nineties in three posters.",
      es: "Los coches y el diseño japonés: dos de mis debilidades. Supra, Impreza y Skyline, los noventa en tres pósters.",
    },
    process: {
      en: "Photoshop and Illustrator, in the language of the retro poster: flat colour, grain and speed.",
      es: "Photoshop e Illustrator, con el lenguaje del póster retro: color plano, grano y velocidad.",
    },
    format: { en: "Poster · Triptych", es: "Póster · Tríptico" },
    images: [1, 2, 3].map((i) => W(`lab/jpn-drift-${i}.webp`)),
    orbit: [2, 1, 3].map((i) => W(`lab/jpn-drift-${i}.webp`)),
  },
  {
    slug: "keiddn",
    title: "KEIDDN",
    kind: { en: "3D · Identity", es: "3D · Identidad" },
    origin: {
      en: "KEIDDN is my name as a producer. I make electronic music with one foot in the experimental.",
      es: "KEIDDN es mi nombre como productor. Hago música electrónica con un pie en lo experimental.",
    },
    process: {
      en: "An abstract K, modelled in Blender. I wanted a sign that looks more like my music than like a letter.",
      es: "Una K abstracta, modelada en Blender. Quería un signo que se pareciera más a mi música que a una letra.",
    },
    format: { en: "3D logo · Blender", es: "Logotipo 3D · Blender" },
    models: ["keiddn"],
    images: [W("lab/keiddn.webp")],
    orbit: [W("lab/keiddn.webp")],
  },
  {
    slug: "animal-series",
    title: "ASCII Animal Series",
    kind: { en: "Type · Illustration", es: "Tipografía · Ilustración" },
    origin: {
      en: "ASCII was one of the first ways to draw with a screen.",
      es: "El ASCII fue una de las primeras formas de dibujar con una pantalla.",
    },
    process: {
      en: "A horse, a wolf, an eagle and a leopard made of nothing but characters. Old technology with a present-day finish.",
      es: "Un caballo, un lobo, un águila y un leopardo hechos solo con caracteres. Tecnología antigua con acabado de hoy.",
    },
    format: { en: "Typographic illustration · Series of 4", es: "Ilustración tipográfica · Serie de 4" },
    images: [W("posters/05.webp")],
    orbit: [W("posters/05.webp")],
  },
  {
    slug: "ceramics",
    title: "Ceramics",
    kind: { en: "3D · Objects", es: "3D · Objetos" },
    origin: {
      en: "I love interiors. I wanted to design my own objects, even if for now they only exist in 3D.",
      es: "Me encanta la decoración. Quería diseñar mis propios objetos, aunque de momento solo existan en 3D.",
    },
    process: {
      en: "One of the first things I modelled in Blender. Clay is forgiving: warps, specks and flaws are what make it look handmade.",
      es: "Fue de lo primero que modelé en Blender. La arcilla perdona: las deformaciones, las motas y los defectos son lo que la hacen parecer hecha a mano.",
    },
    format: { en: "3D render · Blender", es: "Render 3D · Blender" },
    models: ["ceramics"],
    images: [W("cutouts/ceramics.webp"), W("lab/ceramics-detail.webp")],
    orbit: [W("cutouts/ceramics.webp"), W("lab/ceramics-detail.webp")],
  },
  {
    slug: "objects",
    title: "Objects",
    kind: { en: "3D · Objects", es: "3D · Objetos" },
    origin: { en: "My own name as raw material.", es: "Mi propio nombre como materia prima." },
    process: {
      en: "A wax seal and a chrome keychain. Each started as a concept test and ended up modelled in Blender, with my lettering.",
      es: "Un sello de lacre y un llavero cromado. Cada uno empezó como prueba de concepto y acabó modelado en Blender, con mi rotulación.",
    },
    format: { en: "3D render · Blender", es: "Render 3D · Blender" },
    models: ["sello", "miki-keychain"],
    images: [],
    orbit: [W("cutouts/seal.webp"), W("cutouts/keychain.webp")],
  },
];

/** Wall pieces: x/y/w in % of the canvas (150vw × 160vh), d = depth for pointer parallax. */
export const wall = [
  { s: "film-posters", src: W("posters/01.webp"), x: 3, y: 4, w: 9, d: 0.6 },
  { s: "boton-charro", src: W("cutouts/charro.webp"), x: 15, y: 8, w: 8, d: 1.2, cut: true },
  { s: "tutto-passa", src: W("lab/vinyl-tutto-passa-1.webp"), x: 27, y: 3, w: 11, d: 0.4 },
  { s: "objects", src: W("cutouts/seal.webp"), x: 42, y: 9, w: 7, d: 1.4, cut: true },
  { s: "miki-racing", src: W("lab/racing-1.webp"), x: 50, y: 8, w: 13, d: 0.7 },
  { s: "jpn-drift", src: W("lab/jpn-drift-1.webp"), x: 64, y: 5, w: 8, d: 0.5 },
  { s: "ipod", src: W("lab/ipod.webp"), x: 74, y: 12, w: 11, d: 0.8 },
  { s: "objects", src: W("cutouts/keychain.webp"), x: 88, y: 3, w: 5, d: 1.5, cut: true },
  { s: "ceramics", src: W("cutouts/ceramics.webp"), x: 1, y: 40, w: 9, d: 1.1, cut: true },
  { s: "any-kind-of-blues", src: W("lab/vinyl-miles-1.webp"), x: 14, y: 42, w: 11, d: 0.5 },
  { s: "animal-series", src: W("posters/05.webp"), x: 29, y: 44, w: 14, d: 0.6 },
  { s: "inhabit", src: W("cutouts/vulture.webp"), x: 47, y: 38, w: 6, d: 1.2, cut: true },
  { s: "miki", src: W("lab/miki-lego.webp"), x: 57, y: 41, w: 7, d: 0.8 },
  { s: "boton-charro", src: W("lab/04.webp"), x: 69, y: 45, w: 13, d: 0.6 },
  { s: "boton-charro", src: W("cutouts/pendant.webp"), x: 86, y: 39, w: 5, d: 1.3, cut: true },
  { s: "film-posters", src: W("posters/03.webp"), x: 6, y: 74, w: 8, d: 0.7 },
  { s: "tutto-passa", src: W("lab/vinyl-tutto-passa-3.webp"), x: 19, y: 78, w: 14, d: 0.5 },
  { s: "any-kind-of-blues", src: W("lab/vinyl-miles-3.webp"), x: 38, y: 76, w: 12, d: 0.6 },
  { s: "inhabit", src: W("lab/inhabit-house.webp"), x: 55, y: 75, w: 12, d: 0.5 },
  { s: "tutto-passa", src: W("lab/vinyl-tutto-passa-2.webp"), x: 71, y: 76, w: 15, d: 0.6 },
  { s: "jpn-drift", src: W("lab/jpn-drift-2.webp"), x: 89, y: 70, w: 8, d: 0.9 },
];
