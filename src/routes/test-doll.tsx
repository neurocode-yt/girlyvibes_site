import React, { useState, useRef } from 'react';
import { createFileRoute } from "@tanstack/react-router";
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { Sparkles as SparkleIcon, Star, Heart, RotateCcw, Palette, Gem } from 'lucide-react';

export const Route = createFileRoute("/test-doll")({
  component: App,
});

// --- Assets and Config ---
const COLORS = {
  skin: ['#ffe0bd', '#ffcdb2', '#e8b898', '#c68642', '#8d5524', '#3d2c23'],
  hair: ['#fbbc05', '#1a1a1a', '#e60000', '#f48fb1', '#ce93d8', '#4fc3f7', '#a1887f'],
  clothes: [
    '#ff4081', // Pink
    '#7c4dff', // Deep Purple
    '#00e5ff', // Cyan
    '#b2ff59', // Lime
    '#ffea00', // Yellow
    '#ffffff', // White
    '#222222', // Black
  ]
};

const CATEGORIES = {
  HAIR: 'HAIR',
  TOP: 'TOP',
  BOTTOM: 'BOTTOM',
  SKIN: 'SKIN'
};

const ITEMS = {
  [CATEGORIES.HAIR]: [
    { id: 'h1', name: 'Bubble Pigtails', type: 'pigtails' },
    { id: 'h2', name: 'Trendy Bob', type: 'bob' },
    { id: 'h3', name: 'Long & Wavy', type: 'long' },
    { id: 'h4', name: 'Y2K Buns', type: 'buns' },
  ],
  [CATEGORIES.TOP]: [
    { id: 't1', name: 'Crop Top', type: 'crop' },
    { id: 't2', name: 'Tube Top', type: 'tube' },
    { id: 't3', name: 'Halter', type: 'halter' },
    { id: 't4', name: 'Baby Tee', type: 'tee' },
  ],
  [CATEGORIES.BOTTOM]: [
    { id: 'b1', name: 'Pleated Skirt', type: 'skirt' },
    { id: 'b2', name: 'Flared Jeans', type: 'jeans' },
    { id: 'b3', name: 'Cargo Pants', type: 'cargos' },
    { id: 'b4', name: 'Hot Pants', type: 'shorts' },
  ]
};

// --- Procedural 3D Components ---

const BasicMaterial = ({ color, side, ...props }: any) => {
  return <meshStandardMaterial color={color} roughness={0.3} metalness={0.1} side={side || THREE.FrontSide} {...props} />;
};

const ShinyMaterial = ({ color, side, ...props }: any) => {
  return <meshPhysicalMaterial color={color} roughness={0.15} metalness={0.1} clearcoat={1} side={side || THREE.FrontSide} {...props} />;
};

