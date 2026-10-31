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
  role: {
    en: "Product Designer — Creative Technology & AI",
    es: "Diseñador de producto — Creative Technology e IA",
  },
  heroNote: { en: "Design you can feel", es: "Diseño que se siente" },
  scroll: { en: "Scroll", es: "Scroll" },
  nav: {
    work: { en: "Work", es: "Trabajo" },
    oxia: { en: "OXIA Labs", es: "OXIA Labs" },
    lab: { en: "Lab", es: "Lab" },
    about: { en: "About", es: "Sobre mí" },
    contact: { en: "Contact", es: "Contacto" },
  },
  intro: {
    en: "I design products that go beyond working well. Experiences crafted down to the last detail — in the interface, in every flow, and in what you feel when you use them.",
    es: "Diseño productos que van más allá de funcionar bien. Experiencias cuidadas hasta el último detalle: en la interfaz, en cada flujo y en lo que sientes al usarlas.",
  },
  introSmall: {
    en: "Product designer, music producer for over a decade and founder of OXIA Labs. I chase perfection in design, and I take every concept to its extreme.",
    es: "Diseñador de producto, productor musical desde hace más de diez años y fundador de OXIA Labs. Persigo la perfección en el diseño y llevo cada concepto hasta el extremo.",
  },
  selected: { en: "Selected Work", es: "Trabajo seleccionado" },
  selectedSub: {
    en: "Products, brands and experiments — 2024 to now",
    es: "Productos, marcas y experimentos — de 2024 a hoy",
  },
  view: { en: "View project", es: "Ver proyecto" },
  oxiaKicker: {
    en: "Creative Technology & Design Studio",
    es: "Estudio de Creative Technology y diseño",
  },
  oxiaLine: {
    en: "An independent studio for products nobody asked for — and everyone should feel. Games, apps and audio tools, designed and shipped end to end.",
    es: "Un estudio independiente para productos que nadie ha pedido y que todo el mundo debería sentir. Juegos, apps y herramientas de audio, diseñados y lanzados de principio a fin.",
  },
  oxiaCta: { en: "Enter OXIA Labs", es: "Entrar en OXIA Labs" },
  material: { en: "Material", es: "Material" },
  labTitle: { en: "Lab", es: "Lab" },
  labSub: {
    en: "Objects that don't exist — yet. Posters, 3D studies and material experiments made with Blender and AI tools.",
    es: "Objetos que todavía no existen. Pósters, estudios 3D y experimentos de materiales hechos con Blender y herramientas de IA.",
  },
  index: { en: "Index", es: "Índice" },
  indexSub: { en: "Everything, newest first", es: "Todo, de lo último a lo primero" },
  contactBig: { en: "Let's build something", es: "Construyamos algo" },
  contactBig2: { en: "people will feel.", es: "que se sienta." },
  copy: { en: "Click to copy", es: "Clic para copiar" },
  copied: { en: "Copied ✓", es: "Copiado ✓" },
  nextProject: { en: "Next project", es: "Siguiente proyecto" },
  back: { en: "Back", es: "Volver" },
  visit: { en: "Visit live site", es: "Ver web" },
  year: { en: "Year", es: "Año" },
  type: { en: "Type", es: "Tipo" },
  roleLabel: { en: "Role", es: "Rol" },
  tools: { en: "Tools", es: "Herramientas" },
  rights: { en: "All rights reserved", es: "Todos los derechos reservados" },
  loading: { en: "Loading", es: "Cargando" },
};
