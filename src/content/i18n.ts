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
    en: "I'm Miki, a product designer. I want every UX and UI decision to have a reason behind it, and the result to feel clean and current. I've also been producing music for over ten years, and it shows in how I think about experiences: rhythm, tension and care for how things feel. I'm still learning every day — this is what I've made so far.",
    es: "Soy Miki, diseñador de producto. Busco que cada decisión de UX y de UI tenga un porqué, y que el resultado sea limpio y actual. Además, llevo más de diez años produciendo música, y eso se nota en cómo pienso las experiencias: ritmo, tensión y cuidado por cómo se sienten. Sigo aprendiendo cada día; esto es lo que he hecho hasta ahora.",
  },
  ch1: { en: "Product", es: "Producto" },
  work: { en: "Work", es: "Trabajo" },
  workSub: {
    en: "Digital products, from the first idea to the last pixel.",
    es: "Productos digitales, de la primera idea al último píxel.",
  },
  archive: { en: "Archive", es: "Archivo" },
  archiveSub: { en: "Earlier work", es: "Proyectos anteriores" },
  view: { en: "View project", es: "Ver proyecto" },
  ch2: { en: "Studio", es: "Estudio" },
  oxiaTitle: { en: "What I make when nobody asks.", es: "Lo que hago cuando nadie me lo pide." },
  oxiaLine: {
    en: "OXIA Labs is my personal, independent studio. It's where I launch the projects I want to make: products that combine carefully crafted design with music, art, technology and AI. TETRA, Tendu, Unwind and Dark Matter were born there.",
    es: "OXIA Labs es mi estudio personal e independiente. Ahí lanzo los proyectos que me apetece hacer: productos que mezclan un diseño muy cuidado con música, arte, tecnología e IA. TETRA, Tendu, Unwind y Dark Matter nacieron ahí.",
  },
  oxiaCta: { en: "Enter OXIA Labs", es: "Entrar en OXIA Labs" },
  ch3: { en: "Graphic", es: "Gráfico" },
  labTitle: { en: "Lab", es: "Lab" },
  labSub: {
    en: "Graphic design, 3D and experiments. Posters, records and objects made with Blender and AI tools.",
    es: "Diseño gráfico, 3D y experimentos. Pósters, discos y objetos hechos con Blender y herramientas de IA.",
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
  rights: { en: "All rights reserved", es: "Todos los derechos reservados" },
  loading: { en: "Loading", es: "Cargando" },
};
