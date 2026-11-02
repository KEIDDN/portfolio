"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import styles from "./Cursor.module.css";

/**
 * A small dot that follows the pointer (desktop only). It grows over links and
 * shows a word over anything marked data-cursor="…" (Ver, Arrastrar, ←, →).
 */
export default function Cursor() {
  const dot = useRef<HTMLDivElement>(null);
  const [label, setLabel] = useState("");
  const [hover, setHover] = useState(false);
  const [on, setOn] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;
    setOn(true);
    document.documentElement.classList.add("has-cursor");
    const p = { x: -100, y: -100, tx: -100, ty: -100 };
    let raf = 0;
    const loop = () => {
      p.x += (p.tx - p.x) * 0.28;
      p.y += (p.ty - p.y) * 0.28;
      if (dot.current) dot.current.style.transform = `translate3d(${p.x}px, ${p.y}px, 0)`;
      raf = requestAnimationFrame(loop);
    };
    const move = (e: PointerEvent) => {
      p.tx = e.clientX;
      p.ty = e.clientY;
      const t = e.target as HTMLElement | null;
      const c = t?.closest<HTMLElement>("[data-cursor]");
      setLabel(c?.dataset.cursor ?? "");
      setHover(!c && !!t?.closest("a, button, [role=button]"));
    };
    const leave = () => {
      p.tx = p.ty = -100;
    };
    window.addEventListener("pointermove", move, { passive: true });
    document.addEventListener("pointerleave", leave);
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", move);
      document.removeEventListener("pointerleave", leave);
      document.documentElement.classList.remove("has-cursor");
    };
  }, []);

  useEffect(() => {
    setLabel("");
    setHover(false);
  }, [pathname]);

  if (!on) return null;
  return (
    <div ref={dot} className={styles.cursor} aria-hidden>
      <div className={`${styles.dot} ${hover ? styles.hover : ""} ${label ? styles.label : ""}`}>
        <span className="mono">{label}</span>
      </div>
    </div>
  );
}
