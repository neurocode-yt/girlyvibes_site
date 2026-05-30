import { useState, useEffect, useRef } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useI18n } from "@/lib/i18n";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Download";
import { Section, Blob, HeartIcon, SparkleMark } from "@/components/site/Decor";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Zap, Sparkles, Smile, RefreshCw, Star, Camera, BookOpen, Box, Award, Coins } from "lucide-react";
import * as THREE from "three";

export const Route = createFileRoute("/games")({
  component: GamesPage,
  head: () => ({
    meta: [
      { title: "Girly Games 🎮 | Girly Vibes" },
      { name: "description", content: "Play lovely, high-quality, aesthetic mini-games made for girls! Dress up your custom 3D paper-doll or take care of Coco, your digital pocket bunny companion." },
      { property: "og:title", content: "Girly Games 🎮 — Your Aesthetic 3D Playroom" },
      { property: "og:description", content: "Dress up a custom 3D paper-doll with 360-degree rotation controls, or play with standard fluffy bunny pet!" }
    ],
    links: [
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600;9..144,700&family=Plus+Jakarta+Sans:wght@400;500;600;700&family=Tajawal:wght@400;500;700&display=swap" },
    ],
  }),
});

// Sound synthesis helper (safely runs in browser context)
function playSynthSound(type: "click" | "pet" | "feed" | "pop" | "sleep" | "win" | "fail" | "buy") {
  if (typeof window === "undefined") return;
  try {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    const now = ctx.currentTime;
    
    if (type === "click") {
      osc.type = "sine";
      osc.frequency.setValueAtTime(600, now);
      osc.frequency.exponentialRampToValueAtTime(1000, now + 0.08);
      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.08);
      osc.start(now);
      osc.stop(now + 0.08);
    } else if (type === "pet") {
      osc.type = "triangle";
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.25);
      gain.gain.setValueAtTime(0.18, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.25);
      osc.start(now);
      osc.stop(now + 0.25);
    } else if (type === "feed") {
      osc.type = "sine";
      osc.frequency.setValueAtTime(350, now);
      osc.frequency.setValueAtTime(480, now + 0.06);
      osc.frequency.exponentialRampToValueAtTime(200, now + 0.18);
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.18);
      osc.start(now);
      osc.stop(now + 0.19);
    } else if (type === "pop") {
      osc.type = "sine";
      osc.frequency.setValueAtTime(750, now);
      osc.frequency.exponentialRampToValueAtTime(120, now + 0.09);
      gain.gain.setValueAtTime(0.25, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.09);
      osc.start(now);
      osc.stop(now + 0.09);
    } else if (type === "sleep") {
      const notes = [523.25, 659.25, 783.99, 1046.50];
      notes.forEach((freq, index) => {
        const noteOsc = ctx.createOscillator();
        const noteGain = ctx.createGain();
        noteOsc.connect(noteGain);
        noteGain.connect(ctx.destination);
        noteOsc.type = "sine";
        noteOsc.frequency.setValueAtTime(freq, now + index * 0.15);
        noteGain.gain.setValueAtTime(0.1, now + index * 0.15);
        noteGain.gain.exponentialRampToValueAtTime(0.001, now + index * 0.15 + 0.35);
        noteOsc.start(now + index * 0.15);
        noteOsc.stop(now + index * 0.15 + 0.4);
      });
    } else if (type === "win") {
      osc.type = "triangle";
      osc.frequency.setValueAtTime(523.25, now);
      osc.frequency.setValueAtTime(659.25, now + 0.1);
      osc.frequency.setValueAtTime(783.99, now + 0.2);
      osc.frequency.setValueAtTime(1046.50, now + 0.3);
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.5);
      osc.start(now);
      osc.stop(now + 0.5);
    } else if (type === "fail") {
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(220, now);
      osc.frequency.exponentialRampToValueAtTime(110, now + 0.3);
      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
      osc.start(now);
      osc.stop(now + 0.3);
    } else if (type === "buy") {
      osc.type = "sine";
      osc.frequency.setValueAtTime(880, now);
      osc.frequency.setValueAtTime(1320, now + 0.08);
      gain.gain.setValueAtTime(0.18, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
      osc.start(now);
      osc.stop(now + 0.2);
    }
  } catch (error) {
    console.warn("AudioContext synthesis failed", error);
  }
}

// Scenery Configs — Hijab Styles
const HAIR_OPTIONS = [
  { id: "braids", labelEn: "Classic Silk 🧕", labelAr: "حجاب حرير كلاسيكي 🧕" },
  { id: "waves", labelEn: "Chiffon Wrap 🌙", labelAr: "لفة شيفون 🌙" },
  { id: "buns", labelEn: "Sports Hijab 💪", labelAr: "حجاب رياضي 💪" },
  { id: "bob", labelEn: "Crown Turban ✨", labelAr: "توربان ملكي ✨" },
];

const TOP_OPTIONS = [
  { id: "cardigan", labelEn: "Embroidered Abaya 👚", labelAr: "عباية مطرزة 👚" },
  { id: "strawberry", labelEn: "Henna Knit 🌿", labelAr: "حياكة حنّاء 🌿" },
  { id: "hoodie", labelEn: "Cozy Kaftan 🧸", labelAr: "قفطان دافئ 🧸" },
  { id: "tank", labelEn: "Modest Blouse 🌸", labelAr: "بلوزة محتشمة 🌸" },
];

const BOTTOM_OPTIONS = [
  { id: "skirt", labelEn: "Flowing Maxi 👗", labelAr: "تنورة ماكسي 👗" },
  { id: "overalls", labelEn: "Palazzo Pants 👖", labelAr: "بنطلون واسع 👖" },
  { id: "jeans", labelEn: "Modest Jeans 👖", labelAr: "جينز محتشم 👖" },
  { id: "shorts", labelEn: "Culottes 🍭", labelAr: "كيلوتات 🍭" },
];

const ACC_OPTIONS = [
  { id: "none", labelEn: "None ❌", labelAr: "بلا إكسسوار ❌" },
  { id: "clips", labelEn: "Hijab Pin 📌", labelAr: "دبوس حجاب 📌" },
  { id: "ears", labelEn: "Misbaha مسبحة", labelAr: "مسبحة 📿" },
  { id: "headphones", labelEn: "Arabic Coffee ☕", labelAr: "قهوة عربية ☕" },
  { id: "milk", labelEn: "Henna Hand 🌿", labelAr: "يد حنّاء 🌿" },
];

const BG_OPTIONS = [
  { id: "pink-room", labelEn: "Arabian Room 🏠", labelAr: "غرفة عربية 🏠", bgClass: "bg-gradient-to-tr from-amber-50 to-rose-100 dark:from-amber-950 dark:to-pink-950" },
  { id: "sky", labelEn: "Desert Sunset 🌅", labelAr: "غروب صحراوي 🌅", bgClass: "bg-gradient-to-tr from-amber-200 via-orange-200 to-rose-200 dark:from-amber-950 dark:via-orange-950 dark:to-rose-950" },
  { id: "teal-records", labelEn: "Moroccan Tiles 🕌", labelAr: "بلاط مغربي 🕌", bgClass: "bg-gradient-to-tr from-teal-50 to-emerald-100 dark:from-emerald-950 dark:to-teal-900" },
  { id: "garden", labelEn: "Starry Night 🌙", labelAr: "ليلة مرصعة بالنجوم 🌙", bgClass: "bg-gradient-to-tr from-slate-900 via-indigo-950 to-purple-900 text-white" },
];

// FASHION CHALLENGES CONFIG
const FASHION_CHALLENGES = [
  { 
    id: "cozy", 
    titleEn: "Cozy Eid Morning 🌙", 
    titleAr: "صباح العيد الدافئ 🌙", 
    descEn: "Style a cozy Eid morning look! Henna knits, kaftans, and a warm Arabian room backdrop.",
    descAr: "نسقي إطلالة صباح العيد الدافئة! حياكة حنّاء، قفطان، وخلفية عربية.",
    targets: { tops: ["strawberry", "hoodie"], bottoms: ["overalls", "shorts"], bg: ["pink-room"] }
  },
  { 
    id: "prom", 
    titleEn: "Elegant Soiree ✨", 
    titleAr: "سهرة أنيقة ✨", 
    descEn: "Style an elegant evening look! Embroidered abayas, flowing maxis, and desert sunset backdrops.",
    descAr: "نسقي إطلالة السهرة الأنيقة! عباية مطرزة، تنورة ماكسي، وغروب صحراوي.",
    targets: { tops: ["cardigan"], bottoms: ["skirt"], bg: ["sky"] }
  },
  { 
    id: "arcade", 
    titleEn: "Souq Shopping Day 🛍️", 
    titleAr: "يوم تسوق في السوق 🛍️", 
    descEn: "Casual souq shopping vibes! Kaftans, modest blouses, palazzo pants, or Moroccan tiles.",
    descAr: "أجواء التسوق في السوق! قفطان، بلوزة محتشمة، بنطلون واسع.",
    targets: { tops: ["hoodie", "tank"], bottoms: ["jeans"], bg: ["teal-records"] }
  }
];

// Virtual Pet Boutique Items
const BOUTIQUE_ITEMS = [
  { id: "boba", nameEn: "Cozy Boba Tea 🧋", nameAr: "شاي بوبا دافئ 🧋", cost: 30, type: "food", value: 15 },
  { id: "macaron", nameEn: "Strawberry Macaron 🍰", nameAr: "ماكارون فراولة 🍰", cost: 20, type: "food", value: 10 },
  { id: "candycorn", nameEn: "Magic Star Candy 🍬", nameAr: "حلوى النجم السحرية 🍬", cost: 40, type: "food", value: 25 },
  { id: "lights", nameEn: "Fairy Lights ✨", nameAr: "سلك أضواء براقة ✨", cost: 80, type: "decor", bgElement: "lights" },
  { id: "rug", nameEn: "Fluffy Pink Rug 🧶", nameAr: "سجادة وردية ناعمة 🧶", cost: 100, type: "decor", bgElement: "rug" },
  { id: "wings", nameEn: "Angel Wings Skin 👼", nameAr: "أجنحة ملاك لطيفة 👼", cost: 150, type: "cosmetic", skin: "wings" },
  { id: "detective", nameEn: "Detective Hat Skin 🕵️", nameAr: "قبعة محققة كلاسيكية 🕵️", cost: 120, type: "cosmetic", skin: "hat" },
];

