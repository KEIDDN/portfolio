import type { L } from "./i18n";

export type Theme = { bg: string; fg: string; accent: string; muted?: string };

export type Feature = { title: L; body: L; media: string; poster?: string; frame?: "browser" | "phone" | "none" };

export type Block =
  | { kind: "text"; label: L; title?: L; body: L }
  | { kind: "image"; src: string; alt: string; layout?: "full" | "wide" | "inset" }
  | { kind: "row"; srcs: string[]; alt: string }
  | { kind: "video"; src: string; poster: string; layout?: "full" | "wide" }
  | { kind: "browser"; src: string; poster?: string; url: string }
  | { kind: "phones"; srcs: string[]; posters?: string[] }
  | { kind: "features"; label: L; items: Feature[] }
  | { kind: "embed"; url: string; title: string; note: L; blocked?: boolean; mobile?: boolean }
  | { kind: "objects"; srcs: string[]; captions?: string[] }
  | { kind: "statement"; body: L }
  | { kind: "theme"; theme: Theme; label?: L };

export type Project = {
  slug: string;
  title: string;
  year: string;
  label: "Oxia Labs" | "Concept" | "Client" | "Personal";
  type: L;
  role: L;
  tools: string;
  summary: L;
  cover: string;
  coverVideo?: string;
  url?: string;
  theme: Theme;
  blocks: Block[];
};

const W = (p: string) => `/work/${p}`;

