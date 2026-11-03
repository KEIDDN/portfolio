import type { L } from "./i18n";
import type { Step } from "@/components/case/Evolution";
import type { RoomItem } from "@/components/case/Room";

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
  | { kind: "statement"; body: L; sub?: L }
  /** a design decision: the why, then the proof (rendered live from the product's own code when it can be) */
  | {
      kind: "decision";
      n: string;
      title: L;
      body: L;
      proof: "icons" | "skins" | "logo" | "palette" | { media: string; poster?: string; phone?: boolean };
    }
  /** a decision told through its versions, pinned and replaced as you scroll */
  | { kind: "evolution"; n: string; title: L; body: L; steps: Step[] }
  /** the material hung on a wall that slides by, like a room in the Lab */
  | { kind: "room"; title: L; body: L; items: RoomItem[] };

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
  decisions: { en: "The decisions", es: "Las decisiones" },
  room: { en: "The room", es: "La sala" },
  result: { en: "The result", es: "El resultado" },
};
const D = (n: number) => `${String(n).padStart(2, "0")} —`;

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
      en: "The falling-blocks classic, redesigned from the music up.",
      es: "El clásico de los bloques, rediseñado desde la música.",
    },
    cover: W("tetra/v/cover.webp"),
    coverVideo: W("tetra/v/cover.mp4"),
    url: "https://tetra-blocks.vercel.app/",
    theme: { bg: "#000000", fg: "#f2f2f0", accent: "#ffffff", muted: "#8f8f8c" },
    blocks: [
      { kind: "stage", n: "01", label: ST.idea },
      {
        kind: "idea",
        title: { en: "Falling blocks and electronic music speak the same language.", es: "Los bloques y la música electrónica hablan el mismo idioma." },
        body: {
          en: "Both build tension and release it in one go. I've been producing music for ten years and I've always loved this game. TETRA comes from putting the two together, and from redesigning a classic to the standard of a product made today.",
          es: "Los dos acumulan tensión y la sueltan de golpe. Llevo diez años produciendo música y siempre me ha encantado este juego. TETRA nace de juntar los dos mundos y de rediseñar un clásico con la exigencia de un producto de hoy.",
        },
      },
      {
        kind: "moment",
        title: { en: "Stack and the mix tightens. Clear and the drop lands.", es: "Apila y la mezcla se tensa. Limpia y llega el drop." },
        body: {
          en: "The music answers the game in real time, and binaural audio places every sound around you.",
          es: "La música responde a la partida en tiempo real, y el audio binaural coloca cada sonido a tu alrededor.",
        },
        media: W("tetra/v/listen.mp4"),
        poster: W("tetra/v/listen.webp"),
        sound: true,
      },
      { kind: "stage", n: "02", label: ST.decisions },
      {
        kind: "decision",
        n: D(1),
        title: { en: "Everything is made of pieces. Starting with the logo.", es: "Todo está hecho de piezas. Empezando por el logo." },
        body: {
          en: "Four minos make the T. When the game opens, the mark builds itself piece by piece in just over a second and the word rises behind it. You're playing before you play.",
          es: "Cuatro minos forman la T. Al abrir el juego, la marca se monta pieza a pieza en poco más de un segundo y la palabra sube detrás. Antes de jugar, ya estás jugando.",
        },
        proof: "logo",
      },
      {
        kind: "decision",
        n: D(2),
        title: { en: "Icons that follow the rules of the game.", es: "Iconos con las reglas del juego." },
        body: {
          en: "I love grids. Each icon is drawn on a 5×5 grid with the same rounded cells as the pieces: 29 glyphs that make moving through the menu feel like more of the game.",
          es: "Me encantan las retículas. Cada icono se dibuja en una rejilla de 5×5 con las mismas celdas redondeadas que las piezas: 29 glifos que hacen que moverse por el menú se sienta como seguir jugando.",
        },
        proof: "icons",
      },
      {
        kind: "decision",
        n: D(3),
        title: { en: "Black, seven colours, two typefaces.", es: "Negro, siete colores y dos tipografías." },
        body: {
          en: "The pieces and the music bring the light, so the interface stays near-absolute black. One colour per piece, not one more. Plus Jakarta Sans to read; Geist Mono for every number, because in a speed game the numbers matter.",
          es: "La luz la ponen las piezas y la música, así que la interfaz se queda en un negro casi absoluto. Un color por pieza, ni uno más. Plus Jakarta Sans para leer y Geist Mono para cada cifra, porque en un juego de velocidad los números importan.",
        },
        proof: "palette",
      },
      {
        kind: "decision",
        n: D(4),
        title: { en: "Leave the world without breaking it.", es: "Salirse del universo sin romperlo." },
        body: {
          en: "Each skin changes materials, light and music, but every one keeps the shape of the piece. The classics, NES and Game Boy, nod to the original: the eighties inside a present-day interface is a contrast that works.",
          es: "Cada skin cambia materiales, luz y música, pero todas respetan la forma de la pieza. Las clásicas, NES y Game Boy, son un guiño al original: los ochenta dentro de una interfaz de hoy es un contraste que funciona.",
        },
        proof: "skins",
      },
      {
        kind: "evolution",
        n: D(5),
        title: { en: "The menu: five versions to get it right.", es: "El menú: cinco versiones hasta dar con él." },
        body: {
          en: "They all worked. I kept the one that asks least of you: the mode, large; a single action; and, once you choose, the skin running live beside it.",
          es: "Todas funcionaban. Me quedé con la que menos pide: el modo en grande, una sola acción y, al elegir, la skin en directo al lado.",
        },
        steps: [
          { src: W("tetra/menu/m1.webp"), label: { en: "Cover with a live game", es: "Portada con partida en directo" }, body: { en: "The name, huge, and a game playing itself. Handsome, but it only offered one mode.", es: "El nombre en grande y una partida jugándose sola. Bonita, pero solo ofrecía un modo." } },
          { src: W("tetra/menu/m2.webp"), label: { en: "Launcher", es: "Lanzador" }, body: { en: "Every mode at headline size, like a console menu.", es: "Todos los modos a tamaño de titular, como un menú de consola." } },
          { src: W("tetra/menu/m3.webp"), label: { en: "Wheel with a glass lens", es: "Rueda con lente de cristal" }, body: { en: "The chosen mode sits in a Liquid Glass lens; the rest bend away along an arc.", es: "El modo elegido entra en una lente de Liquid Glass y los demás se curvan en arco." } },
          { src: W("tetra/menu/m4.webp"), label: { en: "Centred", es: "Centrado" }, body: { en: "The wheel moves to the centre and the game drops behind it.", es: "La rueda pasa al centro y la partida se queda de fondo." } },
          { src: W("tetra/menu/m5.webp"), label: { en: "Only what matters", es: "Solo lo esencial" }, body: { en: "No game behind it: the mode, one line and one action.", es: "Sin partida de fondo: el modo, una línea y una acción." } },
          { src: W("tetra/menu/m6.webp"), label: { en: "Once you choose", es: "Al elegir" }, body: { en: "The menu steps aside and you try the skin live before you play.", es: "El menú se aparta a la izquierda y pruebas la skin en directo antes de jugar." } },
        ],
      },
      { kind: "stage", n: "03", label: ST.room },
      {
        kind: "room",
        title: { en: "TETRA, piece by piece.", es: "TETRA, pieza a pieza." },
        body: {
          en: "The opening, the game, the opponents and the phone, hung whole.",
          es: "La entrada, la partida, los rivales y el móvil, colgados enteros.",
        },
        items: [
          { src: W("tetra/v/intro.mp4"), poster: W("tetra/v/intro.webp"), caption: { en: "A short 3D opening sets the tone. No tutorials.", es: "Una intro breve en 3D marca el tono. Sin tutoriales." } },
          { src: W("tetra/v/game.mp4"), poster: W("tetra/v/game.webp"), caption: { en: "Every rotation, drop and clear lands inside the track.", es: "Cada giro, caída y línea suena dentro de la pista." } },
          { src: W("tetra/v/opponents.mp4"), poster: W("tetra/v/opponents.webp"), caption: { en: "Ten named opponents, Versus and Cups.", es: "Diez rivales con nombre propio, Versus y Copas." } },
          { src: W("tetra/v/select.mp4"), poster: W("tetra/v/select.webp"), caption: { en: "Mode and skin on one screen, with a live preview.", es: "Modo y skin en una sola pantalla, con vista previa en directo." } },
          { src: W("tetra/v/skins.mp4"), poster: W("tetra/v/skins.webp"), caption: { en: "Changing skin means changing room, and track.", es: "Cambiar de skin es cambiar de sala, y de tema." } },
          { src: W("tetra/v/desktop.mp4"), poster: W("tetra/v/desktop.webp"), caption: { en: "A desktop app for macOS and Windows.", es: "App de escritorio para macOS y Windows." } },
          { src: W("tetra/m-landing.webp"), caption: { en: "On the phone, from the first screen.", es: "En el móvil, desde la primera pantalla." }, phone: true },
          { src: W("tetra/m-choose.webp"), caption: { en: "Choosing with your thumb.", es: "Elegir con el pulgar." }, phone: true },
          { src: W("tetra/m-game.webp"), caption: { en: "Controls designed for touch.", es: "Controles pensados para el tacto." }, phone: true },
        ],
      },
      { kind: "stage", n: "04", label: ST.result },
      {
        kind: "details",
        items: [
          {
            label: { en: "How I made it", es: "Cómo lo hice" },
            body: { en: "Design in Figma, and AI directed through OXIA's own design agents and skills. The AI builds; the design decisions are mine.", es: "Diseño en Figma y dirección de IA con agentes y skills de diseño propios de OXIA. La IA construye; las decisiones de diseño son mías." },
          },
          {
            label: { en: "In numbers", es: "En cifras" },
            body: { en: "15 skins, 10 opponents, 29 icons and one track per skin.", es: "15 skins, 10 rivales, 29 iconos y un tema por skin." },
          },
          {
            label: { en: "For everyone", es: "Para todos" },
            body: { en: "Free, with no ads. Web, macOS, Windows and mobile.", es: "Gratis y sin anuncios. Web, macOS, Windows y móvil." },
          },
        ],
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
    heroVideo: W("tendu/v/t-bloom.mp4"),
    heroPoster: W("tendu/v/t-bloom.webp"),
    theme: { bg: "#f9f6f1", fg: "#1b1f1c", accent: "#4f7a3a", muted: "#7a7a72" },
    blocks: [
      { kind: "stage", n: "01", label: ST.idea },
      {
        kind: "idea",
        title: { en: "Looking after yourself shouldn't be one more chore.", es: "Cuidarte no debería ser otra obligación." },
        body: {
          en: "Wellbeing apps compete for your attention too: streaks that break, red badges, guilt for not opening them. Tendu turns that around. Focusing, breathing or writing how you feel grows an island, and if one day you don't come back, nothing withers.",
          es: "Las apps de bienestar también compiten por tu atención: rachas que se rompen, avisos en rojo, culpa por no entrar. Tendu le da la vuelta. Concentrarte, respirar o escribir cómo estás hace crecer una isla, y si un día no entras, no se marchita nada.",
        },
      },
      { kind: "stage", n: "02", label: ST.decisions },
      {
        kind: "decision",
        n: D(1),
        title: { en: "No guilt, in every word.", es: "Sin culpa, en cada palabra." },
        body: {
          en: "Nobody makes you do anything. Fancy twenty minutes on the timer? Go ahead. Just want to look at your garden and the gifts the animals left you? That counts too. Being away never costs you, and the copy says so on every screen.",
          es: "Nadie te obliga a nada. ¿Te apetecen veinte minutos de temporizador? Adelante. ¿Solo quieres ver tu jardín y los regalos que te han dejado los animales? También vale. Ausentarte nunca resta, y el copy lo dice en cada pantalla.",
        },
        proof: { media: W("tendu/v/t-welcome.webp"), phone: true },
      },
      {
        kind: "evolution",
        n: D(2),
        title: { en: "The garden is the interface.", es: "El jardín es la interfaz." },
        body: {
          en: "No progress bars, no charts: your consistency shows on the island. From day one to year one, it grows with the time you give yourself.",
          es: "Ni barras de progreso ni gráficas: tu constancia se ve en la isla. Del día 1 al año 1, crece con el tiempo que te dedicas.",
        },
        steps: [
          { src: W("tendu/island/s1.webp"), label: { en: "Day 1", es: "Día 1" }, body: { en: "Newborn: one plot, one tree.", es: "Recién nacida: una parcela y un árbol." } },
          { src: W("tendu/island/s2.webp"), label: { en: "Week 2", es: "Semana 2" }, body: { en: "16 plots. Paths and the first lights arrive.", es: "16 parcelas. Llegan los caminos y las primeras luces." } },
          { src: W("tendu/island/s3.webp"), label: { en: "Month 3", es: "Mes 3" }, body: { en: "25 plots, a pond and the first blossom.", es: "25 parcelas, un estanque y la primera floración." } },
          { src: W("tendu/island/s4.webp"), label: { en: "Year 1", es: "Año 1" }, body: { en: "The whole island, laid out your way.", es: "La isla completa, a tu manera." } },
        ],
      },
      {
        kind: "decision",
        n: D(3),
        title: { en: "Low poly and Liquid Glass, in measure.", es: "Low poly y Liquid Glass, con medida." },
        body: {
          en: "Low poly brings warmth; glass brings lightness. Liquid Glass is everywhere right now, so I kept it for what floats above the garden (panels, controls, notices) and never for the garden itself.",
          es: "El low poly da calidez; el cristal, ligereza. Liquid Glass está en todas partes, así que lo reservé para lo que flota sobre el jardín (paneles, controles, avisos) y nunca para el jardín en sí.",
        },
        proof: { media: W("tendu/v/t-night.webp"), phone: true },
      },
      { kind: "stage", n: "03", label: ST.room },
      {
        kind: "room",
        title: { en: "Tendu, screen by screen.", es: "Tendu, pantalla a pantalla." },
        body: {
          en: "Focus, bloom, breathe, write and plant: the app in use, recorded on the phone.",
          es: "Concentrarse, florecer, respirar, escribir y plantar: la app en uso, grabada en el móvil.",
        },
        items: [
          { src: W("tendu/v/t-focus.mp4"), poster: W("tendu/v/t-focus.webp"), phone: true, caption: { en: "A timer, the phone face down, and something new sprouts.", es: "Un temporizador, el móvil a un lado y algo nuevo brota." } },
          { src: W("tendu/v/t-bloom.mp4"), poster: W("tendu/v/t-bloom.webp"), phone: true, caption: { en: "Finish, and it blooms.", es: "Termina y florece." } },
          { src: W("tendu/v/t-breathe.mp4"), poster: W("tendu/v/t-breathe.webp"), phone: true, caption: { en: "An orb that breathes with you. Nothing else on screen.", es: "Una esfera que respira contigo. Nada más en pantalla." } },
          { src: W("tendu/v/t-journal.mp4"), poster: W("tendu/v/t-journal.webp"), phone: true, caption: { en: "One question a day. Slide to say how you feel.", es: "Una pregunta al día. Deslizas para decir cómo estás." } },
          { src: W("tendu/v/t-nursery.mp4"), poster: W("tendu/v/t-nursery.webp"), phone: true, caption: { en: "What you earn, you plant.", es: "Lo que ganas, lo plantas." } },
        ],
      },
      { kind: "stage", n: "04", label: ST.result },
      {
        kind: "details",
        items: [
          {
            label: { en: "How I made it", es: "Cómo lo hice" },
            body: { en: "First concept in Figma, refined with AI. Built with React and Three.js, installable on the iPhone.", es: "Primer concepto en Figma, refinado con IA. Hecha con React y Three.js, instalable en el iPhone." },
          },
          {
            label: { en: "Private by design", es: "Privado por diseño" },
            body: { en: "The journal is yours alone. It's never shared.", es: "El diario es solo tuyo. Nunca se comparte." },
          },
          {
            label: { en: "Nothing for sale", es: "Nada a la venta" },
            body: { en: "Coins and progress are earned, never bought.", es: "Las monedas y el progreso se ganan; nunca se compran." },
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
