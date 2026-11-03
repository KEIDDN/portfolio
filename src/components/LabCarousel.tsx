"use client";

import { Canvas, useFrame, useThree, type ThreeEvent } from "@react-three/fiber";
import { Environment, Lightformer, useTexture } from "@react-three/drei";
import { Suspense, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import * as THREE from "three";
import gsap from "gsap";
import { t, type Locale } from "@/content/i18n";
import { labIntro, series } from "@/content/lab";
import { usePreparedModel } from "./ModelViewer";
import { MODELS } from "@/content/models";
import { useLenis } from "./SmoothScroll";
import LabRoom from "./LabRoom";
import styles from "./LabCarousel.module.css";

const N = series.length;
const STEP = (Math.PI * 2) / N;
const R = 4.8; // ring radius
const CAM = new THREE.Vector3(0, 1.2, 4.9);
const LOOK = new THREE.Vector3(0, 0.72, -0.4);
const ease = (x: number) => (x >= 1 ? 1 : 1 - Math.pow(2, -10 * x));
/** shortest signed distance between two positions on the ring */
const wrap = (d: number) => ((((d + N / 2) % N) + N) % N) - N / 2;

type Shared = {
  pos: number; // where the ring is (continuous index)
  target: number; // where it's heading
  born: number; // clock time the scene appeared
  skip: number; // the series that arrives already in place (coming from the home)
  push: number; // 0 → 1 as the camera walks into a room
};

type Presence = { dim: number; front: number };

/** Series without a 3D model still stand as objects, each in the shape of its format. */
const DISPLAY: Record<string, { as: "vinyl" | "frame" | "lightbox"; src: string; disc?: string }> = {
  "tutto-passa": { as: "vinyl", src: "/work/lab/vinyl-tutto-passa-1.webp", disc: "#7d97ad" },
  "any-kind-of-blues": { as: "vinyl", src: "/work/lab/vinyl-miles-1.webp", disc: "#0b0b0c" },
  "film-posters": { as: "frame", src: "/work/posters/02.webp" },
  "jpn-drift": { as: "frame", src: "/work/lab/jpn-drift-2.webp" },
  "animal-series": { as: "frame", src: "/work/posters/05.webp" },
  "miki-racing": { as: "lightbox", src: "/work/lab/racing-1.webp" },
  fruy2k: { as: "lightbox", src: "/work/lab/fruy2k.webp" },
};

function useImage(src: string) {
  const tex = useTexture(src);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  const img = tex.image as HTMLImageElement;
  return { tex, r: img.width / img.height };
}

/** Fits an image inside a box of the given max width and height. */
const fitBox = (r: number, mw: number, mh: number) => (r > mw / mh ? [mw, mw / r] : [mh * r, mh]);

/** The print, dimmed with the pedestal's presence. */
function Print({ tex, w, h, z, p }: { tex: THREE.Texture; w: number; h: number; z: number; p: React.RefObject<Presence> }) {
  const m = useRef<THREE.MeshBasicMaterial>(null);
  useFrame(() => m.current?.color.setScalar(p.current!.dim));
  return (
    <mesh position={[0, 0, z]}>
      <planeGeometry args={[w, h]} />
      <meshBasicMaterial ref={m} map={tex} toneMapped={false} />
    </mesh>
  );
}

/** A poster: a thin black frame, the print, and glass that catches the studio's light. */
function Frame({ src, p }: { src: string; p: React.RefObject<Presence> }) {
  const { tex, r } = useImage(src);
  const [w, h] = fitBox(r, 1.25, 1.35);
  return (
    <group position={[0, h / 2 + 0.08, 0]} rotation-x={-0.05}>
      <mesh>
        <boxGeometry args={[w + 0.06, h + 0.06, 0.03]} />
        <meshStandardMaterial color="#111" roughness={0.35} metalness={0.7} />
      </mesh>
      <Print tex={tex} w={w} h={h} z={0.0155} p={p} />
      <mesh position={[0, 0, 0.018]}>
        <planeGeometry args={[w, h]} />
        <meshPhysicalMaterial transparent opacity={0.14} roughness={0.03} metalness={0.1} envMapIntensity={2.5} clearcoat={1} />
      </mesh>
    </group>
  );
}

/** A render without a model: a slim lightbox, lit from inside. */
function Lightbox({ src, p }: { src: string; p: React.RefObject<Presence> }) {
  const { tex, r } = useImage(src);
  const [w, h] = fitBox(r, 1.5, 1.3);
  return (
    <group position={[0, h / 2 + 0.08, 0]}>
      <mesh>
        <boxGeometry args={[w + 0.05, h + 0.05, 0.07]} />
        <meshStandardMaterial color="#141414" roughness={0.5} metalness={0.3} />
      </mesh>
      <Print tex={tex} w={w} h={h} z={0.0355} p={p} />
    </group>
  );
}

/** Concentric grooves, drawn once: they break the disc's reflection into rings, like vinyl does. */
let groovesTex: THREE.CanvasTexture | null = null;
function grooves() {
  if (groovesTex) return groovesTex;
  const c = document.createElement("canvas");
  c.width = c.height = 1024;
  const g = c.getContext("2d")!;
  g.fillStyle = "#808080";
  g.fillRect(0, 0, 1024, 1024);
  for (let r = 175; r < 506; r += 1.6) {
    const v = 96 + Math.floor(Math.random() * 70);
    g.strokeStyle = `rgb(${v},${v},${v})`;
    g.lineWidth = 0.9;
    g.beginPath();
    g.arc(512, 512, r, 0, Math.PI * 2);
    g.stroke();
  }
  // the run-out and lead-in: two smooth bands
  for (const [a, b] of [[175, 190], [490, 506]]) {
    g.strokeStyle = "#5a5a5a";
    g.lineWidth = b - a;
    g.beginPath();
    g.arc(512, 512, (a + b) / 2, 0, Math.PI * 2);
    g.stroke();
  }
  groovesTex = new THREE.CanvasTexture(c);
  groovesTex.anisotropy = 8;
  return groovesTex;
}

/** A record: the sleeve with its cover, and the disc sliding out and turning when it's in front. */
function Vinyl({ src, disc, p }: { src: string; disc: string; p: React.RefObject<Presence> }) {
  const { tex } = useImage(src);
  const d = useRef<THREE.Group>(null);
  const spin = useRef<THREE.Group>(null);
  useFrame((_, dt) => {
    const f = p.current!.front;
    d.current!.position.x = THREE.MathUtils.damp(d.current!.position.x, f > 0.6 ? 0.46 : 0.04, 3, dt);
    spin.current!.rotation.z -= dt * (f > 0.6 ? 0.9 : 0);
  });
  const S = 1.12;
  return (
    <group position={[0, S / 2 + 0.06, 0]} rotation-x={-0.04}>
      <group ref={d} position={[0.04, 0, -0.02]}>
        <group ref={spin}>
          <mesh rotation-x={Math.PI / 2}>
            <cylinderGeometry args={[0.53, 0.53, 0.008, 96]} />
            <meshPhysicalMaterial
              color={disc}
              roughness={0.42}
              roughnessMap={grooves()}
              bumpMap={grooves()}
              bumpScale={0.6}
              metalness={0.2}
              clearcoat={0.6}
              clearcoatRoughness={0.2}
              envMapIntensity={1.4}
            />
          </mesh>
          <mesh position={[0, 0, 0.0045]}>
            <circleGeometry args={[0.17, 64]} />
            <meshBasicMaterial map={tex} toneMapped={false} />
          </mesh>
        </group>
      </group>
      <mesh>
        <boxGeometry args={[S, S, 0.014]} />
        <meshStandardMaterial color="#0e0e0e" roughness={0.7} />
      </mesh>
      <Print tex={tex} w={S} h={S} z={0.0075} p={p} />
    </group>
  );
}

function Model({ k, onReady }: { k: NonNullable<(typeof series)[number]["models"]>[number]; onReady?: () => void }) {
  const obj = usePreparedModel(k);
  useEffect(() => {
    onReady?.();
  }, [onReady]);
  return (
    <group position={[0, 0.72, 0]} scale={0.64}>
      <primitive object={obj} />
    </group>
  );
}

/** One series: a plinth, a ring of its own light at the top edge, and its piece turning on it. */
function Pedestal({ k, sh, near, onPick, onArrive }: { k: number; sh: React.RefObject<Shared>; near: boolean; onPick: (k: number) => void; onArrive?: () => void }) {
  const s = series[k];
  const g = useRef<THREE.Group>(null);
  const piece = useRef<THREE.Group>(null);
  const rim = useRef<THREE.MeshBasicMaterial>(null);
  const col = useMemo(() => new THREE.Color(s.color), [s.color]);
  const model = s.models?.[0];
  const spins = !!model && near;
  // pieces with an unfinished back (the iPod, the moss emblem…) only sway, facing you; the rest turn all the way
  const lim = model ? MODELS[model].yaw : undefined;
  const y0 = model ? THREE.MathUtils.degToRad(MODELS[model].y0 ?? 0) : 0;
  const shown = DISPLAY[s.slug];
  const pres = useRef<Presence>({ dim: 1, front: 0 });
  useFrame((state, dt) => {
    const S = sh.current!;
    const d = wrap(k - S.pos);
    const a = d * STEP;
    const el = state.clock.elapsedTime - S.born;
    // the entrance: plinths rise out of the dark, nearest first; the piece you came with is already there
    const delay = k === S.skip ? -10 : 0.35 + Math.abs(wrap(k - S.target)) * 0.09;
    const rise = ease(Math.max(0, (el - delay) / 1.6));
    const front = Math.max(0, 1 - Math.abs(d));
    const G = g.current!;
    G.position.set(Math.sin(a) * R, (rise - 1) * 2.4, Math.cos(a) * R - R);
    G.rotation.y = a;
    const p = piece.current!;
    const time = state.clock.elapsedTime;
    // 3D pieces turn on their plinth; sheets always face you, with a slight sway
    if (spins && !lim) p.rotation.y += dt * (0.16 + front * 0.24);
    else if (spins && lim) p.rotation.y = -a + y0 + Math.sin(time * 0.4 + k) * THREE.MathUtils.degToRad(Math.min(lim[1], -lim[0]) * 0.6);
    else p.rotation.y = -a * 0.85 + Math.sin(time * 0.45 + k) * (0.1 + front * 0.14) - front * 0.18;
    pres.current.dim = 0.3 + front * 0.7;
    pres.current.front = front;
    const sc = 0.8 + front * 0.2;
    p.scale.setScalar(THREE.MathUtils.damp(p.scale.x, sc * rise, 6, dt));
    if (rim.current) rim.current.color.copy(col).multiplyScalar(0.25 + front * 2.2);
  });
  const pick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    onPick(k);
  };
  return (
    <group ref={g} onClick={pick} onPointerOver={() => (document.body.style.cursor = "pointer")} onPointerOut={() => (document.body.style.cursor = "")}>
      {/* the plinth */}
      <mesh position={[0, -0.5, 0]}>
        <cylinderGeometry args={[0.4, 0.44, 1, 64]} />
        <meshStandardMaterial color="#0d0d0e" roughness={0.42} metalness={0.4} envMapIntensity={0.6} />
      </mesh>
      {/* its light, a thin ring at the top edge */}
      <mesh position={[0, 0.002, 0]} rotation-x={-Math.PI / 2}>
        <ringGeometry args={[0.375, 0.4, 96]} />
        <meshBasicMaterial ref={rim} toneMapped={false} />
      </mesh>
      <group ref={piece}>
        <Suspense fallback={null}>
          {shown ? (
            shown.as === "vinyl" ? (
              <Vinyl src={shown.src} disc={shown.disc!} p={pres} />
            ) : shown.as === "frame" ? (
              <Frame src={shown.src} p={pres} />
            ) : (
              <Lightbox src={shown.src} p={pres} />
            )
          ) : (
            spins && <Model k={model!} onReady={k === sh.current!.skip ? onArrive : undefined} />
          )}
        </Suspense>
      </group>
    </group>
  );
}

