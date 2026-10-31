"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { LOADER_EVENT, loaderDone } from "./Loader";
import styles from "./Hero.module.css";

const MAX = 16;

const vert = /* glsl */ `
varying vec2 vUv;
void main(){ vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }
`;

const frag = /* glsl */ `
precision highp float;
#define MAX ${MAX}
uniform sampler2D uTex;
uniform vec4 uBox[MAX];
uniform vec3 uOff[MAX];
uniform int uCount;
uniform vec2 uRes;
uniform float uTime;
uniform float uDis;
uniform vec3 uColor;
varying vec2 vUv;

float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }

float alphaAt(vec2 uv){
  vec2 px = uv * uRes;
  float a = 0.0;
  for (int i = 0; i < MAX; i++) {
    if (i >= uCount) break;
    vec4 b = uBox[i];           // px: x, y, w, h (y from bottom)
    vec3 o = uOff[i];           // px offset x, y ; rotation
    vec2 c = b.xy + b.zw * 0.5;
    vec2 p = px - o.xy - c;
    float s = sin(-o.z), co = cos(-o.z);
    p = vec2(co * p.x - s * p.y, s * p.x + co * p.y) + c;
    vec2 q = (p - b.xy) / b.zw;
    if (q.x < -0.02 || q.x > 1.02 || q.y < -0.02 || q.y > 1.02) continue;
    a = max(a, texture2D(uTex, p / uRes).a);
  }
  return a;
}

void main(){
  float solid = alphaAt(vUv);
  // halftone dissolve
  float cell = mix(3.0, 16.0, uDis);
  vec2 px = vUv * uRes;
  vec2 id = floor(px / cell);
  vec2 cc = (id + 0.5) * cell;
  float ca = alphaAt(cc / uRes);
  float drop = step(hash(id) , 1.0 - uDis * 0.75);
  float r = sqrt(ca) * cell * 0.62 * (1.0 - uDis * 0.35);
  float dotA = (1.0 - smoothstep(r - 1.0, r + 0.5, length(px - cc))) * drop;
  float a = mix(solid, dotA, smoothstep(0.02, 0.35, uDis));
  float g = hash(vUv * uRes + fract(uTime * 7.0)) - 0.5;
  vec3 col = uColor + g * 0.12;
  gl_FragColor = vec4(col * a, a);
}
`;

type Glyph = { x: number; y: number; w: number; h: number };

function drawText(text: string, width: number, dpr: number, mobile: boolean) {
  const lines = mobile ? text.split(" ") : [text];
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d")!;
  const base = 200;
  ctx.font = `500 ${base}px Garet`;
  const measure = (s: string, size: number) =>
    [...s].reduce((w, ch) => w + ctx.measureText(ch).width + -0.075 * size, 0.075 * size);
  const widest = Math.max(...lines.map((l) => measure(l, base)));
  const size = (base * width * 0.995) / widest;
  const lineH = size * 0.84;
  const padY = size * 0.22;
  const core = lineH * lines.length + padY * 2;
  const padTop = size * 0.5;
  const padBottom = size * 1.5;
  const h = core + padTop + padBottom;
  canvas.width = Math.round(width * dpr);
  canvas.height = Math.round(h * dpr);
  ctx.scale(dpr, dpr);
  ctx.font = `500 ${size}px Garet`;
  ctx.fillStyle = "#fff";
  const tr = -0.075 * size;
  const glyphs: Glyph[] = [];
  lines.forEach((line, i) => {
    const lw = [...line].reduce((w, ch) => w + ctx.measureText(ch).width + tr, -tr);
    let x = (width - lw) / 2;
    const base = padTop + padY + lineH * (i + 1) - size * 0.1;
    for (const ch of line) {
      const m = ctx.measureText(ch);
      ctx.fillText(ch, x, base);
      if (ch !== " ") {
        const top = base - m.actualBoundingBoxAscent;
        const gh = m.actualBoundingBoxAscent + m.actualBoundingBoxDescent;
        // y from bottom for GL
        glyphs.push({ x: x - 2, y: h - (top + gh) - 2, w: m.width + 4, h: gh + 4 });
      }
      x += m.width + tr;
    }
  });
  return { canvas, height: h, core, padTop, glyphs };
}

