"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

export default function Template({ children }: { children: React.ReactNode }) {
  const curtain = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const first = !(window as unknown as { __mhNav?: boolean }).__mhNav;
    (window as unknown as { __mhNav?: boolean }).__mhNav = true;
    if (first) {
      curtain.current?.remove();
      return;
    }
    const tl = gsap.timeline();
    tl.fromTo(curtain.current, { clipPath: "inset(0 0 0 0)" }, { clipPath: "inset(0 0 100% 0)", duration: 1.0, ease: "expo.inOut", delay: 0.05 });
    return () => {
      tl.kill();
    };
  }, []);
  return (
    <>
      <div
        ref={curtain}
        aria-hidden
        style={{ position: "fixed", inset: 0, zIndex: 95, background: "#050505", pointerEvents: "none" }}
      />
      {children}
    </>
  );
}
