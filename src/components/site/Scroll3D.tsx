import { useEffect } from "react";

export function Scroll3D() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const main = document.querySelector("main");
    if (!main) return;

    const sections = Array.from(
      main.querySelectorAll<HTMLElement>(":scope > section")
    ).filter((s) => s.id !== "home");

    if (!sections.length) return;

    sections.forEach((s) => {
      s.style.willChange = "transform, opacity";
      s.style.transition =
        "transform 800ms cubic-bezier(0.25, 1, 0.5, 1), opacity 800ms ease";
      // Initial hidden state: standard 2D fade-up for high performance
      s.style.opacity = "0";
      s.style.transform = "translateY(30px) scale(0.98)";
    });

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          const el = e.target as HTMLElement;
          if (e.isIntersecting) {
            el.style.opacity = "1";
            el.style.transform = "translateY(0) scale(1)";
          } else if (e.boundingClientRect.top > 0) {
            // Only re-hide when section is below viewport
            el.style.opacity = "0";
            el.style.transform = "translateY(30px) scale(0.98)";
          }
        }
      },
      { threshold: 0.1, rootMargin: "0px 0px -5% 0px" }
    );

    sections.forEach((s) => io.observe(s));

    return () => {
      io.disconnect();
      sections.forEach((s) => {
        s.style.transform = "";
        s.style.opacity = "";
        s.style.transition = "";
        s.style.willChange = "";
      });
    };
  }, []);

  return null;
}
