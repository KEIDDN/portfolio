"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { LOADER_EVENT, loaderDone } from "./Loader";
import styles from "./Hero.module.css";

const vert = /* glsl */ `
varying vec2 vUv;
void main(){ vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }
`;

const frag = /* glsl */ `
precision highp float;
uniform sampler2D uTex;
uniform vec2 uMouse;
uniform vec2 uVel;
uniform vec2 uRes;
uniform float uTime;
uniform float uReveal;
uniform float uScroll;
uniform float uHover;
uniform vec3 uColor;
varying vec2 vUv;

float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }

float sampleA(vec2 uv){
  if(uv.x < 0.0 || uv.x > 1.0 || uv.y < 0.0 || uv.y > 1.0) return 0.0;
  return texture2D(uTex, uv).a;
}

void main(){
  vec2 uv = vUv;

  // reveal: columns rise from below, staggered
  float cols = 14.0;
  float c = floor(uv.x * cols);
  float delay = (c / cols) * 0.45;
  float r = clamp((uReveal - delay) / 0.55, 0.0, 1.0);
  r = 1.0 - pow(1.0 - r, 4.0);
  uv.y -= (1.0 - r) * 1.05;

  // mouse liquid push
  vec2 asp = vec2(uRes.x / uRes.y, 1.0);
  vec2 d = (vUv - uMouse) * asp;
  float f = exp(-dot(d, d) * 9.0) * uHover;
  uv -= uVel * f * 0.35;
  // subtle lens bulge under cursor
  uv -= d / asp * f * 0.035;

  // scroll: slice displacement + vertical stretch
  float band = floor(vUv.y * 18.0);
  float n = hash(vec2(band, 3.0)) - 0.5;
  uv.x += n * uScroll * 0.22;
  uv.y = (uv.y - 1.0) * (1.0 - uScroll * 0.35) + 1.0;

  float split = length(uVel) * f * 0.06 + uScroll * 0.012;
  float aR = sampleA(uv + vec2(split, 0.0));
  float aG = sampleA(uv);
  float aB = sampleA(uv - vec2(split, 0.0));
  float a = max(max(aR, aG), aB);

  // grain
  float g = hash(vUv * uRes + fract(uTime * 7.0)) - 0.5;
  vec3 col = uColor * vec3(aR, aG, aB) / max(a, 0.001);
  col += g * 0.12;
  a *= 1.0 - uScroll * 0.6;
  gl_FragColor = vec4(col * a, a);
}
`;

type Props = { text: string; color?: string };

function drawText(text: string, width: number, dpr: number, mobile: boolean) {
  const lines = mobile ? text.split(" ") : [text];
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d")!;
  const base = 200;
  ctx.font = `500 ${base}px Garet`;
  const track = -0.075 * base;
  const measure = (s: string) =>
    [...s].reduce((w, ch) => w + ctx.measureText(ch).width + track, -track);
  const widest = Math.max(...lines.map(measure));
  const size = (base * width) / widest;
  const lineH = size * 0.84;
  const padY = size * 0.18;
  const h = lineH * lines.length + padY * 2;
  canvas.width = Math.round(width * dpr);
  canvas.height = Math.round(h * dpr);
  ctx.scale(dpr, dpr);
  ctx.font = `500 ${size}px Garet`;
  ctx.fillStyle = "#fff";
  ctx.textBaseline = "alphabetic";
  const tr = -0.075 * size;
  lines.forEach((line, i) => {
    const lw = [...line].reduce((w, ch) => w + ctx.measureText(ch).width + tr, -tr);
    let x = (width - lw) / 2;
    const y = padY + lineH * (i + 1) - size * 0.1;
    for (const ch of line) {
      ctx.fillText(ch, x, y);
      x += ctx.measureText(ch).width + tr;
    }
  });
  return { canvas, height: h };
}

