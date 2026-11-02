"use client";

import { createContext, useContext, useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const LenisCtx = createContext<Lenis | null>(null);
export const useLenis = () => useContext(LenisCtx);

/** Scroll to the element named in the URL hash once the page has laid out. */
function toHash(l: Lenis | null, immediate = false) {
  const id = decodeURIComponent(window.location.hash.slice(1));
  if (!id) return false;
  const el = document.getElementById(id);
  if (!el) return false;
  if (l) l.scrollTo(el, { immediate, duration: 1.4, force: true });
  else el.scrollIntoView();
  return true;
}

/**
 * Presenter keys: ↓ → PageDown Space go to the next stop, ↑ ← PageUp back.
 * Stops are the page's top-level sections plus anything marked [data-stop].
 * A stop taller than the screen is walked through one screen at a time.
 */
function stops() {
  const els = Array.from(document.querySelectorAll<HTMLElement>("main > section, main > footer, main > header, [data-stop]"));
  const y = window.scrollY;
  return Array.from(new Set(els.map((e) => Math.round(e.getBoundingClientRect().top + y)))).sort((a, b) => a - b);
}

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  const [lenis, setLenis] = useState<Lenis | null>(null);
  const pathname = usePathname();
  const first = useRef(true);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const l = new Lenis({ lerp: 0.09, wheelMultiplier: 1, touchMultiplier: 1.4 });
    l.on("scroll", ScrollTrigger.update);
    const tick = (time: number) => l.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    setLenis(l);
    return () => {
      gsap.ticker.remove(tick);
      l.destroy();
    };
  }, []);

  // presenter keys
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const t = e.target as HTMLElement | null;
      if (t && (t.isContentEditable || /INPUT|TEXTAREA|SELECT/.test(t.tagName))) return;
      if (document.documentElement.dataset.modal) return; // overlays handle their own keys
      const fwd = ["ArrowDown", "ArrowRight", "PageDown", " "].includes(e.key);
      const back = ["ArrowUp", "ArrowLeft", "PageUp"].includes(e.key);
      if (!fwd && !back) return;
      if (e.key === " " && e.shiftKey) return;
      e.preventDefault();
      const vh = window.innerHeight;
      const y = lenis ? lenis.targetScroll : window.scrollY;
      const s = stops();
      let to: number;
      if (fwd) {
        const next = s.find((v) => v > y + 8);
        to = next === undefined || next - y > vh * 1.05 ? y + vh * 0.9 : next;
      } else {
        const prev = [...s].reverse().find((v) => v < y - 8);
        to = prev === undefined || y - prev > vh * 1.05 ? y - vh * 0.9 : prev;
      }
      to = Math.max(0, Math.min(to, document.documentElement.scrollHeight - vh));
      if (lenis) lenis.scrollTo(to, { duration: 1.25, easing: (x) => 1 - Math.pow(1 - x, 4) });
      else window.scrollTo({ top: to, behavior: "smooth" });
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lenis]);

  useEffect(() => {
    const isFirst = first.current;
    first.current = false;
    if (!isFirst) {
      lenis?.scrollTo(0, { immediate: true, force: true });
      window.scrollTo(0, 0);
    }
    const id = requestAnimationFrame(() => ScrollTrigger.refresh());
    // land on #section after the page (and its pinned sections) have laid out
    const tm = window.location.hash ? window.setTimeout(() => toHash(lenis), isFirst ? 900 : 500) : 0;
    const onHash = () => toHash(lenis);
    window.addEventListener("hashchange", onHash);
    return () => {
      cancelAnimationFrame(id);
      clearTimeout(tm);
      window.removeEventListener("hashchange", onHash);
    };
  }, [pathname, lenis]);

  return <LenisCtx.Provider value={lenis}>{children}</LenisCtx.Provider>;
}
