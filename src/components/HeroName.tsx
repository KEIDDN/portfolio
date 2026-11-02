"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { LOADER_EVENT, loaderDone } from "./Loader";
import styles from "./Hero.module.css";

/**
 * MIKI HERRERO, drawn twice from the same canvas:
 * - a solid text quad (letters rise in through an invisible baseline mask), and
 * - a field of dots sampled from the glyphs that take over on scroll and melt:
 *   they drip downwards, drift to the sides with a little life, and fade out
 *   before they reach the copy below.
 */

const MAX = 16;
const CELL = 2.6; // css px between sampled dots

const quadVert = /* glsl */ `
varying vec2 vUv;
void main(){ vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }
`;

const quadFrag = /* glsl */ `
precision highp float;
#define MAX ${MAX}
uniform sampler2D uTex;
uniform vec4 uBox[MAX];
uniform float uOff[MAX];
uniform int uCount;
uniform vec2 uRes;
uniform float uTime;
uniform float uSolid;
uniform vec3 uColor;
varying vec2 vUv;
float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
void main(){
  vec2 px = vUv * uRes;
  float a = 0.0;
  for (int i = 0; i < MAX; i++) {
    if (i >= uCount) break;
    vec4 b = uBox[i];
    vec2 p = px - vec2(0.0, uOff[i]);
    if (p.x < b.x || p.x > b.x + b.z) continue;
    if (px.y < b.y) continue;                 // each letter rises through its own baseline mask
    a = max(a, texture2D(uTex, p / uRes).a);
  }
  float g = hash(px + fract(uTime * 7.0)) - 0.5;
  a *= uSolid;
  gl_FragColor = vec4((uColor + g * 0.1) * a, a);
}
`;

const dotVert = /* glsl */ `
attribute vec4 aRnd;
uniform float uP;
uniform float uTime;
uniform vec2 uRes;
uniform float uDpr;
uniform vec4 uText; // x0, y0 (bottom), w, h of the text block, px
varying float vA;
varying float vT;
void main(){
  vec2 aPos = position.xy;
  float yN = (aPos.y - uText.y) / uText.w;           // 0 bottom .. 1 top
  float delay = aRnd.x * 0.42 + (1.0 - yN) * 0.12;   // bottom edge starts dripping first
  float t = clamp((uP - delay) / 0.5, 0.0, 1.0);
  float te = t * t;
  float cx = uText.x + uText.z * 0.5;
  float side = (aPos.x - cx) / (uText.z * 0.5);       // -1 .. 1
  vec2 p = aPos;
  // fall and open to the sides, with a slow organic sway
  p.y -= te * uText.w * (1.2 + aRnd.z * 1.1);
  p.x += sign(side) * (0.25 + abs(side) * 0.75) * te * uText.z * 0.22;
  p.x += sin(uTime * 1.1 + aRnd.y * 6.2831 + aPos.y * 0.02) * 14.0 * t;
  p.y += cos(uTime * 0.9 + aRnd.w * 6.2831) * 6.0 * t;
  vec2 clip = (p / uRes) * 2.0 - 1.0;
  gl_Position = vec4(clip, 0.0, 1.0);
  float shrink = mix(1.0, 0.55 + aRnd.y * 0.45, smoothstep(0.0, 0.35, t));
  gl_PointSize = ${CELL.toFixed(2)} * uDpr * 1.06 * shrink;
  vA = step(0.0001, uP) * (1.0 - smoothstep(0.45, 0.95, t));
  vT = t;
}
`;

const dotFrag = /* glsl */ `
precision highp float;
uniform vec3 uColor;
varying float vA;
varying float vT;
void main(){
  // square cells while still forming the letters, round dots once they melt
  vec2 c = gl_PointCoord - 0.5;
  float round = 1.0 - smoothstep(0.42, 0.5, length(c));
  float shape = mix(1.0, round, smoothstep(0.02, 0.3, vT));
  float a = vA * shape;
  if (a < 0.01) discard;
  gl_FragColor = vec4(uColor * a, a);
}
`;

