import { useState, type CSSProperties, type PointerEvent, type ReactNode } from "react";
import { useReducedMotion } from "framer-motion";

type Props = {
  children: ReactNode;
  className?: string;
  maxRotation?: number; // Maximum rotation in degrees (default: 10)
  scale?: number; // Scale on hover (default: 1.02)
};

export function ThreeDTilt({ children, className = "", maxRotation = 10, scale = 1.02 }: Props) {
  const [tiltStyle, setTiltStyle] = useState<CSSProperties>({});
  const reduceMotion = useReducedMotion();

  const handlePointerMove = (e: PointerEvent<HTMLDivElement>) => {
    if (reduceMotion || e.pointerType !== "mouse") return;
    const rect = e.currentTarget.getBoundingClientRect();
    
    // Mouse coordinates relative to the card
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Normalize coordinates from -0.5 to 0.5
    const xc = rect.width / 2;
    const yc = rect.height / 2;
    
    // Calculate rotation angles
    const rotateY = ((x - xc) / xc) * maxRotation;
    const rotateX = -((y - yc) / yc) * maxRotation;

    setTiltStyle({
      transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(${scale}, ${scale}, ${scale})`,
      transition: "transform 150ms cubic-bezier(0.25, 1, 0.5, 1)",
    });
  };

  const handleMouseLeave = () => {
    setTiltStyle({
      transform: "perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)",
      transition: "transform 500ms cubic-bezier(0.25, 1, 0.5, 1)",
    });
  };

  return (
    <div
      onPointerMove={handlePointerMove}
      onPointerLeave={handleMouseLeave}
      style={{
        transformStyle: "preserve-3d",
        ...(reduceMotion ? {} : tiltStyle),
      }}
      className={`transform-gpu motion-reduce:transform-none! motion-reduce:transition-none! ${className}`}
    >
      {children}
    </div>
  );
}
