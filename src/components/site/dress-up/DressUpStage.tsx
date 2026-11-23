import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  Component,
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type PointerEvent,
  type ReactNode,
} from "react";
import * as THREE from "three";
import { createCharacter, type CharacterAppearance } from "./character";
import { createWardrobe, type WardrobeLook } from "./wardrobe";

const rendererOptions = {
  alpha: false,
  antialias: true,
  preserveDrawingBuffer: true,
  powerPreference: "low-power",
} as const;

const backdrops = {
  rose: {
    wall: "#edcbd5",
    inset: "#f9dce4",
    trim: "#f8e7e7",
    floor: "#eac6d0",
    base: "#dda6b8",
    top: "#f3d4db",
    metal: "#cfaa87",
    ink: "#743e56",
  },
  lilac: {
    wall: "#d9cfe8",
    inset: "#e9dff4",
    trim: "#f2e8f8",
    floor: "#d5c8e5",
    base: "#b7a3ce",
    top: "#e3d7ed",
    metal: "#c2a4a3",
    ink: "#5d4877",
  },
  mint: {
    wall: "#c7ddd5",
    inset: "#e0eee3",
    trim: "#ecf4ea",
    floor: "#c0d8ce",
    base: "#96baaa",
    top: "#dcebe1",
    metal: "#b4a986",
    ink: "#3b695a",
  },
  midnight: {
    wall: "#2b243d",
    inset: "#3c2f4e",
    trim: "#685271",
    floor: "#3c304a",
    base: "#634761",
    top: "#775773",
    metal: "#bc987b",
    ink: "#f8e7f2",
  },
} as const;

export type DressUpBackdrop = keyof typeof backdrops;
export type DressUpStageLook = CharacterAppearance & WardrobeLook & { backdrop: DressUpBackdrop };

type BackdropColors = (typeof backdrops)[DressUpBackdrop];

interface DressUpStageProps {
  look: DressUpStageLook;
  rotation: number;
  onRotate: (radians: number) => void;
  portrait?: boolean;
  label: string;
  unavailableLabel: string;
  loadingLabel?: string;
  onCanvasReady?: (canvas: HTMLCanvasElement | null) => void;
}

class StageErrorBoundary extends Component<
  { children: ReactNode; fallback: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}

function canCreateWebGL() {
  try {
    const canvas = document.createElement("canvas");
    canvas.width = canvas.height = 1;
    const context = canvas.getContext("webgl2", rendererOptions);
    if (!context || !("getExtension" in context)) return false;
    context.getExtension("WEBGL_lose_context")?.loseContext();
    return true;
  } catch {
    return false;
  }
}

function releaseModel(group: THREE.Group) {
  const geometries = new Set<THREE.BufferGeometry>();
  const materials = new Set<THREE.Material>();

  group.traverse((object) => {
    if (!(object instanceof THREE.Mesh)) return;
    geometries.add(object.geometry);
    for (const material of Array.isArray(object.material) ? object.material : [object.material]) {
      materials.add(material);
    }
  });

  for (const geometry of geometries) geometry.dispose();
  for (const material of materials) material.dispose();
}

function useDollBlink(setEyeOpenness: (openness: number) => void) {
  const invalidate = useThree((state) => state.invalidate);
  const blinkStarted = useRef<number | null>(null);

  useEffect(() => {
    const motionPreference = window.matchMedia("(prefers-reduced-motion: reduce)");
    let timer: number;
    const schedule = () => {
      window.clearTimeout(timer);
      if (motionPreference.matches || document.hidden) return;
      timer = window.setTimeout(
        () => {
          blinkStarted.current = performance.now();
          invalidate();
          schedule();
        },
        3800 + Math.random() * 2400,
      );
    };

    const syncPreference = () => {
      blinkStarted.current = null;
      setEyeOpenness(1);
      invalidate();
      schedule();
    };

    schedule();
    motionPreference.addEventListener("change", syncPreference);
    document.addEventListener("visibilitychange", syncPreference);
    return () => {
      window.clearTimeout(timer);
      blinkStarted.current = null;
      motionPreference.removeEventListener("change", syncPreference);
      document.removeEventListener("visibilitychange", syncPreference);
    };
  }, [invalidate, setEyeOpenness]);

  useFrame(() => {
    if (blinkStarted.current === null) return;
    const progress = (performance.now() - blinkStarted.current) / 230;
    if (progress >= 1) {
      setEyeOpenness(1);
      blinkStarted.current = null;
      return;
    }

    const amount = progress < 0.36 ? progress / 0.36 : (1 - progress) / 0.64;
    setEyeOpenness(1 - 0.98 * THREE.MathUtils.smoothstep(amount, 0, 1));
    invalidate();
  });
}