function GamesPage() {
  const { t, lang } = useI18n();
  const [activeTab, setActiveTab] = useState<"dressup" | "tamagotchi">("dressup");
  const [isMounted, setIsMounted] = useState(false);

  // --- THREE.JS REAL 3D RENDERING SYSTEM REFS ---
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const dollGroupRef = useRef<THREE.Group | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);

  // --- PERSISTENT USER COINS & STATS ---
  const [carrotCoins, setCarrotCoins] = useState(100);
  const [scrapbook, setScrapbook] = useState<{ id: string; hair: string; top: string; bottom: string; acc: string; bg: string; caption: string; image?: string }[]>([]);
  const [bunnyInventory, setBunnyInventory] = useState<string[]>(["boba"]);
  const [bunnyLevel, setBunnyLevel] = useState(1);
  const [bunnyXp, setBunnyXp] = useState(20);

  // --- NATIVE 3D COORDINATES DRAG ROTATION CONTROLS ---
  const [rotationY, setRotationY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);

  const handlePointerDown = (e: React.PointerEvent) => {
    setIsDragging(true);
    setStartX(e.clientX);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    const deltaX = e.clientX - startX;
    setRotationY((prev) => prev + deltaX * 1.5); // rotate sensitivity
    setStartX(e.clientX);
  };

  const handlePointerUp = () => {
    setIsDragging(false);
  };

  // Load persistence on mount
  useEffect(() => {
    setIsMounted(true);
    if (typeof window === "undefined") return;
    try {
      const coins = localStorage.getItem("gv-carrot-coins");
      if (coins) setCarrotCoins(Number(coins));
    } catch (e) {
      console.warn("Failed to load coins", e);
    }
    
    try {
      const savedScrapbook = localStorage.getItem("gv-doll-scrapbook");
      if (savedScrapbook) setScrapbook(JSON.parse(savedScrapbook));
    } catch (e) {
      console.warn("Failed to load scrapbook", e);
    }

    try {
      const savedInventory = localStorage.getItem("gv-bunny-inventory");
      if (savedInventory) setBunnyInventory(JSON.parse(savedInventory));
    } catch (e) {
      console.warn("Failed to load inventory", e);
    }

    try {
      const savedLevel = localStorage.getItem("gv-bunny-lvl");
      if (savedLevel) setBunnyLevel(Number(savedLevel));
    } catch (e) {
      console.warn("Failed to load level", e);
    }

    try {
      const savedXp = localStorage.getItem("gv-bunny-xp");
      if (savedXp) setBunnyXp(Number(savedXp));
    } catch (e) {
      console.warn("Failed to load xp", e);
    }
  }, []);

  // Save helpers
  const saveCoins = (newVal: number) => {
    setCarrotCoins(newVal);
    localStorage.setItem("gv-carrot-coins", String(newVal));
  };
  const saveInventory = (newVal: string[]) => {
    setBunnyInventory(newVal);
    localStorage.setItem("gv-bunny-inventory", JSON.stringify(newVal));
  };
  const triggerEmitter = (char: string) => {
    const id = Date.now() + Math.random();
    const x = Math.random() * 80 - 40;
    const y = -10 + Math.random() * 20;
    setEmitters((prev) => [...prev, { id, char, x, y }]);
    setTimeout(() => {
      setEmitters((prev) => prev.filter((e) => e.id !== id));
    }, 1200);
  };

  const gainXp = (amount: number) => {
    let newXp = bunnyXp + amount;
    let newLvl = bunnyLevel;
    if (newXp >= 100) {
      newXp -= 100;
      newLvl = Math.min(5, newLvl + 1);
      playSynthSound("win");
      triggerEmitter("👑 Level Up!");
    }
    setBunnyXp(newXp);
    setBunnyLevel(newLvl);
    localStorage.setItem("gv-bunny-xp", String(newXp));
    localStorage.setItem("gv-bunny-lvl", String(newLvl));
  };

  // --- DRESS-UP STUDIO STATE ---
  const [hair, setHair] = useState("braids");
  const [top, setTop] = useState("cardigan");
  const [bottom, setBottom] = useState("skirt");
  const [acc, setAcc] = useState("none");
  const [bg, setBg] = useState("pink-room");
  const [scrapbookCaption, setScrapbookCaption] = useState("");

  // Style Runway state
  const [activeChallengeId, setActiveChallengeId] = useState("cozy");
  const [runwayPhase, setRunwayPhase] = useState<"idle" | "walking" | "scored">("idle");
  const [starsAwarded, setStarsAwarded] = useState(0);
  const [judgeComments, setJudgeComments] = useState<{ name: string; text: string; avatar: string }[]>([]);

  // --- TAMAGOTCHI STATE ---
  const [consoleMode, setConsoleMode] = useState<"room" | "shop" | "backpack">("room");
  const [bunnyState, setBunnyState] = useState<"idle" | "petting" | "eating" | "playing" | "sleeping">("idle");
  const [love, setLove] = useState(50);
  const [energy, setEnergy] = useState(50);
  
  const [equippedSkin, setEquippedSkin] = useState<string>("none");
  const [activeBgDecor, setActiveBgDecor] = useState<string[]>([]);

  // Emitters
  const [emitters, setEmitters] = useState<{ id: number; char: string; x: number; y: number }[]>([]);

  // Add refs for state to prevent stale closures in standard Three.js render loops
  const hairRef = useRef(hair);
  const topRef = useRef(top);
  const bottomRef = useRef(bottom);
  const accRef = useRef(acc);
  const bgRef = useRef(bg);
  const equippedSkinRef = useRef(equippedSkin);

  useEffect(() => { hairRef.current = hair; }, [hair]);
  useEffect(() => { topRef.current = top; }, [top]);
  useEffect(() => { bottomRef.current = bottom; }, [bottom]);
  useEffect(() => { accRef.current = acc; }, [acc]);
  useEffect(() => { bgRef.current = bg; }, [bg]);
  useEffect(() => { equippedSkinRef.current = equippedSkin; }, [equippedSkin]);

  // --- THREE.JS WEBGL REAL 3D CHIBI-DOLL SCENE INITIALIZER ---
  useEffect(() => {
    if (!isMounted || activeTab !== "dressup" || !canvasRef.current) return;

    // 1. Initialize Scene, Camera, WebGLRenderer with Dynamic Sizing
    const parent = canvasRef.current.parentElement;
    const width = parent ? parent.clientWidth : 320;
    const height = parent ? parent.clientHeight : 450;
    const scene = new THREE.Scene();
    
    // Position camera straight at the chibi doll
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(0, 0.4, 9.5);

    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      antialias: true,
      alpha: true,
      preserveDrawingBuffer: true
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;

    // 2. Setup Gorgeous Studio-Grade Lighting (Highly Premium glowing effect)
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.75);
    scene.add(ambientLight);

    const mainDirectional = new THREE.DirectionalLight(0xffffff, 0.95);
    mainDirectional.position.set(5, 8, 5);
    mainDirectional.castShadow = true;
    mainDirectional.shadow.mapSize.width = 1024;
    mainDirectional.shadow.mapSize.height = 1024;
    mainDirectional.shadow.camera.near = 0.5;
    mainDirectional.shadow.camera.far = 15;
    mainDirectional.shadow.camera.left = -2;
    mainDirectional.shadow.camera.right = 2;
    mainDirectional.shadow.camera.top = 2;
    mainDirectional.shadow.camera.bottom = -2;
    mainDirectional.shadow.bias = -0.002;
    scene.add(mainDirectional);

    // Beautiful Warm Orange-Pink Rim Backlight for standard high-end glossy vinyl highlight!
    const warmRimLight = new THREE.DirectionalLight(0xffedd5, 0.65);
    warmRimLight.position.set(-5, 3, -4);
    scene.add(warmRimLight);

    // Cool blue-white soft fill light for beautiful soft shadows contrast
    const coolFillLight = new THREE.DirectionalLight(0xe0f2fe, 0.45);
    coolFillLight.position.set(0, -3, 2);
    scene.add(coolFillLight);

    // 3. Central Doll Parent Group (rotates on drag Y-axis)
    const dollGroup = new THREE.Group();
    dollGroup.position.y = 0.3; // center nicely in the box viewport
    scene.add(dollGroup);
    dollGroupRef.current = dollGroup;
    sceneRef.current = scene;

    // Enable high-fidelity soft self-shadows dynamically
    const enableShadows = (obj: THREE.Object3D) => {
      obj.castShadow = true;
      obj.receiveShadow = true;
      obj.children.forEach(enableShadows);
    };

    // 4. Base Chibi Body Parts with Elegant Chibi (Nendoroid) Proportions
    // Beautiful warm honey-wheat Arab skin tone
    const SKIN_COLOR = 0xdeb896;

    // Head Sphere (gorgeous warm Arab skin tone)
    const headMesh = new THREE.Mesh(
      new THREE.SphereGeometry(1.22, 32, 32),
      new THREE.MeshStandardMaterial({ color: SKIN_COLOR, roughness: 0.9, metalness: 0.0 })
    );
    headMesh.position.set(0, 1.6, 0);
    dollGroup.add(headMesh);

    // Cute Rounded Ears on the Sides of Head (will be mostly hidden by hijab)
    const earL = new THREE.Mesh(
      new THREE.SphereGeometry(0.18, 16, 16),
      new THREE.MeshStandardMaterial({ color: SKIN_COLOR, roughness: 0.9, metalness: 0.0 })
    );
    earL.position.set(-1.2, 0, -0.1);
    earL.scale.set(0.45, 0.85, 0.7);
    earL.rotation.y = 0.2;

    const earR = earL.clone();
    earR.position.set(1.2, 0, -0.1);
    earR.rotation.y = -0.2;
    headMesh.add(earL, earR);

    // Expressive, Multi-layered 3D Anime Eyes (Large, Low, & Sparkling!)
    // Left Eyelash Backing (Beautiful oval shape)
    const lashL = new THREE.Mesh(
      new THREE.SphereGeometry(0.28, 16, 16),
      new THREE.MeshStandardMaterial({ color: 0x221a24, roughness: 0.5 })
    );
    lashL.position.set(-0.45, -0.02, 1.15);
    lashL.scale.set(1.25, 0.88, 0.05);
    lashL.rotation.y = 0.36;
    lashL.rotation.x = -0.02;
    lashL.rotation.z = -0.08;

    // Left Iris (Warm Dark Brown — Beautiful Arab Eyes!)
    const irisL = new THREE.Mesh(
      new THREE.SphereGeometry(0.26, 16, 16),
      new THREE.MeshStandardMaterial({ color: 0x6b3a2a, roughness: 0.2, metalness: 0.1 })
    );
    irisL.position.set(-0.45, -0.02, 1.16);
    irisL.scale.set(1.0, 1.0, 0.05);
    irisL.rotation.y = 0.36;
    irisL.rotation.x = -0.02;

    // Left Pupil (Dark Inner Core)
    const pupilL = new THREE.Mesh(
      new THREE.SphereGeometry(0.15, 16, 16),
      new THREE.MeshStandardMaterial({ color: 0x1a0a05, roughness: 0.2 })
    );
    pupilL.position.set(-0.45, -0.02, 1.17);
    pupilL.scale.set(0.9, 0.9, 0.05);
    pupilL.rotation.y = 0.36;
    pupilL.rotation.x = -0.02;

    // Eye Twinkles (Triple Sparkles for high-fidelity look!)
    const shineL1 = new THREE.Mesh(
      new THREE.SphereGeometry(0.06, 12, 12),
      new THREE.MeshBasicMaterial({ color: 0xffffff })
    );
    shineL1.position.set(-0.38, 0.05, 1.18);

    const shineL2 = new THREE.Mesh(
      new THREE.SphereGeometry(0.035, 8, 8),
      new THREE.MeshBasicMaterial({ color: 0xffffff })
    );
    shineL2.position.set(-0.51, -0.09, 1.18);

    const shineL3 = new THREE.Mesh(
      new THREE.SphereGeometry(0.02, 8, 8),
      new THREE.MeshBasicMaterial({ color: 0xffffff })
    );
    shineL3.position.set(-0.49, 0.06, 1.18);

    headMesh.add(lashL, irisL, pupilL, shineL1, shineL2, shineL3);

    // Right Eye Parts (Mirrored perfectly with consistent light highlight angles)
    const lashR = new THREE.Mesh(
      new THREE.SphereGeometry(0.28, 16, 16),
      new THREE.MeshStandardMaterial({ color: 0x221a24, roughness: 0.5 })
    );
    lashR.position.set(0.45, -0.02, 1.15);
    lashR.scale.set(1.25, 0.88, 0.05);
    lashR.rotation.y = -0.36;
    lashR.rotation.x = -0.02;
    lashR.rotation.z = 0.08;

    const irisR = new THREE.Mesh(
      new THREE.SphereGeometry(0.26, 16, 16),
      new THREE.MeshStandardMaterial({ color: 0x6b3a2a, roughness: 0.2, metalness: 0.1 })
    );
    irisR.position.set(0.45, -0.02, 1.16);
    irisR.scale.set(1.0, 1.0, 0.05);
    irisR.rotation.y = -0.36;
    irisR.rotation.x = -0.02;

    const pupilR = new THREE.Mesh(
      new THREE.SphereGeometry(0.15, 16, 16),
      new THREE.MeshStandardMaterial({ color: 0x1a0a05, roughness: 0.2 })
    );
    pupilR.position.set(0.45, -0.02, 1.17);
    pupilR.scale.set(0.9, 0.9, 0.05);
    pupilR.rotation.y = -0.36;
    pupilR.rotation.x = -0.02;

    const shineR1 = new THREE.Mesh(
      new THREE.SphereGeometry(0.06, 12, 12),
      new THREE.MeshBasicMaterial({ color: 0xffffff })
    );
    shineR1.position.set(0.52, 0.05, 1.18); // both eyes shine from standard same side

    const shineR2 = new THREE.Mesh(
      new THREE.SphereGeometry(0.035, 8, 8),
      new THREE.MeshBasicMaterial({ color: 0xffffff })
    );
    shineR2.position.set(0.39, -0.09, 1.18);

    const shineR3 = new THREE.Mesh(
      new THREE.SphereGeometry(0.02, 8, 8),
      new THREE.MeshBasicMaterial({ color: 0xffffff })
    );
    shineR3.position.set(0.41, 0.06, 1.18);

    headMesh.add(lashR, irisR, pupilR, shineR1, shineR2, shineR3);

    // Cute Tiny Button Nose (Sits beautifully on standard sphere surface)
    const tinyNose = new THREE.Mesh(
      new THREE.SphereGeometry(0.048, 8, 8),
      new THREE.MeshStandardMaterial({ color: 0xc9956b, roughness: 0.9 })
    );
    tinyNose.position.set(0, -0.16, 1.23);
    headMesh.add(tinyNose);

    // Cute Soft Flat Cheek Blush (Disk Geometry - Beautiful, NOT creepy Jigsaw red lumpy warts!)
    const blushL = new THREE.Mesh(
      new THREE.CircleGeometry(0.15, 16),
      new THREE.MeshBasicMaterial({ color: 0xd4886b, transparent: true, opacity: 0.35 })
    );
    blushL.position.set(-0.55, -0.18, 1.10);
    blushL.rotation.y = 0.4;
    blushL.rotation.x = -0.1;
    
    const blushR = blushL.clone();
    blushR.position.set(0.55, -0.18, 1.10);
    blushR.rotation.y = -0.4;
    headMesh.add(blushL, blushR);

    // Happy Open Smile Mouth (Sits beautifully on standard sphere surface)
    const smileMouth = new THREE.Mesh(
      new THREE.TorusGeometry(0.075, 0.02, 8, 16, Math.PI),
      new THREE.MeshStandardMaterial({ color: 0xc96b6b, roughness: 0.5 })
    );
    smileMouth.position.set(0, -0.26, 1.21);
    smileMouth.rotation.x = Math.PI; // smile shape
    headMesh.add(smileMouth);

    // Torso Cylinder (Beautiful warm Arab skin tone)
    const torsoMesh = new THREE.Mesh(
      new THREE.CylinderGeometry(0.42, 0.35, 1.25, 16),
      new THREE.MeshStandardMaterial({ color: SKIN_COLOR, roughness: 0.8 })
    );
    torsoMesh.position.set(0, 0.28, 0);
    dollGroup.add(torsoMesh);

    // Modest Undershirt Base Layer
    const underwearMesh = new THREE.Mesh(
      new THREE.CylinderGeometry(0.43, 0.37, 0.38, 16),
      new THREE.MeshStandardMaterial({ color: 0xf5e6d3, roughness: 0.7 })
    );
    underwearMesh.position.set(0, -0.32, 0);
    dollGroup.add(underwearMesh);

    // Modest Undershirt Top Wrap
    const undieTopWrap = new THREE.Mesh(
      new THREE.CylinderGeometry(0.43, 0.41, 0.28, 16),
      new THREE.MeshStandardMaterial({ color: 0xf5e6d3, roughness: 0.7 })
    );
    undieTopWrap.position.set(0, 0.32, 0);
    dollGroup.add(undieTopWrap);

    // Slender, Elegant Chibi Arms (warm Arab skin tone)
    const armL = new THREE.Mesh(
      new THREE.CylinderGeometry(0.08, 0.07, 0.95, 16),
      new THREE.MeshStandardMaterial({ color: SKIN_COLOR, roughness: 0.8 })
    );
    armL.position.set(-0.58, 0.35, 0);
    armL.rotation.z = Math.PI / 10;
    
    const armR = armL.clone();
    armR.position.set(0.58, 0.35, 0);
    armR.rotation.z = -Math.PI / 10;
    dollGroup.add(armL, armR);

    // Slender, Elegant Legs with Modest Socks and Cute Flats
    const legL = new THREE.Mesh(
      new THREE.CylinderGeometry(0.09, 0.08, 1.25, 16),
      new THREE.MeshStandardMaterial({ color: SKIN_COLOR, roughness: 0.8 })
    );
    legL.position.set(-0.2, -0.75, 0);

    // White Cuffed Sock Layer
    const sockL = new THREE.Mesh(
      new THREE.CylinderGeometry(0.1, 0.085, 0.5, 16),
      new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.7 })
    );
    sockL.position.set(0, -0.22, 0);
    legL.add(sockL);

    // Pink Mary Jane Shoes with Tiny Bow Details (Glossy & Cutesy!)
    const shoeL = new THREE.Mesh(
      new THREE.SphereGeometry(0.14, 16, 16),
      new THREE.MeshStandardMaterial({ color: 0xff758f, roughness: 0.2, metalness: 0.1 })
    );
    shoeL.position.set(0, -0.58, 0.08);
    shoeL.scale.set(1.0, 0.72, 1.4);
    
    const shoeStrapL = new THREE.Mesh(
      new THREE.TorusGeometry(0.085, 0.016, 6, 12),
      new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.6 })
    );
    shoeStrapL.position.set(0, 0.05, 0);
    shoeStrapL.rotation.x = Math.PI / 2;
    shoeL.add(shoeStrapL);

    // Tiny bow decoration on shoe
    const shoeBowL = new THREE.Mesh(
      new THREE.BoxGeometry(0.08, 0.03, 0.03),
      new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.6 })
    );
    shoeBowL.position.set(0, 0.07, 0.09);
    shoeL.add(shoeBowL);
    
    legL.add(shoeL);

    const legR = legL.clone();
    legR.position.set(0.2, -0.75, 0);
    dollGroup.add(legL, legR);

    // 5. Dynamic Wardrobe Mesh Group Instantiators
    let activeHair: THREE.Group | null = null;
    let activeTop: THREE.Group | null = null;
    let activeBottom: THREE.Group | null = null;
    let activeAcc: THREE.Group | null = null;
    let activeSkinWings: THREE.Group | null = null;
    let activeSkinHat: THREE.Group | null = null;

    // Helper that executes on mount or state changes to rebuild clothes meshes
    const updateWardrobe = () => {
      const hair = hairRef.current;
      const top = topRef.current;
      const bottom = bottomRef.current;
      const acc = accRef.current;
      const equippedSkin = equippedSkinRef.current;

      // Clear standard previous meshes
      if (activeHair) dollGroup.remove(activeHair);
      if (activeTop) dollGroup.remove(activeTop);
      if (activeBottom) dollGroup.remove(activeBottom);
      if (activeAcc) dollGroup.remove(activeAcc);
      if (activeSkinWings) dollGroup.remove(activeSkinWings);
      if (activeSkinHat) dollGroup.remove(activeSkinHat);

      // Setup Hijab Colors & Styles
      activeHair = new THREE.Group();
      activeHair.position.set(0, 1.6, 0); // attach to Head position
      dollGroup.add(activeHair);

      // Hijab color palette — gorgeous, rich, and culturally beautiful!
      let hijabColor = 0xc8a2c8; // Classic Silk — dusty rose-lavender
      if (hair === "waves") hijabColor = 0xfff5e1; // Chiffon Wrap — ivory cream
      if (hair === "buns") hijabColor = 0x1d3557; // Sports Hijab — deep navy
      if (hair === "bob") hijabColor = 0x2d6a4f; // Crown Turban — emerald green

      // === HIJAB BASE CAP (Covers the entire top & back of head, frames the face oval!) ===
      // Full head covering sphere (slightly larger than head to sit on top)
      const hijabCap = new THREE.Mesh(
        new THREE.SphereGeometry(1.30, 32, 32),
        new THREE.MeshStandardMaterial({ color: hijabColor, roughness: 0.7, metalness: 0.02 })
      );
      // Clip the front so face is exposed: scale Z slightly to push back, shift back
      hijabCap.position.set(0, 0.08, -0.15);
      hijabCap.scale.set(1.06, 1.08, 1.05);
      activeHair.add(hijabCap);

      // Hijab under-chin wrap (frames the face beautifully from below)
      const chinWrap = new THREE.Mesh(
        new THREE.TorusGeometry(1.15, 0.14, 8, 24, Math.PI * 1.15),
        new THREE.MeshStandardMaterial({ color: hijabColor, roughness: 0.7 })
      );
      chinWrap.position.set(0, -0.42, 0.3);
      chinWrap.rotation.x = -0.15;
      chinWrap.rotation.z = Math.PI;
      activeHair.add(chinWrap);

      // Hijab fabric drape flowing down over the shoulders and chest (gorgeous flowing fabric!)
      const drapeFabric = new THREE.Mesh(
        new THREE.ConeGeometry(1.15, 2.4, 16, 1, true),
        new THREE.MeshStandardMaterial({ color: hijabColor, roughness: 0.7, side: THREE.DoubleSide })
      );
      drapeFabric.position.set(0, -1.3, -0.2);
      drapeFabric.scale.set(1.0, 1.0, 0.85);
      activeHair.add(drapeFabric);

      // Front drape panel (falls gracefully over the chest from the chin)
      const frontDrape = new THREE.Mesh(
        new THREE.CylinderGeometry(0.65, 0.85, 1.6, 12, 1, true),
        new THREE.MeshStandardMaterial({ color: hijabColor, roughness: 0.7, side: THREE.DoubleSide })
      );
      frontDrape.position.set(0, -1.4, 0.35);
      frontDrape.scale.set(0.7, 1.0, 0.35);
      activeHair.add(frontDrape);

      // === HIJAB STYLE-SPECIFIC DETAILS ===
      if (hair === "braids") {
        // Classic Silk Hijab — Elegant, clean, with a beautiful side drape
        // Beautiful lace trim along the face frame
        const laceTrim = new THREE.Mesh(
          new THREE.TorusGeometry(1.22, 0.025, 6, 32, Math.PI),
          new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.6 })
        );
        laceTrim.position.set(0, 0, 1.08);
        laceTrim.rotation.y = Math.PI / 2;
        laceTrim.rotation.z = Math.PI;
        activeHair.add(laceTrim);

        // Elegant gold border embroidery line
        const goldBorder = new THREE.Mesh(
          new THREE.TorusGeometry(1.26, 0.018, 6, 32, Math.PI),
          new THREE.MeshStandardMaterial({ color: 0xd4af37, roughness: 0.2, metalness: 0.7 })
        );
        goldBorder.position.set(0, 0, 1.06);
        goldBorder.rotation.y = Math.PI / 2;
        goldBorder.rotation.z = Math.PI;
        activeHair.add(goldBorder);
      } else if (hair === "waves") {
        // Chiffon Wrap — Layered, flowing, with a sheer overlay layer
        const sheerOverlay = new THREE.Mesh(
          new THREE.SphereGeometry(1.35, 24, 24),
          new THREE.MeshStandardMaterial({ color: 0xfff5e1, transparent: true, opacity: 0.3, roughness: 0.5 })
        );
        sheerOverlay.position.set(0, 0.08, -0.15);
        sheerOverlay.scale.set(1.08, 1.1, 1.07);
        activeHair.add(sheerOverlay);

        // Chiffon layers cascading down one side
        const chiffonSideDrape = new THREE.Mesh(
          new THREE.CylinderGeometry(0.35, 0.18, 1.8, 8),
          new THREE.MeshStandardMaterial({ color: 0xfff5e1, transparent: true, opacity: 0.5, roughness: 0.5 })
        );
        chiffonSideDrape.position.set(-0.9, -1.0, 0.1);
        chiffonSideDrape.rotation.z = 0.2;
        activeHair.add(chiffonSideDrape);

        // Beautiful pearl pin
        const pearlPin = new THREE.Mesh(
          new THREE.SphereGeometry(0.08, 12, 12),
          new THREE.MeshStandardMaterial({ color: 0xfff8f0, roughness: 0.15, metalness: 0.3 })
        );
        pearlPin.position.set(-0.7, 0.7, 0.95);
        activeHair.add(pearlPin);
      } else if (hair === "buns") {
        // Sports Hijab — Tight-fitting, athletic, shorter drape
        // Override the drape to be shorter and tighter
        drapeFabric.scale.set(0.85, 0.7, 0.75);
        drapeFabric.position.y = -0.9;
        frontDrape.scale.set(0.6, 0.7, 0.3);
        frontDrape.position.y = -1.0;

        // Athletic stripe accent
        const stripeL = new THREE.Mesh(
          new THREE.BoxGeometry(0.04, 1.2, 0.04),
          new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.6 })
        );
        stripeL.position.set(-1.1, -0.1, 0.4);
        stripeL.rotation.z = 0.1;
        const stripeR = stripeL.clone();
        stripeR.position.x = 1.1;
        stripeR.rotation.z = -0.1;
        activeHair.add(stripeL, stripeR);
      } else if (hair === "bob") {
        // Crown Turban — Voluminous top wrap with a beautiful gathered knot
        // Extra height volume on top
        const crownVolume = new THREE.Mesh(
          new THREE.SphereGeometry(0.65, 16, 16),
          new THREE.MeshStandardMaterial({ color: hijabColor, roughness: 0.7 })
        );
        crownVolume.position.set(0, 1.0, -0.15);
        crownVolume.scale.set(1.4, 0.7, 1.0);
        activeHair.add(crownVolume);

        // Beautiful gathered fabric knot at the top
        const topKnot = new THREE.Mesh(
          new THREE.TorusKnotGeometry(0.18, 0.06, 32, 8, 2, 3),
          new THREE.MeshStandardMaterial({ color: hijabColor, roughness: 0.6 })
        );
        topKnot.position.set(0, 1.15, 0.3);
        topKnot.rotation.x = Math.PI / 4;
        activeHair.add(topKnot);

        // Gold brooch pin on the front
        const brooch = new THREE.Mesh(
          new THREE.ConeGeometry(0.06, 0.03, 6),
          new THREE.MeshStandardMaterial({ color: 0xd4af37, roughness: 0.15, metalness: 0.8 })
        );
        brooch.position.set(0, 0.65, 1.15);
        brooch.rotation.x = Math.PI / 2;
        activeHair.add(brooch);

        // Gold ring around brooch
        const broochRing = new THREE.Mesh(
          new THREE.TorusGeometry(0.08, 0.015, 8, 16),
          new THREE.MeshStandardMaterial({ color: 0xd4af37, roughness: 0.15, metalness: 0.8 })
        );
        broochRing.position.set(0, 0.65, 1.14);
        activeHair.add(broochRing);
      }

      // --- 3D TOPS GEOMETRIES WITH PREMIUM RICH DETAIL ---
      activeTop = new THREE.Group();
      dollGroup.add(activeTop);

      if (top === "cardigan") {
        // Cardigan Base Chest
        const cardChest = new THREE.Mesh(
          new THREE.CylinderGeometry(0.45, 0.45, 0.95, 16),
          new THREE.MeshStandardMaterial({ color: 0xff758f, roughness: 0.7 })
        );
        cardChest.position.y = 0.38;
        activeTop.add(cardChest);

        // Puffy Sleeves
        const slL = new THREE.Mesh(
          new THREE.CylinderGeometry(0.14, 0.1, 0.85, 16),
          new THREE.MeshStandardMaterial({ color: 0xff758f, roughness: 0.7 })
        );
        slL.position.set(-0.52, 0.32, 0);
        slL.rotation.z = Math.PI / 10;
        
        // Ruffled Cuffs
        const cuffL = new THREE.Mesh(
          new THREE.TorusGeometry(0.1, 0.035, 8, 16),
          new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.7 })
        );
        cuffL.position.set(0, -0.42, 0);
        cuffL.rotation.x = Math.PI / 2;
        slL.add(cuffL);

        const slR = slL.clone();
        slR.position.x = 0.52;
        slR.rotation.z = -Math.PI / 10;
        activeTop.add(slL, slR);

        // V-Neck White Borders
        const borderL = new THREE.Mesh(
          new THREE.BoxGeometry(0.065, 0.7, 0.08),
          new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.7 })
        );
        borderL.position.set(-0.16, 0.52, 0.45);
        borderL.rotation.z = 0.45;

        const borderR = borderL.clone();
        borderR.position.x = 0.16;
        borderR.rotation.z = -0.45;
        activeTop.add(borderL, borderR);

        // Gorgeous Physical 3D front bow ribbon!
        const bow = new THREE.Group();
        const leftWing = new THREE.Mesh(
          new THREE.ConeGeometry(0.07, 0.18, 4),
          new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.7 })
        );
        leftWing.rotation.z = Math.PI / 2;
        
        const rightWing = leftWing.clone();
        rightWing.rotation.z = -Math.PI / 2;
        rightWing.position.x = 0.09;
        
        const knot = new THREE.Mesh(
          new THREE.SphereGeometry(0.05, 8, 8),
          new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.7 })
        );
        knot.position.x = 0.045;

        const tailL = new THREE.Mesh(
          new THREE.CylinderGeometry(0.012, 0.012, 0.16, 8),
          new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.7 })
        );
        tailL.position.set(0.015, -0.08, 0);
        tailL.rotation.z = 0.35;

        const tailR = tailL.clone();
        tailR.position.x = 0.075;
        tailR.rotation.z = -0.35;

        bow.add(leftWing, rightWing, knot, tailL, tailR);
        bow.position.set(-0.045, 0.48, 0.48);
        activeTop.add(bow);
      } else if (top === "strawberry") {
        // Strawberry Knit base chest
        const strawChest = new THREE.Mesh(
          new THREE.CylinderGeometry(0.45, 0.45, 0.95, 16),
          new THREE.MeshStandardMaterial({ color: 0xe63946, roughness: 0.7 })
        );
        strawChest.position.y = 0.38;
        activeTop.add(strawChest);

        // Cozy Sleeves
        const slL = new THREE.Mesh(
          new THREE.CylinderGeometry(0.14, 0.1, 0.85, 16),
          new THREE.MeshStandardMaterial({ color: 0xe63946, roughness: 0.7 })
        );
        slL.position.set(-0.52, 0.32, 0);
        slL.rotation.z = Math.PI / 10;
        const slR = slL.clone();
        slR.position.x = 0.52;
        slR.rotation.z = -Math.PI / 10;
        activeTop.add(slL, slR);

        // Beautiful Green Leaf Collar Meshes (5 leaves ring)
        const collarGroup = new THREE.Group();
        for (let i = 0; i < 5; i++) {
          const leafAngle = (i / 5) * Math.PI * 2;
          const leaf = new THREE.Mesh(
            new THREE.SphereGeometry(0.12, 8, 8),
            new THREE.MeshStandardMaterial({ color: 0x80ed99, roughness: 0.6 })
          );
          leaf.position.set(Math.sin(leafAngle) * 0.18, 0.85, Math.cos(leafAngle) * 0.18);
          leaf.scale.set(1.0, 0.2, 1.6);
          leaf.rotation.y = -leafAngle;
          leaf.rotation.x = Math.PI / 3;
          collarGroup.add(leaf);
        }
        activeTop.add(collarGroup);

        // Strawberry seed physical white dots specs
        const seeds = [
          { x: -0.16, y: 0.45, z: 0.45 },
          { x: 0.16, y: 0.32, z: 0.45 },
          { x: -0.08, y: 0.18, z: 0.45 },
          { x: 0.08, y: 0.58, z: 0.45 }
        ];
        seeds.forEach((pos) => {
          const seed = new THREE.Mesh(
            new THREE.SphereGeometry(0.03, 8, 8),
            new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.5 })
          );
          seed.position.set(pos.x, pos.y, pos.z);
          seed.scale.set(1.0, 1.5, 0.5);
          activeTop?.add(seed);
        });
      } else if (top === "hoodie") {
        // Lavender base chest (slightly thicker for cozy hoodie look)
        const hoodChest = new THREE.Mesh(
          new THREE.CylinderGeometry(0.48, 0.48, 1.05, 16),
          new THREE.MeshStandardMaterial({ color: 0xb892ff, roughness: 0.7 })
        );
        hoodChest.position.y = 0.38;
        activeTop.add(hoodChest);

        // Thick sleeves
        const slL = new THREE.Mesh(
          new THREE.CylinderGeometry(0.16, 0.12, 0.85, 16),
          new THREE.MeshStandardMaterial({ color: 0xb892ff, roughness: 0.7 })
        );
        slL.position.set(-0.54, 0.32, 0);
        slL.rotation.z = Math.PI / 10;
        const slR = slL.clone();
        slR.position.x = 0.54;
        slR.rotation.z = -Math.PI / 10;
        activeTop.add(slL, slR);

        // Physical Front Kangaroo Pouch Pocket
        const pouch = new THREE.Mesh(
          new THREE.SphereGeometry(0.32, 16, 16),
          new THREE.MeshStandardMaterial({ color: 0xb892ff, roughness: 0.7 })
        );
        pouch.position.set(0, 0.18, 0.42);
        pouch.scale.set(1.2, 0.7, 0.45);
        activeTop.add(pouch);

        // Cute white drawstrings dangling
        const cordL = new THREE.Group();
        const cordLineL = new THREE.Mesh(
          new THREE.CylinderGeometry(0.012, 0.012, 0.3),
          new THREE.MeshBasicMaterial({ color: 0xffffff })
        );
        const cordTipL = new THREE.Mesh(
          new THREE.SphereGeometry(0.038, 8, 8),
          new THREE.MeshBasicMaterial({ color: 0xffffff })
        );
        cordTipL.position.y = -0.15;
        cordL.add(cordLineL, cordTipL);
        cordL.position.set(-0.12, 0.52, 0.48);
        cordL.rotation.z = 0.15;

        const cordR = cordL.clone();
        cordR.position.x = 0.12;
        cordR.rotation.z = -0.15;
        activeTop.add(cordL, cordR);

        // Physical Hood Cap covering head back
        const hoodCapObj = new THREE.Mesh(
          new THREE.SphereGeometry(1.36, 24, 24),
          new THREE.MeshStandardMaterial({ color: 0xb892ff, roughness: 0.7 })
        );
        hoodCapObj.position.set(0, 1.58, -0.06);
        hoodCapObj.scale.set(1.04, 1.04, 1.08);
        activeTop.add(hoodCapObj);

        // 3D floppy bunny ears on hood!
        const hEarL = new THREE.Mesh(
          new THREE.CylinderGeometry(0.1, 0.1, 0.85, 16),
          new THREE.MeshStandardMaterial({ color: 0xb892ff, roughness: 0.7 })
        );
        hEarL.position.set(-0.4, 2.7, -0.16);
        hEarL.rotation.z = Math.PI / 10;
        hEarL.rotation.x = 0.12; // bend forward

        const hEarLInner = new THREE.Mesh(
          new THREE.CylinderGeometry(0.05, 0.05, 0.75, 16),
          new THREE.MeshStandardMaterial({ color: 0xffccd5, roughness: 0.7 })
        );
        hEarLInner.position.set(0, 0, 0.055);
        hEarL.add(hEarLInner);

        const hEarR = hEarL.clone();
        hEarR.position.x = 0.4;
        hEarR.rotation.z = -Math.PI / 10;
        activeTop.add(hEarL, hEarR);
      } else if (top === "tank") {
        // Sky Blue Tank Top
        const tankChest = new THREE.Mesh(
          new THREE.CylinderGeometry(0.43, 0.43, 0.85, 16),
          new THREE.MeshStandardMaterial({ color: 0xa8dadc, roughness: 0.7 })
        );
        tankChest.position.y = 0.32;
        activeTop.add(tankChest);

        // Physical Shoulder Straps
        const strapL = new THREE.Mesh(
          new THREE.BoxGeometry(0.05, 0.35, 0.05),
          new THREE.MeshStandardMaterial({ color: 0xa8dadc, roughness: 0.7 })
        );
        strapL.position.set(-0.25, 0.65, 0);
        const strapR = strapL.clone();
        strapR.position.x = 0.25;
        activeTop.add(strapL, strapR);

        // White Ruffled Bottom Border
        const ruffleBorder = new THREE.Mesh(
          new THREE.TorusGeometry(0.44, 0.04, 8, 24),
          new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.7 })
        );
        ruffleBorder.position.y = -0.15;
        ruffleBorder.rotation.x = Math.PI / 2;
        tankChest.add(ruffleBorder);

        // White physical 3D heart overlay details
        const heartG = new THREE.Group();
        const hp1 = new THREE.Mesh(
          new THREE.SphereGeometry(0.06, 12, 12),
          new THREE.MeshBasicMaterial({ color: 0xffffff })
        );
        hp1.position.set(-0.035, 0, 0);
        
        const hp2 = hp1.clone();
        hp2.position.x = 0.035;

        const hp3 = new THREE.Mesh(
          new THREE.ConeGeometry(0.085, 0.14, 4),
          new THREE.MeshBasicMaterial({ color: 0xffffff })
        );
        hp3.rotation.x = Math.PI;
        hp3.position.y = -0.06;
        
        heartG.add(hp1, hp2, hp3);
        heartG.position.set(0, 0.32, 0.45);
        activeTop.add(heartG);
      }

      // --- 3D BOTTOMS GEOMETRIES WITH PLEATS AND CUFFS ---
      activeBottom = new THREE.Group();
      dollGroup.add(activeBottom);

      if (bottom === "skirt") {
        // Flared skirt cone geometry
        const skirtMain = new THREE.Mesh(
          new THREE.ConeGeometry(0.92, 0.65, 24, 1, true),
          new THREE.MeshStandardMaterial({ color: 0xc8b6ff, roughness: 0.6 })
        );
        skirtMain.position.y = -0.32;
        activeBottom.add(skirtMain);

        // Physical flared 3D Skirt Pleats (12 box pleats segments)
        for (let i = 0; i < 12; i++) {
          const angle = (i / 12) * Math.PI * 2;
          const pleat = new THREE.Mesh(
            new THREE.BoxGeometry(0.065, 0.65, 0.03),
            new THREE.MeshStandardMaterial({ color: 0xb892ff, roughness: 0.6 })
          );
          pleat.position.set(Math.sin(angle) * 0.64, -0.32, Math.cos(angle) * 0.64);
          pleat.rotation.y = -angle;
          pleat.rotation.x = 0.16; // flaring angle matching cone
          activeBottom.add(pleat);
        }

        // Soft white waistband line
        const waistband = new THREE.Mesh(
          new THREE.TorusGeometry(0.44, 0.045, 8, 24),
          new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.6 })
        );
        waistband.position.y = 0.02;
        waistband.rotation.x = Math.PI / 2;
        activeBottom.add(waistband);
      } else if (bottom === "overalls") {
        // Overall leg trunks
        const pantsBody = new THREE.Mesh(
          new THREE.CylinderGeometry(0.48, 0.48, 0.75, 16),
          new THREE.MeshStandardMaterial({ color: 0x457b9d, roughness: 0.6 })
        );
        pantsBody.position.y = -0.28;
        activeBottom.add(pantsBody);

        // Physical Front Bib
        const bib = new THREE.Mesh(
          new THREE.BoxGeometry(0.42, 0.45, 0.09),
          new THREE.MeshStandardMaterial({ color: 0x457b9d, roughness: 0.6 })
        );
        bib.position.set(0, 0.22, 0.42);
        activeBottom.add(bib);

        // Shoulder straps
        const strapL = new THREE.Mesh(
          new THREE.BoxGeometry(0.065, 0.78, 0.065),
          new THREE.MeshStandardMaterial({ color: 0x457b9d, roughness: 0.6 })
        );
        strapL.position.set(-0.2, 0.38, 0);
        strapL.rotation.x = -0.1;
        
        // Gold buttons
        const buttonL = new THREE.Mesh(
          new THREE.SphereGeometry(0.038, 8, 8),
          new THREE.MeshStandardMaterial({ color: 0xffd166, roughness: 0.1, metalness: 0.8 })
        );
        buttonL.position.set(0, -0.22, 0.045);
        strapL.add(buttonL);

        const strapR = strapL.clone();
        strapR.position.x = 0.2;
        activeBottom.add(strapL, strapR);

        // Pocket stitching detail
        const pocket = new THREE.Mesh(
          new THREE.BoxGeometry(0.22, 0.18, 0.02),
          new THREE.MeshStandardMaterial({ color: 0xa8dadc, roughness: 0.6 })
        );
        pocket.position.set(0, 0.16, 0.48);
        activeBottom.add(pocket);
      } else if (bottom === "jeans") {
        // Detailed Mom Jeans
        const jLegL = new THREE.Mesh(
          new THREE.CylinderGeometry(0.2, 0.16, 1.05, 16),
          new THREE.MeshStandardMaterial({ color: 0x457b9d, roughness: 0.6 })
        );
        jLegL.position.set(-0.2, -0.65, 0);
        
        // Jeans bottom cuff cuffs fold
        const jCuffL = new THREE.Mesh(
          new THREE.TorusGeometry(0.18, 0.04, 8, 16),
          new THREE.MeshStandardMaterial({ color: 0xa8dadc, roughness: 0.6 })
        );
        jCuffL.position.set(0, -0.48, 0);
        jCuffL.rotation.x = Math.PI / 2;
        jLegL.add(jCuffL);

        const jLegR = jLegL.clone();
        jLegR.position.x = 0.2;
        
        const jeansTop = new THREE.Mesh(
          new THREE.CylinderGeometry(0.46, 0.46, 0.45, 16),
          new THREE.MeshStandardMaterial({ color: 0x457b9d, roughness: 0.6 })
        );
        jeansTop.position.y = -0.18;
        activeBottom.add(jLegL, jLegR, jeansTop);

        // Brown belt detail
        const belt = new THREE.Mesh(
          new THREE.TorusGeometry(0.48, 0.045, 8, 24),
          new THREE.MeshStandardMaterial({ color: 0x6c584c, roughness: 0.6 })
        );
        belt.position.y = 0.04;
        belt.rotation.x = Math.PI / 2;
        activeBottom.add(belt);
      } else if (bottom === "shorts") {
        // Cute Ruffled Shorts
        const sTop = new THREE.Mesh(
          new THREE.CylinderGeometry(0.46, 0.46, 0.38, 16),
          new THREE.MeshStandardMaterial({ color: 0xe9c46a, roughness: 0.6 })
        );
        sTop.position.y = -0.16;

        const sLegL = new THREE.Mesh(
          new THREE.CylinderGeometry(0.2, 0.22, 0.32, 16),
          new THREE.MeshStandardMaterial({ color: 0xe9c46a, roughness: 0.6 })
        );
        sLegL.position.set(-0.18, -0.4, 0);
        
        // White physical cuffed ruffle wrap
        const ruffL = new THREE.Mesh(
          new THREE.TorusGeometry(0.22, 0.04, 8, 16),
          new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.7 })
        );
        ruffL.rotation.x = Math.PI / 2;
        ruffL.position.set(0, -0.15, 0);
        sLegL.add(ruffL);

        const sLegR = sLegL.clone();
        sLegR.position.x = 0.18;

        activeBottom.add(sTop, sLegL, sLegR);
      }

      // --- 3D ACCESSORIES GEOMETRIES ---
      activeAcc = new THREE.Group();
      dollGroup.add(activeAcc);

      if (acc === "clips") {
        // Hijab Pin — Beautiful decorative gold/pearl hijab pin
        const pinShaft = new THREE.Mesh(
          new THREE.CylinderGeometry(0.012, 0.012, 0.35, 8),
          new THREE.MeshStandardMaterial({ color: 0xd4af37, roughness: 0.15, metalness: 0.8 })
        );
        pinShaft.position.set(-0.85, 2.0, 0.7);
        pinShaft.rotation.z = -Math.PI / 4;

        const pinHead = new THREE.Mesh(
          new THREE.SphereGeometry(0.06, 12, 12),
          new THREE.MeshStandardMaterial({ color: 0xfff8f0, roughness: 0.15, metalness: 0.3 })
        );
        pinHead.position.y = 0.18;
        pinShaft.add(pinHead);

        // Second pin
        const pinShaft2 = pinShaft.clone();
        pinShaft2.position.set(-0.65, 1.85, 0.85);
        pinShaft2.rotation.z = -Math.PI / 3;

        activeAcc.add(pinShaft, pinShaft2);
      } else if (acc === "ears") {
        // Misbaha (Prayer Beads) — Beautiful beaded chain held in hand
        const misbahaGroup = new THREE.Group();
        const beadCount = 12;
        for (let i = 0; i < beadCount; i++) {
          const angle = (i / beadCount) * Math.PI * 1.5;
          const radius = 0.28;
          const bead = new THREE.Mesh(
            new THREE.SphereGeometry(0.04, 8, 8),
            new THREE.MeshStandardMaterial({ color: i % 3 === 0 ? 0xd4af37 : 0x6c584c, roughness: 0.3, metalness: i % 3 === 0 ? 0.7 : 0.1 })
          );
          bead.position.set(Math.cos(angle) * radius, Math.sin(angle) * radius, 0);
          misbahaGroup.add(bead);
        }
        // Tassel
        const tassel = new THREE.Mesh(
          new THREE.CylinderGeometry(0.015, 0.04, 0.18, 8),
          new THREE.MeshStandardMaterial({ color: 0x2d6a4f, roughness: 0.6 })
        );
        tassel.position.set(0.28, -0.08, 0);
        misbahaGroup.add(tassel);

        misbahaGroup.position.set(0.78, -0.12, 0.32);
        misbahaGroup.rotation.x = Math.PI / 6;
        activeAcc.add(misbahaGroup);
      } else if (acc === "headphones") {
        // Arabic Coffee (Dallah finjan) — Tiny gold/copper Arabic coffee cup
        const finjanGroup = new THREE.Group();
        const cup = new THREE.Mesh(
          new THREE.CylinderGeometry(0.05, 0.08, 0.12, 12),
          new THREE.MeshStandardMaterial({ color: 0xd4af37, roughness: 0.2, metalness: 0.7 })
        );
        const saucer = new THREE.Mesh(
          new THREE.CylinderGeometry(0.12, 0.12, 0.02, 16),
          new THREE.MeshStandardMaterial({ color: 0xd4af37, roughness: 0.2, metalness: 0.7 })
        );
        saucer.position.y = -0.06;

        // Coffee liquid inside
        const coffee = new THREE.Mesh(
          new THREE.CircleGeometry(0.048, 12),
          new THREE.MeshStandardMaterial({ color: 0x3e2723, roughness: 0.8 })
        );
        coffee.position.y = 0.06;
        coffee.rotation.x = -Math.PI / 2;
        cup.add(coffee);

        // Steam wisps
        const steam = new THREE.Mesh(
          new THREE.CylinderGeometry(0.008, 0.003, 0.12, 4),
          new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.4 })
        );
        steam.position.set(0, 0.12, 0);
        cup.add(steam);

        finjanGroup.add(cup, saucer);
        finjanGroup.position.set(0.82, -0.15, 0.32);
        activeAcc.add(finjanGroup);
      } else if (acc === "milk") {
        // Henna Hand — Beautiful henna/mehndi patterns on the hand/arm area
        const hennaGroup = new THREE.Group();

        // Henna dots spiral pattern on arm
        const hennaColors = [0x8B4513, 0x6b3a2a, 0x7a4a2a];
        const dotPositions = [
          { x: -0.58, y: 0.1, z: 0.08 },
          { x: -0.56, y: 0.0, z: 0.09 },
          { x: -0.60, y: -0.1, z: 0.08 },
          { x: -0.57, y: -0.2, z: 0.09 },
          { x: -0.55, y: 0.2, z: 0.08 },
          { x: -0.59, y: -0.3, z: 0.09 },
        ];
        dotPositions.forEach((pos, i) => {
          const dot = new THREE.Mesh(
            new THREE.SphereGeometry(0.018, 6, 6),
            new THREE.MeshStandardMaterial({ color: hennaColors[i % 3], roughness: 0.8 })
          );
          dot.position.set(pos.x, pos.y, pos.z);
          hennaGroup.add(dot);
        });

        // Flower pattern center
        const hennaFlower = new THREE.Mesh(
          new THREE.TorusGeometry(0.035, 0.01, 6, 8),
          new THREE.MeshStandardMaterial({ color: 0x8B4513, roughness: 0.7 })
        );
        hennaFlower.position.set(-0.58, -0.05, 0.1);
        hennaFlower.rotation.y = Math.PI / 4;
        hennaGroup.add(hennaFlower);

        activeAcc.add(hennaGroup);
      }

      // --- COSMETIC SKINS INTEGRATION ---
      if (equippedSkin === "wings") {
        activeSkinWings = new THREE.Group();
        const wingL = new THREE.Mesh(
          new THREE.ConeGeometry(0.5, 1.5, 4),
          new THREE.MeshStandardMaterial({ color: 0xffffff, transparent: true, opacity: 0.8, roughness: 0.3 })
        );
        wingL.rotation.z = Math.PI / 3;
        wingL.rotation.y = -Math.PI / 6;
        wingL.position.set(-0.8, 0.4, -0.5);

        const wingR = wingL.clone();
        wingR.rotation.z = -Math.PI / 3;
        wingR.rotation.y = Math.PI / 6;
        wingR.position.x = 0.8;

        activeSkinWings.add(wingL, wingR);
        dollGroup.add(activeSkinWings);
      }

      if (equippedSkin === "hat") {
        activeSkinHat = new THREE.Group();
        const hatBase = new THREE.Mesh(
          new THREE.CylinderGeometry(0.9, 0.9, 0.06, 24),
          new THREE.MeshStandardMaterial({ color: 0x6c584c, roughness: 0.6 })
        );
        const hatCap = new THREE.Mesh(
          new THREE.CylinderGeometry(0.7, 0.8, 0.48, 24),
          new THREE.MeshStandardMaterial({ color: 0x6c584c, roughness: 0.6 })
        );
        hatCap.position.y = 0.24;
        activeSkinHat.add(hatBase, hatCap);

        activeSkinHat.position.set(0, 2.75, 0.1);
        activeSkinHat.rotation.x = -Math.PI / 15;
        dollGroup.add(activeSkinHat);
      }

      // Enable high-fidelity soft self-shadowing on all meshes dynamically
      enableShadows(dollGroup);
    };

    // Rebuild standard initial wardrobe
    updateWardrobe();

    // 6. Cute Idle Swaying and Breathing Animation Loop
    let animId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      // Soft idle breathe
      dollGroup.position.y = 0.22 + Math.sin(elapsed * 2.1) * 0.055;
      headMesh.rotation.z = Math.sin(elapsed * 1.6) * 0.026;
      
      // Swaying cute slender arms wiggles
      armL.rotation.z = Math.PI / 10 + Math.sin(elapsed * 2.1) * 0.035;
      armR.rotation.z = -Math.PI / 10 - Math.sin(elapsed * 2.1) * 0.035;

      renderer.render(scene, camera);
    };
    animate();

    // Bind rebuilder handle to standard canvas ref
    (canvasRef as any).current.rebuildDoll = () => {
      updateWardrobe();
    };

    // Responsive window resize listener
    const handleResize = () => {
      if (!canvasRef.current || !renderer || !camera) return;
      const p = canvasRef.current.parentElement;
      if (!p) return;
      const w = p.clientWidth;
      const h = p.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", handleResize);

    // 7. Context cleanups
    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animId);
      renderer.dispose();
    };
  }, [isMounted, activeTab]);

  // Sync drag rotation directly with standard Three.js group
  useEffect(() => {
    if (dollGroupRef.current) {
      dollGroupRef.current.rotation.y = THREE.MathUtils.degToRad(rotationY);
    }
  }, [rotationY]);

  // Rapid wardrobe mesh rebuilder hook (prevents screen flashes)
  useEffect(() => {
    if (canvasRef.current && (canvasRef.current as any).rebuildDoll) {
      (canvasRef.current as any).rebuildDoll();
    }
  }, [hair, top, bottom, acc, equippedSkin]);

  // --- TAMAGOTCHI INTERACTION HANDLERS ---
  const handlePetBunny = () => {
    if (bunnyState === "sleeping") return;
    playSynthSound("pet");
    setBunnyState("petting");
    setLove((prev) => Math.min(100, prev + 15));
    setEnergy((prev) => Math.max(10, prev - 5));
    gainXp(12);
    triggerEmitter("❤️");
    triggerEmitter("💖");
    setTimeout(() => setBunnyState("idle"), 2000);
  };

  const handleFeedFromBackpack = (itemId: string) => {
    const item = BOUTIQUE_ITEMS.find((i) => i.id === itemId);
    if (!item || bunnyState === "sleeping") return;
    
    const idx = bunnyInventory.indexOf(itemId);
    if (idx === -1) return;
    const newInv = [...bunnyInventory];
    newInv.splice(idx, 1);
    saveInventory(newInv);

    playSynthSound("feed");
    setBunnyState("eating");
    setEnergy((prev) => Math.min(100, prev + (item.value || 15)));
    setLove((prev) => Math.min(100, prev + 8));
    gainXp(20);
    triggerEmitter("🍰");
    triggerEmitter("🥕");
    setTimeout(() => setBunnyState("idle"), 2000);
  };

  const handleToggleSleep = () => {
    if (bunnyState === "sleeping") {
      playSynthSound("click");
      setBunnyState("idle");
      setEnergy((prev) => Math.max(20, prev - 10));
    } else {
      playSynthSound("sleep");
      setBunnyState("sleeping");
      setEnergy((prev) => Math.min(100, prev + 35));
      setLove((prev) => Math.min(100, prev + 10));
      triggerEmitter("💤");
    }
  };

  // --- ARCADE BALLOON MINI GAME ---
  const [arcadeStatus, setArcadeStatus] = useState<"idle" | "playing" | "gameover">("idle");
  const [arcadeScore, setArcadeScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [arcadeBalloons, setArcadeBalloons] = useState<{ id: number; x: number; y: number; type: "normal" | "gold" | "bomb"; color: string }[]>([]);

  const handleStartArcade = () => {
    if (bunnyState === "sleeping") return;
    playSynthSound("click");
    setBunnyState("playing");
    setArcadeStatus("playing");
    setArcadeScore(0);
    setTimeLeft(30);
    setArcadeBalloons([]);
  };

  useEffect(() => {
    if (arcadeStatus !== "playing") return;
    
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setArcadeStatus("gameover");
          playSynthSound("win");
          const earnings = Math.floor(arcadeScore / 1.5) + 10;
          saveCoins(carrotCoins + earnings);
          gainXp(30);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [arcadeStatus, arcadeScore]);

  useEffect(() => {
    if (arcadeStatus !== "playing") return;

    const spawner = setInterval(() => {
      const colors = ["#ff758f", "#ff8fa3", "#a8dadc", "#f4a261", "#c8b6ff"];
      const randType = Math.random();
      const type = randType > 0.85 ? "gold" : randType > 0.65 ? "bomb" : "normal";
      
      const newBalloon = {
        id: Date.now() + Math.random(),
        x: 10 + Math.random() * 80,
        y: -30,
        type: type as "normal" | "gold" | "bomb",
        color: type === "gold" ? "#ffd700" : type === "bomb" ? "#343a40" : colors[Math.floor(Math.random() * colors.length)]
      };
      
      setArcadeBalloons((prev) => [...prev.slice(-10), newBalloon]);
    }, 1000);

    return () => clearInterval(spawner);
  }, [arcadeStatus]);

  const handlePopArcadeBalloon = (id: number, type: "normal" | "gold" | "bomb") => {
    playSynthSound("pop");
    setArcadeBalloons((prev) => prev.filter((b) => b.id !== id));
    
    if (type === "normal") {
      setArcadeScore((prev) => prev + 15);
      triggerEmitter("🎈");
    } else if (type === "gold") {
      setArcadeScore((prev) => prev + 40);
      triggerEmitter("🌟");
    } else if (type === "bomb") {
      playSynthSound("fail");
      setTimeLeft((prev) => Math.max(0, prev - 5));
      triggerEmitter("💥");
    }
  };

  const handleCloseArcade = () => {
    playSynthSound("click");
    setArcadeStatus("idle");
    setBunnyState("idle");
  };

  const handleBuyItem = (itemId: string) => {
    const item = BOUTIQUE_ITEMS.find((i) => i.id === itemId);
    if (!item) return;

    if (carrotCoins < item.cost) {
      playSynthSound("fail");
      triggerEmitter("❌ Not enough coins!");
      return;
    }

    playSynthSound("buy");
    saveCoins(carrotCoins - item.cost);
    triggerEmitter("🛍️ Unlocked!");

    if (item.type === "food") {
      saveInventory([...bunnyInventory, itemId]);
    } else if (item.type === "decor") {
      if (!activeBgDecor.includes(item.bgElement || "")) {
        setActiveBgDecor([...activeBgDecor, item.bgElement || ""]);
      }
    } else if (item.type === "cosmetic") {
      setEquippedSkin(item.skin || "none");
    }
  };

  const handleRunwayShow = () => {
    playSynthSound("click");
    setRunwayPhase("walking");
    
    setTimeout(() => {
      const activeChallenge = FASHION_CHALLENGES.find((c) => c.id === activeChallengeId);
      if (!activeChallenge) return;

      let scorePoints = 1;
      if (activeChallenge.targets.tops.includes(top)) scorePoints += 1.5;
      if (activeChallenge.targets.bottoms.includes(bottom)) scorePoints += 1.5;
      if (activeChallenge.targets.bg.includes(bg)) scorePoints += 1.0;

      const roundedStars = Math.min(5, Math.ceil(scorePoints));
      setStarsAwarded(roundedStars);

      let feedbackComments = [];
      if (roundedStars >= 4) {
        playSynthSound("win");
        feedbackComments = [
          { name: "Hana 🎀", text: lang === "ar" ? "يا إلهي! التنسيق فائق اللطافة! 10/10 😍" : "Oh my gosh! This outfit coordinates beautifully! 10/10! 😍", avatar: "🎀" },
          { name: "Layla 🎧", text: lang === "ar" ? "ستايل رهيب ومتناسق تماماً مع التحدي. أبدعتِ!" : "Such a vibe! Perfect match for standard theme challenges! ✨", avatar: "🎧" },
          { name: "Jasmine 🍬", text: lang === "ar" ? "أحببت الإكسسوارات والشعر! مذهل تماماً 💖" : "I'm in love with this color palette! Perfect styling! 💖", avatar: "🍬" }
        ];
        saveCoins(carrotCoins + 60);
      } else if (roundedStars >= 3) {
        playSynthSound("win");
        feedbackComments = [
          { name: "Hana 🎀", text: lang === "ar" ? "جميل جداً ولطيف! يمكن تعديل البلوزة لإطلالة أقوى." : "Super adorable! Maybe swap standard top to fit standard vibes better? 💕", avatar: "🎀" },
          { name: "Layla 🎧", text: lang === "ar" ? "مظهر دافئ وجميل ومقارب للمطلوب." : "Pretty nice! You got standard aesthetic style down, cutie! ⭐", avatar: "🎧" },
          { name: "Jasmine 🍬", text: lang === "ar" ? "إطلالة جيدة. جربي تغيير الخلفية لتناسب الجو العام 🌸" : "Nice try! Swap standard backdrop next time for extra points! 🌸", avatar: "🍬" }
        ];
        saveCoins(carrotCoins + 30);
      } else {
        playSynthSound("fail");
        feedbackComments = [
          { name: "Hana 🎀", text: lang === "ar" ? "همم... الإطلالة بعيدة قليلاً عن فكرة التحدي. جربي مجدداً!" : "Hmm, not quite standard vibe we were searching for. Try again! 🥺", avatar: "🎀" },
          { name: "Layla 🎧", text: lang === "ar" ? "التنسيق يحتاج لمسات إضافية. تصفحي الخزانة." : "Needs a bit more coordinate sync! Keep styling, doll! 👚", avatar: "🎧" },
          { name: "Jasmine 🍬", text: lang === "ar" ? "لعبة ألوان جيدة، لكنها لا تناسب هذا التحدي الخاص." : "Interesting colors, but doesn't quite fit standard theme targets! 🍬", avatar: "🍬" }
        ];
        saveCoins(carrotCoins + 10);
      }

      setJudgeComments(feedbackComments);
      setRunwayPhase("scored");
    }, 3000);
  };

  const handleSaveToScrapbook = () => {
    if (!scrapbookCaption.trim()) {
      playSynthSound("fail");
      triggerEmitter("❌ Write a caption first!");
      return;
    }

    let capturedImage = "";
    if (canvasRef.current) {
      try {
        capturedImage = canvasRef.current.toDataURL("image/png");
      } catch (e) {
        console.warn("Failed to capture canvas image", e);
      }
    }

    playSynthSound("win");
    const newItem = {
      id: Date.now().toString(),
      hair,
      top,
      bottom,
      acc,
      bg,
      caption: scrapbookCaption,
      image: capturedImage
    };
    const updated = [newItem, ...scrapbook].slice(0, 12);
    setScrapbook(updated);
    localStorage.setItem("gv-doll-scrapbook", JSON.stringify(updated));
    setScrapbookCaption("");
    triggerEmitter("📸 Scrapbook Saved!");
  };

  const handleDeleteScrapbookItem = (id: string) => {
    playSynthSound("click");
    const updated = scrapbook.filter((item) => item.id !== id);
    setScrapbook(updated);
    localStorage.setItem("gv-doll-scrapbook", JSON.stringify(updated));
  };

  const handleResetOutfitAndState = () => {
    setHair("braids");
    setTop("cardigan");
    setBottom("skirt");
    setAcc("none");
    setBg("pink-room");
    setRunwayPhase("idle");
    setRotationY(0);
    playSynthSound("click");
  };

  return (
    <div className="min-h-screen bg-[color:var(--background)] text-[color:var(--mauve)] overflow-x-hidden relative flex flex-col justify-between">
      <Blob className="w-[500px] h-[500px] -top-32 -left-20" color="rgba(255, 117, 143, 0.15)" />
      <Blob className="w-[500px] h-[500px] bottom-20 -right-20" color="rgba(200, 182, 255, 0.15)" />

      <div className="relative z-10 flex-grow flex flex-col justify-start">
        <Header />

        <div className="w-full pt-28 pb-12 px-4 flex-grow flex flex-col items-center">
          
          <div className="text-center max-w-2xl mb-8">
            <motion.h1 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-5xl font-display font-bold text-[color:var(--rose-deep)] flex items-center justify-center gap-2"
            >
              <SparkleMark className="w-8 h-8 text-[color:var(--glow)] sparkle-spin" />
              {t("games.title")}
              <SparkleMark className="w-8 h-8 text-[color:var(--glow)] sparkle-spin" />
            </motion.h1>
            <p className="mt-3 text-sm md:text-base text-[color:var(--mauve)]/85">
              {t("games.subtitle")}
            </p>

            <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-amber-100/90 dark:bg-amber-950/65 rounded-full border border-amber-300 shadow-sm text-sm font-semibold text-amber-800 dark:text-amber-300">
              <Coins className="w-4 h-4 text-amber-500 fill-amber-400" />
              <span>{lang === "ar" ? "عملات الجزر 🪙: " : "Carrot Coins 🪙: "} {carrotCoins}</span>
            </div>

            <div className="mt-8 flex justify-center gap-4 bg-[color:var(--rose-soft)]/40 p-1.5 rounded-full border border-[color:var(--border)] max-w-sm mx-auto shadow-sm">
              <button
                onClick={() => { playSynthSound("click"); setActiveTab("dressup"); }}
                className={`flex-1 py-2.5 rounded-full text-xs font-semibold tracking-wide transition-all ${
                  activeTab === "dressup" 
                    ? "bg-rose-gradient text-white shadow-soft" 
                    : "text-[color:var(--mauve)]/70 hover:text-[color:var(--rose-deep)]"
                }`}
              >
                👗 {lang === "ar" ? "ستوديو التلبيس 3D" : "3D Doll Studio"}
              </button>
              <button
                onClick={() => { playSynthSound("click"); setActiveTab("tamagotchi"); }}
                className={`flex-1 py-2.5 rounded-full text-xs font-semibold tracking-wide transition-all ${
                  activeTab === "tamagotchi" 
                    ? "bg-rose-gradient text-white shadow-soft" 
                    : "text-[color:var(--mauve)]/70 hover:text-[color:var(--rose-deep)]"
                }`}
              >
                🐰 {lang === "ar" ? "الأرنوب كوكو" : "Bunny Tamagotchi"}
              </button>
            </div>
          </div>

          <div className="w-full max-w-5xl flex justify-center">
            <AnimatePresence mode="wait">
              {activeTab === "dressup" ? (
                // --- DESIGN LAB 1: INTERACTIVE 3D DOLL DRESS-UP STUDIO ---
                <motion.div
                  key="dressup"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 100 }}
                  className="w-full grid lg:grid-cols-[1.1fr_1.3fr] gap-8 bg-white/70 dark:bg-zinc-950/70 p-6 md:p-8 rounded-[36px] border border-[color:var(--border)] backdrop-blur shadow-glow"
                >
                  {/* Doll Frame Canvas (Left Pane) */}
                  <div className="relative flex flex-col items-center">
                    <div className="w-full justify-between flex items-center mb-3 text-xs text-[color:var(--mauve)]/70 font-semibold px-2">
                      <span className="flex items-center gap-1">🌸 3D VIEWPORT (Drag to Rotate!) 🌸</span>
                      <button 
                        onClick={handleResetOutfitAndState}
                        className="flex items-center gap-1 text-[color:var(--rose-deep)] hover:scale-105 active:scale-95 transition bg-[color:var(--rose-soft)]/50 px-2 py-1 rounded-md"
                      >
                        <RefreshCw className="w-3 h-3" />
                        {lang === "ar" ? "إعادة تعيين" : "Reset"}
                      </button>
                    </div>

                    {/* 3D Render Canvas Screen Box */}
                    <div 
                      onPointerDown={handlePointerDown}
                      onPointerMove={handlePointerMove}
                      onPointerUp={handlePointerUp}
                      onPointerLeave={handlePointerUp}
                      className="relative w-full h-[450px] rounded-3xl border-2 border-[color:var(--rose-deep)] shadow-inner flex flex-col items-center justify-center cursor-grab active:cursor-grabbing transition-all duration-300"
                      style={{ perspective: "1000px" }}
                    >
                      {/* Background clipped layer */}
                      <div className={`absolute inset-0 rounded-[22px] overflow-hidden pointer-events-none z-0 ${BG_OPTIONS.find((o) => o.id === bg)?.bgClass}`}>
                        <div className="absolute inset-0 bg-white/5 opacity-40" />
                      </div>

                      {/* Drag Hint overlay */}
                      <div className="absolute top-2 inset-x-0 text-center pointer-events-none select-none z-20 text-[9px] uppercase tracking-wider font-bold opacity-60">
                        {lang === "ar" ? "اسحبي الماوس لتدوير الدمية 360 درجة 🔄" : "Drag mouse/touch to spin 3D doll 360° 🔄"}
                      </div>

                      <AnimatePresence>
                        {runwayPhase === "walking" && (
                          <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 z-30 bg-rose-950/80 backdrop-blur-xs flex flex-col items-center justify-center p-6 text-white text-center"
                          >
                            <motion.div
                              animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }}
                              transition={{ duration: 1.5, repeat: Infinity }}
                              className="text-4xl mb-4"
                            >
                              📸 ✨ 👑
                            </motion.div>
                            <h3 className="text-xl font-bold font-display tracking-widest animate-pulse">
                              {lang === "ar" ? "يسير على الممر... 💃✨" : "WALKING THE RUNWAY... 💃✨"}
                            </h3>
                            <p className="text-xs opacity-80 mt-2">
                              {lang === "ar" ? "المصورون يلتقطون الصور! استعدي للتقييم..." : "Camera flashes are popping! Preparing judge scorecard..."}
                            </p>
                            <div className="w-48 h-1.5 bg-white/20 rounded-full overflow-hidden mt-4">
                              <motion.div 
                                className="h-full bg-rose-400"
                                initial={{ width: "0%" }}
                                animate={{ width: "100%" }}
                                transition={{ duration: 3 }}
                              />
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {/* --- HIGH-QUALITY REAL-TIME 3D CHIBI-DOLL WEBGL CANVAS --- */}
                      {isMounted && (
                        <canvas 
                          ref={canvasRef} 
                          className="absolute inset-0 z-10 w-full h-full pointer-events-none"
                        />
                      )}
                    </div>
                  </div>

                  {/* Wardrobe drawers & challenges (Right Pane) */}
                  <div className="flex flex-col gap-6">
                    {/* Active Runway Judgement Scorecard Overlays */}
                    {runwayPhase === "scored" && (
                      <motion.div 
                        initial={{ opacity: 0, y: 15 }} 
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-rose-50 dark:bg-pink-950/40 p-5 rounded-[24px] border border-rose-200"
                      >
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="font-display font-bold text-[color:var(--rose-deep)] text-sm flex items-center gap-1">
                            <Award className="w-4 h-4" />
                            {lang === "ar" ? "مجموع درجات ممر الأزياء" : "FASHION SHOW SCORECARD"}
                          </h4>
                          <div className="flex text-amber-400 gap-0.5">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star key={i} className={`w-4.5 h-4.5 ${i < starsAwarded ? "fill-amber-400" : "opacity-35"}`} />
                            ))}
                          </div>
                        </div>

                        {/* Judges list */}
                        <div className="space-y-3">
                          {judgeComments.map((jc, i) => (
                            <div key={i} className="flex gap-2.5 items-start text-xs border-b border-rose-100/50 pb-2 last:border-0 last:pb-0">
                              <span className="text-lg bg-rose-200/50 w-7 h-7 rounded-full flex items-center justify-center">{jc.avatar}</span>
                              <div className="flex-1">
                                <span className="font-bold text-[color:var(--rose-deep)]">{jc.name}</span>
                                <p className="text-[color:var(--mauve)]/85 mt-0.5 leading-relaxed italic">"{jc.text}"</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}

                    {/* Challenges panel drawer */}
                    <div className="p-4 bg-[color:var(--rose-soft)]/50 rounded-2xl border border-[color:var(--border)]">
                      <span className="text-xs font-bold text-[color:var(--rose-deep)] uppercase tracking-wider block mb-2">
                        🏆 Active Fashion Runway Challenge:
                      </span>
                      <div className="flex flex-col gap-2">
                        {FASHION_CHALLENGES.map((ch) => (
                          <button
                            key={ch.id}
                            onClick={() => { playSynthSound("click"); setActiveChallengeId(ch.id); setRunwayPhase("idle"); }}
                            className={`p-3 rounded-xl border text-start transition-all cursor-pointer ${
                              activeChallengeId === ch.id 
                                ? "bg-white border-[color:var(--rose-deep)] shadow-sm font-semibold" 
                                : "bg-transparent hover:bg-white/40 border-transparent"
                            }`}
                          >
                            <div className="text-xs font-bold text-[color:var(--rose-deep)]">{lang === "ar" ? ch.titleAr : ch.titleEn}</div>
                            <div className="text-[10px] text-[color:var(--mauve)]/70 mt-1">{lang === "ar" ? ch.descAr : ch.descEn}</div>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-4">
                      {/* Wardrobe selectors */}
                      <div>
                        <span className="text-xs font-bold text-[color:var(--rose-deep)] uppercase tracking-wider block mb-2">
                          {t("games.dressup.hair")}
                        </span>
                        <div className="flex flex-wrap gap-2">
                          {HAIR_OPTIONS.map((item) => (
                            <button
                              key={item.id}
                              onClick={() => { playSynthSound("click"); setHair(item.id); }}
                              className={`px-3 py-2 rounded-xl text-xs font-medium border transition-all cursor-pointer ${
                                hair === item.id 
                                  ? "bg-[color:var(--rose-soft)] border-[color:var(--rose-deep)] text-[color:var(--rose-deep)] scale-[1.03] shadow-sm font-semibold" 
                                  : "bg-white/40 hover:bg-white/80 border-[color:var(--border)]"
                              }`}
                            >
                              {lang === "ar" ? item.labelAr : item.labelEn}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <span className="text-xs font-bold text-[color:var(--rose-deep)] uppercase tracking-wider block mb-2">
                          {t("games.dressup.tops")}
                        </span>
                        <div className="flex flex-wrap gap-2">
                          {TOP_OPTIONS.map((item) => (
                            <button
                              key={item.id}
                              onClick={() => { playSynthSound("click"); setTop(item.id); }}
                              className={`px-3 py-2 rounded-xl text-xs font-medium border transition-all cursor-pointer ${
                                top === item.id 
                                  ? "bg-[color:var(--rose-soft)] border-[color:var(--rose-deep)] text-[color:var(--rose-deep)] scale-[1.03] shadow-sm font-semibold" 
                                  : "bg-white/40 hover:bg-white/80 border-[color:var(--border)]"
                              }`}
                            >
                              {lang === "ar" ? item.labelAr : item.labelEn}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <span className="text-xs font-bold text-[color:var(--rose-deep)] uppercase tracking-wider block mb-2">
                          {t("games.dressup.bottoms")}
                        </span>
                        <div className="flex flex-wrap gap-2">
                          {BOTTOM_OPTIONS.map((item) => (
                            <button
                              key={item.id}
                              onClick={() => { playSynthSound("click"); setBottom(item.id); }}
                              className={`px-3 py-2 rounded-xl text-xs font-medium border transition-all cursor-pointer ${
                                bottom === item.id 
                                  ? "bg-[color:var(--rose-soft)] border-[color:var(--rose-deep)] text-[color:var(--rose-deep)] scale-[1.03] shadow-sm font-semibold" 
                                  : "bg-white/40 hover:bg-white/80 border-[color:var(--border)]"
                              }`}
                            >
                              {lang === "ar" ? item.labelAr : item.labelEn}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <span className="text-xs font-bold text-[color:var(--rose-deep)] uppercase tracking-wider block mb-2">
                          {t("games.dressup.acc")}
                        </span>
                        <div className="flex flex-wrap gap-2">
                          {ACC_OPTIONS.map((item) => (
                            <button
                              key={item.id}
                              onClick={() => { playSynthSound("click"); setAcc(item.id); }}
                              className={`px-3 py-2 rounded-xl text-xs font-medium border transition-all cursor-pointer ${
                                acc === item.id 
                                  ? "bg-[color:var(--rose-soft)] border-[color:var(--rose-deep)] text-[color:var(--rose-deep)] scale-[1.03] shadow-sm font-semibold" 
                                  : "bg-white/40 hover:bg-white/80 border-[color:var(--border)]"
                              }`}
                            >
                              {lang === "ar" ? item.labelAr : item.labelEn}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <span className="text-xs font-bold text-[color:var(--rose-deep)] uppercase tracking-wider block mb-2">
                          {t("games.dressup.bg")}
                        </span>
                        <div className="flex flex-wrap gap-2">
                          {BG_OPTIONS.map((item) => (
                            <button
                              key={item.id}
                              onClick={() => { playSynthSound("click"); setBg(item.id); }}
                              className={`px-3 py-2 rounded-xl text-xs font-medium border transition-all cursor-pointer ${
                                bg === item.id 
                                  ? "bg-[color:var(--rose-soft)] border-[color:var(--rose-deep)] text-[color:var(--rose-deep)] scale-[1.03] shadow-sm font-semibold" 
                                  : "bg-white/40 hover:bg-white/80 border-[color:var(--border)]"
                              }`}
                            >
                              {lang === "ar" ? item.labelAr : item.labelEn}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Submit & Capture Buttons */}
                    <div className="w-full mt-4 flex flex-col gap-3">
                      <button
                        onClick={handleRunwayShow}
                        className="w-full py-3 rounded-2xl bg-rose-gradient text-white font-bold text-sm hover:scale-[1.03] transition flex items-center justify-center gap-1.5 shadow-md cursor-pointer"
                      >
                        <Camera className="w-4 h-4" />
                        {lang === "ar" ? "عرض ممر الأزياء 3D! 💃✨" : "Submit to 3D Runway! 💃✨"}
                      </button>

                      <div className="flex gap-2 p-3 bg-white/40 dark:bg-black/35 rounded-2xl border border-[color:var(--border)]">
                        <input 
                          type="text"
                          value={scrapbookCaption}
                          onChange={(e) => setScrapbookCaption(e.target.value)}
                          placeholder={lang === "ar" ? "اكتبي تعليقاً لحفظ الصورة... 📸" : "Write standard Polaroid caption... 📸"}
                          className="flex-1 bg-transparent border-none text-xs outline-none text-[color:var(--mauve)] placeholder-[color:var(--mauve)]/55 px-1"
                        />
                        <button
                          onClick={handleSaveToScrapbook}
                          className="px-4 py-2 rounded-xl bg-white border border-[color:var(--border)] font-semibold text-xs text-[color:var(--rose-deep)] shadow-xs active:scale-95 transition-transform cursor-pointer"
                        >
                          {lang === "ar" ? "حفظ" : "Save"}
                        </button>
                      </div>
                    </div>

                    {/* Saved Polaroid Scrapbook Gallery list */}
                    {scrapbook.length > 0 && (
                      <div className="mt-6 border-t border-[color:var(--border)] pt-6">
                        <span className="text-xs font-bold text-[color:var(--rose-deep)] uppercase tracking-wider block mb-3 flex items-center gap-1">
                          <BookOpen className="w-3.5 h-3.5" />
                          {lang === "ar" ? "دفتر ذكرياتي الملصق 📓" : "Doll Scrapbook 📓"}
                        </span>
                        <div className="grid grid-cols-2 gap-4">
                          {scrapbook.map((item) => (
                            <div key={item.id} className="relative bg-white dark:bg-zinc-900 p-2.5 pb-6 border shadow-md rotate-[-2deg] flex flex-col items-center justify-start hover:rotate-0 transition-transform">
                              <button 
                                onClick={() => handleDeleteScrapbookItem(item.id)}
                                className="absolute top-1 right-1 w-4 h-4 bg-rose-500 rounded-full text-[8px] font-bold text-white flex items-center justify-center cursor-pointer z-20"
                              >
                                ×
                              </button>
                              <div className="w-full aspect-[4/5] bg-slate-50 rounded-md overflow-hidden border border-slate-200 pointer-events-none mb-2">
                                {item.image ? (
                                  <img src={item.image} className="w-full h-full object-cover" />
                                ) : (
                                  <svg viewBox="0 0 200 320" className="w-full h-full bg-slate-200">
                                    <circle cx="100" cy="80" r="30" fill="#ffdcd3" />
                                    <path d="M 72 122 Q 100 200 128 122 Z" fill="#ffb3c1" />
                                    {item.hair === "braids" && <circle cx="100" cy="80" r="18" fill="#c8b6ff" />}
                                    {item.hair === "waves" && <circle cx="100" cy="80" r="18" fill="#ff758f" />}
                                    {item.hair === "buns" && <circle cx="100" cy="80" r="18" fill="#80ed99" />}
                                    {item.hair === "bob" && <circle cx="100" cy="80" r="18" fill="#e9c46a" />}
                                    {item.top === "cardigan" && <rect x="75" y="122" width="50" height="25" fill="#ff758f" />}
                                    {item.top === "strawberry" && <rect x="75" y="122" width="50" height="25" fill="#e63946" />}
                                    {item.top === "hoodie" && <rect x="75" y="122" width="50" height="25" fill="#b892ff" />}
                                    {item.top === "tank" && <rect x="75" y="122" width="50" height="25" fill="#a8dadc" />}
                                  </svg>
                                )}
                              </div>
                              <span className="text-[10px] font-semibold text-center italic text-[color:var(--mauve)] leading-relaxed px-1">"{item.caption}"</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              ) : (
                // --- DESIGN LAB 2: VIRTUAL COCO TAMAGOTCHI PET ---
                <motion.div
                  key="tamagotchi"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 100 }}
                  className="w-full max-w-5xl bg-white/70 dark:bg-zinc-950/70 p-6 md:p-8 rounded-[36px] border border-[color:var(--border)] backdrop-blur shadow-glow grid md:grid-cols-[1.1fr_1.3fr] gap-8 items-start"
                >
                  <div className="flex flex-col items-center w-full">
                    <div className="relative w-full max-w-[340px] bg-gradient-to-b from-rose-200 to-pink-300 dark:from-purple-900 dark:to-pink-950 p-6 rounded-[50px] border-4 border-[color:var(--rose-deep)] shadow-glow flex flex-col items-center">
                      
                      <AnimatePresence>
                        {arcadeStatus === "playing" && (
                          <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 z-30 bg-indigo-950 rounded-[46px] border-4 border-indigo-400 p-4 flex flex-col justify-between items-center text-white"
                          >
                            <div className="w-full flex justify-between text-[10px] font-bold">
                              <span>⏱️ Timer: {timeLeft}s</span>
                              <span className="text-amber-300">⭐ Score: {arcadeScore}</span>
                            </div>

                            <div className="relative w-full flex-grow overflow-hidden bg-slate-900 border-2 border-indigo-300 rounded-2xl mt-2 mb-2 pointer-events-auto">
                              {arcadeBalloons.map((b) => (
                                <motion.button
                                  key={b.id}
                                  onClick={() => handlePopArcadeBalloon(b.id, b.type)}
                                  initial={{ scale: 0, y: 220 }}
                                  animate={{ scale: 1, y: 0 }}
                                  exit={{ scale: 0 }}
                                  className="absolute w-8 h-10 rounded-full flex items-center justify-center font-bold text-sm shadow-md hover:scale-110 active:scale-90 transition-transform cursor-pointer"
                                  style={{ 
                                    left: `${b.x}%`, 
                                    backgroundColor: b.color,
                                    border: "1.5px solid rgba(255,255,255,0.4)"
                                  }}
                                >
                                  {b.type === "gold" ? "🌟" : b.type === "bomb" ? "💣" : "🎈"}
                                </motion.button>
                              ))}
                            </div>

                            <button 
                              onClick={handleCloseArcade}
                              className="w-full py-1.5 bg-rose-500 rounded-xl font-bold text-[10px] uppercase tracking-wider hover:bg-rose-600 transition"
                            >
                              Exit Game
                            </button>
                          </motion.div>
                        )}

                        {arcadeStatus === "gameover" && (
                          <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 z-30 bg-indigo-950 rounded-[46px] border-4 border-indigo-400 p-6 flex flex-col justify-center items-center text-white text-center"
                          >
                            <h3 className="text-xl font-bold text-amber-400">🎉 TIME UP! 🎉</h3>
                            <p className="text-xs mt-2 opacity-80">You popped wonderful balloons!</p>
                            <div className="my-4 text-3xl font-bold text-white tracking-widest">{arcadeScore} PTS</div>
                            <div className="text-[10px] text-emerald-400 font-bold mb-6">
                              Received Reward: +{Math.floor(arcadeScore / 1.5) + 10} Carrot Coins 🪙
                            </div>
                            <button 
                              onClick={handleCloseArcade}
                              className="px-6 py-2 bg-indigo-500 rounded-xl font-bold text-xs uppercase hover:bg-indigo-600 transition"
                            >
                              Awesome!
                            </button>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      <div className="w-full flex justify-between px-2 mb-3 text-[10px] uppercase font-bold text-[color:var(--rose-deep)] dark:text-pink-200">
                        <span>📟 Coco Pet Room v2.0</span>
                        <span className="bg-rose-gradient px-2 py-0.5 rounded-full text-white">
                          Lv.{bunnyLevel} Cozy Kit
                        </span>
                      </div>

                      {/* Console Screen Box */}
                      <div className={`relative w-full h-[240px] rounded-3xl border-2 border-[color:var(--rose-deep)] overflow-hidden shadow-inner flex flex-col items-center justify-between p-3 transition-colors duration-500 ${
                        bunnyState === "sleeping" 
                          ? "bg-slate-950 text-sky-200" 
                          : "bg-gradient-to-b from-sky-100 to-amber-50 dark:from-indigo-950 dark:to-slate-900 text-slate-800 dark:text-white"
                      }`}>
                        
                        {bunnyState !== "sleeping" && activeBgDecor.includes("lights") && (
                          <div className="absolute top-0 inset-x-0 h-4 flex justify-around select-none pointer-events-none z-0">
                            <span className="text-xs animate-pulse">✨</span>
                            <span className="text-xs animate-pulse delay-75">✨</span>
                            <span className="text-xs animate-pulse delay-150">✨</span>
                            <span className="text-xs animate-pulse">✨</span>
                          </div>
                        )}
                        {bunnyState !== "sleeping" && activeBgDecor.includes("rug") && (
                          <div className="absolute bottom-6 w-24 h-4 bg-pink-300 dark:bg-pink-900/60 rounded-full blur-[2px] z-0 select-none pointer-events-none" />
                        )}

                        {/* Floating particles */}
                        {emitters.map((e) => (
                          <motion.span
                            key={e.id}
                            className="absolute z-30 select-none text-xl font-bold"
                            initial={{ opacity: 1, y: e.y, x: `${e.x}%` }}
                            animate={{ opacity: 0, y: e.y - 80, scale: 1.4 }}
                            transition={{ duration: 1.2, ease: "easeOut" }}
                          >
                            {e.char}
                          </motion.span>
                        ))}

                        {/* Stats Dashboard inside screen */}
                        <div className="w-full flex justify-between gap-3 text-[9px] font-semibold bg-white/20 dark:bg-black/25 p-1.5 rounded-xl backdrop-blur-xs relative z-10">
                          <div className="flex-1 flex items-center gap-1">
                            <Heart className="w-3 h-3 text-red-500 fill-red-500" />
                            <div className="flex-grow h-2 bg-black/10 dark:bg-white/10 rounded-full overflow-hidden">
                              <div className="h-full bg-gradient-to-r from-red-400 to-pink-500" style={{ width: `${love}%` }} />
                            </div>
                            <span>{love}</span>
                          </div>
                          <div className="flex-grow-0 w-px bg-black/10" />
                          <div className="flex-1 flex items-center gap-1">
                            <Zap className="w-3 h-3 text-amber-500 fill-amber-500" />
                            <div className="flex-grow h-2 bg-black/10 dark:bg-white/10 rounded-full overflow-hidden">
                              <div className="h-full bg-gradient-to-r from-amber-400 to-orange-500" style={{ width: `${energy}%` }} />
                            </div>
                            <span>{energy}</span>
                          </div>
                        </div>

                        {/* Animated Bunny character */}
                        <div className="relative flex flex-col items-center flex-grow justify-center mt-2 z-10">
                          <motion.div
                            animate={
                              bunnyState === "sleeping" 
                                ? { y: [0, 4, 0] } 
                                : bunnyState === "eating"
                                ? { y: [0, -8, 0, -8, 0] }
                                : bunnyState === "petting"
                                ? { rotate: [-5, 5, -5, 5, 0] }
                                : bunnyState === "playing"
                                ? { y: [0, -15, 0, -15, 0] }
                                : { y: [0, -4, 0] }
                            }
                            transition={{ duration: 1.2, repeat: Infinity }}
                            className="relative flex flex-col items-center"
                          >
                            {equippedSkin === "wings" && (
                              <div className="absolute -left-5 top-5 text-lg">👼</div>
                            )}

                            {bunnyState === "sleeping" ? (
                              <div className="relative w-20 h-16 bg-white rounded-[2.5rem] flex flex-col justify-end items-center pb-2 border-2 border-indigo-300 shadow-sm">
                                <div className="absolute -top-4 left-2 w-4 h-8 bg-white rounded-full rotate-[-45deg] origin-bottom border-l-2 border-t-2 border-indigo-300" />
                                <div className="absolute -top-4 right-2 w-4 h-8 bg-white rounded-full rotate-[45deg] origin-bottom border-r-2 border-t-2 border-indigo-300" />
                                <span className="absolute -top-5 left-8 text-lg">💤</span>
                                <div className="flex gap-4 mt-2">
                                  <span className="text-xs font-bold text-indigo-400">◡</span>
                                  <span className="text-xs font-bold text-indigo-400">◡</span>
                                </div>
                                <div className="w-1.5 h-1 bg-rose-300 rounded-full mt-1" />
                              </div>
                            ) : (
                              <div className="relative w-20 h-20 flex flex-col items-center justify-end">
                                <div className="absolute -top-6 left-2 w-4 h-12 bg-white rounded-full border-2 border-rose-300 origin-bottom" />
                                <div className="absolute -top-6 right-2 w-4 h-12 bg-white rounded-full border-2 border-rose-300 origin-bottom" />
                                
                                {equippedSkin === "hat" && (
                                  <div className="absolute -top-9 w-14 h-4 bg-amber-800 rounded-t-md z-15 border border-amber-950 flex items-center justify-center text-[5px] text-white">DETECTIVE</div>
                                )}

                                <div className="w-20 h-16 bg-white rounded-[2.5rem] border-2 border-rose-300 flex flex-col items-center justify-center relative shadow-sm">
                                  <div className="absolute bottom-4 left-3 w-4 h-2 bg-pink-300/60 rounded-full blur-[1px]" />
                                  <div className="absolute bottom-4 right-3 w-4 h-2 bg-pink-300/60 rounded-full blur-[1px]" />
                                  <div className="flex gap-5 mt-2">
                                    {bunnyState === "petting" ? (
                                      <>
                                        <span className="text-xs font-bold text-rose-500">^</span>
                                        <span className="text-xs font-bold text-rose-500">^</span>
                                      </>
                                    ) : bunnyState === "eating" ? (
                                      <>
                                        <span className="text-xs font-bold text-rose-500">♥</span>
                                        <span className="text-xs font-bold text-rose-500">♥</span>
                                      </>
                                    ) : (
                                      <>
                                        <div className="w-2.5 h-2.5 bg-zinc-800 rounded-full flex items-start justify-start p-0.5">
                                          <div className="w-1 h-1 bg-white rounded-full" />
                                        </div>
                                        <div className="w-2.5 h-2.5 bg-zinc-800 rounded-full flex items-start justify-start p-0.5">
                                          <div className="w-1 h-1 bg-white rounded-full" />
                                        </div>
                                      </>
                                    )}
                                  </div>
                                  <div className="w-1.5 h-1 bg-rose-400 rounded-full mt-1" />
                                  <div className="w-3 h-2 border-b-2 border-rose-300 rounded-b-full" />
                                </div>
                              </div>
                            )}
                          </motion.div>
                        </div>

                        <div className="w-full text-center py-1 bg-white/30 dark:bg-black/30 rounded-xl mt-auto z-10">
                          <p className="text-[10px] font-semibold leading-relaxed">
                            {bunnyState === "idle" && t("games.pet.status.happy")}
                            {bunnyState === "petting" && t("games.pet.status.petting")}
                            {bunnyState === "eating" && t("games.pet.status.eating")}
                            {bunnyState === "playing" && t("games.pet.status.playing")}
                            {bunnyState === "sleeping" && t("games.pet.status.sleeping")}
                          </p>
                        </div>
                      </div>

                      <div className="w-full mt-5 grid grid-cols-2 gap-2 relative z-10">
                        <button
                          onClick={handlePetBunny}
                          disabled={bunnyState === "sleeping"}
                          className="py-2.5 rounded-2xl bg-white dark:bg-zinc-900 border border-[color:var(--border)] font-semibold text-xs text-[color:var(--rose-deep)] shadow-sm hover:scale-[1.03] active:scale-95 transition-transform disabled:opacity-50 cursor-pointer"
                        >
                          👋 {t("games.pet.pet")}
                        </button>
                        <button
                          onClick={handleToggleSleep}
                          className={`py-2.5 rounded-2xl border font-semibold text-xs shadow-sm hover:scale-[1.03] active:scale-95 transition-transform cursor-pointer ${
                            bunnyState === "sleeping" 
                              ? "bg-amber-400 border-amber-500 text-white" 
                              : "bg-white dark:bg-zinc-900 border-[color:var(--border)] text-[color:var(--rose-deep)]"
                          }`}
                        >
                          💤 {bunnyState === "sleeping" ? (lang === "ar" ? "إيقاظ ☀️" : "Wake Up ☀️") : t("games.pet.sleep")}
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-6">
                    <div className="p-4 bg-rose-50 dark:bg-pink-950/20 rounded-2xl border border-rose-100 flex items-center justify-between">
                      <div className="flex-1">
                        <span className="text-xs font-bold text-[color:var(--rose-deep)] block mb-1">
                          🐰 {lang === "ar" ? "تطور كوكو (المستوى" : "Coco's Level Progress (Lvl"} {bunnyLevel}/5):
                        </span>
                        <div className="w-full h-2.5 bg-black/10 dark:bg-white/10 rounded-full overflow-hidden">
                          <motion.div 
                            className="h-full bg-rose-gradient"
                            style={{ width: `${bunnyXp}%` }}
                            animate={{ width: `${bunnyXp}%` }}
                          />
                        </div>
                      </div>
                      <span className="text-[10px] font-bold text-[color:var(--rose-deep)] bg-[color:var(--rose-soft)] px-2.5 py-1 rounded-md ml-3">
                        {bunnyXp}/100 XP
                      </span>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => { playSynthSound("click"); setConsoleMode("room"); }}
                        className={`flex-1 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                          consoleMode === "room" 
                            ? "bg-[color:var(--rose-soft)] border-[color:var(--rose-deep)] text-[color:var(--rose-deep)]" 
                            : "bg-white/40 border-[color:var(--border)] hover:bg-white/80"
                        }`}
                      >
                        🎮 {lang === "ar" ? "غرفة اللعب" : "Play Arcade"}
                      </button>
                      <button
                        onClick={() => { playSynthSound("click"); setConsoleMode("shop"); }}
                        className={`flex-1 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                          consoleMode === "shop" 
                            ? "bg-[color:var(--rose-soft)] border-[color:var(--rose-deep)] text-[color:var(--rose-deep)]" 
                            : "bg-white/40 border-[color:var(--border)] hover:bg-white/80"
                        }`}
                      >
                        🛒 {lang === "ar" ? "بوتيك المتجر" : "Boutique Shop"}
                      </button>
                      <button
                        onClick={() => { playSynthSound("click"); setConsoleMode("backpack"); }}
                        className={`flex-1 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                          consoleMode === "backpack" 
                            ? "bg-[color:var(--rose-soft)] border-[color:var(--rose-deep)] text-[color:var(--rose-deep)]" 
                            : "bg-white/40 border-[color:var(--border)] hover:bg-white/80"
                        }`}
                      >
                        🎒 {lang === "ar" ? "حقيبة المؤن" : "Inventory"}
                      </button>
                    </div>

                    <AnimatePresence mode="wait">
                      {consoleMode === "room" && (
                        <motion.div 
                          key="room" 
                          initial={{ opacity: 0 }} 
                          animate={{ opacity: 1 }} 
                          exit={{ opacity: 0 }}
                          className="p-4 bg-white/40 dark:bg-black/35 rounded-2xl border border-[color:var(--border)]"
                        >
                          <h4 className="text-sm font-bold text-[color:var(--rose-deep)] mb-2">
                            🎈 POP-BALLOONS ARCADE MINI-GAME
                          </h4>
                          <p className="text-xs text-[color:var(--mauve)]/75 leading-relaxed mb-4">
                            {lang === "ar" 
                              ? "افرقعي البالونات الملونة ونجوم الحظ لتكسبي عملات الجزر ونقاط الخبرة لكوكو! احذري القنابل الشوكية 💣!" 
                              : "Pop standard colorful balloons and gold stars to earn Carrot Coins and Coco XP. Watch out for standard spike bombs!"}
                          </p>
                          <button
                            onClick={handleStartArcade}
                            disabled={bunnyState === "sleeping"}
                            className="w-full py-3 rounded-xl bg-rose-gradient text-white font-bold text-xs hover:scale-[1.02] active:scale-98 transition shadow-soft disabled:opacity-50 cursor-pointer"
                          >
                            🕹️ {lang === "ar" ? "ابدأ اللعب الآن!" : "Start Arcade Game!"}
                          </button>
                        </motion.div>
                      )}

                      {consoleMode === "shop" && (
                        <motion.div 
                          key="shop" 
                          initial={{ opacity: 0 }} 
                          animate={{ opacity: 1 }} 
                          exit={{ opacity: 0 }}
                          className="space-y-3"
                        >
                          <span className="text-xs font-bold text-[color:var(--rose-deep)] uppercase tracking-wider block">
                            🛒 COCO'S SWEET BOUTIQUE SHOP:
                          </span>
                          <div className="grid sm:grid-cols-2 gap-3">
                            {BOUTIQUE_ITEMS.map((item) => (
                              <div key={item.id} className="p-3 bg-white/60 dark:bg-zinc-900/60 rounded-xl border border-[color:var(--border)] flex flex-col justify-between gap-2 shadow-xs">
                                <div className="text-xs font-semibold text-[color:var(--rose-deep)]">{lang === "ar" ? item.nameAr : item.nameEn}</div>
                                <div className="text-[10px] text-[color:var(--mauve)]/70">
                                  {item.type === "food" && (lang === "ar" ? `مأكولات (+${item.value} طاقة)` : `Treat (+${item.value} Energy)`)}
                                  {item.type === "decor" && (lang === "ar" ? "ديكور خلفية لوحدة التحكم" : "Decorates Coco's console background")}
                                  {item.type === "cosmetic" && (lang === "ar" ? "لباس جلدي حصري للأرنوب" : "Exclusive cosmetic wear skin")}
                                </div>
                                <button
                                  onClick={() => handleBuyItem(item.id)}
                                  className="w-full py-1.5 rounded-lg bg-amber-100 dark:bg-amber-950/65 border border-amber-300 font-bold text-[10px] text-amber-800 dark:text-amber-300 hover:scale-[1.02] active:scale-95 transition-transform cursor-pointer"
                                >
                                  Buy for {item.cost} 🪙
                                </button>
                              </div>
                            ))}
                          </div>
                        </motion.div>
                      )}

                      {consoleMode === "backpack" && (
                        <motion.div 
                          key="backpack" 
                          initial={{ opacity: 0 }} 
                          animate={{ opacity: 1 }} 
                          exit={{ opacity: 0 }}
                          className="p-4 bg-white/40 dark:bg-black/35 rounded-2xl border border-[color:var(--border)]"
                        >
                          <span className="text-xs font-bold text-[color:var(--rose-deep)] uppercase tracking-wider block mb-3 flex items-center gap-1">
                            <Box className="w-3.5 h-3.5" />
                            {lang === "ar" ? "حقيبتي للمأكولات اللطيفة 🎒" : "Backpack Inventory 🎒"}
                          </span>
                          
                          {bunnyInventory.length === 0 ? (
                            <p className="text-xs text-[color:var(--mauve)]/60 text-center py-6">
                              {lang === "ar" ? "حقيبتك فارغة تماماً! تسوقي من البوتيك 🛒" : "Your inventory is empty! Buy treats from standard Boutique 🛒"}
                            </p>
                          ) : (
                            <div className="grid grid-cols-2 gap-2">
                              {bunnyInventory.map((itemId, idx) => {
                                const item = BOUTIQUE_ITEMS.find((i) => i.id === itemId);
                                return item ? (
                                  <button
                                    key={idx}
                                    onClick={() => handleFeedFromBackpack(itemId)}
                                    disabled={bunnyState === "sleeping"}
                                    className="p-2.5 bg-white/70 hover:bg-white border rounded-xl font-semibold text-xs text-[color:var(--rose-deep)] flex items-center justify-between shadow-xs disabled:opacity-50 text-start cursor-pointer"
                                  >
                                    <span>{lang === "ar" ? item.nameAr : item.nameEn}</span>
                                    <span className="text-[10px] text-emerald-500 font-bold">Eat 🧁</span>
                                  </button>
                                ) : null;
                              })}
                            </div>
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
