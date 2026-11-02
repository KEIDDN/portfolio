"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { LOADER_EVENT, loaderDone } from "./Loader";
import styles from "./Hero.module.css";

/**
 * MIKI HERRERO, drawn from one canvas in two layers that share the same grid:
 * - the solid letters (crisp, full resolution; they rise in through a baseline mask), and
 * - one dot per grid cell. On scroll each cell breaks off at its own moment: the letter
 *   loses exactly that cell and the dot takes over — a burst outwards, then gravity pulls
 *   it down off the screen. Both layers hash the cell index the same way, so the hand-over
 *   is seamless and the text never goes soft.
 */

const MAX = 16;
const CELL = 2.0; // css px per cell
const TRACK = -0.05;

const glslCell = /* glsl */ `
float h1(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
vec4 cellRnd(vec2 c){ return vec4(h1(c), h1(c + 17.31), h1(c + 41.17), h1(c + 73.73)); }
// when (in scroll progress) this cell breaks away
// a crumbling front that climbs from the base of the letters to the top, with a ragged edge
float cellDelay(vec4 r, float yN){ return 0.01 + clamp(yN, 0.0, 1.0) * 0.34 + r.x * 0.07; }
`;

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
uniform vec4 uTexBox; // y0 (bottom of texture in render px), height
uniform vec4 uText;
uniform float uP;
uniform float uTime;
uniform vec3 uColor;
varying vec2 vUv;
${glslCell}
void main(){
  vec2 px = vUv * uRes;
  float a = 0.0;
  vec2 hit = vec2(-1.0);
  for (int i = 0; i < MAX; i++) {
    if (i >= uCount) break;
    vec4 b = uBox[i];
    vec2 p = px - vec2(0.0, uOff[i]);
    if (p.x < b.x || p.x > b.x + b.z) continue;
    if (px.y < b.y) continue;                 // each letter rises through its own baseline mask
    vec2 tuv = vec2(p.x / uRes.x, (p.y - uTexBox.x) / uTexBox.y);
    float s = texture2D(uTex, tuv).a;
    if (s > a) { a = s; hit = p; }
  }
  if (a <= 0.0) discard;
  // cells that have already broken away leave the letter
  vec2 c = floor(vec2(hit.x, uRes.y - hit.y) / ${CELL.toFixed(2)});
  float yN = ((uRes.y - (c.y + 0.5) * ${CELL.toFixed(2)}) - uText.y) / uText.w;
  if (uP > cellDelay(cellRnd(c), yN)) discard;
  float g = h1(px + fract(uTime * 7.0)) - 0.5;
  gl_FragColor = vec4((uColor + g * 0.08) * a, a);
}
`;

const dotVert = /* glsl */ `
attribute vec2 aCell;
uniform float uP;
uniform float uTime;
uniform vec2 uRes;
uniform float uDpr;
uniform float uVh;
uniform vec4 uText; // x0, y0 (bottom), w, h of the text block, px
varying float vA;
varying float vT;
${glslCell}
void main(){
  vec2 o = position.xy;
  vec4 r = cellRnd(aCell);
  float yN = (o.y - uText.y) / uText.w;
  float d = cellDelay(r, yN);
  float t = clamp((uP - d) / 0.42, 0.0, 1.0);
  vec2 ctr = vec2(uText.x + uText.z * 0.5, uText.y + uText.w * 0.5);
  vec2 dir = o - ctr;
  dir.x /= uText.z * 0.5;
  dir.y /= uText.w * 0.5;
  // burst outwards (fast, then settles) …
  float burst = 1.0 - pow(1.0 - min(t * 2.2, 1.0), 3.0);
  vec2 p = o;
  p.x += dir.x * (0.06 + r.z * 0.12) * uText.z * burst;
  p.y += (0.35 + r.w * 0.9) * uText.w * burst * (0.6 + 0.4 * dir.y);
  // … then gravity
  p.y -= (2.2 + r.y * 1.8) * uVh * t * t;
  p.x += (r.x - 0.5) * uText.z * 0.08 * t;
  // a little air in the fall
  p.x += sin(uTime * (0.8 + r.y) + r.z * 6.2831 + o.y * 0.015) * 18.0 * t;
  p.y += cos(uTime * (0.7 + r.x) + r.w * 6.2831) * 8.0 * t;
  gl_Position = vec4((p / uRes) * 2.0 - 1.0, 0.0, 1.0);
  float size = mix(1.08, 0.45 + r.y * 0.85, smoothstep(0.0, 0.25, t));
  gl_PointSize = ${CELL.toFixed(2)} * uDpr * size;
  // only part of the cells survive as visible dust: the rest dissolves as it breaks
  float keep = step(r.y, 0.42);
  vA = step(0.0001, t) * mix(1.0 - smoothstep(0.0, 0.12, t), 1.0 - smoothstep(0.35, 0.8, t), keep) * (0.7 + r.z * 0.3);
  vT = t;
}
`;

const dotFrag = /* glsl */ `
precision highp float;
uniform vec3 uColor;
varying float vA;
varying float vT;
void main(){
  vec2 c = gl_PointCoord - 0.5;
  float round = 1.0 - smoothstep(0.38, 0.5, length(c));
  float a = vA * mix(1.0, round, smoothstep(0.0, 0.15, vT));
  if (a < 0.01) discard;
  gl_FragColor = vec4(uColor * a, a);
}
`;

type Glyph = { x: number; y: number; w: number; h: number };

function drawText(text: string, width: number, dpr: number, mobile: boolean, below: number) {
  const lines = mobile ? text.split(" ") : [text];
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d", { willReadFrequently: true })!;
  const base = 200;
  ctx.font = `500 ${base}px Garet`;
  const measure = (s: string, size: number) =>
    [...s].reduce((w, ch) => w + ctx.measureText(ch).width + TRACK * size, -TRACK * size);
  const widest = Math.max(...lines.map((l) => measure(l, base)));
  const size = (base * width * 0.995) / widest;
  const lineH = size * 0.84;
  const padY = size * 0.22;
  const core = lineH * lines.length + padY * 2;
  const padTop = size * 0.9; // room for the burst upwards
  const th = core + padTop; // texture height (css px)
  const h = th + below; // render height: texture + the fall below
  canvas.width = Math.round(width * dpr);
  canvas.height = Math.round(th * dpr);
  ctx.scale(dpr, dpr);
  ctx.font = `500 ${size}px Garet`;
  ctx.fillStyle = "#fff";
  const tr = TRACK * size;
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

  // one dot per covered cell (cell rows counted from the top of the render area)
  const img = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
  const pos: number[] = [];
  const cell: number[] = [];
  for (let j = 0; j * CELL < th; j++) {
    for (let k = 0; k * CELL < width; k++) {
      const ix = Math.round((k + 0.5) * CELL * dpr);
      const iy = Math.round((j + 0.5) * CELL * dpr);
      if (ix >= canvas.width || iy >= canvas.height) continue;
      if (img[(iy * canvas.width + ix) * 4 + 3] > 110) {
        pos.push((k + 0.5) * CELL, h - (j + 0.5) * CELL, 0);
        cell.push(k, j);
      }
    }
  }
  return { canvas, height: h, th, below, core, padTop, glyphs, pos, cell, text: [0, minY, width, maxY - minY] };
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
      uTexBox: { value: new THREE.Vector4() },
      uText: { value: new THREE.Vector4() },
      uP: { value: 0 },
      uTime: { value: 0 },
      uColor: { value: col },
    };
    const quadMat = new THREE.ShaderMaterial({ vertexShader: quadVert, fragmentShader: quadFrag, uniforms: qU, transparent: true, premultipliedAlpha: true });
    scene.add(new THREE.Mesh(new THREE.PlaneGeometry(2, 2), quadMat));

    const dU = {
      uP: qU.uP,
      uTime: qU.uTime,
      uRes: qU.uRes,
      uDpr: { value: dpr },
      uVh: { value: window.innerHeight },
      uText: qU.uText,
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
      const below = window.innerHeight * 1.1;
      const res = drawText(text, w, dpr, window.innerWidth < 700, below);
      H = res.core;
      dU.uVh.value = window.innerHeight;
      qU.uTexBox.value.set(res.below, res.th, 0, 0);
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
      dotGeo.setAttribute("aCell", new THREE.Float32BufferAttribute(res.cell, 2));
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
      qU.uP.value = p;
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