// Base Doll Body
const DollBody = ({ skinColor }: any) => {
  return (
    <group>
      {/* --- CUTE HEAD & FACE --- */}
      <group position={[0, 4.6, 0]}>
        {/* Main Head Sphere */}
        <mesh>
          <sphereGeometry args={[0.95, 64, 64]} />
          <BasicMaterial color={skinColor} roughness={0.2} />
        </mesh>

        {/* Blush */}
        <mesh position={[-0.45, -0.15, 0.78]}>
          <sphereGeometry args={[0.2, 32, 32]} />
          <meshBasicMaterial color="#ff8da1" transparent opacity={0.4} />
        </mesh>
        <mesh position={[0.45, -0.15, 0.78]}>
          <sphereGeometry args={[0.2, 32, 32]} />
          <meshBasicMaterial color="#ff8da1" transparent opacity={0.4} />
        </mesh>

        {/* Eyes (Anime/Doll Style) */}
        <group position={[-0.35, 0.1, 0.85]}>
          <mesh scale={[1, 1.4, 0.5]}>
            <sphereGeometry args={[0.15, 32, 32]} />
            <meshStandardMaterial color="#111" roughness={0.1} metalness={0.8} />
          </mesh>
          {/* Eye Catchlights */}
          <mesh position={[0.04, 0.08, 0.08]}>
            <sphereGeometry args={[0.05, 16, 16]} />
            <meshBasicMaterial color="white" />
          </mesh>
          <mesh position={[-0.04, -0.06, 0.08]}>
            <sphereGeometry args={[0.02, 16, 16]} />
            <meshBasicMaterial color="white" />
          </mesh>
        </group>

        <group position={[0.35, 0.1, 0.85]}>
          <mesh scale={[1, 1.4, 0.5]}>
            <sphereGeometry args={[0.15, 32, 32]} />
            <meshStandardMaterial color="#111" roughness={0.1} metalness={0.8} />
          </mesh>
          <mesh position={[-0.04, 0.08, 0.08]}>
            <sphereGeometry args={[0.05, 16, 16]} />
            <meshBasicMaterial color="white" />
          </mesh>
          <mesh position={[0.04, -0.06, 0.08]}>
            <sphereGeometry args={[0.02, 16, 16]} />
            <meshBasicMaterial color="white" />
          </mesh>
        </group>

        {/* Glossy Lips */}
        <mesh position={[0, -0.35, 0.88]} scale={[1.4, 0.6, 0.6]}>
          <sphereGeometry args={[0.08, 32, 32]} />
          <meshPhysicalMaterial color="#ff4757" roughness={0.1} clearcoat={1} />
        </mesh>
      </group>

      {/* --- BODY --- */}
      {/* Neck */}
      <mesh position={[0, 3.7, 0]}>
        <cylinderGeometry args={[0.18, 0.22, 0.5, 32]} />
        <BasicMaterial color={skinColor} />
      </mesh>

      {/* Torso (More shaped) */}
      <mesh position={[0, 2.6, 0]}>
        <capsuleGeometry args={[0.45, 1.1, 32, 32]} />
        <BasicMaterial color={skinColor} />
      </mesh>

      {/* Hips */}
      <mesh position={[0, 1.6, 0]}>
        <sphereGeometry args={[0.55, 32, 32]} />
        <BasicMaterial color={skinColor} />
      </mesh>

      {/* Arms (Slimmer, softer curves) */}
      <mesh position={[-0.7, 2.5, 0]} rotation={[0, 0, 0.25]}>
        <capsuleGeometry args={[0.14, 1.7, 32, 32]} />
        <BasicMaterial color={skinColor} />
      </mesh>
      <mesh position={[0.7, 2.5, 0]} rotation={[0, 0, -0.25]}>
        <capsuleGeometry args={[0.14, 1.7, 32, 32]} />
        <BasicMaterial color={skinColor} />
      </mesh>

      {/* Legs (Longer, elegant) */}
      <mesh position={[-0.26, 0.3, 0]}>
        <capsuleGeometry args={[0.2, 2.2, 32, 32]} />
        <BasicMaterial color={skinColor} />
      </mesh>
      <mesh position={[0.26, 0.3, 0]}>
        <capsuleGeometry args={[0.2, 2.2, 32, 32]} />
        <BasicMaterial color={skinColor} />
      </mesh>
    </group>
  );
};


