import type { L } from "./i18n";

export type Theme = { bg: string; fg: string; accent: string; muted?: string };

/**
 * Every case study follows the same arc, marked by numbered stages:
 * cover → facts → 01 the challenge → 02 the idea → 03 the system → 04 in use → closing line → next.
 */
export type Block =
  | { kind: "stage"; n: string; label: L }
  | { kind: "idea"; title: L; body: L }
  | {
      kind: "moment";
      title: L;
      body: L;
      media: string;
      poster?: string;
      sound?: boolean;
      /** panel: floats on a quiet panel (default) · full: edge to edge · plain: sits on the page colour, edges melted */
      layout?: "panel" | "full" | "plain";
      also?: string[];
    }
  | { kind: "sequence"; items: { title: L; body: L; media: string; poster: string }[] }
  /** phone screens side by side, each with its caption */
  | { kind: "screens"; items: { title: L; body: L; media: string; poster: string }[] }
  | { kind: "image"; src: string; alt: string; layout?: "full" | "wide" | "inset" | "bleed" }
  | { kind: "pair"; srcs: [string, string]; alt: string }
  | { kind: "icons"; title: L; body: L }
  | { kind: "skins"; title: L; body: L }
  | { kind: "details"; items: { label: L; body: L }[] }
  | { kind: "chapter"; title: string; kicker: string; body: L; theme: Theme }
  | { kind: "statement"; body: L; sub?: L };

export type Project = {
  slug: string;
  title: string;
  year: string;
  label: "OXIA Labs" | "Concept" | "Client";
  type: L;
  role: L;
  platforms?: L;
  tools: string;
  summary: L;
  cover: string;
  coverVideo?: string;
  /** cover: the media fills the screen · contain: it sits whole on the project colour */
  hero?: "cover" | "contain";
  /** a different clip for the case's own hero (the cover stays for cards) */
  heroVideo?: string;
  heroPoster?: string;
  url?: string;
  theme: Theme;
  archive?: boolean;
  blocks: Block[];
};

const W = (p: string) => `/work/${p}`;

const ST = {
  challenge: { en: "The challenge", es: "El reto" },
  idea: { en: "The idea", es: "La idea" },
  system: { en: "The system", es: "El sistema" },
  use: { en: "In use", es: "En uso" },
};

