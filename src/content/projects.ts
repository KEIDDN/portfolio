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
    type: { en: "Audiovisual game experience", es: "Experiencia de juego audiovisual" },
    role: {
      en: "Product design, creative direction, creative development",
      es: "Diseño de producto, dirección creativa, desarrollo creativo",
    },
    tools: "Three.js, PixiJS, Figma, Ableton",
    summary: {
      en: "The falling-blocks game, rebuilt as a piece of music. Every drop lands on the beat.",
      es: "El juego de bloques que caen, reconstruido como una pieza musical. Cada bloque cae a ritmo.",
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
          en: "Everyone knows how to play it. Almost nobody has felt it. TETRA takes the most familiar puzzle in the world and turns it into an audiovisual instrument: the soundtrack reacts to every move, spatial audio places each piece around you, and the interface steps back until there is only rhythm, light and blocks.",
          es: "Todo el mundo sabe jugarlo. Casi nadie lo ha sentido. TETRA coge el puzle más conocido del mundo y lo convierte en un instrumento audiovisual: la música reacciona a cada movimiento, el audio espacial coloca cada pieza a tu alrededor y la interfaz se aparta hasta que solo quedan ritmo, luz y bloques.",
        },
      },
      { kind: "video", src: W("tetra/experience.mp4"), poster: W("tetra/03.webp"), layout: "full" },
      {
        kind: "text",
        label: { en: "Experience", es: "Experiencia" },
        body: {
          en: "Free and without ads, by design. A real-time 3D landing built in Three.js sets the tone before the first move; the game itself runs on a WebGL renderer so the music never waits for the frame. Versus mode, custom bots and a full account system turn a single session into something you come back to. Best with headphones.",
          es: "Gratis y sin anuncios, por decisión de diseño. Una landing en 3D en tiempo real con Three.js marca el tono antes del primer movimiento; el juego corre sobre un renderer WebGL para que la música nunca espere al frame. Modo versus, bots personalizados y un sistema de cuentas convierten una partida en algo a lo que vuelves. Mejor con auriculares.",
        },
      },
      { kind: "row", srcs: [W("tetra/03.webp"), W("tetra/02.webp")], alt: "TETRA experience" },
      {
        kind: "statement",
        body: {
          en: "Design for the ears first. The eyes will follow.",
          es: "Diseñar primero para el oído. Los ojos vienen después.",
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
    type: { en: "Wellbeing app", es: "App de bienestar" },
    role: {
      en: "Product design, UX, 3D direction, creative development",
      es: "Diseño de producto, UX, dirección 3D, desarrollo creativo",
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
        label: { en: "The metaphor", es: "La metáfora" },
        title: {
          en: "Taking care of yourself is gardening.",
          es: "Cuidarte es cuidar un jardín.",
        },
        body: {
          en: "Self-care apps usually feel like homework. Tendu replaces streaks and guilt with a floating island that is yours: every moment you give yourself — a walk, a breath, an early night — makes it grow. Skip a day and nothing dies. It just waits for you.",
          es: "Las apps de autocuidado suelen parecer deberes. Tendu cambia las rachas y la culpa por una isla flotante que es tuya: cada momento que te dedicas — un paseo, respirar, acostarte pronto — la hace crecer. Si un día no puedes, no muere nada. Simplemente te espera.",
        },
      },
      { kind: "video", src: W("tendu/onboarding.mp4"), poster: W("tendu/04.webp"), layout: "full" },
      {
        kind: "text",
        label: { en: "Craft", es: "Oficio" },
        body: {
          en: "A low-poly diorama rendered in real time, with weather, falling leaves and soft clouds that respond to how you are doing. Calm typography, one green and a single black button — the product gets quieter so you can.",
          es: "Un diorama low-poly renderizado en tiempo real, con clima, hojas que caen y nubes suaves que responden a cómo estás. Tipografía tranquila, un verde y un único botón negro — el producto baja la voz para que tú también puedas.",
        },
      },
      { kind: "row", srcs: [W("tendu/02.webp"), W("tendu/03.webp")], alt: "Tendu onboarding" },
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