type Glyph = { x: number; y: number; w: number; h: number };

function drawText(text: string, width: number, dpr: number, mobile: boolean) {
  const lines = mobile ? text.split(" ") : [text];
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d", { willReadFrequently: true })!;
  const base = 200;
  ctx.font = `500 ${base}px Garet`;
  const measure = (s: string, size: number) =>
    [...s].reduce((w, ch) => w + ctx.measureText(ch).width + -0.075 * size, 0.075 * size);
  const widest = Math.max(...lines.map((l) => measure(l, base)));
  const size = (base * width * 0.995) / widest;
  const lineH = size * 0.84;
  const padY = size * 0.22;
  const core = lineH * lines.length + padY * 2;
  const padTop = size * 0.15;
  const padBottom = size * 1.7; // room for the dots to fall into the empty space below
  const h = core + padTop + padBottom;
  canvas.width = Math.round(width * dpr);
  canvas.height = Math.round(h * dpr);
  ctx.scale(dpr, dpr);
  ctx.font = `500 ${size}px Garet`;
  ctx.fillStyle = "#fff";
  const tr = -0.075 * size;
  const glyphs: Glyph[] = [];
  let minY = Infinity;
  let maxY = -Infinity;
  lines.forEach((line, i) => {
    const lw = [...line].reduce((w, ch) => w + ctx.measureText(ch).width + tr, -tr);
    let x = (width - lw) / 2;
    const bl = padTop + padY + lineH * (i + 1) - size * 0.1;
    for (const ch of line) {
      const m = ctx.measureText(ch);
      ctx.fillText(ch, x, bl);
      if (ch !== " ") {
        const top = bl - m.actualBoundingBoxAscent;
        const gh = m.actualBoundingBoxAscent + m.actualBoundingBoxDescent;
        glyphs.push({ x: x - 2, y: h - (top + gh) - 2, w: m.width + 4, h: gh + 4 });
        minY = Math.min(minY, h - (top + gh));
        maxY = Math.max(maxY, h - top);
      }
      x += m.width + tr;
    }
  });

  // sample dots from the drawn glyphs
  const img = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
  const pos: number[] = [];
  const rnd: number[] = [];
  for (let y = 0; y < h; y += CELL) {
    for (let x = 0; x < width; x += CELL) {
      const ix = Math.round((x + CELL / 2) * dpr);
      const iy = Math.round((y + CELL / 2) * dpr);
      if (img[(iy * canvas.width + ix) * 4 + 3] > 120) {
        pos.push(x + CELL / 2, h - (y + CELL / 2), 0);
        rnd.push(Math.random(), Math.random(), Math.random(), Math.random());
      }
    }
  }
  const lineBottom = h - (padTop + padY + lineH * lines.length);
  return { canvas, height: h, core, padTop, glyphs, pos, rnd, text: [0, minY, width, maxY - minY], lineBottom };
}

