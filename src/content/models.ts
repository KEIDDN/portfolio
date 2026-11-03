/**
 * The real 3D pieces (compressed glb). `yaw` limits how far each one may turn,
 * in degrees, so nobody sees a side that was never finished (the iPod has no
 * back, the moss emblem is flat behind). Without `yaw` a piece turns freely.
 */
export type ModelSpec = { src: string; yaw?: [number, number]; y0?: number; rx?: number; rz?: number; fit?: number };

const DEF = {
  "oxia-chrome": { src: "/models/oxia-chrome.glb", yaw: [-55, 55], fit: 2.3 },
  "oxia-prismatic": { src: "/models/oxia-prismatic.glb", yaw: [-55, 55], fit: 2.3 },
  "oxia-mossy": { src: "/models/oxia-mossy.glb", yaw: [-40, 40], fit: 2.3 },
  ipod: { src: "/models/ipod.glb", yaw: [-45, 45] },
  sello: { src: "/models/crimson-sello.glb", yaw: [-60, 60] },
  keiddn: { src: "/models/keiddn-logo.glb", yaw: [-65, 65], rx: Math.PI / 2 },
  keychain: { src: "/models/house-keychain.glb" },
  vulture: { src: "/models/vulture.glb", y0: -60 },
  ceramics: { src: "/models/ceramics.glb" },
  lego: { src: "/models/lego-miki.glb" },
} satisfies Record<string, ModelSpec>;

export type ModelKey = keyof typeof DEF;
export const MODELS: Record<ModelKey, ModelSpec> = DEF;
