"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, Lightformer, useGLTF, ContactShadows } from "@react-three/drei";
import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { MODELS, type ModelKey } from "@/content/models";

const D = THREE.MathUtils.degToRad;

/** One model, centred and scaled to fit a unit box, turned to its best side. */
function Piece({ k, on, drag }: { k: ModelKey; on: boolean; drag: React.RefObject<{ yaw: number; pitch: number; active: boolean }> }) {
  const m = MODELS[k];
  const { scene } = useGLTF(m.src);
  const obj = useMemo(() => {
    const c = scene.clone(true);
    const inner = new THREE.Group();
    inner.add(c);
    inner.rotation.set(m.rx ?? 0, 0, m.rz ?? 0);
    const box = new THREE.Box3().setFromObject(inner);
    const size = box.getSize(new THREE.Vector3());
    const centre = box.getCenter(new THREE.Vector3());
    const s = (m.fit ?? 1.9) / Math.max(size.x, size.y, size.z * 0.6);
    const g = new THREE.Group();
    g.add(inner);
    inner.position.copy(centre).multiplyScalar(-1);
    g.scale.setScalar(s);
    return g;
  }, [scene, m]);
  const ref = useRef<THREE.Group>(null);
  const [lo, hi] = m.yaw ?? [-180, 180];
  const free = hi - lo >= 360;
  const base = D(m.y0 ?? 0);
  useFrame((state, dt) => {
    const g = ref.current;
    if (!g) return;
    const t = state.clock.elapsedTime;
    const d = drag.current!;
    // at rest the piece sways inside its limits (or turns slowly when it may go all the way round)
    if (!d.active) {
      if (free) d.yaw += dt * 0.25;
      else d.yaw = THREE.MathUtils.damp(d.yaw, Math.sin(t * 0.35) * D(Math.min(hi, -lo) * 0.45), 1.2, dt);
      d.pitch = THREE.MathUtils.damp(d.pitch, 0, 2, dt);
    }
    if (!free) d.yaw = THREE.MathUtils.clamp(d.yaw, D(lo), D(hi));
    g.rotation.y = THREE.MathUtils.damp(g.rotation.y, base + d.yaw, 6, dt);
    g.rotation.x = THREE.MathUtils.damp(g.rotation.x, d.pitch, 6, dt);
    const s = THREE.MathUtils.damp(g.scale.x, on ? 1 : 0.0001, on ? 5 : 9, dt);
    g.scale.setScalar(s);
    g.visible = s > 0.002;
  });
  return (
    <group ref={ref} scale={0.0001}>
      <primitive object={obj} />
    </group>
  );
}

function Studio({ tone }: { tone: "dark" | "light" }) {
  return (
    <Environment resolution={512}>
      <color attach="background" args={[tone === "dark" ? "#262626" : "#d8d4cb"]} />
      <Lightformer intensity={2.4} position={[0, 1.5, 10]} scale={[12, 2.6, 1]} />
      <Lightformer intensity={1.2} position={[0, -2.5, 10]} scale={[12, 1, 1]} />
      <Lightformer intensity={3.4} rotation-x={Math.PI / 2} position={[0, 7, 0]} scale={[14, 3, 1]} />
      <Lightformer intensity={3} rotation-y={Math.PI / 2} position={[-8, 0.5, 0]} scale={[14, 2.2, 1]} />
      <Lightformer intensity={3} rotation-y={-Math.PI / 2} position={[8, -0.5, 0]} scale={[14, 2.2, 1]} />
      <Lightformer form="ring" intensity={3.5} position={[4, 3, 6]} scale={2.6} onUpdate={(self) => self.lookAt(0, 0, 0)} />
    </Environment>
  );
}

function Invalidate({ run }: { run: boolean }) {
  const { invalidate } = useThree();
  useEffect(() => {
    if (run) invalidate();
  }, [run, invalidate]);
  return null;
}

/**
 * The real 3D pieces. Drag turns them (never past the side that was never
 * finished), at rest they sway or turn slowly. Renders only while on screen.
 */
export default function ModelViewer({
  keys,
  active = 0,
  tone = "dark",
  shadow = false,
  className,
  label,
}: {
  keys: ModelKey[];
  active?: number;
  tone?: "dark" | "light";
  shadow?: boolean;
  className?: string;
  label?: string;
}) {
  const wrap = useRef<HTMLDivElement>(null);
  const [seen, setSeen] = useState(false);
  const [visible, setVisible] = useState(false);
  const drag = useRef({ yaw: 0, pitch: 0, active: false });
  // a model is only fetched the first time it is shown (the next one is fetched just ahead)
  const [mounted, setMounted] = useState(() => new Set<ModelKey>([keys[active]]));
  useEffect(() => {
    if (!seen) return;
    const add = (k: ModelKey) => setMounted((m) => (m.has(k) ? m : new Set([...m, k])));
    add(keys[active]);
    const t = setTimeout(() => add(keys[(active + 1) % keys.length]), 1500);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, seen, keys.join()]);

  useEffect(() => {
    const el = wrap.current!;
    const io = new IntersectionObserver(
      ([e]) => {
        setVisible(e.isIntersecting);
        if (e.isIntersecting) setSeen(true);
      },
      { rootMargin: "200px" },
    );
    io.observe(el);
    let sx = 0;
    let sy = 0;
    let oy = 0;
    let op = 0;
    const down = (e: PointerEvent) => {
      drag.current.active = true;
      sx = e.clientX;
      sy = e.clientY;
      oy = drag.current.yaw;
      op = drag.current.pitch;
      el.setPointerCapture(e.pointerId);
      e.stopPropagation();
    };
    const move = (e: PointerEvent) => {
      if (!drag.current.active) return;
      drag.current.yaw = oy + (e.clientX - sx) * 0.008;
      drag.current.pitch = THREE.MathUtils.clamp(op + (e.clientY - sy) * 0.004, -0.35, 0.35);
    };
    const up = () => (drag.current.active = false);
    el.addEventListener("pointerdown", down);
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerup", up);
    el.addEventListener("pointercancel", up);
    return () => {
      io.disconnect();
      el.removeEventListener("pointerdown", down);
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerup", up);
      el.removeEventListener("pointercancel", up);
    };
  }, []);

  return (
    <div ref={wrap} className={className} data-cursor={label} style={{ touchAction: "pan-y", cursor: "grab", width: "100%", height: "100%" }}>
      {seen && (
        <Canvas
          frameloop={visible ? "always" : "never"}
          dpr={[1, 1.75]}
          camera={{ position: [0, 0, 4.4], fov: 32 }}
          gl={{ antialias: true, alpha: true, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.05 }}
        >
          <Invalidate run={visible} />
          <ambientLight intensity={0.35} />
          <directionalLight position={[2, 3, 5]} intensity={0.9} />
          {/* rim light from behind, so dark pieces still draw their outline on black */}
          <directionalLight position={[-3, 2.5, -4]} intensity={2.2} />
          <directionalLight position={[3.5, -1, -3]} intensity={1.2} />
          <Suspense fallback={null}>
            {keys.map((k, i) =>
              mounted.has(k) ? (
                <Suspense key={k} fallback={null}>
                  <Piece k={k} on={i === active} drag={drag} />
                </Suspense>
              ) : null,
            )}
            <Studio tone={tone} />
            {shadow && <ContactShadows position={[0, -1.15, 0]} opacity={0.5} scale={5} blur={2.6} far={2.2} />}
          </Suspense>
        </Canvas>
      )}
    </div>
  );
}
