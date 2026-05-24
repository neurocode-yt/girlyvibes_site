import { useState, useEffect, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, MeshDistortMaterial } from "@react-three/drei";
import * as THREE from "three";

function FloatingShapes() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame(() => {
    if (!groupRef.current) return;
    // Calculate scroll offset (0 to 1) based on page height
    const scrollY = window.scrollY;
    const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    const scrollProgress = scrollY / maxScroll;
    
    // Animate group Y position and rotation based on scroll
    // Move shapes up as we scroll down, and rotate them
    const targetY = scrollProgress * 15 - 2;
    const targetRotY = scrollProgress * Math.PI * 2;
    const targetRotX = scrollProgress * Math.PI;

    groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, targetY, 0.05);
    groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, targetRotY, 0.05);
    groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, targetRotX, 0.05);
  });

  return (
    <group ref={groupRef}>
      <Float speed={1.5} rotationIntensity={1} floatIntensity={2}>
        <mesh position={[-4, 2, -5]}>
          <torusGeometry args={[1, 0.4, 32, 64]} />
          <MeshDistortMaterial color="#ffb6c1" distort={0.2} speed={2} roughness={0.1} />
        </mesh>
      </Float>

      <Float speed={2} rotationIntensity={2} floatIntensity={1.5}>
        <mesh position={[4, -1, -3]}>
          <sphereGeometry args={[1.5, 64, 64]} />
          <MeshDistortMaterial color="#dda0dd" distort={0.4} speed={3} roughness={0.1} />
        </mesh>
      </Float>

      <Float speed={1.2} rotationIntensity={1.5} floatIntensity={2.5}>
        <mesh position={[0, -3, -4]}>
          <octahedronGeometry args={[1.2, 0]} />
          <meshStandardMaterial color="#ff69b4" roughness={0.1} metalness={0.2} />
        </mesh>
      </Float>

      <Float speed={2.5} rotationIntensity={1} floatIntensity={1}>
        <mesh position={[-3, -5, -2]}>
          <sphereGeometry args={[0.8, 64, 64]} />
          <MeshDistortMaterial color="#e6e6fa" distort={0.3} speed={2} roughness={0.1} />
        </mesh>
      </Float>

       <Float speed={1.8} rotationIntensity={1} floatIntensity={2}>
        <mesh position={[5, 4, -6]}>
          <torusKnotGeometry args={[0.8, 0.2, 100, 16]} />
          <meshPhysicalMaterial color="#ffb6c1" roughness={0.1} metalness={0.1} transmission={0.6} thickness={1} />
        </mesh>
      </Float>
    </group>
  );
}

export function Scene3D() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <div className="fixed inset-0 z-[50] pointer-events-none opacity-90">
      <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
        <ambientLight intensity={0.8} />
        <pointLight position={[10, 10, 10]} intensity={1.5} />
        <pointLight position={[-10, -10, -10]} intensity={0.5} />
        <FloatingShapes />
      </Canvas>
    </div>
  );
}