function Doll({
  look: { skin, hairStyle, hairColor, outfit, palette, accessory, costume },
  rotation,
}: {
  look: DressUpStageLook;
  rotation: number;
}) {
  const character = useMemo(
    () => createCharacter({ skin, hairStyle, hairColor }),
    [skin, hairStyle, hairColor],
  );
  const wardrobe = useMemo(
    () => createWardrobe({ outfit, palette, accessory, costume }),
    [outfit, palette, accessory, costume],
  );

  useDollBlink(character.setEyeOpenness);
  useEffect(() => () => releaseModel(character.group), [character]);
  useEffect(() => () => releaseModel(wardrobe), [wardrobe]);

  return (
    <group rotation={[0, rotation, 0]}>
      <primitive object={character.group} />
      <primitive object={wardrobe} />
    </group>
  );
}

function traceArch(path: THREE.Path, width: number, top: number, bottom: number) {
  const radius = width / 2;
  path.moveTo(-radius, bottom);
  path.lineTo(radius, bottom);
  path.lineTo(radius, top - radius);
  path.absarc(0, top - radius, radius, 0, Math.PI, false);
  path.closePath();
}

const backdropVertex =
  /* glsl */
  `
  varying vec2 stagePoint;

  void main() {
    stagePoint = (modelMatrix * vec4(position, 1.0)).xy;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const backdropFragment =
  /* glsl */
  `
  uniform vec3 base;
  uniform vec3 highlight;
  varying vec2 stagePoint;

  void main() {
    vec2 spotlight = (stagePoint - vec2(-0.48, 2.32)) * vec2(0.48, 0.44);
    float glow = 1.0 - smoothstep(0.05, 1.02, length(spotlight));
    gl_FragColor = vec4(mix(base, highlight, glow * 0.68), 1.0);
    #include <colorspace_fragment>
  }