/** The ring turns toward its target; the camera breathes with the pointer and walks in to open a room. */
function Rig({ sh, onIndex, color }: { sh: React.RefObject<Shared>; onIndex: (i: number) => void; color: string }) {
  const { camera, pointer } = useThree();
  const spot = useRef<THREE.SpotLight>(null);
  const back = useRef<THREE.PointLight>(null);
  const tgt = useMemo(() => new THREE.Color(color), [color]);
  const last = useRef(-1);
  const look = useMemo(() => LOOK.clone(), []);
  useFrame((state, dt) => {
    const S = sh.current!;
    S.pos = THREE.MathUtils.damp(S.pos, S.target, 4.2, dt);
    const i = ((Math.round(S.pos) % N) + N) % N;
    if (i !== last.current) {
      last.current = i;
      onIndex(i);
    }
    const el = state.clock.elapsedTime - S.born;
    // arriving: the camera starts close (as close as the home had the piece) and steps back as the room assembles
    const intro = ease(Math.min(1, el / 2.6));
    const z = THREE.MathUtils.lerp(2.5, CAM.z, intro) - S.push * 2.4;
    const y = THREE.MathUtils.lerp(0.85, CAM.y, intro) - S.push * 0.35;
    // the stage sits right of centre, leaving the left to the type
    camera.position.x = THREE.MathUtils.damp(camera.position.x, -0.62 + pointer.x * 0.35, 2.5, dt);
    camera.position.y = THREE.MathUtils.damp(camera.position.y, y + pointer.y * 0.12, 2.5, dt);
    camera.position.z = z;
    look.set(-0.62 * intro, THREE.MathUtils.lerp(0.72, LOOK.y, intro) + S.push * 0.05, LOOK.z);
    camera.lookAt(look);
    spot.current!.color.lerp(tgt, 1 - Math.exp(-dt * 3));
    back.current!.color.lerp(tgt, 1 - Math.exp(-dt * 3));
  });
  return (
    <>
      <ambientLight intensity={0.12} />
      <directionalLight position={[2, 4, 5]} intensity={0.9} />
      <spotLight ref={spot} position={[0, 4.2, 1.4]} angle={0.42} penumbra={0.9} intensity={60} distance={9} decay={1.6} />
      <pointLight ref={back} position={[0, 1.2, -1.2]} intensity={8} distance={4} decay={1.4} />
      <directionalLight position={[-3, 2.5, -4]} intensity={1.6} />
    </>
  );
}