const HairComponent = ({ type, color }: any) => {
  if (!type) return null;

  return (
    <group position={[0, 4.6, 0]}>
      {/* Base scalp (fuller to avoid bald spots) */}
      <mesh position={[0, 0.1, -0.1]}>
        <sphereGeometry args={[0.98, 32, 32, 0, Math.PI * 2, 0, Math.PI / 1.7]} />
        <BasicMaterial color={color} roughness={0.6} />
      </mesh>
      {/* Bangs base */}
      <mesh position={[0, 0.7, 0.5]} scale={[1, 0.5, 0.8]}>
        <sphereGeometry args={[0.8, 32, 32]} />
        <BasicMaterial color={color} />
      </mesh>

      {type === 'pigtails' && (
        <>
          <group position={[-0.9, 0.4, -0.2]} rotation={[0, 0, 0.4]}>
            <mesh position={[0, 0, 0]}><sphereGeometry args={[0.4, 32, 32]} /><BasicMaterial color={color} /></mesh>
            <mesh position={[-0.2, -0.5, 0]} scale={[0.8, 1, 1]}><sphereGeometry args={[0.3, 32, 32]} /><BasicMaterial color={color} /></mesh>
            <mesh position={[-0.4, -0.9, 0]} scale={[0.6, 1, 1]}><sphereGeometry args={[0.2, 32, 32]} /><BasicMaterial color={color} /></mesh>
          </group>
          <group position={[0.9, 0.4, -0.2]} rotation={[0, 0, -0.4]}>
            <mesh position={[0, 0, 0]}><sphereGeometry args={[0.4, 32, 32]} /><BasicMaterial color={color} /></mesh>
            <mesh position={[0.2, -0.5, 0]} scale={[0.8, 1, 1]}><sphereGeometry args={[0.3, 32, 32]} /><BasicMaterial color={color} /></mesh>
            <mesh position={[0.4, -0.9, 0]} scale={[0.6, 1, 1]}><sphereGeometry args={[0.2, 32, 32]} /><BasicMaterial color={color} /></mesh>
          </group>
        </>
      )}

      {type === 'bob' && (
        <mesh position={[0, -0.3, -0.3]} scale={[1.1, 0.9, 1]}>
          <sphereGeometry args={[1.05, 32, 32, 0, Math.PI * 2, 0, Math.PI / 1.8]} />
          <BasicMaterial color={color} />
        </mesh>
      )}

      {type === 'long' && (
        <group position={[0, -1, -0.4]}>
          <mesh position={[0, 0, 0]}><capsuleGeometry args={[0.8, 2.5, 32, 32]} /><BasicMaterial color={color} /></mesh>
          <mesh position={[-0.5, 0.2, 0.2]} rotation={[0, 0, 0.2]}><capsuleGeometry args={[0.4, 2.2, 32, 32]} /><BasicMaterial color={color} /></mesh>
          <mesh position={[0.5, 0.2, 0.2]} rotation={[0, 0, -0.2]}><capsuleGeometry args={[0.4, 2.2, 32, 32]} /><BasicMaterial color={color} /></mesh>
        </group>
      )}

      {type === 'buns' && (
        <group>
          <mesh position={[-0.7, 0.7, 0]}><sphereGeometry args={[0.45, 32, 32]} /><BasicMaterial color={color} /></mesh>
          <mesh position={[0.7, 0.7, 0]}><sphereGeometry args={[0.45, 32, 32]} /><BasicMaterial color={color} /></mesh>
        </group>
      )}
    </group>
  );
};

