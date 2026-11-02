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
    en: "I'm Miguel Ángel Herrero — Miki to almost everyone. I design products that make sense at first sight and feel good to use: from the system behind them to the last pixel. In parallel I run OXIA Labs, my own studio for design experiments.",
    es: "Soy Miguel Ángel Herrero, Miki para casi todo el mundo. Diseño productos que se entienden a la primera y se disfrutan al usarlos: del sistema que los sostiene al último píxel. En paralelo dirijo OXIA Labs, mi propio estudio de experimentos de diseño.",
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
  oxiaTitle: { en: "Original ideas. Real products.", es: "Ideas propias. Producto real." },
  oxiaLine: {
    en: "OXIA Labs is my independent studio for design and creative technology. Original eXperiments + IA: products you play, hear and inhabit. TETRA, Tendu, Unwind and Dark Matter were born here.",
    es: "OXIA Labs es mi estudio independiente de diseño y tecnología creativa. Original eXperiments + IA: productos que se juegan, se escuchan y se habitan. De aquí han salido TETRA, Tendu, Unwind y Dark Matter.",
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
    { n: "01", id: "about", en: "About", es: "Sobre mí" },
    { n: "02", id: "work", en: "Work", es: "Trabajo" },
    { n: "03", id: "oxia", en: "OXIA Labs", es: "OXIA Labs" },
    { n: "04", id: "lab", en: "Lab", es: "Lab" },
  ],
  madeAt: { en: "Made at OXIA Labs", es: "Hecho en OXIA Labs" },
  madeAtSub: { en: "My studio for design experiments", es: "Mi estudio de experimentos de diseño" },
  next: { en: "Next", es: "Siguiente" },
  rights: { en: "All rights reserved", es: "Todos los derechos reservados" },
  loading: { en: "Loading", es: "Cargando" },
};