export default function HeroName({ text, color = "#efefed" }: Props) {
  const wrap = useRef<HTMLDivElement>(null);
  const fallback = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const el = wrap.current!;
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: false, premultipliedAlpha: true });
    } catch {
      return;
    }
    const dpr = Math.min(window.devicePixelRatio, 2);
    renderer.setPixelRatio(dpr);
    el.appendChild(renderer.domElement);
    renderer.domElement.className = styles.canvas;

    const scene = new THREE.Scene();
    const camera = new THREE.Camera();
    const tex = new THREE.CanvasTexture(document.createElement("canvas"));
    tex.minFilter = THREE.LinearFilter;
    tex.generateMipmaps = false;
    const uniforms = {
      uTex: { value: tex },
      uMouse: { value: new THREE.Vector2(0.5, 0.5) },
      uVel: { value: new THREE.Vector2() },
      uRes: { value: new THREE.Vector2(1, 1) },
      uTime: { value: 0 },
      uReveal: { value: 0 },
      uScroll: { value: 0 },
      uHover: { value: 0 },
      uColor: { value: new THREE.Color(color) },
    };
    const mat = new THREE.ShaderMaterial({
      vertexShader: vert,
      fragmentShader: frag,
      uniforms,
      transparent: true,
      premultipliedAlpha: true,
    });
    scene.add(new THREE.Mesh(new THREE.PlaneGeometry(2, 2), mat));

    const layout = () => {
      const w = el.clientWidth;
      const mobile = window.innerWidth < 700;
      const { canvas, height } = drawText(text, w, dpr, mobile);
      el.style.height = `${height}px`;
      tex.image = canvas;
      tex.needsUpdate = true;
      renderer.setSize(w, height);
      uniforms.uRes.value.set(w, height);
      ScrollTrigger.refresh();
    };
    let ready = false;
    document.fonts.load("500 100px Garet").then(() => {
      layout();
      ready = true;
      if (fallback.current) fallback.current.style.opacity = "0";
    });
    const ro = new ResizeObserver(() => ready && layout());
    ro.observe(el);

    // mouse
    const target = new THREE.Vector2(0.5, 0.5);
    const prev = new THREE.Vector2(0.5, 0.5);
    let hoverTarget = 0;
    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      target.set((e.clientX - r.left) / r.width, 1 - (e.clientY - r.top) / r.height);
      hoverTarget = e.clientY > r.top - r.height * 0.6 && e.clientY < r.bottom + r.height * 0.6 ? 1 : 0;
    };
    window.addEventListener("pointermove", onMove);

    // reveal after loader
    const reveal = () =>
      gsap.to(uniforms.uReveal, { value: 1, duration: 2.0, ease: "power2.out", delay: 0.15 });
    if (loaderDone()) reveal();
    else window.addEventListener(LOADER_EVENT, reveal, { once: true });

    const st = ScrollTrigger.create({
      trigger: el,
      start: "top 75%",
      end: "bottom top",
      scrub: true,
      onUpdate: (s) => (uniforms.uScroll.value = Math.max(0, s.progress - 0.15) * 1.2),
    });

    let visible = true;
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting));
    io.observe(el);

    const clock = new THREE.Clock();
    const tick = () => {
      if (!visible || !ready) return;
      const dt = Math.min(clock.getDelta(), 0.05);
      uniforms.uTime.value += dt;
      const m = uniforms.uMouse.value;
      m.lerp(target, 0.12);
      const v = new THREE.Vector2().subVectors(m, prev);
      uniforms.uVel.value.lerp(v.multiplyScalar(6), 0.2);
      prev.copy(m);
      uniforms.uHover.value += (hoverTarget - uniforms.uHover.value) * 0.06;
      renderer.render(scene, camera);
    };
    gsap.ticker.add(tick);

    return () => {
      gsap.ticker.remove(tick);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener(LOADER_EVENT, reveal);
      ro.disconnect();
      io.disconnect();
      st.kill();
      renderer.dispose();
      mat.dispose();
      tex.dispose();
      renderer.domElement.remove();
    };
  }, [text, color]);

  return (
    <div ref={wrap} className={styles.name}>
      <h1 ref={fallback} className={`display ${styles.fallback}`}>
        {text}
      </h1>
    </div>
  );
}
