"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

type W = Window & { __mhNav?: boolean; __mhTitle?: string };

/**
 * Page transition: the new page arrives under a black curtain that lifts.
 * Links marked data-title="…" show that name on the curtain while it lifts.
 */
export default function Template({ children }: { children: React.ReactNode }) {
  const curtain = useRef<HTMLDivElement>(null);
  const title = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const w = window as W;
    const onClick = (e: MouseEvent) => {
      const a = (e.target as HTMLElement | null)?.closest<HTMLElement>("a[data-title]");
      w.__mhTitle = a?.dataset.title ?? "";
    };
    document.addEventListener("click", onClick, true);

    const first = !w.__mhNav;
    w.__mhNav = true;
    if (first) {
      if (curtain.current) curtain.current.style.display = "none";
      return () => document.removeEventListener("click", onClick, true);
    }
    const name = w.__mhTitle;
    w.__mhTitle = "";
    const tl = gsap.timeline();
    if (name && title.current) {
      title.current.textContent = name;
      tl.fromTo(title.current, { yPercent: 110 }, { yPercent: 0, duration: 0.7, ease: "expo.out" });
      tl.to(title.current, { yPercent: -110, duration: 0.55, ease: "expo.in" }, "+=0.15");
    }
    tl.fromTo(
      curtain.current,
      { clipPath: "inset(0 0 0 0)" },
      { clipPath: "inset(0 0 100% 0)", duration: 1.0, ease: "expo.inOut" },
      name ? "-=0.25" : 0.05,
    );
    return () => {
      tl.kill();
      document.removeEventListener("click", onClick, true);
    };
  }, []);
  return (
    <>
      <div
        ref={curtain}
        aria-hidden
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 95,
          background: "#050505",
          pointerEvents: "none",
          display: "grid",
          placeItems: "center",
        }}
      >
        <span style={{ overflow: "hidden", display: "block", padding: "0.12em 0" }}>
          <span
            ref={title}
            className="display"
            style={{ display: "block", fontSize: "clamp(48px, 8vw, 150px)", color: "#efefed", transform: "translateY(110%)" }}
          />
        </span>
      </div>
      {children}
    </>
  );
}