const TopComponent = ({ type, color }: any) => {
  if (!type) return null;

  return (
    <group position={[0, 2.7, 0]}>
      {type === 'crop' && (
        <mesh>
          <cylinderGeometry args={[0.46, 0.42, 0.6, 32]} />
          <ShinyMaterial color={color} />
        </mesh>
      )}
      {type === 'tube' && (
        <mesh position={[0, 0.1, 0]}>
          <cylinderGeometry args={[0.46, 0.44, 0.4, 32]} />
          <ShinyMaterial color={color} />
        </mesh>
      )}
      {type === 'halter' && (
        <group>
          <mesh position={[0, 0, 0]}>
            <cylinderGeometry args={[0.35, 0.45, 0.5, 32]} />
            <ShinyMaterial color={color} />
          </mesh>
          <mesh position={[-0.18, 0.4, 0.15]} rotation={[0.2, 0, -0.5]}>
            <cylinderGeometry args={[0.03, 0.03, 0.6, 16]} />
            <BasicMaterial color={color} />
          </mesh>
          <mesh position={[0.18, 0.4, 0.15]} rotation={[0.2, 0, 0.5]}>
            <cylinderGeometry args={[0.03, 0.03, 0.6, 16]} />
            <BasicMaterial color={color} />
          </mesh>
        </group>
      )}
      {type === 'tee' && (
        <group>
          <mesh position={[0, -0.1, 0]}>
            <cylinderGeometry args={[0.45, 0.46, 0.75, 32]} />
            <BasicMaterial color={color} />
          </mesh>
          {/* Sleeves */}
          <mesh position={[-0.55, 0.15, 0]} rotation={[0, 0, 0.25]}>
            <capsuleGeometry args={[0.18, 0.2, 16, 16]} />
            <BasicMaterial color={color} />
          </mesh>
          <mesh position={[0.55, 0.15, 0]} rotation={[0, 0, -0.25]}>
            <capsuleGeometry args={[0.18, 0.2, 16, 16]} />
            <BasicMaterial color={color} />
          </mesh>
        </group>
      )}
    </group>
  );
};

const BottomComponent = ({ type, color }: any) => {
  if (!type) return null;

  return (
    <group position={[0, 1.4, 0]}>
      {type === 'skirt' && (
        <mesh position={[0, 0.1, 0]}>
          <cylinderGeometry args={[0.55, 0.7, 0.7, 32]} />
          <BasicMaterial color={color} side={THREE.DoubleSide} />
        </mesh>
      )}
      {type === 'jeans' && (
        <group position={[0, -0.9, 0]}>
          <mesh position={[-0.26, 0, 0]}>
            <cylinderGeometry args={[0.23, 0.4, 2, 32]} />
            <BasicMaterial color={color} />
          </mesh>
          <mesh position={[0.26, 0, 0]}>
            <cylinderGeometry args={[0.23, 0.4, 2, 32]} />
            <BasicMaterial color={color} />
          </mesh>
          <mesh position={[0, 1.15, 0]}>
            <cylinderGeometry args={[0.56, 0.48, 0.5, 32]} />
            <BasicMaterial color={color} />
          </mesh>
        </group>
      )}
      {type === 'cargos' && (
        <group position={[0, -0.9, 0]}>
          <mesh position={[-0.26, 0, 0]}>
            <cylinderGeometry args={[0.3, 0.35, 2, 32]} />
            <BasicMaterial color={color} />
          </mesh>
          <mesh position={[0.26, 0, 0]}>
            <cylinderGeometry args={[0.3, 0.35, 2, 32]} />
            <BasicMaterial color={color} />
          </mesh>
          <mesh position={[0, 1.15, 0]}>
            <cylinderGeometry args={[0.56, 0.55, 0.5, 32]} />
            <BasicMaterial color={color} />
          </mesh>
          {/* Pockets */}
          <mesh position={[-0.5, 0.2, 0]}>
            <boxGeometry args={[0.15, 0.5, 0.4]} />
            <BasicMaterial color={color} />
          </mesh>
          <mesh position={[0.5, 0.2, 0]}>
            <boxGeometry args={[0.15, 0.5, 0.4]} />
            <BasicMaterial color={color} />
          </mesh>
        </group>
      )}
      {type === 'shorts' && (
        <group position={[0, 0, 0]}>
          <mesh position={[0, 0.25, 0]}>
            <cylinderGeometry args={[0.56, 0.53, 0.5, 32]} />
            <BasicMaterial color={color} />
          </mesh>
          <mesh position={[-0.26, -0.15, 0]}>
            <cylinderGeometry args={[0.27, 0.26, 0.4, 32]} />
            <BasicMaterial color={color} />
          </mesh>
          <mesh position={[0.26, -0.15, 0]}>
            <cylinderGeometry args={[0.27, 0.26, 0.4, 32]} />
            <BasicMaterial color={color} />
          </mesh>
        </group>
      )}
    </group>
  );
};


