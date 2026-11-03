/**
 * The real 3D pieces (compressed glb). `yaw` limits how far each one may turn,
 * in degrees, so nobody sees a side that was never finished (the iPod has no
 * back, the moss emblem is flat behind). Without `yaw` a piece turns freely.
 */
/**
 * How each piece is lit. `env` picks the studio it is reflected in: metal (dark
 * room, hard light strips, for crisp reflections), studio (bright softboxes) or
 * soft (warm diffuse panels, for clay, plaster and moss). `envI` scales the
 * reflections, `rough` multiplies the material's own roughness, `key` is the
 * direct light and `exposure` the overall brightness. `front` adds a large soft
 * panel behind the camera, for mirror faces that look straight at you.
 */
export type Look = { env: "metal" | "studio" | "soft"; envI: number; rough: number; key: number; exposure: number; front?: number };
export type ModelSpec = { src: string; yaw?: [number, number]; y0?: number; rx?: number; ry?: number; rz?: number; fit?: number; look?: Look };

const METAL: Look = { env: "metal", envI: 1.6, rough: 0.6, key: 0.6, exposure: 1.1 };
const GLOSS: Look = { env: "studio", envI: 1.2, rough: 0.75, key: 0.9, exposure: 1.05 };
const SOFT: Look = { env: "soft", envI: 0.9, rough: 1, key: 1.2, exposure: 1.05 };

const DEF = {
  "oxia-chrome": { src: "/models/oxia-chrome.glb", yaw: [-55, 55], fit: 2.3, look: { env: "studio", envI: 1.9, rough: 0.45, key: 0.8, exposure: 1.15, front: 1.3 } },
  "oxia-prismatic": { src: "/models/oxia-prismatic.glb", yaw: [-55, 55], fit: 2.3, look: { ...GLOSS, envI: 1.5, rough: 0.5, exposure: 1.15 } },
  "oxia-mossy": { src: "/models/oxia-mossy.glb", yaw: [-40, 40], fit: 2.3, look: { ...SOFT, key: 1.6, exposure: 1.15 } },
  ipod: { src: "/models/ipod.glb", yaw: [-45, 45], look: { ...METAL, envI: 1.3, rough: 0.8, key: 1 } },
  sello: { src: "/models/crimson-sello.glb", yaw: [-60, 60], look: { ...GLOSS, rough: 0.7 } },
  keiddn: { src: "/models/keiddn-logo.glb", yaw: [-65, 65], rx: Math.PI / 2, ry: -Math.PI / 2, look: { ...GLOSS, envI: 1.5, rough: 0.55, exposure: 1.15 } },
  keychain: { src: "/models/house-keychain.glb", look: { ...METAL, envI: 1.9, rough: 0.45 } },
  squeeze: { src: "/models/house-squeeze.glb", y0: 45, look: { ...SOFT, envI: 1, rough: 0.85, key: 1 } },
  vulture: { src: "/models/vulture.glb", y0: -60, look: { ...METAL, envI: 2.2, rough: 0.65, key: 1, exposure: 1.2 } },
  ceramics: { src: "/models/ceramics.glb", look: SOFT },
  lego: { src: "/models/lego-miki.glb", look: { ...GLOSS, envI: 1, rough: 0.85, key: 1.1 } },
  street: { src: "/models/street.glb", look: { ...SOFT, envI: 1, rough: 0.9, key: 1.3, exposure: 1.1 } },
  ring: { src: "/models/ring.glb", yaw: [-80, 80], y0: 10, look: { ...METAL, envI: 1.9, rough: 0.5 } },
  "miki-keychain": { src: "/models/miki-keychain.glb", yaw: [-70, 70], look: { ...METAL, envI: 1.9, rough: 0.45 } },
} satisfies Record<string, ModelSpec>;

export type ModelKey = keyof typeof DEF;
export const MODELS: Record<ModelKey, ModelSpec> = DEF;
