import React, { useRef, useState } from "react";

type Props = {
  children: React.ReactNode;
  className?: string;
  maxRotation?: number; // Maximum rotation in degrees (default: 10)
  scale?: number; // Scale on hover (default: 1.02)
};

export function ThreeDTilt({ children, className = "", maxRotation = 10, scale = 1.02 }: Props) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [tiltStyle, setTiltStyle] = useState<React.CSSProperties>({});

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const card = cardRef.current;
    const rect = card.getBoundingClientRect();
    
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
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transformStyle: "preserve-3d",
        ...tiltStyle,
      }}
      className={`transform-gpu ${className}`}
    >
      {children}
    </div>
  );
}