`;

const groundShadowVertex =
  /* glsl */
  `
  varying vec2 shadowPoint;

  void main() {
    shadowPoint = (uv - 0.5) * 2.0;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const groundShadowFragment =
  /* glsl */
  `
  varying vec2 shadowPoint;

  void main() {
    float opacity = 1.0 - smoothstep(0.34, 1.0, length(shadowPoint));
    gl_FragColor = vec4(0.08, 0.025, 0.05, opacity * 0.29);
  }
`;

function BackdropMaterial({ base, highlight }: { base: string; highlight: string }) {
  const uniforms = useMemo(
    () => ({
      base: { value: new THREE.Color(base) },
      highlight: { value: new THREE.Color(highlight) },
    }),
    [base, highlight],
  );

  return (
    <shaderMaterial
      uniforms={uniforms}
      vertexShader={backdropVertex}
      fragmentShader={backdropFragment}
      toneMapped={false}
    />
  );
}

function StudioSet({ colors }: { colors: BackdropColors }) {
  const { arch, trim } = useMemo(() => {
    const arch = new THREE.Shape();
    traceArch(arch, 2.42, 2.983, -0.26);
    const frame = new THREE.Shape();
    traceArch(frame, 2.54, 3.043, -0.25);
    const opening = new THREE.Path();
    traceArch(opening, 2.47, 3.008, -0.24);
    frame.holes.push(opening);
    return { arch, trim: frame };
  }, []);

  return (
    <>
      <color attach="background" args={[colors.wall]} />
      <mesh position={[0, 1.74, -1.48]}>
        <planeGeometry args={[18, 5]} />
        <BackdropMaterial base={colors.wall} highlight={colors.inset} />
      </mesh>
      <mesh position={[0, -0.25, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[18, 18]} />
        <meshStandardMaterial color={colors.floor} roughness={0.93} />
      </mesh>
      <mesh position={[0, 0, -1.465]}>
        <shapeGeometry args={[arch, 48]} />
        <BackdropMaterial base={colors.inset} highlight={colors.trim} />
      </mesh>
      <mesh position={[0, 0, -1.455]}>
        <shapeGeometry args={[trim, 48]} />
        <meshBasicMaterial color={colors.trim} toneMapped={false} />
      </mesh>
      <mesh position={[0, -0.205, -1.445]}>
        <boxGeometry args={[18, 0.09, 0.06]} />
        <meshStandardMaterial color={colors.wall} roughness={0.72} />
      </mesh>

      <mesh position={[0.13, -0.248, -0.065]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[2.55, 2.3]} />
        <shaderMaterial
          vertexShader={groundShadowVertex}
          fragmentShader={groundShadowFragment}
          transparent
          depthWrite={false}
          toneMapped={false}
        />
      </mesh>
      <mesh position={[0, -0.224, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.86, 0.88, 0.05, 80]} />
        <meshStandardMaterial color={colors.base} roughness={0.7} />
      </mesh>
      <mesh position={[0, -0.126, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.79, 0.805, 0.148, 80]} />
        <meshStandardMaterial color={colors.base} roughness={0.64} />
      </mesh>
      <mesh position={[0, -0.033, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.845, 0.827, 0.062, 80]} />
        <meshStandardMaterial color={colors.top} roughness={0.52} />
      </mesh>
      <mesh position={[0, -0.066, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.807, 0.011, 12, 80]} />
        <meshStandardMaterial color={colors.metal} metalness={0.34} roughness={0.38} />
      </mesh>
      <mesh position={[0, -0.196, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.824, 0.008, 12, 80]} />
        <meshStandardMaterial color={colors.metal} metalness={0.34} roughness={0.38} />
      </mesh>
    </>
  );
}

function CameraFrame({ portrait }: { portrait: boolean }) {
  const { camera, size, invalidate } = useThree();

  useLayoutEffect(() => {
    if (!(camera instanceof THREE.OrthographicCamera) || size.width === 0 || size.height === 0) {
      return;
    }

    const center = portrait ? 2.3 : 1.4;
    const height = portrait ? 1.32 : 3.53;
    const width = portrait ? 1.02 : 2.07;

    // The portrait starts at eye level and keeps the shoulder-length sections in frame.
    camera.position.set(portrait ? 0 : 0.35, center + (portrait ? 0.06 : 0.43), 6.6);
    camera.lookAt(0, center, 0);
    camera.zoom = Math.min(size.width / width, size.height / height);
    camera.updateProjectionMatrix();
    invalidate();
  }, [camera, size.width, size.height, portrait, invalidate]);

  return null;
}

function CanvasLifecycle({ onReady }: { onReady: (canvas: HTMLCanvasElement | null) => void }) {
  const { gl, invalidate } = useThree();

  useEffect(() => {
    const canvas = gl.domElement;
    let frame = 0;

    function afterPaint() {
      invalidate();
      frame = requestAnimationFrame(() => {
        frame = requestAnimationFrame(() => onReady(canvas));
      });
    }

    function loseContext(event: Event) {
      event.preventDefault();
      cancelAnimationFrame(frame);
      onReady(null);
    }

    afterPaint();
    canvas.addEventListener("webglcontextlost", loseContext);
    canvas.addEventListener("webglcontextrestored", afterPaint);
    return () => {
      cancelAnimationFrame(frame);
      canvas.removeEventListener("webglcontextlost", loseContext);
      canvas.removeEventListener("webglcontextrestored", afterPaint);
      onReady(null);
    };
  }, [gl, invalidate, onReady]);

  return null;
}

export function DressUpStage({
  look,
  rotation,
  onRotate,
  portrait = false,
  label,
  unavailableLabel,
  loadingLabel,
  onCanvasReady,
}: DressUpStageProps) {
  const colors = backdrops[look.backdrop];
  const [status, setStatus] = useState<"loading" | "ready" | "unavailable">("loading");
  const [webGLAvailable, setWebGLAvailable] = useState(false);
  const drag = useRef<{ pointer: number; startX: number; rotation: number } | null>(null);
  const lastOnCanvasReady = useRef(onCanvasReady);

  useEffect(() => {
    lastOnCanvasReady.current = onCanvasReady;
  }, [onCanvasReady]);

  const onReady = useCallback((canvas: HTMLCanvasElement | null) => {
    setStatus(canvas ? "ready" : "unavailable");
    lastOnCanvasReady.current?.(canvas);
  }, []);

  useEffect(() => {
    const supported = canCreateWebGL();
    setWebGLAvailable(supported);
    if (!supported) onReady(null);
  }, [onReady]);

  function startDrag(event: PointerEvent<HTMLDivElement>) {
    if (!event.isPrimary || event.button !== 0 || status !== "ready") return;
    drag.current = { pointer: event.pointerId, startX: event.clientX, rotation };
    event.currentTarget.setPointerCapture(event.pointerId);
  }

  function moveDrag(event: PointerEvent<HTMLDivElement>) {
    const gesture = drag.current;
    if (gesture?.pointer !== event.pointerId) return;
    onRotate(gesture.rotation + (event.clientX - gesture.startX) * 0.011);
  }

  function endDrag(event: PointerEvent<HTMLDivElement>) {
    if (drag.current?.pointer === event.pointerId) drag.current = null;
  }

  const unavailable = (
    <div className="absolute inset-0 grid place-items-center p-8 text-center" role="status">
      {unavailableLabel}
    </div>
  );

  return (
    <div
      className="relative isolate size-full"
      style={{ backgroundColor: colors.wall, color: colors.ink }}
    >
      <StageErrorBoundary fallback={unavailable}>
        <div
          className="absolute inset-0 cursor-grab select-none active:cursor-grabbing"
          style={{ touchAction: "pan-y" }}
          role="img"
          aria-label={label}
          onPointerDown={startDrag}
          onPointerMove={moveDrag}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
          onLostPointerCapture={endDrag}
        >
          {webGLAvailable && (
            <Canvas
              aria-hidden="true"
              orthographic
              camera={{ near: 0.1, far: 32 }}
              dpr={[1, 1.65]}
              frameloop="demand"
              shadows="percentage"
              gl={rendererOptions}
            >
              <hemisphereLight args={["#fff4ee", "#efe0d7", 1.47]} />
              <directionalLight
                color="#fff0e3"
                intensity={2.2}
                position={[-3.4, 6, 4.7]}
                castShadow
                shadow-mapSize={[1024, 1024]}
                shadow-camera-left={-2.8}
                shadow-camera-right={2.8}
                shadow-camera-top={3.8}
                shadow-camera-bottom={-2}
                shadow-camera-near={0.5}
                shadow-camera-far={14}
                shadow-normalBias={0.015}
                shadow-bias={-0.00022}
                shadow-radius={3}
              />
              <directionalLight color="#fff9f4" intensity={0.68} position={[0, 0.75, 5.3]} />
              <directionalLight color="#efe6ff" intensity={0.8} position={[3.2, 3.7, 0.3]} />
              <directionalLight color="#ffd6c9" intensity={1.25} position={[1.6, 4.9, -3.1]} />
              <StudioSet colors={colors} />
              <Doll look={look} rotation={rotation} />
              <CameraFrame portrait={portrait} />
              <CanvasLifecycle onReady={onReady} />
            </Canvas>
          )}
        </div>
        {status === "unavailable" && unavailable}
        {status === "loading" && loadingLabel && (
          <div
            className="pointer-events-none absolute inset-0 grid place-items-center p-8 text-center"
            role="status"
          >
            {loadingLabel}
          </div>
        )}
      </StageErrorBoundary>
    </div>
  );
}

export default DressUpStage;