export default function LabCarousel({ locale }: { locale: Locale }) {
  const lenis = useLenis();
  const [i, setI] = useState(0);
  const [room, setRoom] = useState<number | null>(null);
  const [ready, setReady] = useState(false);
  const [near, setNear] = useState<Set<number>>(new Set());
  const sh = useRef<Shared>({ pos: 0, target: 0, born: 0, skip: -1, push: 0 });
  const veil = useRef<HTMLDivElement>(null);
  const moved = useRef(0);

  // where we start: the series the home was showing, if we came from there
  useEffect(() => {
    let from = -1;
    try {
      const slug = sessionStorage.getItem("mh-lab-from");
      sessionStorage.removeItem("mh-lab-from");
      from = series.findIndex((s) => s.slug === slug);
    } catch {}
    const k = from >= 0 ? from : 0;
    Object.assign(sh.current, { pos: k, target: k, skip: from });
    setI(k);
    setReady(true);
  }, []);

  // the page is the room: no document scroll, presenter keys off
  useEffect(() => {
    lenis?.stop();
    const html = document.documentElement;
    html.style.overflow = "hidden";
    html.dataset.modal = "1";
    document.body.style.background = "#000";
    return () => {
      lenis?.start();
      html.style.overflow = "";
      delete html.dataset.modal;
      document.body.style.background = "";
      document.body.style.cursor = "";
    };
  }, [lenis]);

  // models are fetched for the series around the front, and kept
  useEffect(() => {
    setNear((m) => {
      const n = new Set(m);
      for (let d = -2; d <= 2; d++) n.add((((i + d) % N) + N) % N);
      return n.size === m.size ? m : n;
    });
  }, [i]);

  // arriving from the home: the bridge it left behind dissolves once the piece stands on its plinth here
  const arrive = useCallback(() => {
    const b = document.getElementById("mh-bridge");
    if (!b) return;
    b.id = "";
    gsap.to(b, { opacity: 0, duration: 1, delay: 0.25, ease: "power2.out", onComplete: () => b.remove() });
  }, []);
  useEffect(() => {
    const t = setTimeout(arrive, 3200);
    return () => clearTimeout(t);
  }, [arrive]);

  const go = useCallback((k: number) => {
    const S = sh.current;
    S.target = S.target + wrap(k - S.target);
  }, []);
  const step = useCallback((d: number) => {
    const S = sh.current;
    S.target = Math.round(S.target) + d;
  }, []);

  const open = useCallback((k: number) => {
    const S = sh.current;
    const t0 = performance.now();
    const run = () => {
      const x = Math.min(1, (performance.now() - t0) / 900);
      S.push = x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
      if (veil.current) veil.current.style.opacity = String(Math.max(0, (x - 0.45) / 0.55));
      if (x < 1) requestAnimationFrame(run);
      else setRoom(k);
    };
    requestAnimationFrame(run);
  }, []);

  const pick = useCallback(
    (k: number) => {
      if (moved.current > 6) return;
      if (k === i && Math.abs(wrap(k - sh.current.pos)) < 0.2) open(k);
      else go(k);
    },
    [i, go, open],
  );

  // wheel and drag turn the ring; it settles on a pedestal
  useEffect(() => {
    if (room !== null) return;
    let acc = 0;
    let idle = 0;
    const settle = () => {
      const S = sh.current;
      S.target = Math.round(S.target);
    };
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      acc = (Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY) * 0.0045;
      sh.current.target += acc;
      clearTimeout(idle);
      idle = window.setTimeout(settle, 140);
    };
    let down = false;
    let lx = 0;
    let vx = 0;
    const onDown = (e: PointerEvent) => {
      if ((e.target as HTMLElement).closest("[data-ui]")) return;
      down = true;
      lx = e.clientX;
      vx = 0;
      moved.current = 0;
    };
    const onMove = (e: PointerEvent) => {
      if (!down) return;
      const dx = e.clientX - lx;
      lx = e.clientX;
      vx = dx;
      moved.current += Math.abs(dx);
      sh.current.target -= dx * 0.006;
    };
    const onUp = () => {
      if (!down) return;
      down = false;
      sh.current.target = Math.round(sh.current.target - vx * 0.05);
    };
    const onKey = (e: KeyboardEvent) => {
      if (["ArrowRight", "ArrowDown", "PageDown"].includes(e.key)) step(1);
      else if (["ArrowLeft", "ArrowUp", "PageUp"].includes(e.key)) step(-1);
      else if (e.key === "Enter") open(i);
      else return;
      e.preventDefault();
    };
    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("keydown", onKey);
    };
  }, [room, i, step, open]);

  const s = series[i];
  const pieces = s.images.length + (s.models?.length ?? 0);

  return (
    <div className={styles.lab} style={{ ["--lab-c" as string]: s.color }}>
      <div className={styles.wash} aria-hidden />
      {ready && (
        <Canvas
          className={styles.canvas}
          dpr={[1, 1.75]}
          camera={{ position: [0, 0.85, 2.5], fov: 32 }}
          gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.1 }}
          onCreated={({ clock, scene }) => {
            sh.current.born = clock.elapsedTime;
            scene.fog = new THREE.Fog("#000", 5.5, 13);
          }}
        >
          <Rig sh={sh} onIndex={setI} color={s.color} />
          {series.map((_, k) => (
            <Pedestal key={k} k={k} sh={sh} near={near.has(k)} onPick={pick} onArrive={arrive} />
          ))}
          {/* the floor: a dark mirror that catches the coloured light */}
          <mesh rotation-x={-Math.PI / 2} position={[0, -1.02, -R]}>
            <circleGeometry args={[R + 4, 96]} />
            <meshStandardMaterial color="#050505" roughness={0.18} metalness={0.6} envMapIntensity={0.4} />
          </mesh>
          <Suspense fallback={null}>
            <Environment resolution={256} files="/hdri/studio_small_09.hdr" environmentIntensity={0.55}>
              <Lightformer intensity={4} rotation-x={Math.PI / 2} position={[0, 6, 0]} scale={[10, 0.6, 1]} />
              <Lightformer intensity={2.5} position={[0, 0.5, 9]} scale={[10, 2, 1]} />
            </Environment>
          </Suspense>
        </Canvas>
      )}

      <div className={styles.shade} aria-hidden />
      <header className={styles.head} data-ui>
        <h1 className={`display ${styles.lab_}`}>Lab</h1>
        <p className={styles.intro}>{t(labIntro, locale)}</p>
      </header>

      <div className={styles.now} key={i} data-ui>
        <span className="mono muted">
          {String(i + 1).padStart(2, "0")} / {String(N).padStart(2, "0")}
        </span>
        <h2 className={`display ${styles.title}`} aria-live="polite">
          {s.title.split("").map((ch, k) => (
            <span key={k} style={{ animationDelay: `${k * 22}ms` }}>
              {ch === " " ? " " : ch}
            </span>
          ))}
        </h2>
        <span className={`mono muted ${styles.kind}`}>
          {t(s.kind, locale)} · {pieces} {locale === "en" ? (pieces === 1 ? "piece" : "pieces") : pieces === 1 ? "pieza" : "piezas"}
        </span>
        <p className={styles.short}>{t(s.short, locale)}</p>
        <button type="button" className={styles.enter} onClick={() => open(i)}>
          <span className={styles.dot} aria-hidden />
          {locale === "en" ? "Enter the room" : "Entrar en la sala"} <span aria-hidden>→</span>
        </button>
      </div>

      <nav className={styles.ticks} data-ui aria-label="Series">
        {series.map((x, k) => (
          <button key={x.slug} type="button" className={k === i ? styles.tickOn : ""} style={{ ["--c" as string]: x.color }} onClick={() => go(k)} aria-label={x.title}>
            <span className={styles.tip}>{x.title}</span>
          </button>
        ))}
      </nav>

      <p className={`mono muted ${styles.hint}`}>
        {locale === "en" ? "Drag · Scroll · ← → · Enter" : "Arrastra · Rueda · ← → · Enter"}
      </p>

      <div ref={veil} className={styles.veil} aria-hidden />

      {room !== null &&
        createPortal(
          <LabRoom
            key={room}
            index={room}
            locale={locale}
            from={null}
            onClose={() => {
              setRoom(null);
              sh.current.push = 0;
              if (veil.current) veil.current.style.opacity = "0";
            }}
            onGo={(k) => {
              setRoom(k);
              go(k);
            }}
          />,
          document.body,
        )}
    </div>
  );
}
