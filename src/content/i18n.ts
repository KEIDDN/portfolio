export const locales = ["en", "es"] as const;
export type Locale = (typeof locales)[number];
export type L = { en: string; es: string };

export const isLocale = (v: string): v is Locale =>
  (locales as readonly string[]).includes(v);

export const t = (l: L, locale: Locale) => l[locale];

export const site = {
  name: "Miki Herrero",
  email: "bymikiherrero@gmail.com",
  socials: [
    { label: "Instagram", href: "https://www.instagram.com/by.mikiherrero/" },
    {
      label: "LinkedIn",
      href: "https://www.linkedin.com/in/miguel-%C3%A1ngel-herrero-s%C3%A1nchez-2a107a298/",
    },
    { label: "Behance", href: "https://www.behance.net/mikiherrero" },
  ],
};

export const dict = {
  role: { en: "Product Designer", es: "Diseñador de producto" },
  heroNote: { en: "Product, brand & creative technology", es: "Producto, marca y tecnología creativa" },
  scroll: { en: "Scroll", es: "Scroll" },
  nav: {
    work: { en: "Work", es: "Trabajo" },
    lab: { en: "Lab", es: "Lab" },
    oxia: { en: "OXIA Labs", es: "OXIA Labs" },
    about: { en: "About", es: "Sobre mí" },
    contact: { en: "Contact", es: "Contacto" },
  },
  intro: {
    en: "I'm obsessed with everything having a reason. And with it looking perfect.",
    es: "Me obsesiona que todo tenga sentido. Y que se vea perfecto.",
  },
  introSmall: {
    en: "I'm Miguel Ángel Herrero, though almost everyone calls me Miki. Product designer at VIOOH in London and founder of OXIA Labs, my studio for design experiments. I sweat the details because I believe good design is felt before it's seen: in what's clean, in what has a reason, and in how it feels to use.",
    es: "Soy Miguel Ángel Herrero, aunque casi todo el mundo me llama Miki. Diseñador de producto en VIOOH, en Londres, y fundador de OXIA Labs, mi estudio de experimentos de diseño. Me fijo en cada detalle porque creo que el buen diseño se nota antes de verse: en lo limpio, en lo que tiene un porqué y en lo que sientes al usarlo.",
  },
  ch1: { en: "Product design", es: "Diseño de producto" },
  work: { en: "Work", es: "Trabajo" },
  workSub: {
    en: "Four products, from the first idea to the last pixel.",
    es: "Cuatro productos, de la primera idea al último píxel.",
  },
  archive: { en: "Archive", es: "Archivo" },
  archiveSub: { en: "Earlier work", es: "Proyectos anteriores" },
  view: { en: "View project", es: "Ver proyecto" },
  ch2: { en: "The studio", es: "El estudio" },
  oxiaTitle: { en: "What I make when nobody asks.", es: "Lo que hago cuando nadie me lo pide." },
  oxiaLine: {
    en: "OXIA Labs is my personal, independent studio, founded in 2026. Original eXperiments + AI: creative ideas you can live, not just look at, built with very polished design. TETRA, Tendu, Unwind and Dark Matter came out of it.",
    es: "OXIA Labs es mi estudio personal e independiente, creado en 2026. Original eXperiments + IA: ideas creativas que se puedan vivir, no solo mirar, con un diseño muy pulido. De aquí han salido TETRA, Tendu, Unwind y Dark Matter.",
  },
  oxiaCta: { en: "Enter OXIA Labs", es: "Entrar en OXIA Labs" },
  ch3: { en: "Design experiments", es: "Experimentos de diseño" },
  labTitle: { en: "Lab", es: "Lab" },
  labSub: {
    en: "A laboratory of design experiments. Posters, records, objects and 3D pieces made with Blender and AI — for the joy of trying things.",
    es: "Un laboratorio de experimentos de diseño. Pósters, discos, objetos y piezas en 3D hechas con Blender e IA, por el gusto de probar cosas.",
  },
  labDrag: { en: "Drag to explore", es: "Arrastra para explorar" },
  labSeries: { en: "Series", es: "Series" },
  open: { en: "Open", es: "Abrir" },
  close: { en: "Close", es: "Cerrar" },
  contactBig: { en: "Let's talk.", es: "Hablemos." },
  contactSub: {
    en: "Open to projects, collaborations and good conversations.",
    es: "Abierto a proyectos, colaboraciones y buenas conversaciones.",
  },
  copy: { en: "Click to copy", es: "Clic para copiar" },
  copied: { en: "Copied ✓", es: "Copiado ✓" },
  nextProject: { en: "Next project", es: "Siguiente proyecto" },
  back: { en: "Back", es: "Volver" },
  visit: { en: "Play TETRA", es: "Jugar a TETRA" },
  year: { en: "Year", es: "Año" },
  type: { en: "Type", es: "Tipo" },
  roleLabel: { en: "Role", es: "Rol" },
  platforms: { en: "Platforms", es: "Plataformas" },
  tools: { en: "Tools", es: "Herramientas" },
  idea: { en: "The idea", es: "La idea" },
  details: { en: "Details", es: "Detalles" },
  soundOn: { en: "Sound on", es: "Activar sonido" },
  soundOff: { en: "Sound off", es: "Silenciar" },
  ch4: { en: "About", es: "Sobre mí" },
  aboutTitle: { en: "About", es: "Sobre mí" },
  aboutLine: {
    en: "From Salamanca, with a year in Rome and now working in London. Product designer, film lover and electronic music producer.",
    es: "De Salamanca, con un año en Roma y ahora trabajando en Londres. Diseñador de producto, cinéfilo y productor de música electrónica.",
  },
  aboutCta: { en: "More about me", es: "Más sobre mí" },
  index: [
    { n: "01", id: "work", en: "Work", es: "Trabajo", sen: "Four products, from the first idea to the last pixel.", ses: "Cuatro productos, de la primera idea al último píxel." },
    { n: "02", id: "oxia", en: "OXIA Labs", es: "OXIA Labs", sen: "My studio: original experiments with design, technology and AI.", ses: "Mi estudio: experimentos originales con diseño, tecnología e IA." },
    { n: "03", id: "lab", en: "Lab", es: "Lab", sen: "A laboratory of graphic and 3D design experiments.", ses: "Un laboratorio de experimentos de diseño gráfico y 3D." },
    { n: "04", id: "about", en: "About", es: "Sobre mí", sen: "Who I am, where I come from and what drives me.", ses: "Quién soy, de dónde vengo y qué me mueve." },
  ],
  madeAt: { en: "Made at OXIA Labs", es: "Hecho en OXIA Labs" },
  madeAtSub: { en: "My studio for design experiments", es: "Mi estudio de experimentos de diseño" },
  next: { en: "Next", es: "Siguiente" },
  rights: { en: "All rights reserved", es: "Todos los derechos reservados" },
  loading: { en: "Loading", es: "Cargando" },
};
