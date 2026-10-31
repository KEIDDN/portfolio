"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, Lightformer, MeshTransmissionMaterial, Float } from "@react-three/drei";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import data from "@/data/emblem.json";

export type MaterialName = "chrome" | "steel" | "black chrome" | "glass";
export const MATERIALS: MaterialName[] = ["chrome", "steel", "black chrome", "glass"];

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
        <meshPhysicalMaterial color="#ffffff" metalness={1} roughness={0.08} clearcoat={1} clearcoatRoughness={0.05} envMapIntensity={1.6} />
      ) : material === "steel" ? (
        <meshPhysicalMaterial color="#c9ccd1" metalness={1} roughness={0.32} anisotropy={0.9} anisotropyRotation={Math.PI / 2} envMapIntensity={1.8} />
      ) : (
        <meshPhysicalMaterial color="#3a3a3c" metalness={1} roughness={0.14} clearcoat={1} clearcoatRoughness={0.04} envMapIntensity={2.2} />
      )}
    </mesh>
  );
}

export default function Emblem3D({ material, scale }: { material: MaterialName; scale?: number }) {
  return (
    <Canvas
      dpr={[1, 1.75]}
      camera={{ position: [0, 0, 4.2], fov: 35 }}
      gl={{ antialias: true, alpha: true, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.25 }}
    >
      <ambientLight intensity={0.4} />
      <directionalLight position={[3, 4, 5]} intensity={1.4} />
      <Float speed={1.4} rotationIntensity={0.25} floatIntensity={0.6}>
        <Emblem material={material} scale={scale} />
      </Float>
      <Environment resolution={256}>
        <color attach="background" args={["#262626"]} />
        <Lightformer intensity={3} rotation-x={Math.PI / 2} position={[0, 5, -9]} scale={[10, 10, 1]} />
        <Lightformer intensity={2.5} position={[0, 0, 8]} scale={[6, 3, 1]} />
        <group rotation={[Math.PI / 2, 1, 0]}>
          {[2, 0, 2, 0, 2, 0, 2, 0].map((x, i) => (
            <Lightformer key={i} intensity={3} rotation={[Math.PI / 4, 0, 0]} position={[x, 4, i * 4]} scale={[4, 1, 1]} />
          ))}
          <Lightformer intensity={1.6} rotation-y={Math.PI / 2} position={[-5, 1, -1]} scale={[50, 2, 1]} />
          <Lightformer intensity={1.6} rotation-y={Math.PI / 2} position={[-5, -1, -1]} scale={[50, 2, 1]} />
          <Lightformer intensity={1.6} rotation-y={-Math.PI / 2} position={[10, 1, 0]} scale={[50, 2, 1]} />
        </group>
        <Lightformer form="ring" color="#c4161c" intensity={3} position={[-6, -4, 4]} scale={4} onUpdate={(self) => self.lookAt(0, 0, 0)} />
      </Environment>
    </Canvas>
  );
}