const DollModel = ({ config, isSpinning }: any) => {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    if (groupRef.current) {
      // Manual spinning
      if (isSpinning) {
        groupRef.current.rotation.y += delta * 0.5;
      }
      // Manual floating effect (smoother)
      groupRef.current.position.y = -2 + Math.sin(state.clock.elapsedTime * 1.5) * 0.15;
    }
  });

  const hairItem = ITEMS[CATEGORIES.HAIR].find(i => i.id === config.hair);
  const topItem = ITEMS[CATEGORIES.TOP].find(i => i.id === config.top);
  const bottomItem = ITEMS[CATEGORIES.BOTTOM].find(i => i.id === config.bottom);

  return (
    <group ref={groupRef as any} position={[0, -2, 0]}>
      <DollBody skinColor={config.skinColor} />
      {hairItem && <HairComponent type={hairItem.type} color={config.hairColor} />}
      {topItem && <TopComponent type={topItem.type} color={config.topColor} />}
      {bottomItem && <BottomComponent type={bottomItem.type} color={config.bottomColor} />}
    </group>
  );
};


const Button = ({ children, onClick, active, className = "" }: any) => (
  <button
    onClick={onClick}
    className={`px-4 py-2 rounded-full font-bold transition-all duration-200 transform hover:scale-105 active:scale-95
      ${active
        ? 'bg-pink-500 text-white shadow-[0_0_15px_rgba(236,72,153,0.6)] border-2 border-white'
        : 'bg-white/80 text-pink-600 hover:bg-pink-100 border-2 border-pink-300'
      } ${className}`}
  >
    {children}
  </button>
);

const ColorPicker = ({ colors, selected, onChange }: any) => (
  <div className="flex flex-wrap gap-2 justify-center p-4 bg-white/50 rounded-2xl backdrop-blur-sm border border-white/40 shadow-xl">
    {colors.map((c: any) => (
      <button
        key={c}
        onClick={() => onChange(c)}
        className={`w-8 h-8 rounded-full transition-transform ${selected === c ? 'scale-125 ring-4 ring-pink-400 ring-offset-2' : 'hover:scale-110 shadow-md'}`}
        style={{ backgroundColor: c }}
      />
    ))}
  </div>
);


