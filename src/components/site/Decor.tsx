import { motion } from "framer-motion";
import type { ReactNode } from "react";

export function FloatingDecor() {
  const items = [
    { left: "5%", top: "12%", delay: 0, size: 22, emoji: "🌸" },
    { left: "85%", top: "18%", delay: 1.2, size: 18, emoji: "✨" },
    { left: "12%", top: "70%", delay: 0.6, size: 24, emoji: "🩷" },
    { left: "78%", top: "62%", delay: 1.8, size: 20, emoji: "🎀" },
    { left: "45%", top: "8%", delay: 0.3, size: 16, emoji: "⭐" },
    { left: "92%", top: "85%", delay: 2.1, size: 18, emoji: "🫧" },
    { left: "3%", top: "45%", delay: 1.5, size: 20, emoji: "💗" },
  ];
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {items.map((it, i) => (
        <motion.span
          key={i}
          className="absolute select-none"
          style={{ left: it.left, top: it.top, fontSize: it.size }}
          initial={{ opacity: 0, y: 0 }}
          animate={{ opacity: [0.5, 1, 0.5], y: [-10, 10, -10], rotate: [0, 15, 0] }}
          transition={{ duration: 6 + i, delay: it.delay, repeat: Infinity, ease: "easeInOut" }}
        >
          {it.emoji}
        </motion.span>
      ))}
    </div>
  );
}

export function Blob({ className = "", color = "var(--blush)" }: { className?: string; color?: string }) {
  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute rounded-full blur-3xl opacity-60 ${className}`}
      style={{ background: color }}
    />
  );
}

export function Section({ id, children, className = "" }: { id?: string; children: ReactNode; className?: string }) {
  return (
    <section id={id} className={`relative py-20 md:py-28 px-5 md:px-8 ${className}`}>
      <div className="max-w-7xl mx-auto relative">{children}</div>
    </section>
  );
}

export function HeartIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
      <path d="M12 21s-7.5-4.6-10-9.3C.4 8 2.5 4 6.3 4c2 0 3.6 1.1 4.7 2.8C12.1 5.1 13.7 4 15.7 4c3.8 0 5.9 4 4.3 7.7C19.5 16.4 12 21 12 21z" />
    </svg>
  );
}

export function SparkleMark({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex items-center justify-center ${className}`}>
      <svg viewBox="0 0 24 24" className="w-full h-full" fill="currentColor" aria-hidden>
        <path d="M12 2l1.8 6.2L20 10l-6.2 1.8L12 18l-1.8-6.2L4 10l6.2-1.8z" />
      </svg>
    </span>
  );
}