export const projects: Project[] = [
  {
    slug: "tetra",
    title: "TETRA",
    year: "2026",
    label: "Oxia Labs",
    type: { en: "Audiovisual game · Web, desktop & mobile", es: "Juego audiovisual · Web, escritorio y móvil" },
    role: {
      en: "Product design, UX/UI, sound & music, creative development",
      es: "Diseño de producto, UX/UI, sonido y música, desarrollo creativo",
    },
    tools: "Three.js, WebGL, Web Audio, Figma, Ableton",
    summary: {
      en: "The perfect game, rebuilt as a piece of music. Every skin is a room with its own track, every drop lands on the beat.",
      es: "El juego perfecto, reconstruido como una pieza musical. Cada skin es una sala con su propia música y cada bloque cae a ritmo.",
    },
    cover: W("tetra/cover.webp"),
    coverVideo: W("tetra/hero.mp4"),
    url: "https://tetra-blocks.vercel.app/",
    theme: { bg: "#000000", fg: "#f2f2f0", accent: "#ffffff", muted: "#7a7a78" },
    blocks: [
      {
        kind: "text",
        label: { en: "The idea", es: "La idea" },
        title: { en: "Feel the blocks.", es: "Siente los bloques." },
        body: {
          en: "I've always thought the falling-blocks game is the perfect game. And I've always played it with electronic music on. TETRA started there: what if the music wasn't playing over the game, but was the game? Stack, clear, tension, release — the same language a DJ speaks to a room until sunrise.",
          es: "Siempre he pensado que el juego de los bloques que caen es el juego perfecto. Y siempre lo he jugado con música electrónica de fondo. TETRA nace de ahí: ¿y si la música no sonara encima del juego, sino que fuera el juego? Apilar, limpiar líneas, tensión, liberación: el mismo idioma con el que un DJ mueve una sala hasta el amanecer.",
        },
      },
      { kind: "video", src: W("tetra/v-ring.mp4"), poster: W("tetra/v-ring.webp"), layout: "full" },
      {
        kind: "features",
        label: { en: "The experience, screen by screen", es: "La experiencia, pantalla a pantalla" },
        items: [
          {
            title: { en: "An entrance, not a menu", es: "Una entrada, no un menú" },
            body: {
              en: "The first minute is a guided, real-time 3D intro: blocks orbit, the music builds, and the product explains itself without a single tutorial screen.",
              es: "El primer minuto es una intro guiada en 3D en tiempo real: los bloques orbitan, la música crece y el producto se explica solo, sin una sola pantalla de tutorial.",
            },
            media: W("tetra/v-intro.mp4"),
            poster: W("tetra/v-intro.webp"),
            frame: "browser",
          },
          {
            title: { en: "Music and blocks, one language", es: "Música y bloques, un solo idioma" },
            body: {
              en: "Every move is sound. Rotations, drops and line clears are mixed into the track, and spatial audio places each piece around you. Best with headphones — the app even asks how you're listening.",
              es: "Cada movimiento es sonido. Giros, caídas y líneas se mezclan con la pista, y el audio espacial coloca cada pieza a tu alrededor. Mejor con auriculares: la app incluso te pregunta cómo estás escuchando.",
            },
            media: W("tetra/s-listen.webp"),
            frame: "browser",
          },
          {
            title: { en: "Every skin is a room", es: "Cada skin es una sala" },
            body: {
              en: "Studio, Clay, Crystal, Liquid Glass… Each skin changes the materials, the light and the music. Its own electronic track, produced for it. Switching skin is switching club.",
              es: "Studio, Clay, Crystal, Liquid Glass… Cada skin cambia los materiales, la luz y la música. Cada una tiene su propio tema electrónico, producido para ella. Cambiar de skin es cambiar de club.",
            },
            media: W("tetra/s-crystal.webp"),
            frame: "browser",
          },
          {
            title: { en: "Lights off", es: "Con las luces apagadas" },
            body: {
              en: "The background breathes with the game: it reacts to your stack, your clears and the beat, like playing in a dark room lit only by the music.",
              es: "El fondo respira con la partida: reacciona a tu pila, a tus líneas y al ritmo, como jugar en una sala a oscuras iluminada solo por la música.",
            },
            media: W("tetra/v-game.mp4"),
            poster: W("tetra/v-game.webp"),
            frame: "browser",
          },
          {
            title: { en: "Opponents with a pulse", es: "Rivales con pulso" },
            body: {
              en: "Ten bots with their own personality and tempo, a Versus mode and Cups — tournament brackets from Foundations to Summit. Something to come back to.",
              es: "Diez bots con personalidad y tempo propios, un modo Versus y Copas: torneos por eliminatorias de Foundations a Summit. Algo a lo que volver.",
            },
            media: W("tetra/s-versus.webp"),
            frame: "browser",
          },
          {
            title: { en: "A locker, not a shop", es: "Una taquilla, no una tienda" },
            body: {
              en: "Profile, records, achievements, leaderboards and a music library for every track you've unlocked. No ads, no store, no pay-to-win. Free, by design.",
              es: "Perfil, récords, logros, rankings y una biblioteca con cada tema que has desbloqueado. Sin anuncios, sin tienda, sin pagar para ganar. Gratis, por decisión de diseño.",
            },
            media: W("tetra/s-music.webp"),
            frame: "browser",
          },
          {
            title: { en: "Tuned like an instrument", es: "Afinado como un instrumento" },
            body: {
              en: "Handling (DAS, ARR, soft drop), remappable controls, per-layer volumes and full accessibility settings. Built for casual players and for people who count frames.",
              es: "Handling (DAS, ARR, soft drop), controles reasignables, volúmenes por capa y ajustes de accesibilidad completos. Pensado para quien juega por gusto y para quien cuenta frames.",
            },
            media: W("tetra/s-sound-settings.webp"),
            frame: "browser",
          },
        ],
      },
      { kind: "row", srcs: [W("tetra/s-clay.webp"), W("tetra/s-glass.webp")], alt: "TETRA skins: Clay and Liquid Glass" },
      {
        kind: "text",
        label: { en: "Everywhere", es: "En todas partes" },
        title: { en: "Web, desktop and your pocket.", es: "Web, escritorio y tu bolsillo." },
        body: {
          en: "TETRA runs in the browser, installs as a desktop app for macOS and Windows, and lives on your home screen on mobile — with controls redesigned for touch instead of shrunk down from a keyboard.",
          es: "TETRA funciona en el navegador, se instala como app de escritorio en macOS y Windows y vive en la pantalla de inicio del móvil, con controles rediseñados para el tacto en vez de reducidos desde un teclado.",
        },
      },
      {
        kind: "phones",
        srcs: [W("tetra/m-landing.webp"), W("tetra/m-choose.webp"), W("tetra/m-game.webp"), W("tetra/m-game2.webp")],
      },
      { kind: "row", srcs: [W("tetra/s-desktop.webp"), W("tetra/s-home.webp")], alt: "TETRA desktop and mobile install" },
      {
        kind: "text",
        label: { en: "Under the hood", es: "Por dentro" },
        body: {
          en: "Three.js for the 3D landing and intro, a dedicated WebGL renderer for the board so the music never waits for a frame, and a Web Audio engine that mixes stems in real time and positions sound in space. Designed, produced and built end to end at OXIA Labs.",
          es: "Three.js para la landing y la intro en 3D, un renderer WebGL propio para el tablero para que la música nunca espere a un frame, y un motor de Web Audio que mezcla stems en tiempo real y coloca el sonido en el espacio. Diseñado, producido y desarrollado de principio a fin en OXIA Labs.",
        },
      },
      {
        kind: "embed",
        url: "https://tetra-blocks.vercel.app/",
        title: "TETRA",
        note: {
          en: "The real thing, running live. Put your headphones on.",
          es: "El producto real, funcionando aquí mismo. Ponte los auriculares.",
        },
      },
      {
        kind: "statement",
        body: {
          en: "A game you hear as much as you play.",
          es: "Un juego que se escucha tanto como se juega.",
        },
      },
    ],
  },
  {
    slug: "veritas",
    title: "Veritas",
    year: "2024",
    label: "Concept",
    type: { en: "Brand identity & product design", es: "Identidad de marca y diseño de producto" },
    role: { en: "Art direction, brand identity, UI", es: "Dirección de arte, identidad, UI" },
    tools: "Illustrator, Photoshop, Figma",
    summary: {
      en: "A bank named after the truth. Brand and product for a new kind of digital banking.",
      es: "Un banco que se llama como la verdad. Marca y producto para una nueva banca digital.",
    },
    cover: W("veritas/07.webp"),
    theme: { bg: "#0c120e", fg: "#e8efe9", accent: "#4cd964", muted: "#7f8f83" },
    blocks: [
      {
        kind: "text",
        label: { en: "Origin", es: "Origen" },
        title: { en: "Veritas — Latin for truth.", es: "Veritas — verdad, en latín." },
        body: {
          en: "Modern neobanks rewrote the rules of how money looks and feels. Veritas is my take on that world: a concept bank built on one promise — no small print. It was also my first deep dive into product design, where brand and interface had to be designed as one system.",
          es: "Los neobancos han reescrito cómo se ve y se siente el dinero. Veritas es mi versión de ese mundo: un banco concepto construido sobre una sola promesa, nada de letra pequeña. Fue también mi primera inmersión de verdad en el diseño de producto, donde marca e interfaz tenían que diseñarse como un único sistema.",
        },
      },
      { kind: "image", src: W("veritas/06.webp"), alt: "Veritas business cards", layout: "wide" },
      { kind: "theme", theme: { bg: "#4cd964", fg: "#07110a", accent: "#07110a", muted: "#1f5a2b" } },
      {
        kind: "text",
        label: { en: "Identity", es: "Identidad" },
        title: { en: "Confident, warm, a little retro.", es: "Segura, cercana, un punto retro." },
        body: {
          en: "A soft, high-contrast serif gives Veritas a voice fintech rarely has. The V monogram works as app icon, card mark and signature, and a single electric green does all the talking.",
          es: "Una serif suave y de alto contraste le da a Veritas una voz que pocas fintech tienen. El monograma V funciona como icono de app, marca en la tarjeta y firma, y un único verde eléctrico lo dice todo.",
        },
      },
      { kind: "row", srcs: [W("veritas/08.webp"), W("veritas/04.webp")], alt: "Veritas cards" },
      { kind: "theme", theme: { bg: "#0c120e", fg: "#e8efe9", accent: "#4cd964", muted: "#7f8f83" } },
      { kind: "image", src: W("veritas/05.webp"), alt: "Veritas billboard", layout: "wide" },
      {
        kind: "text",
        label: { en: "Product", es: "Producto" },
        body: {
          en: "The app follows the brand's rule: say less, show more. A card-first home, spending and earnings at a glance, and the green reserved for what actually matters.",
          es: "La app sigue la regla de la marca: decir menos, enseñar más. Una home centrada en la tarjeta, gastos e ingresos de un vistazo y el verde reservado para lo que de verdad importa.",
        },
      },
      { kind: "row", srcs: [W("veritas/02.webp"), W("veritas/01.webp")], alt: "Veritas app" },
      { kind: "image", src: W("veritas/03.webp"), alt: "Veritas logotype", layout: "wide" },
    ],
  },
  {
    slug: "unwind-dark-matter",
    title: "Unwind & Dark Matter",
    year: "2026",
    label: "Oxia Labs",
    type: { en: "Audio plugins — product design", es: "Plugins de audio — diseño de producto" },
    role: {
      en: "Product design, UI, sound design, 3D, packaging",
      es: "Diseño de producto, UI, diseño sonoro, 3D, packaging",
    },
    tools: "Figma, Blender, AI tools, Ableton Live",
    summary: {
      en: "Two real, working audio plugins by OXIA: a tape machine you can play, and a reverb the size of space.",
      es: "Dos plugins de audio reales y funcionales de OXIA: una máquina de cinta que se toca y una reverb del tamaño del espacio.",
    },
    cover: W("dark-matter/02.webp"),
    theme: { bg: "#0b0912", fg: "#ece8f6", accent: "#9b7bff", muted: "#7c7590" },
    blocks: [
      {
        kind: "text",
        label: { en: "Why plugins", es: "Por qué plugins" },
        title: { en: "Instruments, not utilities.", es: "Instrumentos, no utilidades." },
        body: {
          en: "After more than ten years producing music, I know what it's like to stare at a plugin that looks like a spreadsheet with knobs. OXIA Audio starts from the opposite question: what should a sound feel like before you hear it? Two plugins, two worlds, one design language — and both of them run in your DAW today.",
          es: "Después de más de diez años produciendo música, sé lo que es mirar un plugin que parece una hoja de cálculo con potenciómetros. OXIA Audio parte de la pregunta contraria: ¿cómo debería sentirse un sonido antes de oírlo? Dos plugins, dos mundos, un mismo lenguaje, y los dos funcionan hoy en tu DAW.",
        },
      },
      {
        kind: "theme",
        theme: { bg: "#e9e6df", fg: "#141412", accent: "#e8622c", muted: "#7c7a74" },
        label: { en: "01 — Unwind", es: "01 — Unwind" },
      },
      {
        kind: "text",
        label: { en: "Tape Manipulation Instrument", es: "Tape Manipulation Instrument" },
        body: {
          en: "A reel-to-reel machine you can bend. Wow, flutter, age and saturation become physical controls; stop, play and reverse behave like real transport. Warm off-white hardware, honest type and a single orange signal light.",
          es: "Una máquina de bobinas que se puede doblar. Wow, flutter, age y saturation se convierten en controles físicos; stop, play y reverse funcionan como un transporte real. Hardware blanco roto, tipografía honesta y una única luz naranja.",
        },
      },
      { kind: "image", src: W("unwind/01.webp"), alt: "Unwind interface", layout: "wide" },
      { kind: "row", srcs: [W("unwind/02.webp"), W("unwind/03.webp")], alt: "Unwind packaging and detail" },
      {
        kind: "theme",
        theme: { bg: "#0b0912", fg: "#ece8f6", accent: "#9b7bff", muted: "#7c7590" },
        label: { en: "02 — Dark Matter", es: "02 — Dark Matter" },
      },
      {
        kind: "text",
        label: { en: "Space Reverb", es: "Space Reverb" },
        body: {
          en: "Sonic spaces for a deeper you. The reverb tail becomes a living nebula at the centre of the interface: size, decay and diffusion reshape it in real time, so you see the room before you hear it.",
          es: "Sonic spaces for a deeper you. La cola de la reverb se convierte en una nebulosa viva en el centro de la interfaz: size, decay y diffusion la deforman en tiempo real, para que veas la sala antes de oírla.",
        },
      },
      { kind: "image", src: W("dark-matter/02.webp"), alt: "Dark Matter interface", layout: "wide" },
      { kind: "image", src: W("dark-matter/01.webp"), alt: "Dark Matter detail", layout: "inset" },
    ],
  },
  {
    slug: "tendu",
    title: "Tendu",
    year: "2026",
    label: "Oxia Labs",
    type: { en: "Wellbeing app · Proof of concept", es: "App de bienestar · Prueba de concepto" },
    role: {
      en: "Product design, UX/UI, 3D direction, creative development",
      es: "Diseño de producto, UX/UI, dirección 3D, desarrollo creativo",
    },
    tools: "Three.js, Blender, Figma",
    summary: {
      en: "Look after yourself. Watch it bloom. A garden that grows every time you take a moment for you.",
      es: "Cuídate. Míralo florecer. Un jardín que crece cada vez que te dedicas un momento.",
    },
    cover: W("tendu/cover.webp"),
    coverVideo: W("tendu/hero.mp4"),
    url: "https://tendu-beta.vercel.app/",
    theme: { bg: "#faf6f0", fg: "#1b1f1c", accent: "#4f9a62", muted: "#8a8a80" },
    blocks: [
      {
        kind: "text",
        label: { en: "The idea", es: "La idea" },
        title: {
          en: "We forget to stop.",
          es: "Se nos olvida parar.",
        },
        body: {
          en: "We run all day and rarely stop to look after ourselves. Self-care apps don't help much: streaks, red badges and guilt — more homework. Tendu starts from a different metaphor. Taking care of yourself is like tending a garden: small, regular, patient. And you can see it grow.",
          es: "Vamos corriendo todo el día y casi nunca paramos a cuidarnos. Las apps de autocuidado no ayudan mucho: rachas, avisos en rojo y culpa, más deberes. Tendu parte de otra metáfora. Cuidarte es como cuidar un jardín: poco a poco, con constancia y paciencia. Y puedes verlo crecer.",
        },
      },
      { kind: "video", src: W("tendu/onboarding.mp4"), poster: W("tendu/s-start.webp"), layout: "full" },
      {
        kind: "features",
        label: { en: "The product, step by step", es: "El producto, paso a paso" },
        items: [
          {
            title: { en: "Plant your time", es: "Planta tu tiempo" },
            body: {
              en: "Onboarding is a conversation, not a form: your name, what you want to look after, how many days a week you'll come back. Every answer shapes the island.",
              es: "El onboarding es una conversación, no un formulario: tu nombre, qué quieres cuidar, cuántos días a la semana vas a volver. Cada respuesta da forma a la isla.",
            },
            media: W("tendu/s-plant.webp"),
            frame: "browser",
          },
          {
            title: { en: "Choose your first seed", es: "Elige tu primera semilla" },
            body: {
              en: "The first decision is emotional, not functional. You pick a seed and the garden becomes yours from the very first minute.",
              es: "La primera decisión es emocional, no funcional. Eliges una semilla y el jardín es tuyo desde el primer minuto.",
            },
            media: W("tendu/s-seed.webp"),
            frame: "browser",
          },
          {
            title: { en: "Today, without pressure", es: "Hoy, sin presión" },
            body: {
              en: "A short list of small rituals for the day. Complete one and something grows. Miss one and nothing withers — the garden just waits for you.",
              es: "Una lista corta de pequeños rituales para el día. Completas uno y algo crece. Si no puedes, nada se marchita: el jardín simplemente te espera.",
            },
            media: W("tendu/s-today.webp"),
            frame: "browser",
          },
          {
            title: { en: "Calm, Focus, Read, Roots", es: "Calma, Foco, Lectura, Raíces" },
            body: {
              en: "Guided breathing and meditation, a focus timer, short reads and a journal with daily prompts. Four ways to stop, all inside the same quiet space.",
              es: "Respiración guiada y meditación, un temporizador de foco, lecturas breves y un diario con preguntas para cada día. Cuatro formas de parar, todas en el mismo espacio tranquilo.",
            },
            media: W("tendu/s-calm.webp"),
            frame: "browser",
          },
          {
            title: { en: "Make it yours", es: "Hazlo tuyo" },
            body: {
              en: "The nursery and the garden editor let you plant, move and decorate. Progress isn't a number, it's a place you've built.",
              es: "El vivero y el editor del jardín te dejan plantar, mover y decorar. El progreso no es un número, es un lugar que has construido tú.",
            },
            media: W("tendu/s-nursery.webp"),
            frame: "browser",
          },
          {
            title: { en: "Look back", es: "Mirar atrás" },
            body: {
              en: "Progress, achievements and an album of your garden through the seasons — a gentle record of the times you chose yourself.",
              es: "Progreso, logros y un álbum de tu jardín a lo largo de las estaciones: un registro amable de las veces que te elegiste.",
            },
            media: W("tendu/s-album.webp"),
            frame: "browser",
          },
        ],
      },
      { kind: "row", srcs: [W("tendu/s-breathe.webp"), W("tendu/s-roots.webp")], alt: "Tendu onboarding moments" },
      {
        kind: "text",
        label: { en: "Craft", es: "Oficio" },
        title: { en: "The product gets quieter so you can.", es: "El producto baja la voz para que tú también puedas." },
        body: {
          en: "A low-poly diorama rendered in real time, with seasons, falling leaves and soft clouds. Warm paper tones, calm typography, one green and a single black button. Every panel floats over the garden so you never leave it.",
          es: "Un diorama low-poly renderizado en tiempo real, con estaciones, hojas que caen y nubes suaves. Tonos cálidos de papel, tipografía tranquila, un verde y un único botón negro. Cada panel flota sobre el jardín para que nunca salgas de él.",
        },
      },
      { kind: "row", srcs: [W("tendu/s-focus.webp"), W("tendu/s-read.webp")], alt: "Tendu Focus and Read" },
      {
        kind: "text",
        label: { en: "Status", es: "Estado" },
        body: {
          en: "Tendu is a working proof of concept on the web, designed mobile-first. The next step is a native mobile app.",
          es: "Tendu es una prueba de concepto funcional en web, diseñada pensando primero en el móvil. El siguiente paso es una app nativa para móvil.",
        },
      },
      {
        kind: "embed",
        url: "https://tendu-beta.vercel.app/",
        title: "Tendu",
        note: {
          en: "The live beta. Plant something.",
          es: "La beta, en directo. Planta algo.",
        },
      },
    ],
  },
  {
    slug: "posters",
    title: "Posters",
    year: "2025",
    label: "Personal",
    type: { en: "Poster design & typography", es: "Diseño de cartel y tipografía" },
    role: { en: "Design, typography, image treatment", es: "Diseño, tipografía, tratamiento de imagen" },
    tools: "Photoshop, Illustrator",
    summary: {
      en: "Films I love, rewritten in halftone, grain and type. Plus an animal series in bitmap.",
      es: "Películas que me encantan, reescritas en trama, grano y tipografía. Y una serie de animales en bitmap.",
    },
    cover: W("posters/05.webp"),
    theme: { bg: "#0e0d0d", fg: "#f1eee6", accent: "#d0232f", muted: "#8a8580" },
    blocks: [
      {
        kind: "text",
        label: { en: "Series", es: "Serie" },
        title: { en: "One frame, one idea.", es: "Un fotograma, una idea." },
        body: {
          en: "A personal series of alternative film posters. Each one reduces a movie to a single gesture — a stare, a scream, a cigarette — and lets the type carry the rest.",
          es: "Una serie personal de carteles alternativos de cine. Cada uno reduce la película a un único gesto — una mirada, un grito, un cigarro — y deja que la tipografía haga el resto.",
        },
      },
      { kind: "row", srcs: [W("posters/01.webp"), W("posters/02.webp")], alt: "Batman and Trainspotting posters" },
      { kind: "row", srcs: [W("posters/03.webp"), W("posters/04.webp")], alt: "Ghost in the Shell and Whiplash posters" },
      { kind: "theme", theme: { bg: "#f1eee6", fg: "#0e0d0d", accent: "#0e0d0d", muted: "#8a8580" } },
      {
        kind: "text",
        label: { en: "Animal Series", es: "Animal Series" },
        body: {
          en: "Horse, wolf, eagle, leopard. Bitmap bodies against sharp display serifs — a study of how much an image can lose before it stops being one.",
          es: "Caballo, lobo, águila, leopardo. Cuerpos en bitmap contra serifs de display afiladas: un estudio sobre cuánto puede perder una imagen antes de dejar de serlo.",
        },
      },
      { kind: "image", src: W("posters/05.webp"), alt: "Animal Series", layout: "wide" },
    ],
  },
  {
    slug: "3d-experiments",
    title: "3D Experiments",
    year: "2026",
    label: "Personal",
    type: { en: "3D & material studies", es: "Estudios 3D y de materiales" },
    role: { en: "3D, art direction", es: "3D, dirección de arte" },
    tools: "Blender, AI tools",
    summary: {
      en: "Chrome, wax, silver and stone. Objects that don't exist — yet.",
      es: "Cromo, cera, plata y piedra. Objetos que todavía no existen.",
    },
    cover: W("lab/03.webp"),
    theme: { bg: "#050505", fg: "#efefed", accent: "#c4161c", muted: "#77736f" },
    blocks: [
      {
        kind: "text",
        label: { en: "Process", es: "Proceso" },
        title: { en: "Modelled in Blender. Pushed with AI.", es: "Modelado en Blender. Llevado más lejos con IA." },
        body: {
          en: "A playground for materials, light and identity as physical objects: my 'miki' signature in chrome and wax, jewellery built around the charro button, a vulture guarding a house.",
          es: "Un campo de pruebas de materiales, luz e identidad convertida en objeto: mi firma 'miki' en cromo y en cera, joyería construida alrededor del botón charro, un buitre que vigila una casa.",
        },
      },
      {
        kind: "objects",
        srcs: [W("cutouts/seal.webp"), W("cutouts/keychain.webp"), W("cutouts/vulture.webp")],
        captions: ["Wax seal — miki", "Chrome keychain", "Vulture"],
      },
      { kind: "statement", body: { en: "Identity you can hold.", es: "Identidad que se puede tocar." } },
      {
        kind: "objects",
        srcs: [W("cutouts/charro.webp"), W("cutouts/pendant.webp")],
        captions: ["Charro button — ring & pendant", "Rosette pendant"],
      },
      { kind: "image", src: W("lab/05.webp"), alt: "Silver rosette jewellery", layout: "wide" },
    ],
  },
  {
    slug: "more-vintage",
    title: "More Vintage",
    year: "2025",
    label: "Client",
    type: { en: "Rebranding", es: "Rebranding" },
    role: { en: "Brand identity, print", es: "Identidad de marca, impresos" },
    tools: "Illustrator, Photoshop, InDesign",
    summary: {
      en: "Old brands, new stories. A real rebrand for a vintage store in Salamanca.",
      es: "Old brands, new stories. Un rebranding real para una tienda vintage de Salamanca.",
    },
    cover: W("more-vintage/01.webp"),
    theme: { bg: "#111010", fg: "#f1eee6", accent: "#ff4a1c", muted: "#8a8580" },
    blocks: [
      {
        kind: "text",
        label: { en: "Brief", es: "Encargo" },
        body: {
          en: "A full rebrand for More Vintage, a second-hand fashion store in Salamanca: a loud, condensed identity made for walls, bags and pop-ups — and for a city that had never seen vintage look this urban.",
          es: "Un rebranding completo para More Vintage, tienda de moda de segunda mano en Salamanca: una identidad condensada y ruidosa pensada para muros, bolsas y pop-ups, en una ciudad que nunca había visto el vintage tan urbano.",
        },
      },
      { kind: "image", src: W("more-vintage/01.webp"), alt: "More Vintage posters", layout: "wide" },
      { kind: "row", srcs: [W("more-vintage/02.webp"), W("more-vintage/03.webp")], alt: "Flyers and bag" },
    ],
  },
];

export const selectedSlugs = ["tetra", "veritas", "unwind-dark-matter", "tendu", "posters"];

export const getProject = (slug: string) => projects.find((p) => p.slug === slug);

export const nextProject = (slug: string) => {
  const order = [...selectedSlugs, "3d-experiments", "more-vintage"];
  const i = order.indexOf(slug);
  return getProject(order[(i + 1) % order.length])!;
};