export default function HeroName({ text, color = "#efefed" }: { text: string; color?: string }) {
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
    const col = new THREE.Color(color);
    const qU = {
      uTex: { value: tex },
      uBox: { value: Array.from({ length: MAX }, () => new THREE.Vector4()) },
      uOff: { value: new Array(MAX).fill(0) as number[] },
      uCount: { value: 0 },
      uRes: { value: new THREE.Vector2(1, 1) },
      uTime: { value: 0 },
      uSolid: { value: 1 },
      uColor: { value: col },
    };
    const quadMat = new THREE.ShaderMaterial({ vertexShader: quadVert, fragmentShader: quadFrag, uniforms: qU, transparent: true, premultipliedAlpha: true });
    scene.add(new THREE.Mesh(new THREE.PlaneGeometry(2, 2), quadMat));

    const dU = {
      uP: { value: 0 },
      uTime: qU.uTime,
      uRes: qU.uRes,
      uDpr: { value: dpr },
      uText: { value: new THREE.Vector4() },
      uColor: { value: col },
    };
    const dotGeo = new THREE.BufferGeometry();
    const dotMat = new THREE.ShaderMaterial({ vertexShader: dotVert, fragmentShader: dotFrag, uniforms: dU, transparent: true, premultipliedAlpha: true, depthTest: false });
    const dots = new THREE.Points(dotGeo, dotMat);
    dots.frustumCulled = false;
    scene.add(dots);

    let H = 1;
    let offs: number[] = [];
    let revealed = loaderDone();
    const layout = () => {
      const w = el.clientWidth;
      if (w < 10) return false;
      const res = drawText(text, w, dpr, window.innerWidth < 700);
      H = res.core;
      el.style.height = `${H}px`;
      tex.image = res.canvas;
      tex.needsUpdate = true;
      renderer.setSize(w, res.height);
      renderer.domElement.style.top = `${-res.padTop}px`;
      renderer.domElement.style.height = `${res.height}px`;
      qU.uRes.value.set(w, res.height);
      qU.uCount.value = Math.min(res.glyphs.length, MAX);
      res.glyphs.slice(0, MAX).forEach((g, i) => qU.uBox.value[i].set(g.x, g.y, g.w, g.h));
      offs = res.glyphs.map(() => (revealed ? 0 : -H * 1.15));
      dotGeo.setAttribute("position", new THREE.Float32BufferAttribute(res.pos, 3));
      dotGeo.setAttribute("aRnd", new THREE.Float32BufferAttribute(res.rnd, 4));
      dU.uText.value.set(res.text[0], res.text[1], res.text[2], res.text[3]);
      ScrollTrigger.refresh();
      return true;
    };

    let ready = false;
    document.fonts.load("500 100px Garet").then(() => {
      if (!layout()) {
        requestAnimationFrame(() => layout() && (ready = true));
        if (fallback.current) fallback.current.style.opacity = "0";
        return;
      }
      ready = true;
      if (fallback.current) fallback.current.style.opacity = "0";
      if (revealed) reveal(true);
    });
    const ro = new ResizeObserver(() => {
      if (layout()) ready = true;
    });
    ro.observe(el);

    // entrance: letters rise through the baseline, staggered, no bounce
    const state = { o: [] as number[] };
    const reveal = (instant = false) => {
      revealed = true;
      if (!ready) return;
      state.o = offs.slice();
      gsap.to(state.o, {
        ...Object.fromEntries(state.o.map((_, i) => [i, 0])),
        duration: instant ? 0 : 1.5,
        ease: "expo.out",
        stagger: 0.055,
        onUpdate: () => (offs = state.o.slice()),
      });
    };
    const onLoaded = () => reveal();
    if (!revealed) window.addEventListener(LOADER_EVENT, onLoaded, { once: true });

    let target = 0;
    const st = ScrollTrigger.create({
      trigger: el.closest("section") ?? el,
      start: "top top",
      end: "bottom 10%",
      onUpdate: (s) => (target = s.progress),
    });

    let visible = true;
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting), { rootMargin: "0px 0px 40% 0px" });
    io.observe(el);

    let p = 0;
    let last = performance.now();
    const tick = () => {
      const now = performance.now();
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      if (!visible || !ready) return;
      qU.uTime.value += dt;
      p += (target - p) * Math.min(1, dt * 6);
      dU.uP.value = p;
      // the solid letters hand over to the dots as soon as the melt starts
      qU.uSolid.value = 1 - Math.min(1, p / 0.02);
      for (let i = 0; i < MAX; i++) qU.uOff.value[i] = offs[i] ?? 0;
      renderer.render(scene, camera);
    };
    gsap.ticker.add(tick);

    return () => {
      gsap.ticker.remove(tick);
      window.removeEventListener(LOADER_EVENT, onLoaded);
      ro.disconnect();
      io.disconnect();
      st.kill();
      renderer.dispose();
      quadMat.dispose();
      dotMat.dispose();
      dotGeo.dispose();
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
