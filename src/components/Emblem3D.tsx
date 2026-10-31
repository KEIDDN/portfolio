"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, Lightformer, MeshTransmissionMaterial, Float } from "@react-three/drei";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import data from "@/data/emblem.json";

export type MaterialName = "chrome" | "glass" | "obsidian" | "crimson";
export const MATERIALS: MaterialName[] = ["chrome", "glass", "obsidian", "crimson"];

function useEmblemGeometry() {
  return useMemo(() => {
    const shapes = (data.shapes as { outer: number[][]; holes: number[][][] }[]).map((s) => {
      const shape = new THREE.Shape(s.outer.map(([x, y]) => new THREE.Vector2(x, y)));
      s.holes.forEach((h) => shape.holes.push(new THREE.Path(h.map(([x, y]) => new THREE.Vector2(x, y)))));
      return shape;
    });
    const geo = new THREE.ExtrudeGeometry(shapes, {
      depth: 0.16,
      bevelEnabled: true,
      bevelThickness: 0.035,
      bevelSize: 0.022,
      bevelSegments: 6,
      curveSegments: 4,
    });
    geo.center();
    geo.computeVertexNormals();
    return geo;
  }, []);
}

function Emblem({ material, scale = 1.7 }: { material: MaterialName; scale?: number }) {
  const ref = useRef<THREE.Mesh>(null);
  const geo = useEmblemGeometry();
  const { pointer } = useThree();
  useFrame((state, dt) => {
    const m = ref.current;
    if (!m) return;
    const t = state.clock.elapsedTime;
    m.rotation.y = THREE.MathUtils.damp(m.rotation.y, pointer.x * 0.7 + Math.sin(t * 0.4) * 0.25, 3, dt);
    m.rotation.x = THREE.MathUtils.damp(m.rotation.x, -pointer.y * 0.45, 3, dt);
  });
  return (
    <mesh ref={ref} geometry={geo} scale={scale}>
      {material === "glass" ? (
        <MeshTransmissionMaterial
          samples={4}
          resolution={384}
          thickness={0.35}
          roughness={0.02}
          ior={1.45}
          chromaticAberration={0.25}
          anisotropy={0.2}
          distortion={0.15}
          distortionScale={0.4}
          temporalDistortion={0.05}
          backside
          color="#ffffff"
        />
      ) : material === "chrome" ? (
        <meshPhysicalMaterial color="#e8e8e8" metalness={1} roughness={0.06} clearcoat={1} />
      ) : material === "obsidian" ? (
        <meshPhysicalMaterial color="#0a0a0a" metalness={0.2} roughness={0.12} clearcoat={1} clearcoatRoughness={0.05} />
      ) : (
        <meshPhysicalMaterial color="#b0121b" metalness={0.1} roughness={0.25} clearcoat={1} clearcoatRoughness={0.08} sheen={0.4} />
      )}
    </mesh>
  );
}

export default function Emblem3D({ material, scale }: { material: MaterialName; scale?: number }) {
  return (
    <Canvas
      dpr={[1, 1.75]}
      camera={{ position: [0, 0, 4.2], fov: 35 }}
      gl={{ antialias: true, alpha: true, toneMapping: THREE.ACESFilmicToneMapping }}
    >
      <Float speed={1.4} rotationIntensity={0.25} floatIntensity={0.6}>
        <Emblem material={material} scale={scale} />
      </Float>
      <Environment resolution={256}>
        <color attach="background" args={["#0a0a0a"]} />
        <Lightformer intensity={1.2} rotation-x={Math.PI / 2} position={[0, 5, -9]} scale={[10, 10, 1]} />
        <group rotation={[Math.PI / 2, 1, 0]}>
          {[2, 0, 2, 0, 2, 0, 2, 0].map((x, i) => (
            <Lightformer key={i} intensity={1.6} rotation={[Math.PI / 4, 0, 0]} position={[x, 4, i * 4]} scale={[4, 1, 1]} />
          ))}
          <Lightformer intensity={0.8} rotation-y={Math.PI / 2} position={[-5, 1, -1]} scale={[50, 2, 1]} />
          <Lightformer intensity={0.8} rotation-y={Math.PI / 2} position={[-5, -1, -1]} scale={[50, 2, 1]} />
          <Lightformer intensity={0.8} rotation-y={-Math.PI / 2} position={[10, 1, 0]} scale={[50, 2, 1]} />
        </group>
        <Lightformer form="ring" color="#c4161c" intensity={3} position={[-6, -4, 4]} scale={4} onUpdate={(self) => self.lookAt(0, 0, 0)} />
      </Environment>
    </Canvas>
  );
}