type Body = { x: number; y: number; r: number; vx: number; vy: number; vr: number; fx: number; fy: number; fr: number };

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
    const uniforms = {
      uTex: { value: tex },
      uBox: { value: Array.from({ length: MAX }, () => new THREE.Vector4()) },
      uOff: { value: Array.from({ length: MAX }, () => new THREE.Vector3()) },
      uCount: { value: 0 },
      uRes: { value: new THREE.Vector2(1, 1) },
      uTime: { value: 0 },
      uDis: { value: 0 },
      uColor: { value: new THREE.Color(color) },
    };
    const mat = new THREE.ShaderMaterial({ vertexShader: vert, fragmentShader: frag, uniforms, transparent: true, premultipliedAlpha: true });
    scene.add(new THREE.Mesh(new THREE.PlaneGeometry(2, 2), mat));

    let glyphs: Glyph[] = [];
    let bodies: Body[] = [];
    let H = 1;
    let padTopPx = 0;
    const layout = () => {
      const w = el.clientWidth;
      const res = drawText(text, w, dpr, window.innerWidth < 700);
      glyphs = res.glyphs;
      H = res.core;
      el.style.height = `${H}px`;
      tex.image = res.canvas;
      tex.needsUpdate = true;
      renderer.setSize(w, res.height);
      renderer.domElement.style.top = `${-res.padTop}px`;
      renderer.domElement.style.height = `${res.height}px`;
      uniforms.uRes.value.set(w, res.height);
      padTopPx = res.padTop;
      uniforms.uCount.value = Math.min(glyphs.length, MAX);
      glyphs.slice(0, MAX).forEach((g, i) => uniforms.uBox.value[i].set(g.x, g.y, g.w, g.h));
      bodies = glyphs.map(() => ({
        x: 0, y: revealed ? 0 : -H * 1.3, r: 0, vx: 0, vy: 0, vr: 0,
        // per-letter scroll scatter targets
        fx: (Math.random() - 0.5) * 0.5, fy: 0.55 + Math.random() * 0.9, fr: (Math.random() - 0.5) * 1.6,
      }));
      ScrollTrigger.refresh();
    };

    let ready = false;
    let revealed = false;
    let revealT = 0;
    document.fonts.load("500 100px Garet").then(() => {
      layout();
      ready = true;
      if (fallback.current) fallback.current.style.opacity = "0";
    });
    const ro = new ResizeObserver(() => ready && layout());
    ro.observe(el);

    const mouse = { x: -9999, y: -9999, active: false };
    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      mouse.x = e.clientX - r.left;
      mouse.y = r.bottom - e.clientY + (renderer.domElement.clientHeight - padTopPx - H); // y from canvas bottom
      mouse.active = true;
    };
    const onLeave = () => (mouse.active = false);
    window.addEventListener("pointermove", onMove);
    document.addEventListener("pointerleave", onLeave);

    const reveal = () => {
      revealed = true;
      revealT = performance.now();
    };
    if (loaderDone()) reveal();
    else window.addEventListener(LOADER_EVENT, reveal, { once: true });

    let scrollP = 0;
    const st = ScrollTrigger.create({
      trigger: el,
      start: "top 70%",
      end: "bottom top",
      scrub: true,
      onUpdate: (s) => (scrollP = Math.max(0, (s.progress - 0.1) / 0.9)),
    });

    let visible = true;
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting));
    io.observe(el);

    let last = performance.now();
    const tick = () => {
      if (!visible || !ready) return;
      const now = performance.now();
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      uniforms.uTime.value += dt;
      const sp = scrollP;
      uniforms.uDis.value += (Math.min(1, sp * 1.4) - uniforms.uDis.value) * 0.15;
      const radius = H * 0.75;
      bodies.forEach((b, i) => {
        const g = glyphs[i];
        if (!g) return;
        // reveal stagger: letters rise in
        const delay = i * 70;
        const since = revealed ? now - revealT - delay : -1;
        let tx = b.fx * H * sp * 1.6;
        let ty = since < 0 ? -H * 1.3 : -b.fy * H * sp * 1.4;
        let tr = b.fr * sp;
        // magnet
        if (mouse.active && sp < 0.6) {
          const cx = g.x + g.w / 2 + b.x;
          const cy = g.y + g.h / 2 + b.y;
          const dx = cx - mouse.x;
          const dy = cy - mouse.y;
          const d = Math.hypot(dx, dy);
          if (d < radius) {
            const f = Math.pow(1 - d / radius, 2);
            tx += (dx / (d || 1)) * f * H * 0.32;
            ty += (dy / (d || 1)) * f * H * 0.32;
            tr += (dx / radius) * f * -0.35;
          }
        }
        // spring
        const k = since < 0 ? 0 : 120;
        const damp = 14;
        b.vx += ((tx - b.x) * k - b.vx * damp) * dt;
        b.vy += ((ty - b.y) * k - b.vy * damp) * dt;
        b.vr += ((tr - b.r) * k - b.vr * damp) * dt;
        b.x += b.vx * dt;
        b.y += b.vy * dt;
        b.r += b.vr * dt;
        if (i < MAX) uniforms.uOff.value[i].set(b.x, b.y, b.r);
      });
      renderer.render(scene, camera);
    };
    gsap.ticker.add(tick);

    return () => {
      gsap.ticker.remove(tick);
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
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