export default function App() {
  const [config, setConfig] = useState({
    skinColor: COLORS.skin[0],
    hair: ITEMS[CATEGORIES.HAIR][0].id,
    hairColor: COLORS.hair[0],
    top: ITEMS[CATEGORIES.TOP][0].id,
    topColor: COLORS.clothes[0],
    bottom: ITEMS[CATEGORIES.BOTTOM][0].id,
    bottomColor: COLORS.clothes[1],
  });

  const [activeCategory, setActiveCategory] = useState(CATEGORIES.TOP);
  const [isSpinning, setIsSpinning] = useState(false);

  const handleItemSelect = (id: any) => {
    setConfig(prev => ({ ...prev, [activeCategory.toLowerCase()]: id }));
  };

  const handleColorSelect = (color: any) => {
    if (activeCategory === CATEGORIES.HAIR) setConfig(prev => ({ ...prev, hairColor: color }));
    if (activeCategory === CATEGORIES.TOP) setConfig(prev => ({ ...prev, topColor: color }));
    if (activeCategory === CATEGORIES.BOTTOM) setConfig(prev => ({ ...prev, bottomColor: color }));
    if (activeCategory === CATEGORIES.SKIN) setConfig(prev => ({ ...prev, skinColor: color }));
  };

  const randomize = () => {
    setConfig({
      skinColor: COLORS.skin[Math.floor(Math.random() * COLORS.skin.length)],
      hair: ITEMS[CATEGORIES.HAIR][Math.floor(Math.random() * ITEMS[CATEGORIES.HAIR].length)].id,
      hairColor: COLORS.hair[Math.floor(Math.random() * COLORS.hair.length)],
      top: ITEMS[CATEGORIES.TOP][Math.floor(Math.random() * ITEMS[CATEGORIES.TOP].length)].id,
      topColor: COLORS.clothes[Math.floor(Math.random() * COLORS.clothes.length)],
      bottom: ITEMS[CATEGORIES.BOTTOM][Math.floor(Math.random() * ITEMS[CATEGORIES.BOTTOM].length)].id,
      bottomColor: COLORS.clothes[Math.floor(Math.random() * COLORS.clothes.length)],
    });
  };

  return (
    <div className="w-full h-screen flex flex-col md:flex-row overflow-hidden bg-gradient-to-br from-fuchsia-200 via-pink-100 to-cyan-100 font-sans">

      {/* Background Decorative Elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-30">
        <Star className="absolute top-10 left-10 text-pink-400 w-12 h-12 animate-pulse" />
        <Heart className="absolute bottom-20 left-1/4 text-fuchsia-400 w-16 h-16 animate-bounce" />
        <SparkleIcon className="absolute top-20 right-1/4 text-yellow-400 w-10 h-10 animate-spin-slow" />
        <Star className="absolute bottom-10 right-10 text-cyan-400 w-14 h-14 animate-pulse" />
      </div>

      {/* Header (Mobile) */}
      <div className="md:hidden flex justify-between items-center p-4 bg-white/40 backdrop-blur-md z-10 border-b border-pink-200">
        <h1 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-violet-500 tracking-tighter">
          Y2K DOLLZ
        </h1>
        <button onClick={randomize} className="p-2 bg-white rounded-full text-pink-500 shadow-md">
          <RotateCcw size={20} />
        </button>
      </div>

      {/* 3D Viewport Area */}
      <div className="relative flex-1 h-[50vh] md:h-screen w-full cursor-grab active:cursor-grabbing">

        {/* Top Controls Overlay */}
        <div className="absolute top-4 right-4 z-10 hidden md:flex gap-2">
          <button
            onClick={() => setIsSpinning(!isSpinning)}
            className={`p-3 rounded-full shadow-lg transition-all ${isSpinning ? 'bg-pink-500 text-white' : 'bg-white text-pink-500 hover:bg-pink-50'}`}
            title="Auto-Spin"
          >
            <RotateCcw size={24} />
          </button>
          <button
            onClick={randomize}
            className="p-3 bg-white text-pink-500 rounded-full shadow-lg hover:bg-pink-50 transition-all"
            title="Randomize"
          >
            <SparkleIcon size={24} />
          </button>
        </div>

        {/* 3D Canvas */}
        <Canvas camera={{ position: [0, 0, 8], fov: 45 }}>
          <color attach="background" args={['#ffb6c1'] as any} />

          {/* Enhanced "Cute/Studio" Lighting */}
          <ambientLight intensity={0.6} />
          <hemisphereLight skyColor="#ffffff" groundColor="#ffb3ba" intensity={0.8} />
          <directionalLight position={[2, 10, 5]} intensity={1.5} castShadow />
          {/* Key light for face glow */}
          <pointLight position={[0, 4, 3]} intensity={1.2} color="#ffe4e1" distance={10} />

          <DollModel config={config} isSpinning={isSpinning} />

          {/* Fake Shadow */}
          <mesh position={[0, -2.1, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <circleGeometry args={[1.5, 32]} />
            <meshBasicMaterial color="#a21caf" transparent opacity={0.2} />
          </mesh>

          <OrbitControls
            enablePan={false}
            minPolarAngle={Math.PI / 4}
            maxPolarAngle={Math.PI / 1.5}
            minDistance={4}
            maxDistance={12}
            target={[0, 1, 0]}
          />
        </Canvas>

        {/* Instructions overlay */}
        <div className="absolute bottom-4 left-0 right-0 text-center pointer-events-none opacity-50">
          <p className="bg-white/50 inline-block px-4 py-1 rounded-full text-xs font-bold text-pink-800 backdrop-blur-md">
            Drag to rotate • Scroll to zoom
          </p>
        </div>
      </div>

      {/* UI Controls Panel */}
      <div className="w-full md:w-[400px] h-[50vh] md:h-screen bg-white/60 backdrop-blur-xl border-t md:border-t-0 md:border-l border-white/50 shadow-[-10px_0_30px_rgba(236,72,153,0.1)] flex flex-col z-10 rounded-t-[3rem] md:rounded-none overflow-hidden relative">

        {/* Desktop Title */}
        <div className="hidden md:flex flex-col items-center p-6 border-b border-white/50 bg-gradient-to-r from-pink-100/50 to-violet-100/50">
          <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-fuchsia-500 to-violet-500 tracking-tighter filter drop-shadow-sm flex items-center gap-2">
            <Gem className="text-pink-400" />
            Y2K DOLLZ
            <Gem className="text-violet-400" />
          </h1>
          <p className="text-sm font-bold text-fuchsia-400 mt-1 uppercase tracking-widest">Dress Up Studio</p>
        </div>

        {/* Category Tabs */}
        <div className="flex overflow-x-auto p-4 gap-2 no-scrollbar border-b border-white/50">
          {[CATEGORIES.HAIR, CATEGORIES.TOP, CATEGORIES.BOTTOM, CATEGORIES.SKIN].map(cat => (
            <Button
              key={cat}
              active={activeCategory === cat}
              onClick={() => setActiveCategory(cat)}
              className="flex-shrink-0 text-sm py-1.5"
            >
              {cat}
            </Button>
          ))}
        </div>

        {/* Selection Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">

          {/* Items Grid (if applicable) */}
          {activeCategory !== CATEGORIES.SKIN && ITEMS[activeCategory as keyof typeof ITEMS] && (
            <div className="space-y-3">
              <h3 className="font-bold text-pink-800 flex items-center gap-2">
                <Palette size={18} /> Select Style
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {ITEMS[activeCategory as keyof typeof ITEMS].map((item: any) => {
                  const isActive = (config as any)[activeCategory.toLowerCase()] === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleItemSelect(item.id)}
                      className={`p-3 rounded-xl font-bold text-sm transition-all duration-200 border-2 
                        ${isActive
                          ? 'border-pink-500 bg-pink-100 text-pink-700 shadow-[0_4px_0_rgb(236,72,153)] transform translate-y-[2px]'
                          : 'border-white bg-white/80 text-gray-600 hover:border-pink-300 hover:bg-white shadow-[0_6px_0_rgba(255,255,255,0.8)]'
                        }`}
                    >
                      {item.name}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Color Picker Section */}
          <div className="space-y-3 pb-8">
            <h3 className="font-bold text-pink-800 flex items-center gap-2">
              <Palette size={18} /> Choose Color
            </h3>
            {activeCategory === CATEGORIES.SKIN && (
              <ColorPicker colors={COLORS.skin} selected={config.skinColor} onChange={handleColorSelect} />
            )}
            {activeCategory === CATEGORIES.HAIR && (
              <ColorPicker colors={COLORS.hair} selected={config.hairColor} onChange={handleColorSelect} />
            )}
            {(activeCategory === CATEGORIES.TOP || activeCategory === CATEGORIES.BOTTOM) && (
              <ColorPicker colors={COLORS.clothes} selected={(config as any)[`${activeCategory.toLowerCase()}Color`]} onChange={handleColorSelect} />
            )}
          </div>

        </div>

      </div>

      {/* Global Styles for Scrollbar */}
      <style dangerouslySetInnerHTML={{
        __html: `
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.2);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(236, 72, 153, 0.3);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(236, 72, 153, 0.5);
        }
        .animate-spin-slow {
          animation: spin 8s linear infinite;
        }
      `}} />
    </div>
  );
}