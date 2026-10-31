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
    es: "Product Designer — Creative Technology & IA",
  },
  currently: {
    en: "Currently Product Designer at VIOOH, London",
    es: "Ahora Product Designer en VIOOH, Londres",
  },
  founder: { en: "Founder of OXIA Labs", es: "Fundador de OXIA Labs" },
  scroll: { en: "Scroll", es: "Scroll" },
  nav: {
    work: { en: "Work", es: "Trabajo" },
    oxia: { en: "OXIA Labs", es: "OXIA Labs" },
    lab: { en: "Lab", es: "Lab" },
    about: { en: "About", es: "Sobre mí" },
    contact: { en: "Contact", es: "Contacto" },
  },
  intro: {
    en: "I design digital products where technology becomes feeling. Interfaces, identities and experiments at the edge of AI, sound and real-time 3D.",
    es: "Diseño productos digitales donde la tecnología se convierte en sensación. Interfaces, identidades y experimentos en el límite entre la IA, el sonido y el 3D en tiempo real.",
  },
  introSmall: {
    en: "By day I design products for the screens of London's streets. By night I run OXIA Labs, my creative technology studio.",
    es: "De día diseño producto para las pantallas de las calles de Londres. De noche dirijo OXIA Labs, mi estudio de creative technology.",
  },
  selected: { en: "Selected Work", es: "Trabajo seleccionado" },
  selectedSub: {
    en: "Products, identities and experiments, 2024 — now",
    es: "Productos, identidades y experimentos, 2024 — hoy",
  },
  view: { en: "View project", es: "Ver proyecto" },
  oxiaKicker: {
    en: "Creative Technology & Design Studio",
    es: "Estudio de Creative Technology & Diseño",
  },
  oxiaLine: {
    en: "A studio with no brief. We build what we want to exist — with new technology, and design at its highest level.",
    es: "Un estudio sin brief. Construimos lo que queremos que exista — con tecnología nueva y el diseño al máximo nivel.",
  },
  oxiaCta: { en: "Enter OXIA Labs", es: "Entrar en OXIA Labs" },
  material: { en: "Material", es: "Material" },
  labTitle: { en: "Lab", es: "Lab" },
  labSub: {
    en: "Posters, 3D studies and things made for the joy of it. Blender, type and a bit of AI.",
    es: "Pósters, estudios 3D y cosas hechas por puro gusto. Blender, tipografía y un poco de IA.",
  },
  index: { en: "Index", es: "Índice" },
  indexSub: { en: "Everything, in order", es: "Todo, en orden" },
  contactBig: { en: "Let's make something", es: "Hagamos algo" },
  contactBig2: { en: "worth showing.", es: "que merezca la pena." },
  copy: { en: "Click to copy", es: "Clic para copiar" },
  copied: { en: "Copied ✓", es: "Copiado ✓" },
  nextProject: { en: "Next project", es: "Siguiente proyecto" },
  back: { en: "Back", es: "Volver" },
  visit: { en: "Visit live site", es: "Ver web" },
  year: { en: "Year", es: "Año" },
  type: { en: "Type", es: "Tipo" },
  roleLabel: { en: "Role", es: "Rol" },
  tools: { en: "Tools", es: "Herramientas" },
  localTime: { en: "Local time", es: "Hora local" },
  rights: { en: "All rights reserved", es: "Todos los derechos reservados" },
  loading: { en: "Loading", es: "Cargando" },
};
