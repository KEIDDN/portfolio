import gsap from "gsap";

type W = Window & { __mhMorph?: boolean };

/**
 * Shared-element transition: a copy of the clicked media (its current frame)
 * grows from where it is to fill the screen while the next page loads under it,
 * then dissolves into that page's full-screen hero.
 */
export function morphTo(el: HTMLElement, href: string, push: (href: string) => void) {
  const r = el.getBoundingClientRect();
  const clone = document.createElement("div");
  Object.assign(clone.style, {
    position: "fixed",
    left: `${r.left}px`,
    top: `${r.top}px`,
    width: `${r.width}px`,
    height: `${r.height}px`,
    zIndex: "150",
    overflow: "hidden",
    borderRadius: getComputedStyle(el).borderRadius,
    background: "#000",
    pointerEvents: "none",
  });
  const video = el.querySelector("video");
  const img = el.querySelector("img");
  const fill = { position: "absolute", inset: "0", width: "100%", height: "100%", objectFit: "cover" };
  if (video && video.readyState >= 2) {
    const c = document.createElement("canvas");
    c.width = video.videoWidth;
    c.height = video.videoHeight;
    try {
      c.getContext("2d")!.drawImage(video, 0, 0);
      Object.assign(c.style, fill);
      clone.appendChild(c);
    } catch {
      /* fall back to the poster below */
    }
  }
  if (!clone.firstChild) {
    const src = video?.poster || img?.currentSrc || img?.src;
    if (src) {
      const i = document.createElement("img");
      i.src = src;
      Object.assign(i.style, fill);
      clone.appendChild(i);
    }
  }
  document.body.appendChild(clone);
  (window as W).__mhMorph = true;

  gsap.to(clone, {
    left: 0,
    top: 0,
    width: window.innerWidth,
    height: window.innerHeight,
    borderRadius: 0,
    duration: 0.95,
    ease: "expo.inOut",
    onComplete: () => {
      push(href);
      // let the new page paint its hero under the clone, then dissolve
      const start = performance.now();
      const wait = () => {
        const arrived = window.location.pathname === href || performance.now() - start > 2500;
        if (!arrived) return requestAnimationFrame(wait);
        gsap.to(clone, { opacity: 0, duration: 0.7, ease: "power2.out", delay: 0.35, onComplete: () => clone.remove() });
      };
      requestAnimationFrame(wait);
    },
  });
}
