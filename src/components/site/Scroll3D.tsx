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

    // Apply perspective on main
    main.style.perspective = "1400px";
    main.style.perspectiveOrigin = "50% 30%";

    sections.forEach((s) => {
      s.style.transformStyle = "preserve-3d";
      s.style.willChange = "transform, opacity, filter";
      s.style.transformOrigin = "50% 100%";
      s.style.transition =
        "transform 700ms cubic-bezier(0.22, 1, 0.36, 1), opacity 700ms ease, filter 700ms ease";
      // initial hidden state
      s.style.opacity = "0";
      s.style.filter = "blur(8px)";
      s.style.transform =
        "perspective(1400px) translateY(80px) translateZ(-220px) rotateX(14deg) scale(0.94)";
    });

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          const el = e.target as HTMLElement;
          if (e.isIntersecting) {
            el.style.opacity = "1";
            el.style.filter = "blur(0)";
            el.style.transform =
              "perspective(1400px) translateY(0) translateZ(0) rotateX(0deg) scale(1)";
          } else if (e.boundingClientRect.top > 0) {
            // only re-hide when section is below viewport (scrolling up to it again)
            el.style.opacity = "0";
            el.style.filter = "blur(8px)";
            el.style.transform =
              "perspective(1400px) translateY(80px) translateZ(-220px) rotateX(14deg) scale(0.94)";
          }
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -10% 0px" }
    );

    sections.forEach((s) => io.observe(s));

    return () => {
      io.disconnect();
      sections.forEach((s) => {
        s.style.transform = "";
        s.style.opacity = "";
        s.style.filter = "";
        s.style.transition = "";
        s.style.willChange = "";
        s.style.transformOrigin = "";
        s.style.transformStyle = "";
      });
      main.style.perspective = "";
      main.style.perspectiveOrigin = "";
    };
  }, []);

  return null;
}
