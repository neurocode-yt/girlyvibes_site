import { useEffect, useRef, useState } from "react";

const EMOJIS = ["🌸", "✨", "🩷", "🎀", "💖", "⭐", "🫧", "🌷", "💗", "🍡"];

type Particle = {
  id: number;
  x: number;
  y: number;
  emoji: string;
  size: number;
  rotate: number;
};

export function CursorTrail() {
  const [particles, setParticles] = useState<Particle[]>([]);
  const idRef = useRef(0);
  const lastRef = useRef({ x: -999, y: -999, t: 0 });

  useEffect(() => {
    if (typeof window === "undefined") return;

    const spawn = (cx: number, cy: number) => {
      const now = performance.now();
      const dx = cx - lastRef.current.x;
      const dy = cy - lastRef.current.y;
      const dist = Math.hypot(dx, dy);
      if (now - lastRef.current.t < 30 || dist < 10) return;
      lastRef.current = { x: cx, y: cy, t: now };

      const id = ++idRef.current;
      const p: Particle = {
        id,
        x: cx + (Math.random() - 0.5) * 12,
        y: cy + (Math.random() - 0.5) * 12,
        emoji: EMOJIS[Math.floor(Math.random() * EMOJIS.length)],
        size: 16 + Math.random() * 14,
        rotate: (Math.random() - 0.5) * 60,
      };
      setParticles((prev) => [...prev.slice(-28), p]);
      window.setTimeout(() => {
        setParticles((prev) => prev.filter((x) => x.id !== id));
      }, 1300);
    };

    const onMouseMove = (e: MouseEvent) => spawn(e.clientX, e.clientY);
    const onTouchMove = (e: TouchEvent) => {
      const touch = e.touches[0];
      if (touch) {
        spawn(touch.clientX, touch.clientY);
      }
    };

    document.addEventListener("mousemove", onMouseMove, { passive: true });
    document.addEventListener("touchmove", onTouchMove, { passive: true });

    return () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("touchmove", onTouchMove);
    };
  }, []);

  return (
    <div
      aria-hidden
      style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 2147483647, overflow: "hidden" }}
    >
      {particles.map((p) => (
        <span
          key={p.id}
          className="cursor-sparkle"
          style={{
            position: "absolute",
            left: p.x,
            top: p.y,
            fontSize: p.size,
            lineHeight: 1,
            userSelect: "none",
            // @ts-expect-error css var
            "--r": `${p.rotate}deg`,
          }}
        >
          {p.emoji}
        </span>
      ))}
    </div>
  );
}