export const projects: Project[] = [
  {
    slug: "tetra",
    title: "TETRA",
    year: "2026",
    label: "OXIA Labs",
    type: { en: "Audiovisual game", es: "Juego audiovisual" },
    role: { en: "Product design, UX/UI, visual system, music", es: "Diseño de producto, UX/UI, sistema visual, música" },
    platforms: { en: "Web, macOS, Windows, mobile", es: "Web, macOS, Windows y móvil" },
    tools: "Figma, TypeScript, React, PixiJS, Three.js, Web Audio, Ableton",
    summary: {
      en: "The falling-blocks classic, redesigned to be played with your ears.",
      es: "El clásico de los bloques, rediseñado para jugarse también con los oídos.",
    },
    cover: W("tetra/v/cover.webp"),
    coverVideo: W("tetra/v/cover.mp4"),
    url: "https://tetra-blocks.vercel.app/",
    theme: { bg: "#000000", fg: "#f2f2f0", accent: "#ffffff", muted: "#8f8f8c" },
    blocks: [
      { kind: "stage", n: "01", label: ST.challenge },
      {
        kind: "idea",
        title: { en: "The perfect game, stuck in the past.", es: "El juego perfecto, atrapado en el pasado." },
        body: {
          en: "Few games are as well designed as falling blocks. Yet its online versions have fallen behind: cluttered interfaces, ads, and music that merely plays along.",
          es: "Pocos juegos están tan bien diseñados como el de los bloques que caen. Pero sus versiones online se han quedado atrás: interfaces recargadas, publicidad y una música que se limita a acompañar.",
        },
      },
      { kind: "stage", n: "02", label: ST.idea },
      {
        kind: "idea",
        title: { en: "Music you don't just hear. Music you play.", es: "Que la música no suene de fondo. Que se juegue." },
        body: {
          en: "Blocks and electronic music share one language: building tension and releasing it. In TETRA, every move becomes part of the track.",
          es: "Los bloques y la música electrónica comparten un mismo lenguaje: acumular tensión y liberarla. En TETRA, cada movimiento forma parte de la pista.",
        },
      },
      {
        kind: "moment",
        title: { en: "Stack and the mix tightens. Clear and the drop lands.", es: "Apila y la mezcla se tensa. Limpia y llega el drop." },
        body: {
          en: "The music answers the game in real time, with a binaural audio engine that places every sound around you.",
          es: "La música responde a la partida en tiempo real, con un motor de audio binaural que coloca cada sonido a tu alrededor.",
        },
        media: W("tetra/v/listen.mp4"),
        poster: W("tetra/v/listen.webp"),
        sound: true,
      },
      { kind: "stage", n: "03", label: ST.system },
      {
        kind: "icons",
        title: { en: "An icon dictionary built from blocks.", es: "Un diccionario de iconos hecho de bloques." },
        body: {
          en: "Every icon is drawn on a 5×5 grid with the same rounded cells as the pieces. The visual system is born from the game itself.",
          es: "Cada icono se dibuja sobre una retícula de 5×5 con las mismas celdas redondeadas que las piezas. El sistema visual nace del propio juego.",
        },
      },
      {
        kind: "skins",
        title: { en: "Fifteen skins. Fifteen rooms.", es: "Quince skins. Quince salas." },
        body: {
          en: "Each skin redefines materials, light and soundtrack. Rendered here with the game's own code.",
          es: "Cada skin redefine materiales, luz y banda sonora. Renderizadas aquí con el código real del juego.",
        },
      },
      {
        kind: "moment",
        title: { en: "Changing skin means changing room.", es: "Cambiar de skin es cambiar de sala." },
        body: {
          en: "Every skin brings its own electronic track, produced for the game.",
          es: "Cada una trae su propio tema de música electrónica, producido para el juego.",
        },
        media: W("tetra/v/skins.mp4"),
        poster: W("tetra/v/skins.webp"),
        sound: true,
      },
      {
        kind: "details",
        items: [
          {
            label: { en: "Colour", es: "Color" },
            body: { en: "Near-absolute black: the light comes from the pieces and the music.", es: "Negro casi absoluto: la luz la ponen las piezas y la música." },
          },
          {
            label: { en: "Sound", es: "Sonido" },
            body: { en: "One original track per skin and binaural spatial audio. Best with headphones.", es: "Un tema original por skin y audio espacial binaural. Mejor con auriculares." },
          },
          {
            label: { en: "No noise", es: "Sin ruido" },
            body: { en: "Free, no ads, no store. Nothing between the player and the game.", es: "Gratis, sin anuncios y sin tienda. Nada entre el jugador y la partida." },
          },
        ],
      },
      { kind: "stage", n: "04", label: ST.use },
      {
        kind: "moment",
        title: { en: "An entrance that sets the tone.", es: "Una entrada que marca el tono." },
        body: {
          en: "A short 3D intro presents the idea before the first game. No tutorials.",
          es: "Una intro breve en 3D presenta la idea antes de la primera partida. Sin tutoriales.",
        },
        media: W("tetra/v/intro.mp4"),
        poster: W("tetra/v/intro.webp"),
        sound: true,
      },
      {
        kind: "moment",
        title: { en: "Playing is listening.", es: "Jugar es escuchar." },
        body: {
          en: "The background breathes with the game; every rotation, drop and clear lands inside the track.",
          es: "El fondo respira con la partida; cada giro, caída y línea suena dentro de la pista.",
        },
        media: W("tetra/v/game.mp4"),
        poster: W("tetra/v/game.webp"),
        sound: true,
        layout: "full",
      },
      {
        kind: "moment",
        title: { en: "Opponents with personality.", es: "Rivales con personalidad." },
        body: {
          en: "Named bots, a Versus mode and Cups: there's always a reason to come back.",
          es: "Bots con nombre propio, modo Versus y Copas: siempre hay un motivo para volver.",
        },
        media: W("tetra/v/opponents.mp4"),
        poster: W("tetra/v/opponents.webp"),
        sound: true,
      },
      {
        kind: "moment",
        title: { en: "Two decisions, one click.", es: "Dos decisiones, un clic." },
        body: {
          en: "Mode and skin on a single screen, with a live preview.",
          es: "Modo y skin en una sola pantalla, con vista previa en directo.",
        },
        media: W("tetra/v/select.mp4"),
        poster: W("tetra/v/select.webp"),
        sound: true,
      },
      {
        kind: "moment",
        title: { en: "Web, desktop and mobile.", es: "Web, escritorio y móvil." },
        body: {
          en: "Plays in the browser, installs on macOS and Windows, and on mobile comes with controls designed for touch.",
          es: "Se juega en el navegador, se instala en macOS y Windows y, en móvil, llega con controles pensados para el tacto.",
        },
        media: W("tetra/v/desktop.mp4"),
        poster: W("tetra/v/desktop.webp"),
        also: [W("tetra/m-landing.webp"), W("tetra/m-choose.webp"), W("tetra/m-game.webp")],
      },
      {
        kind: "statement",
        body: { en: "A game you hear as much as you play.", es: "Un juego que se escucha tanto como se juega." },
      },
    ],
  },
  {
    slug: "tendu",
    title: "Tendu",
    year: "2026",
    label: "OXIA Labs",
    type: { en: "Wellbeing app · Proof of concept", es: "App de bienestar · Prueba de concepto" },
    role: { en: "Product design, UX/UI, visual direction", es: "Diseño de producto, UX/UI, dirección visual" },
    platforms: { en: "Web app, installable on iPhone (PWA)", es: "Web app instalable en el iPhone (PWA)" },
    tools: "Figma, TypeScript, React, React Three Fiber, Motion",
    summary: {
      en: "A wellbeing app where looking after yourself makes a garden bloom.",
      es: "Una app de bienestar en la que cuidarte hace florecer un jardín.",
    },
    cover: W("tendu/v/i-days.webp"),
    coverVideo: W("tendu/v/i-days.mp4"),
    hero: "contain",
    heroVideo: W("tendu/v/t-growth.mp4"),
    heroPoster: W("tendu/v/t-growth.webp"),
    theme: { bg: "#f9f6f1", fg: "#1b1f1c", accent: "#4f7a3a", muted: "#7a7a72" },
    blocks: [
      { kind: "stage", n: "01", label: ST.challenge },
      {
        kind: "idea",
        title: { en: "Wellbeing apps compete for your attention too.", es: "Las apps de bienestar también compiten por tu atención." },
        body: {
          en: "Streaks that break, red badges, guilt for not opening them. The opposite of what wellbeing promises.",
          es: "Rachas que se rompen, avisos en rojo, culpa por no entrar. Justo lo contrario de lo que promete el bienestar.",
        },
      },
      { kind: "stage", n: "02", label: ST.idea },
      {
        kind: "idea",
        title: { en: "A garden that grows when you look after yourself.", es: "Un jardín que crece cuando te cuidas." },
        body: {
          en: "Every pause, every breath and every journal entry grows a small island. If one day you can't, nothing withers.",
          es: "Cada pausa, cada respiración y cada entrada en el diario hacen crecer una pequeña isla. Si un día no puedes, no se marchita nada.",
        },
      },
      {
        kind: "screens",
        items: [
          {
            title: { en: "It grows with you.", es: "Crece contigo." },
            body: { en: "Day 1, week 2, month 3, year 1: the island reflects the time you give yourself.", es: "Día 1, semana 2, mes 3, año 1: la isla refleja el tiempo que te dedicas." },
            media: W("tendu/v/t-growth.mp4"),
            poster: W("tendu/v/t-growth.webp"),
          },
          {
            title: { en: "It lives on your time.", es: "Vive a tu ritmo." },
            body: { en: "Sunrise, golden hour and night follow your own clock.", es: "Amanecer, hora dorada y noche siguen tu propio reloj." },
            media: W("tendu/v/t-daylight.mp4"),
            poster: W("tendu/v/t-daylight.webp"),
          },
        ],
      },
      { kind: "stage", n: "03", label: ST.system },
      {
        kind: "details",
        items: [
          {
            label: { en: "Wellbeing before engagement", es: "Bienestar antes que engagement" },
            body: { en: "Progress without guilt: being away never costs you. Coins and progress are never for sale.", es: "Progreso sin culpa: ausentarse nunca resta. Ni monedas ni progreso a la venta." },
          },
          {
            label: { en: "Private by design", es: "Privado por diseño" },
            body: { en: "The journal is yours alone. It's never shared.", es: "El diario es solo tuyo. Nunca se comparte." },
          },
          {
            label: { en: "Visual calm", es: "Calma visual" },
            body: { en: "A floating low-poly garden and Liquid Glass panels that never take you out of it.", es: "Un jardín low poly flotante y paneles de Liquid Glass que nunca te sacan de él." },
          },
        ],
      },
      { kind: "stage", n: "04", label: ST.use },
      {
        kind: "sequence",
        items: [
          {
            title: { en: "Focus that grows things.", es: "Concentrarse hace crecer cosas." },
            body: { en: "A timer, the phone face down, and when you finish, something new sprouts on the island.", es: "Un temporizador, el móvil a un lado y, al terminar, algo nuevo brota en la isla." },
            media: W("tendu/v/t-focus.mp4"),
            poster: W("tendu/v/t-focus.webp"),
          },
          {
            title: { en: "Breathe with something alive.", es: "Respirar con algo vivo." },
            body: { en: "An orb that swells and settles with your breath. Nothing else on screen.", es: "Una esfera que se expande y se contrae al ritmo de tu respiración. Nada más en pantalla." },
            media: W("tendu/v/t-breathe.mp4"),
            poster: W("tendu/v/t-breathe.webp"),
          },
          {
            title: { en: "A journal that asks the right question.", es: "Un diario que hace la pregunta justa." },
            body: { en: "One question a day. Slide to say how you feel and a flower opens with you.", es: "Una pregunta al día. Deslizas para decir cómo estás y una flor se abre contigo." },
            media: W("tendu/v/t-journal.mp4"),
            poster: W("tendu/v/t-journal.webp"),
          },
          {
            title: { en: "What you earn, you plant.", es: "Lo que ganas, lo plantas." },
            body: { en: "Looking after yourself earns seeds, trees and small details for your island.", es: "Lo que ganas cuidándote se convierte en semillas, árboles y detalles para tu isla." },
            media: W("tendu/v/t-nursery.mp4"),
            poster: W("tendu/v/t-nursery.webp"),
          },
        ],
      },
      {
        kind: "statement",
        body: { en: "Good for you. Not for your attention.", es: "Buena para ti. No para tu atención." },
        sub: { en: "A working proof of concept. Next step: a native app.", es: "Una prueba de concepto funcional. Siguiente paso: la app nativa." },
      },
    ],
  },
  {
    slug: "unwind-dark-matter",
    title: "Unwind & Dark Matter",
    year: "2026",
    label: "OXIA Labs",
    type: { en: "Audio plugins", es: "Plugins de audio" },
    role: { en: "Product design, UI, sound design, 3D", es: "Diseño de producto, UI, diseño de sonido, 3D" },
    platforms: { en: "Any DAW, as plugins", es: "Cualquier DAW, como plugin" },
    tools: "Figma, Blender, C++, JUCE",
    summary: {
      en: "Two audio plugins: a tape machine you can play and a reverb you can see.",
      es: "Dos plugins de audio: una máquina de cinta que se toca y una reverb que se ve.",
    },
    cover: W("dark-matter/02.webp"),
    theme: { bg: "#08070b", fg: "#efeef4", accent: "#a98bff", muted: "#8b899a" },
    blocks: [
      { kind: "stage", n: "01", label: ST.challenge },
      {
        kind: "idea",
        title: { en: "Great sound, behind cold interfaces.", es: "Buen sonido, detrás de interfaces frías." },
        body: {
          en: "Most audio tools hide their sound behind technical, lifeless screens. These had to invite you to play.",
          es: "La mayoría de herramientas de audio esconden su sonido tras pantallas técnicas y sin vida. Estas tenían que invitar a tocar.",
        },
      },
      { kind: "stage", n: "02", label: ST.idea },
      {
        kind: "idea",
        title: { en: "Design the sound and the interface together.", es: "Diseñar el sonido y la interfaz a la vez." },
        body: {
          en: "Ten years of self-taught music production and audio engineering, put to one goal: every control should make sense to the ear and to the eye. Built in C++ with JUCE, they run in any DAW.",
          es: "Diez años produciendo música de forma autodidacta y conocimientos de ingeniería de audio, al servicio de un objetivo: que cada control se entienda con el oído y con la vista. Desarrollados en C++ con JUCE, funcionan en cualquier DAW.",
        },
      },
      {
        kind: "chapter",
        title: "Unwind",
        kicker: "Tape Manipulation Instrument",
        body: {
          en: "A lo-fi tape machine for guitars, drums or any source. Wow, flutter, age and saturation as physical controls; stop, play and reverse as a real transport.",
          es: "Una máquina de cinta lo-fi para guitarras, baterías o cualquier fuente. Wow, flutter, desgaste y saturación como controles físicos; stop, play y reverse como un transporte real.",
        },
        theme: { bg: "#ecebe6", fg: "#141414", accent: "#e8601c", muted: "#77756f" },
      },
      { kind: "image", src: W("unwind/01.webp"), alt: "Unwind interface", layout: "wide" },
      { kind: "pair", srcs: [W("unwind/02.webp"), W("unwind/03.webp")], alt: "Unwind packaging and detail" },
      {
        kind: "chapter",
        title: "Dark Matter",
        kicker: "Space Reverb",
        body: {
          en: "A spatial reverb built on complex algorithms, made to carry sound somewhere else. Its tail is a nebula that size, decay and diffusion bend in real time.",
          es: "Una reverb espacial basada en algoritmos complejos, pensada para llevar el sonido a otro lugar. Su cola es una nebulosa que size, decay y diffusion deforman en tiempo real.",
        },
        theme: { bg: "#030303", fg: "#efeef4", accent: "#a98bff", muted: "#8b899a" },
      },
      { kind: "image", src: W("dark-matter/02.webp"), alt: "Dark Matter interface", layout: "bleed" },
      { kind: "image", src: W("dark-matter/01.webp"), alt: "Dark Matter detail", layout: "bleed" },
      {
        kind: "statement",
        body: { en: "Two plugins, one language.", es: "Dos plugins, un mismo lenguaje." },
      },
    ],
  },
  {
    slug: "veritas",
    title: "Veritas",
    year: "2024",
    label: "Concept",
    type: { en: "Brand & product design", es: "Marca y diseño de producto" },
    role: { en: "Art direction, brand identity, UI", es: "Dirección de arte, identidad, UI" },
    platforms: { en: "iOS app, brand", es: "App iOS, marca" },
    tools: "Figma, Illustrator, Photoshop",
    summary: {
      en: "A digital bank with no small print. A concept brand and app.",
      es: "Un banco digital sin letra pequeña. Marca y app conceptuales.",
    },
    cover: W("veritas/07.webp"),
    theme: { bg: "#0f1411", fg: "#eef3ee", accent: "#43d36a", muted: "#8a958d" },
    blocks: [
      { kind: "stage", n: "01", label: ST.challenge },
      {
        kind: "idea",
        title: { en: "Digital banks promise transparency. Then hide it in the small print.", es: "La banca digital promete transparencia. Y la esconde en la letra pequeña." },
        body: {
          en: "A first product project, designed in Figma: imagine a bank whose brand and app keep a single promise.",
          es: "Un primer proyecto de producto, diseñado en Figma: imaginar un banco cuya marca y cuya app cumplan una sola promesa.",
        },
      },
      { kind: "stage", n: "02", label: ST.idea },
      {
        kind: "idea",
        title: { en: "Veritas: Latin for truth.", es: "Veritas: verdad, en latín." },
        body: {
          en: "A name that is a promise. A soft, high-contrast serif, a V monogram that works as icon, card mark and signature, and one electric green.",
          es: "Un nombre que es una promesa. Una serif suave de alto contraste, un monograma V que funciona como icono, sello en la tarjeta y firma, y un único verde eléctrico.",
        },
      },
      { kind: "image", src: W("veritas/06.webp"), alt: "Veritas brand", layout: "wide" },
      { kind: "pair", srcs: [W("veritas/08.webp"), W("veritas/04.webp")], alt: "Veritas cards" },
      {
        kind: "moment",
        title: { en: "Out in the street.", es: "En la calle." },
        body: { en: "The green carries the brand on its own, even at billboard scale.", es: "El verde sostiene la marca por sí solo, incluso a escala de valla." },
        media: W("veritas/05.webp"),
        layout: "full",
      },
      { kind: "stage", n: "03", label: { en: "The app", es: "La app" } },
      {
        kind: "moment",
        title: { en: "Say less, show more.", es: "Decir menos, enseñar más." },
        body: {
          en: "The card at the centre, spending and income at a glance, and green kept for what really matters.",
          es: "La tarjeta en el centro, gastos e ingresos de un vistazo y el verde reservado para lo que importa.",
        },
        media: W("veritas/02.webp"),
        also: [W("veritas/01.webp")],
      },
      { kind: "image", src: W("veritas/03.webp"), alt: "Veritas logotype", layout: "wide" },
      {
        kind: "statement",
        body: { en: "No small print.", es: "Sin letra pequeña." },
        sub: { en: "A concept project. Neither the bank nor the app exist.", es: "Proyecto conceptual. Ni el banco ni la app existen." },
      },
    ],
  },
  {
    slug: "more-vintage",
    title: "More Vintage",
    year: "2025",
    label: "Client",
    archive: true,
    type: { en: "Rebrand", es: "Rebranding" },
    role: { en: "Brand identity, print", es: "Identidad de marca, impresos" },
    tools: "Illustrator, Photoshop",
    summary: {
      en: "A rebrand for a vintage shop in Salamanca.",
      es: "Rebranding para una tienda vintage de Salamanca.",
    },
    cover: W("more-vintage/01.webp"),
    theme: { bg: "#111010", fg: "#f1eee6", accent: "#ff4a1c", muted: "#8f8a83" },
    blocks: [
      {
        kind: "idea",
        title: { en: "Clothes with a past. An identity with volume.", es: "Ropa con historia. Una identidad con volumen." },
        body: {
          en: "A second-hand fashion shop needed a brand for walls, bags and pop-ups. The answer: a condensed, loud identity built on repetition and strong colour.",
          es: "Una tienda de moda de segunda mano necesitaba una marca para muros, bolsas y pop-ups. La respuesta: una identidad condensada y ruidosa, construida a base de repetición y color.",
        },
      },
      { kind: "image", src: W("more-vintage/01.webp"), alt: "More Vintage posters", layout: "wide" },
      { kind: "pair", srcs: [W("more-vintage/02.webp"), W("more-vintage/03.webp")], alt: "Flyers and bag" },
    ],
  },
];

export const workSlugs = ["tetra", "tendu", "unwind-dark-matter", "veritas"];
export const getProject = (slug: string) => projects.find((p) => p.slug === slug);
/** The story continues after the last project: Veritas (and the archive) lead to OXIA Labs. */
export const nextAfter = (slug: string, locale: "en" | "es") => {
  const i = workSlugs.indexOf(slug);
  if (i >= 0 && i < workSlugs.length - 1) {
    const p = getProject(workSlugs[i + 1])!;
    return { href: `/${locale}/work/${p.slug}`, title: p.title, kicker: locale === "en" ? "Next project" : "Siguiente proyecto", img: p.cover };
  }
  return {
    href: `/${locale}/oxia-labs`,
    title: "OXIA Labs",
    kicker: locale === "en" ? "Next — 03 · The studio" : "Siguiente — 03 · El estudio",
    img: "/work/oxia/v-chrome.webp",
  };
};
