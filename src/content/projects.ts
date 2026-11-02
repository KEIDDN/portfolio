import type { L } from "./i18n";

export type Theme = { bg: string; fg: string; accent: string; muted?: string };

/**
 * Every case study follows the same order:
 * cover → idea → numbered moments → details → statement → next.
 * Moments use video when there is video and images when there isn't.
 */
export type Block =
  | { kind: "idea"; title: L; body: L }
  | {
      kind: "moment";
      title: L;
      body: L;
      media: string;
      poster?: string;
      sound?: boolean;
      layout?: "full" | "wide";
      also?: string[];
    }
  | { kind: "image"; src: string; alt: string; layout?: "full" | "wide" | "inset" }
  | { kind: "pair"; srcs: [string, string]; alt: string }
  | { kind: "icons"; title: L; body: L }
  | { kind: "details"; items: { label: L; body: L }[] }
  | { kind: "chapter"; title: string; kicker: string; body: L; theme: Theme }
  | { kind: "statement"; body: L };

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
  url?: string;
  theme: Theme;
  archive?: boolean;
  blocks: Block[];
};

const W = (p: string) => `/work/${p}`;

export const projects: Project[] = [
  {
    slug: "tetra",
    title: "TETRA",
    year: "2026",
    label: "OXIA Labs",
    type: { en: "Audiovisual game", es: "Juego audiovisual" },
    role: { en: "Product design, UX/UI, visual system, music", es: "Diseño de producto, UX/UI, sistema visual, música" },
    platforms: { en: "Web, macOS, Windows, mobile", es: "Web, macOS, Windows y móvil" },
    tools: "Figma, Three.js, Ableton",
    summary: {
      en: "My take on the perfect game: falling blocks and electronic music that doesn't play over you — it plays with every move.",
      es: "Mi versión del juego perfecto: bloques que caen y música electrónica que no suena de fondo, sino con cada movimiento.",
    },
    cover: W("tetra/v/cover.webp"),
    coverVideo: W("tetra/v/cover.mp4"),
    url: "https://tetra-blocks.vercel.app/",
    theme: { bg: "#000000", fg: "#f2f2f0", accent: "#ffffff", muted: "#7a7a78" },
    blocks: [
      {
        kind: "idea",
        title: { en: "I've always played with music on.", es: "Siempre he jugado con música." },
        body: {
          en: "To me, Tetris is the perfect game, and I've always played it with electronic music on. I felt it deserved a modern redesign, so I made one as a personal project — with the music not in the background, but part of the game. Stack, hold, clear. Tension and release, like a set that pulls you into a trance.",
          es: "Para mí el Tetris es el juego perfecto, y siempre lo he jugado con música electrónica de fondo. Sentía que le faltaba un rediseño moderno y quise hacerlo como proyecto personal: que la música no sonara de fondo, sino que fuera parte del juego. Apilar, aguantar, limpiar líneas. Tensión y liberación, como una sesión que te mete en trance.",
        },
      },
      {
        kind: "moment",
        title: { en: "An entrance that sets the mood", es: "Una entrada que te prepara" },
        body: {
          en: "Before you play, a short 3D intro introduces the idea: music and blocks speak the same language. No tutorials.",
          es: "Antes de jugar, una intro corta en 3D te presenta la idea: la música y los bloques hablan el mismo idioma. Sin tutoriales.",
        },
        media: W("tetra/v/intro.mp4"),
        poster: W("tetra/v/intro.webp"),
        sound: true,
      },
      {
        kind: "moment",
        title: { en: "Every skin is a room", es: "Cada skin es una sala" },
        body: {
          en: "Fifteen skins, each with its own materials, light and electronic track. Changing skin means changing room.",
          es: "Quince skins, cada una con sus materiales, su luz y su propio tema de música electrónica. Cambiar de skin es cambiar de sala.",
        },
        media: W("tetra/v/skins.mp4"),
        poster: W("tetra/v/skins.webp"),
        sound: true,
      },
      {
        kind: "moment",
        title: { en: "Playing is listening", es: "Jugar es escuchar" },
        body: {
          en: "Every rotation, drop and clear lands inside the track, with spatial audio. The background reacts to the game, like playing with the lights off.",
          es: "Cada giro, caída y línea suena dentro de la pista, con audio espacial. El fondo reacciona a la partida, como jugar con las luces apagadas.",
        },
        media: W("tetra/v/game.mp4"),
        poster: W("tetra/v/game.webp"),
        sound: true,
        layout: "full",
      },
      {
        kind: "icons",
        title: { en: "An icon dictionary made of blocks", es: "Un diccionario de iconos hecho de bloques" },
        body: {
          en: "Every TETRA icon is drawn on a 5×5 grid, using the same rounded cells as the pieces. It's what I'm proudest of: the visual system comes straight out of the game.",
          es: "Cada icono de TETRA se dibuja sobre una cuadrícula de 5×5, con las mismas celdas redondeadas que las piezas. Es de lo que más orgulloso estoy: el sistema visual sale del propio juego.",
        },
      },
      {
        kind: "moment",
        title: { en: "Opponents with a pulse", es: "Rivales con pulso" },
        body: {
          en: "Named bots with their own personality, a Versus mode and Cups, so there's always a reason to come back.",
          es: "Bots con nombre y personalidad propia, modo Versus y Copas, para que siempre haya un motivo para volver.",
        },
        media: W("tetra/v/opponents.mp4"),
        poster: W("tetra/v/opponents.webp"),
        sound: true,
      },
      {
        kind: "moment",
        title: { en: "Choosing is design too", es: "Elegir también es diseño" },
        body: {
          en: "Mode and skin on a single screen, with a live preview. Two decisions, one click.",
          es: "Modo y skin en una sola pantalla, con vista previa en directo. Dos decisiones, un clic.",
        },
        media: W("tetra/v/select.mp4"),
        poster: W("tetra/v/select.webp"),
        sound: true,
      },
      {
        kind: "moment",
        title: { en: "Web, desktop and mobile", es: "Web, escritorio y móvil" },
        body: {
          en: "It runs in the browser, installs on macOS and Windows, and on mobile it has controls designed for touch.",
          es: "Se juega en el navegador, se instala en macOS y Windows, y en el móvil tiene controles pensados para el tacto.",
        },
        media: W("tetra/v/desktop.mp4"),
        poster: W("tetra/v/desktop.webp"),
        also: [W("tetra/m-landing.webp"), W("tetra/m-choose.webp"), W("tetra/m-game.webp")],
      },
      {
        kind: "details",
        items: [
          {
            label: { en: "Colour", es: "Color" },
            body: {
              en: "Near-total black, so the light comes from the pieces and the music.",
              es: "Un negro casi absoluto, para que la luz la pongan las piezas y la música.",
            },
          },
          {
            label: { en: "Sound", es: "Sonido" },
            body: {
              en: "One track per skin, effects mixed in time and spatial audio. Best with headphones.",
              es: "Un tema por skin, efectos mezclados a tempo y audio espacial. Mejor con auriculares.",
            },
          },
          {
            label: { en: "No noise", es: "Sin ruido" },
            body: {
              en: "Free, no ads, no store. Nothing between you and the game.",
              es: "Gratis, sin anuncios y sin tienda. Nada entre tú y la partida.",
            },
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
    platforms: { en: "Mobile (web prototype)", es: "Móvil (prototipo web)" },
    tools: "Figma, Blender, Three.js",
    summary: {
      en: "A wellbeing app where looking after yourself grows a garden.",
      es: "Una app de bienestar en la que cuidarte hace crecer un jardín.",
    },
    cover: W("tendu/v/days.webp"),
    coverVideo: W("tendu/v/days.mp4"),
    theme: { bg: "#f6f2ea", fg: "#1b1f1c", accent: "#4f7a3a", muted: "#8a8a80" },
    blocks: [
      {
        kind: "idea",
        title: { en: "We forget to stop.", es: "Se nos olvida parar." },
        body: {
          en: "We rush through the day and rarely stop to look after ourselves. I wanted an app that invites you to do it without pressure: no streaks to break, no red badges. The metaphor is a garden. Every moment you give yourself makes it grow, and if one day you can't, nothing withers. It was my first app designed for mobile.",
          es: "Vamos todo el día corriendo y casi nunca paramos a cuidarnos. Quería una app que te invitara a hacerlo sin presión: sin rachas que se rompen ni avisos en rojo. La metáfora es un jardín. Cada momento que te dedicas lo hace crecer, y si un día no puedes, no se marchita. Fue mi primera app pensada para móvil.",
        },
      },
      {
        kind: "moment",
        title: { en: "It grows with you", es: "Crece contigo" },
        body: {
          en: "You start with one small tree. The more you come back, the bigger the island gets: day 1, day 12, day 290.",
          es: "Empiezas con un árbol pequeño. Cuanto más vuelves, más grande es la isla: día 1, día 12, día 290.",
        },
        media: W("tendu/v/days.mp4"),
        poster: W("tendu/v/days.webp"),
        layout: "full",
      },
      {
        kind: "moment",
        title: { en: "Focus that grows things", es: "Concentrarte hace crecer cosas" },
        body: {
          en: "Set a timer, put your phone down, and when you're done something new sprouts in your garden.",
          es: "Pones un temporizador, dejas el móvil y, al terminar, brota algo nuevo en tu jardín.",
        },
        media: W("tendu/v/focus.mp4"),
        poster: W("tendu/v/focus.webp"),
      },
      {
        kind: "moment",
        title: { en: "Breathe with something alive", es: "Respirar con algo vivo" },
        body: {
          en: "An orb that grows and shrinks with your breath. Nothing else on screen.",
          es: "Una esfera que se expande y se contrae con tu respiración. Nada más en pantalla.",
        },
        media: W("tendu/v/breathe.mp4"),
        poster: W("tendu/v/breathe.webp"),
      },
      {
        kind: "moment",
        title: { en: "A journal that asks the right question", es: "Un diario que hace la pregunta justa" },
        body: {
          en: "One question a day. Slide to say how you feel and a flower opens with you.",
          es: "Una pregunta al día. Deslizas para decir cómo estás y una flor se abre contigo.",
        },
        media: W("tendu/v/journal.mp4"),
        poster: W("tendu/v/journal.webp"),
      },
      {
        kind: "moment",
        title: { en: "Spend it on something beautiful", es: "Gástalo en algo bonito" },
        body: {
          en: "What you earn by looking after yourself goes into seeds, trees and small details for your island.",
          es: "Lo que ganas cuidándote lo inviertes en semillas, árboles y pequeños detalles para tu isla.",
        },
        media: W("tendu/v/nursery.mp4"),
        poster: W("tendu/v/nursery.webp"),
      },
      {
        kind: "moment",
        title: { en: "It lives on your time", es: "Vive a tu ritmo" },
        body: {
          en: "Real seasons, sunrises and nights that follow your clock.",
          es: "Estaciones reales, amaneceres y noches que siguen tu reloj.",
        },
        media: W("tendu/v/seasons.mp4"),
        poster: W("tendu/v/seasons.webp"),
        layout: "full",
      },
      {
        kind: "details",
        items: [
          {
            label: { en: "Colour", es: "Color" },
            body: { en: "Warm paper tones and a single green.", es: "Tonos cálidos de papel y un solo verde." },
          },
          {
            label: { en: "Form", es: "Forma" },
            body: {
              en: "A real-time low-poly diorama. Panels float over the garden, so you never leave it.",
              es: "Un diorama low-poly en tiempo real. Los paneles flotan sobre el jardín para que nunca salgas de él.",
            },
          },
          {
            label: { en: "Tone", es: "Tono" },
            body: { en: "Short, kind words. No guilt.", es: "Textos cortos y amables. Nada de culpa." },
          },
        ],
      },
      {
        kind: "moment",
        title: { en: "Every corner, considered", es: "Cada rincón, pensado" },
        body: {
          en: "Tendu is a working proof of concept. The next step is a native mobile app.",
          es: "Tendu es una prueba de concepto que funciona. El siguiente paso es una app nativa para móvil.",
        },
        media: W("tendu/v/screens.mp4"),
        poster: W("tendu/v/screens.webp"),
        layout: "full",
      },
      {
        kind: "statement",
        body: { en: "Good for you. Not for your attention.", es: "Buena para ti. No para tu atención." },
      },
    ],
  },
  {
    slug: "unwind-dark-matter",
    title: "Unwind & Dark Matter",
    year: "2026",
    label: "OXIA Labs",
    type: { en: "Audio plugins", es: "Plugins de audio" },
    role: { en: "Product design, UI, 3D, packaging", es: "Diseño de producto, UI, 3D, packaging" },
    platforms: { en: "Any DAW, as plugins", es: "Cualquier DAW, como plugin" },
    tools: "Figma, Blender",
    summary: {
      en: "Two real audio plugins: a tape machine you can play and a reverb you can see.",
      es: "Dos plugins de audio reales: una máquina de cinta que se toca y una reverb que se ve.",
    },
    cover: W("dark-matter/02.webp"),
    theme: { bg: "#0b0a10", fg: "#efeef4", accent: "#a98bff", muted: "#7c7a88" },
    blocks: [
      {
        kind: "idea",
        title: { en: "Plugins that feel like instruments.", es: "Plugins que se sienten como instrumentos." },
        body: {
          en: "I've been producing music for over ten years, and a lot of plugins look like spreadsheets with knobs. I wanted to design the opposite: interfaces that tell you how something will sound before you hear it. Both work today inside any DAW.",
          es: "Llevo más de diez años produciendo música y muchos plugins parecen hojas de cálculo con potenciómetros. Quise diseñar lo contrario: interfaces que te dicen cómo va a sonar algo antes de oírlo. Los dos funcionan hoy dentro de cualquier DAW.",
        },
      },
      {
        kind: "chapter",
        title: "Unwind",
        kicker: "Tape Manipulation Instrument",
        body: {
          en: "A reel-to-reel machine. Wow, flutter, age and saturation are physical controls, and stop, play and reverse work like a real transport. Off-white hardware and a single orange light.",
          es: "Una máquina de bobinas. Wow, flutter, age y saturation son controles físicos, y stop, play y reverse funcionan como un transporte real. Hardware blanco roto y una sola luz naranja.",
        },
        theme: { bg: "#ecebe6", fg: "#141414", accent: "#e8601c", muted: "#8b8984" },
      },
      { kind: "image", src: W("unwind/01.webp"), alt: "Unwind interface", layout: "wide" },
      { kind: "pair", srcs: [W("unwind/02.webp"), W("unwind/03.webp")], alt: "Unwind packaging and detail" },
      {
        kind: "chapter",
        title: "Dark Matter",
        kicker: "Space Reverb",
        body: {
          en: "The reverb tail is a nebula at the centre of the interface. Size, decay and diffusion bend it in real time: you see the room before you hear it.",
          es: "La cola de la reverb es una nebulosa en el centro de la interfaz. Size, decay y diffusion la deforman en tiempo real: ves la sala antes de oírla.",
        },
        theme: { bg: "#0b0a10", fg: "#efeef4", accent: "#a98bff", muted: "#7c7a88" },
      },
      { kind: "image", src: W("dark-matter/02.webp"), alt: "Dark Matter interface", layout: "wide" },
      { kind: "image", src: W("dark-matter/01.webp"), alt: "Dark Matter detail", layout: "inset" },
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
      en: "A digital bank named after the truth. Brand and app — my first product design project.",
      es: "Un banco digital que se llama como la verdad. Marca y app: mi primer proyecto de producto.",
    },
    cover: W("veritas/07.webp"),
    theme: { bg: "#0f1411", fg: "#eef3ee", accent: "#43d36a", muted: "#7f8a82" },
    blocks: [
      {
        kind: "idea",
        title: { en: "Veritas: Latin for truth.", es: "Veritas: verdad, en latín." },
        body: {
          en: "In 2024 I wanted to understand how a real product is designed, not just a brand. I looked at modern digital banks and imagined one with a single promise: no small print. Brand and app were designed as one system.",
          es: "En 2024 quise entender cómo se diseña un producto de verdad, no solo una marca. Me fijé en los bancos digitales modernos y planteé uno con una sola promesa: nada de letra pequeña. La marca y la app se diseñaron como un mismo sistema.",
        },
      },
      {
        kind: "moment",
        title: { en: "Confident, close, a little retro", es: "Segura, cercana y un punto retro" },
        body: {
          en: "A soft, high-contrast serif, a V monogram that works as app icon, card mark and signature, and one electric green.",
          es: "Una serif suave y con mucho contraste, un monograma V que funciona como icono, marca en la tarjeta y firma, y un único verde eléctrico.",
        },
        media: W("veritas/06.webp"),
      },
      { kind: "pair", srcs: [W("veritas/08.webp"), W("veritas/04.webp")], alt: "Veritas cards" },
      {
        kind: "moment",
        title: { en: "Out in the street", es: "En la calle" },
        body: {
          en: "The green carries the brand on its own, even at billboard scale.",
          es: "El verde sostiene la marca por sí solo, incluso a escala de valla.",
        },
        media: W("veritas/05.webp"),
        layout: "full",
      },
      {
        kind: "moment",
        title: { en: "The app: say less, show more", es: "La app: decir menos, enseñar más" },
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
      en: "A real rebrand for a vintage shop in Salamanca. One of my first client projects.",
      es: "Un rebranding real para una tienda vintage de Salamanca. Uno de mis primeros encargos.",
    },
    cover: W("more-vintage/01.webp"),
    theme: { bg: "#111010", fg: "#f1eee6", accent: "#ff4a1c", muted: "#8a857e" },
    blocks: [
      {
        kind: "idea",
        title: { en: "Old clothes, loud identity.", es: "Ropa con historia, identidad ruidosa." },
        body: {
          en: "A second-hand fashion shop in Salamanca wanted a brand for walls, bags and pop-ups. I answered with a condensed, noisy identity built from repetition and strong colour.",
          es: "Una tienda de moda de segunda mano en Salamanca quería una marca para muros, bolsas y pop-ups. Respondí con una identidad condensada y ruidosa, construida a base de repetición y color.",
        },
      },
      { kind: "image", src: W("more-vintage/01.webp"), alt: "More Vintage posters", layout: "wide" },
      { kind: "pair", srcs: [W("more-vintage/02.webp"), W("more-vintage/03.webp")], alt: "Flyers and bag" },
    ],
  },
];

export const workSlugs = ["tetra", "tendu", "unwind-dark-matter", "veritas"];
export const getProject = (slug: string) => projects.find((p) => p.slug === slug);
export const nextProject = (slug: string) => {
  const order = [...workSlugs, "more-vintage"];
  const i = order.indexOf(slug);
  return getProject(order[(i + 1) % order.length])!;
};
