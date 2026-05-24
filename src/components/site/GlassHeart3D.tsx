import { useRef, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Center } from "@react-three/drei";
import * as THREE from "three";

function HeartMesh() {
  const meshRef = useRef<THREE.Mesh>(null);
  
  // Custom 3D Heart Shape using bezier curves
  const heartShape = new THREE.Shape();
  heartShape.moveTo(0, 0.4);
  heartShape.bezierCurveTo(0, 0.4, -0.3, 0.9, -0.8, 0.9);
  heartShape.bezierCurveTo(-1.4, 0.9, -1.4, 0.2, -1.4, 0.2);
  heartShape.bezierCurveTo(-1.4, -0.5, -0.8, -1.1, 0, -1.6);
  heartShape.bezierCurveTo(0.8, -1.1, 1.4, -0.5, 1.4, 0.2);
  heartShape.bezierCurveTo(1.4, 0.2, 1.4, 0.9, 0.8, 0.9);
  heartShape.bezierCurveTo(0.3, 0.9, 0, 0.4, 0, 0.4);

  const extrudeSettings = {
    depth: 0.3,
    bevelEnabled: true,
    bevelSegments: 4,
    steps: 1,
    bevelSize: 0.08,
    bevelThickness: 0.08,
  };

  useFrame((state) => {
    if (!meshRef.current) return;
    
    // Constant slow rotation + scroll speed acceleration
    const scrollY = typeof window !== "undefined" ? window.scrollY : 0;
    const scrollSpeed = scrollY * 0.001;

    // Spin it on Y-axis
    meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.5 + scrollSpeed * 2.5;
    // Wobble it slightly on X/Z axes for biological feeling
    meshRef.current.rotation.x = Math.sin(state.clock.getElapsedTime()) * 0.15;
    meshRef.current.position.y = Math.sin(state.clock.getElapsedTime() * 1.5) * 0.1;
  });

  return (
    <Center>
      <mesh ref={meshRef}>
        <extrudeGeometry args={[heartShape, extrudeSettings]} />
        <meshPhysicalMaterial
          color="#ffb6c1" // Soft blush pink
          roughness={0.1}
          metalness={0.1}
          transmission={0.8} // Glassmorphism!
          thickness={1.2}
          ior={1.5}
          clearcoat={1}
          clearcoatRoughness={0.1}
          envMapIntensity={1.5}
        />
      </mesh>
    </Center>
  );
}

export function GlassHeart3D({ size = "w-16 h-16" }: { size?: string }) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <div className={`relative ${size} pointer-events-none select-none overflow-visible`}>
      {/* Background glow shadow */}
      <div className="absolute inset-0 bg-[#F7C9D9] blur-md opacity-30 rounded-full scale-75" />
      <Canvas camera={{ position: [0, 0, 3], fov: 50 }} className="w-full h-full">
        <ambientLight intensity={0.6} />
        <pointLight position={[5, 5, 5]} intensity={1.5} color="#ffffff" />
        <pointLight position={[-5, -5, -5]} intensity={0.5} color="#fcdce7" />
        <HeartMesh />
      </Canvas>
    </div>
  );
}
