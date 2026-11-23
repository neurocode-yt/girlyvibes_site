import { useState, useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useI18n } from "@/lib/i18n";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Download";
import { Blob } from "@/components/site/Decor";
import { renderGreetingCard } from "@/lib/greetingCard";
import { motion, AnimatePresence } from "framer-motion";
import { Camera, Coins, Heart, Box, Rabbit, Mail, Shirt, Sparkles, Zap } from "lucide-react";
import { DressUpStudio } from "@/components/site/dress-up/DressUpStudio";
import {
  copyPortrait,
  defaultLook,
  initialDressUpLook,
  readScrapbook,
  saveDressUpLook,
  writeScrapbook,
  type DressUpCostume,
  type DressUpLook,
  type ScrapbookEntry,
} from "@/components/site/dress-up/look";
import stylesheet from "./-games.css?url";

export const Route = createFileRoute("/games")({
  component: GamesPage,
  head: () => ({
    meta: [
      { title: "3D Dress-Up Studio & Girly Games | Girly Vibes" },
      {
        name: "description",
        content: "Style an original 3D fashion doll, save your looks, and play with Coco in Girly Vibes' bilingual games arcade.",
      },
      { property: "og:title", content: "The Dress-Up Studio | Girly Vibes" },
      {
        property: "og:description",
        content: "Build a look in the Girly Vibes 3D dress-up studio, then share it with a friend.",
      },
    ],
    links: [
      { rel: "canonical", href: "https://girly-vibes.com/games" },
      { rel: "stylesheet", href: stylesheet },
    ],
  }),
});

let globalIsSoundMuted = false;

// Sound synthesis helper (safely runs in browser context)
function playSynthSound(type: "click" | "pet" | "feed" | "pop" | "sleep" | "win" | "fail" | "buy") {
  if (typeof window === "undefined" || globalIsSoundMuted) return;
  try {
    const AudioCtx = window.AudioContext ?? (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
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
const BOUTIQUE_ITEMS = [
  { id: "boba", nameEn: "Cozy Boba Tea 🧋", nameAr: "شاي بوبا دافئ 🧋", cost: 30, type: "food", value: 15 },
  { id: "macaron", nameEn: "Strawberry Macaron 🍰", nameAr: "ماكارون فراولة 🍰", cost: 20, type: "food", value: 10 },
  { id: "candycorn", nameEn: "Magic Star Candy 🍬", nameAr: "حلوى النجم السحرية 🍬", cost: 40, type: "food", value: 25 },
  { id: "lights", nameEn: "Fairy Lights ✨", nameAr: "سلك أضواء براقة ✨", cost: 80, type: "decor", bgElement: "lights" },
  { id: "rug", nameEn: "Vintage Persian Rug 🧶", nameAr: "سجادة فارسية عتيقة 🧶", cost: 100, type: "decor", bgElement: "rug" },
  { id: "plushie", nameEn: "Plushie Collection 🧸", nameAr: "مجموعة دمى محشوة 🧸", cost: 130, type: "decor", bgElement: "plushie" },
  { id: "wings", nameEn: "Angel Wings Skin 👼", nameAr: "أجنحة ملاك لطيفة 👼", cost: 150, type: "cosmetic", skin: "wings" },
  { id: "detective", nameEn: "Detective Hat Skin 🕵️", nameAr: "قبعة محققة كلاسيكية 🕵️", cost: 120, type: "cosmetic", skin: "hat" },
] as const;

const HALLMARK_TEMPLATES = [
  {
    id: "eid",
    nameEn: "Eid & Celebration 🌸",
    nameAr: "بطاقة العيد والمناسبات 🌸",
    bgGradient: "from-amber-100 via-rose-100 to-pink-200 dark:from-amber-950 dark:via-rose-950 dark:to-pink-900",
    borderColor: "border-amber-400",
    exportBackground: "#ffedca",
    exportAccent: "#ce922c",
    headerEn: "CELEBRATION GREETINGS",
    headerAr: "بطاقة تهنئة ومعايدة",
    defaultTitleEn: "Warm Eid Mubarak Wishes! 🌙",
    defaultTitleAr: "عيد مبارك وكل عام وأنتم بخير 🌙",
    defaultMsgEn: "May your day be filled with happiness, sweet treats, and glowing moments!",
    defaultMsgAr: "أتمنى لكِ يوماً مليئاً بالسعادة، والحلويات، واللحظات المتألقة!",
    seal: "🌙 EID & JOY"
  },
  {
    id: "magazine",
    nameEn: "Glow Magazine Cover ✨",
    nameAr: "غلاف مجلة التألق ✨",
    bgGradient: "from-pink-100 via-purple-100 to-rose-200 dark:from-pink-950 dark:via-purple-950 dark:to-rose-900",
    borderColor: "border-pink-400",
    exportBackground: "#fbe3f6",
    exportAccent: "#c765a3",
    headerEn: "GIRLY VIBES MAGAZINE",
    headerAr: "مجلة جيرلي فايبس",
    defaultTitleEn: "The Ultimate Glow-Up Edition ✨",
    defaultTitleAr: "إصدار التألق والأناقة المذهلة ✨",
    defaultMsgEn: "Unstoppable confidence, cozy routines, and endless sweetness!",
    defaultMsgAr: "ثقة لا تتوقف، روتين دافئ، وحلاوة لا تنتهي!",
    seal: "⭐ ISSUE #1"
  },
  {
    id: "besties",
    nameEn: "Besties & Birthday 🎂",
    nameAr: "أصدقاء وعيد ميلاد 🎂",
    bgGradient: "from-rose-100 via-amber-50 to-pink-100 dark:from-rose-950 dark:via-zinc-900 dark:to-pink-950",
    borderColor: "border-rose-300",
    exportBackground: "#ffe3eb",
    exportAccent: "#d480a0",
    headerEn: "BESTIES FOREVER",
    headerAr: "صديقاتي للأبد",
    defaultTitleEn: "Happiest Birthday Sunshine! 🎂",
    defaultTitleAr: "عيد ميلاد سعيد يا أحلى نهار! 🎂",
    defaultMsgEn: "Thank you for bringing light and joy to every single day!",
    defaultMsgAr: "شكراً لأنكِ تملئين كل يوم بالنور والبهجة والضحك!",
    seal: "💗 WITH LOVE"
  },
  {
    id: "garden",
    nameEn: "Pastel Garden 🌺",
    nameAr: "حديقة الورد 🌺",
    bgGradient: "from-emerald-100 via-teal-50 to-rose-100 dark:from-emerald-950 dark:via-teal-950 dark:to-rose-950",
    borderColor: "border-emerald-300",
    exportBackground: "#dff6ed",
    exportAccent: "#598e79",
    headerEn: "FLOWERS & SUNSHINE",
    headerAr: "ورد وإشراق",
    defaultTitleEn: "Bloom With Grace & Love 🌸",
    defaultTitleAr: "ازهري بحب وفرح 🌸",
    defaultMsgEn: "Take a deep breath, smile softly, and bloom wherever you go.",
    defaultMsgAr: "خذي نفساً عميقاً، ابتسمي بصفاء، وأزهري في كل مكان.",
    seal: "🌸 BLOOM & GLOW"
  }
];

function GamesPage() {
  const { t, lang } = useI18n();
  const [activeTab, setActiveTab] = useState<"dressup" | "tamagotchi" | "hallmark">("dressup");

  // Greeting card customization
  const [hallmarkTemplate, setHallmarkTemplate] = useState("eid");
  const [customTitle, setHallmarkTitle] = useState<string | null>(null);
  const [customMessage, setHallmarkMessage] = useState<string | null>(null);
  const [customRecipient, setHallmarkRecipient] = useState<string | null>(null);
  const [hallmarkStickers, setHallmarkStickers] = useState<string[]>(["🎀", "✨", "🌸", "📮"]);
  const greetingTemplate = HALLMARK_TEMPLATES.find(({ id }) => id === hallmarkTemplate) ?? HALLMARK_TEMPLATES[0];
  const isArabic = lang === "ar";
  const greetingHeading = isArabic ? greetingTemplate.headerAr : greetingTemplate.headerEn;
  const hallmarkTitle = customTitle ?? (isArabic ? greetingTemplate.defaultTitleAr : greetingTemplate.defaultTitleEn);
  const hallmarkMessage = customMessage ?? (isArabic ? greetingTemplate.defaultMsgAr : greetingTemplate.defaultMsgEn);
  const hallmarkRecipient = customRecipient ?? (isArabic ? "إلى صديقتي الغالية 💖" : "To my dearest bestie 💖");

  const [look, setLook] = useState<DressUpLook>(defaultLook);
  const [dollCanvas, setDollCanvas] = useState<HTMLCanvasElement | null>(null);
  const [greetingPortrait, setGreetingPortrait] = useState<{
    canvas: HTMLCanvasElement;
    preview: string;
  } | null>(null);

  // --- PERSISTENT USER COINS & STATS ---
  const [carrotCoins, setCarrotCoins] = useState(100);
  const [scrapbook, setScrapbook] = useState<ScrapbookEntry[]>([]);
  const [bunnyInventory, setBunnyInventory] = useState<string[]>(["boba"]);
  const [bunnyLevel, setBunnyLevel] = useState(1);
  const [bunnyXp, setBunnyXp] = useState(20);

  // Load persistence on mount
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const coins = localStorage.getItem("gv-carrot-coins");
      if (coins) setCarrotCoins(Number(coins));
    } catch (e) {
      console.warn("Failed to load coins", e);
    }
    
    try {
      setScrapbook(readScrapbook(localStorage));
    } catch {
      // The game remains playable when browser storage is unavailable.
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

    setLook(initialDressUpLook(new URLSearchParams(window.location.search), () => localStorage));
  }, []);

  // Save helpers
  const saveCoins = (newVal: number) => {
    setCarrotCoins(newVal);
    try {
      localStorage.setItem("gv-carrot-coins", String(newVal));
    } catch {
      // Coins still work for the current visit if storage is blocked.
    }
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

  // --- TAMAGOTCHI STATE ---
  const [consoleMode, setConsoleMode] = useState<"room" | "shop" | "backpack">("room");
  const [bunnyState, setBunnyState] = useState<"idle" | "petting" | "eating" | "playing" | "sleeping">("idle");
  const [love, setLove] = useState(50);
  const [energy, setEnergy] = useState(50);
  
  const [equippedSkin, setEquippedSkin] = useState<DressUpCostume>("none");
  const [activeBgDecor, setActiveBgDecor] = useState<string[]>([]);
  const [isSoundMuted, setIsSoundMuted] = useState(false);

  // Emitters
  const [emitters, setEmitters] = useState<{ id: number; char: string; x: number; y: number }[]>([]);

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
    if (item?.type !== "food" || bunnyState === "sleeping") return;
    
    const idx = bunnyInventory.indexOf(itemId);
    if (idx === -1) return;
    const newInv = [...bunnyInventory];
    newInv.splice(idx, 1);
    saveInventory(newInv);

    playSynthSound("feed");
    setBunnyState("eating");
    setEnergy((prev) => Math.min(100, prev + item.value));
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
      if (!activeBgDecor.includes(item.bgElement)) {
        setActiveBgDecor([...activeBgDecor, item.bgElement]);
      }
    } else if (item.type === "cosmetic") {
      setEquippedSkin(item.skin);
    }
  };

  const changeLook = (next: DressUpLook) => {
    setLook(next);
    try {
      saveDressUpLook(localStorage, next);
    } catch {
      // Changing the current outfit still works for this visit.
    }
  };

  const switchTab = (tab: typeof activeTab) => {
    if (tab === activeTab) return;
    playSynthSound("click");
    if (activeTab === "dressup" && dollCanvas) {
      try {
        const canvas = copyPortrait(dollCanvas);
        setGreetingPortrait({ canvas, preview: canvas.toDataURL("image/webp", 0.86) });
      } catch {
        setGreetingPortrait(null);
      }
    }
    setActiveTab(tab);
  };

  const saveScrapbookImage = (caption: string, image: string, savedLook?: DressUpLook) => {
    const entry = { id: crypto.randomUUID(), caption, image, look: savedLook };
    const updated = [entry, ...scrapbook].slice(0, 12);
    try {
      writeScrapbook(localStorage, updated);
    } catch {
      triggerEmitter(isArabic ? "تعذّر الحفظ في هذا المتصفح" : "Couldn’t save in this browser");
      return false;
    }
    setScrapbook(updated);
    playSynthSound("win");
    return true;
  };

  const removeScrapbookEntry = (id: string) => {
    const updated = scrapbook.filter((entry) => entry.id !== id);
    try {
      writeScrapbook(localStorage, updated);
    } catch {
      return false;
    }
    setScrapbook(updated);
    return true;
  };

  const exportGreeting = (destination: "download" | "scrapbook") => {
    let image: string;
    try {
      image = renderGreetingCard({
        direction: isArabic ? "rtl" : "ltr",
        background: greetingTemplate.exportBackground,
        accent: greetingTemplate.exportAccent,
        heading: greetingHeading,
        title: hallmarkTitle,
        portrait: greetingPortrait?.canvas ?? null,
        stickers: hallmarkStickers,
        recipient: hallmarkRecipient,
        message: hallmarkMessage,
        seal: isArabic ? "جيرلي فايبس" : "Girly Vibes",
      });
    } catch {
      triggerEmitter(isArabic ? "تعذّر إنشاء صورة البطاقة" : "Couldn’t create the card image");
      return;
    }

    if (destination === "download") {
      const link = document.createElement("a");
      link.href = image;
      link.download = "girly-vibes-greeting-card.png";
      link.click();
    } else if (saveScrapbookImage(hallmarkTitle.trim() || greetingHeading, image)) {
      saveCoins(carrotCoins + 50);
      triggerEmitter(isArabic ? "تم الحفظ في القصاصات" : "Saved to scrapbook");
    }
  };

  return (
    <div className="min-h-screen bg-[color:var(--background)] text-[color:var(--mauve)] overflow-x-hidden relative flex flex-col justify-between">
      <Blob className="w-[500px] h-[500px] -top-32 -left-20" color="rgba(255, 117, 143, 0.15)" />
      <Blob className="w-[500px] h-[500px] bottom-20 -right-20" color="rgba(200, 182, 255, 0.15)" />

      <div className="relative z-10 flex-grow flex flex-col justify-start">
        <Header />

        <main id="main-content" tabIndex={-1} className="w-full pt-28 pb-12 px-4 flex-grow flex flex-col items-center">
          
          <div className="games-masthead">
            <h1>
              {activeTab === "dressup"
                ? (isArabic ? "استوديو تنسيق الأزياء" : "The Dress-Up Studio")
                : t("games.title")}
            </h1>
            {activeTab === "dressup" && (
              <p>
                {isArabic
                  ? "نسّقي إطلالة الدمية ثلاثية الأبعاد، ثم التقطي صورة أو شاركيها."
                  : "Style your 3D doll, take a photo, or share the look."}
              </p>
            )}
            <div className="games-masthead-row">
              <div className="games-switcher" role="group" aria-label={isArabic ? "اختاري لعبة" : "Choose a game"}>
                <button type="button" aria-pressed={activeTab === "dressup"} onClick={() => switchTab("dressup")}>
                  <Shirt size={17} aria-hidden="true" /> {isArabic ? "تنسيق الأزياء" : "Dress-up"}
                </button>
                <button type="button" aria-pressed={activeTab === "hallmark"} onClick={() => switchTab("hallmark")}>
                  <Mail size={17} aria-hidden="true" /> {isArabic ? "بطاقات التهنئة" : "Greeting cards"}
                </button>
                <button type="button" aria-pressed={activeTab === "tamagotchi"} onClick={() => switchTab("tamagotchi")}>
                  <Rabbit size={17} aria-hidden="true" /> {isArabic ? "غرفة كوكو" : "Coco’s room"}
                </button>
              </div>
              <span className="games-coins">
                <Coins size={18} aria-hidden="true" />
                {isArabic ? "عملات الجزر" : "Carrot Coins"}: {new Intl.NumberFormat(lang).format(carrotCoins)}
              </span>
            </div>
          </div>

          <div className="w-full max-w-6xl flex justify-center">
            <AnimatePresence mode="wait">
              {activeTab === "hallmark" && (
                <motion.div
                  key="hallmark"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 100 }}
                  className="w-full grid lg:grid-cols-[1.1fr_1.3fr] gap-8 bg-white/70 dark:bg-zinc-950/70 p-6 md:p-8 rounded-[36px] border border-[color:var(--border)] backdrop-blur shadow-glow"
                >
                  {/* Greeting card preview */}
                  <div className="relative flex flex-col items-center">
                    <div className="w-full justify-between flex items-center mb-3 text-xs text-[color:var(--mauve)]/70 font-semibold px-2">
                      <span>{isArabic ? "معاينة البطاقة" : "Card preview"}</span>
                    </div>

                    {(() => {
                      const selectedTmpl = greetingTemplate;
                      return (
                        <div
                          className={`relative w-full max-w-[360px] aspect-[4/5] rounded-[32px] p-5 shadow-2xl border-4 ${selectedTmpl.borderColor} bg-gradient-to-b ${selectedTmpl.bgGradient} flex flex-col justify-between overflow-hidden select-none`}
                        >
                          {/* Card Top Banner Header */}
                          <div className="text-center pt-1 pb-2 border-b border-black/10 dark:border-white/10">
                            <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-rose-600 dark:text-rose-400">
                              {greetingHeading}
                            </p>
                            <h3 className="font-display font-bold text-lg text-slate-800 dark:text-slate-100 mt-0.5 leading-tight">
                              {hallmarkTitle}
                            </h3>
                          </div>

                          {/* Middle Frame: 3D Doll Canvas Viewport */}
                          <div className="relative my-2 w-full h-[210px] rounded-2xl overflow-hidden border-2 border-white/80 dark:border-white/20 shadow-inner bg-gradient-to-b from-white/40 to-white/10 flex items-center justify-center">
                            {greetingPortrait ? (
                              <img
                                src={greetingPortrait.preview}
                                alt={isArabic ? "إطلالة الدمية" : "Your doll’s look"}
                                className="h-full w-full object-contain"
                              />
                            ) : (
                              <Heart aria-hidden="true" className="size-12 text-rose-500/60" />
                            )}

                            {/* Card stickers */}
                            <div className="absolute inset-0 pointer-events-none p-3 flex flex-wrap justify-between items-start">
                              {hallmarkStickers.map((st, i) => (
                                <motion.span
                                  key={i}
                                  animate={{ y: [0, -4, 0], rotate: [0, i % 2 === 0 ? 8 : -8, 0] }}
                                  transition={{ duration: 2 + i * 0.5, repeat: Infinity, ease: "easeInOut" }}
                                  className="text-2xl filter drop-shadow-md"
                                >
                                  {st}
                                </motion.span>
                              ))}
                            </div>
                          </div>

                          {/* Greeting message and studio mark */}
                          <div className="pt-2 border-t border-black/10 dark:border-white/10 flex flex-col justify-between gap-2">
                            <div className="bg-white/70 dark:bg-black/40 p-2.5 rounded-xl border border-white/60 dark:border-white/10">
                              <p className="text-xs font-bold text-rose-500 dark:text-rose-300">{hallmarkRecipient}</p>
                              <p className="text-xs font-medium text-slate-700 dark:text-slate-200 mt-1 leading-snug italic">
                                "{hallmarkMessage}"
                              </p>
                            </div>

                            <div className="flex items-center justify-between text-[9px] font-mono text-slate-500 dark:text-slate-400">
                              <span className="font-bold bg-amber-200 dark:bg-amber-900 text-amber-900 dark:text-amber-200 px-2 py-0.5 rounded-md">
                                {selectedTmpl.seal}
                              </span>
                              <bdi>Girly Vibes</bdi>
                            </div>
                          </div>
                        </div>
                      );
                    })()}
                  </div>

                  {/* Greeting card controls */}
                  <div className="flex flex-col gap-5 justify-between">
                    <div>
                      <h3 className="text-xl font-display font-bold text-[color:var(--rose-deep)] flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-amber-400" />
                        {isArabic ? "استوديو بطاقات التهنئة" : "Greeting Card Studio"}
                      </h3>
                      <p className="text-xs text-[color:var(--mauve)]/75 mt-1">
                        {lang === "ar"
                          ? "نسّقي دميتك واختاري قالبًا، وبعدها اكتبي إهداءك وزيّني البطاقة بالملصقات."
                          : "Style your doll, pick a template, then add a message and stickers to your card."}
                      </p>
                    </div>

                    {/* 1. Template Selector */}
                    <div>
                      <label className="text-xs font-bold text-[color:var(--rose-deep)] uppercase tracking-wider block mb-2">
                        {isArabic ? "اختاري قالب البطاقة" : "Choose a card template"}
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        {HALLMARK_TEMPLATES.map((tmpl) => {
                          const isSel = hallmarkTemplate === tmpl.id;
                          return (
                            <button
                              key={tmpl.id}
                              onClick={() => {
                                playSynthSound("click");
                                setHallmarkTemplate(tmpl.id);
                                setHallmarkTitle(null);
                                setHallmarkMessage(null);
                              }}
                              className={`p-3 rounded-2xl border text-xs font-semibold flex flex-col gap-1 text-start transition-all cursor-pointer ${
                                isSel
                                  ? "bg-rose-gradient text-white border-transparent shadow-soft scale-[1.02]"
                                  : "bg-white/80 dark:bg-zinc-900/80 border-[color:var(--border)] text-[color:var(--mauve)] hover:border-[color:var(--rose-deep)]"
                              }`}
                            >
                              <span>{lang === "ar" ? tmpl.nameAr : tmpl.nameEn}</span>
                              <span className={`text-[10px] opacity-80 ${isSel ? "text-white" : "text-[color:var(--mauve)]/60"}`}>
                                {tmpl.seal}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* 2. Custom Message & Title Input */}
                    <div className="space-y-3">
                      <div>
                        <label className="text-xs font-bold text-[color:var(--rose-deep)] uppercase tracking-wider block mb-1">
                          {lang === "ar" ? "2. إهداء إلى / Recipient 💌" : "2. Recipient Name 💌"}
                        </label>
                        <input
                          type="text"
                          value={hallmarkRecipient}
                          onChange={(e) => setHallmarkRecipient(e.target.value)}
                          className="w-full px-3 py-2 text-xs rounded-xl border border-[color:var(--border)] bg-white/80 dark:bg-zinc-900/80 text-[color:var(--mauve)] focus:outline-none focus:ring-2 focus:ring-[color:var(--rose-deep)]"
                          placeholder="To My Dearest Bestie 💖"
                        />
                      </div>

                      <div>
                        <label className="text-xs font-bold text-[color:var(--rose-deep)] uppercase tracking-wider block mb-1">
                          {lang === "ar" ? "العنوان الرئيسي / Card Title ✍️" : "Card Main Title ✍️"}
                        </label>
                        <input
                          type="text"
                          value={hallmarkTitle}
                          onChange={(e) => setHallmarkTitle(e.target.value)}
                          className="w-full px-3 py-2 text-xs rounded-xl border border-[color:var(--border)] bg-white/80 dark:bg-zinc-900/80 text-[color:var(--mauve)] focus:outline-none focus:ring-2 focus:ring-[color:var(--rose-deep)]"
                        />
                      </div>

                      <div>
                        <label className="text-xs font-bold text-[color:var(--rose-deep)] uppercase tracking-wider block mb-1">
                          {lang === "ar" ? "رسالة التهنئة / Personalized Wish 🌸" : "Personalized Greeting Message 🌸"}
                        </label>
                        <textarea
                          rows={2}
                          value={hallmarkMessage}
                          onChange={(e) => setHallmarkMessage(e.target.value)}
                          className="w-full px-3 py-2 text-xs rounded-xl border border-[color:var(--border)] bg-white/80 dark:bg-zinc-900/80 text-[color:var(--mauve)] focus:outline-none focus:ring-2 focus:ring-[color:var(--rose-deep)] resize-none"
                        />
                      </div>
                    </div>

                    {/* 3. Sticker Toggles & Pose */}
                    <div>
                      <label className="text-xs font-bold text-[color:var(--rose-deep)] uppercase tracking-wider block mb-2">
                        {isArabic ? "ملصقات البطاقة" : "Card stickers"}
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {["🎀", "✨", "🌸", "📮", "🎂", "👑", "🧋", "💗"].map((st) => {
                          const active = hallmarkStickers.includes(st);
                          return (
                            <button
                              key={st}
                              onClick={() => {
                                playSynthSound("click");
                                if (active) {
                                  setHallmarkStickers(hallmarkStickers.filter((s) => s !== st));
                                } else {
                                  setHallmarkStickers([...hallmarkStickers, st]);
                                }
                              }}
                              className={`w-9 h-9 rounded-xl text-lg flex items-center justify-center border transition-all cursor-pointer ${
                                active
                                  ? "bg-rose-100 dark:bg-rose-900 border-rose-400 scale-110 shadow-xs"
                                  : "bg-white/60 dark:bg-zinc-900/60 border-[color:var(--border)] opacity-60 hover:opacity-100"
                              }`}
                            >
                              {st}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Card export actions */}
                    <div className="pt-3 border-t border-[color:var(--border)] flex flex-col sm:flex-row gap-3">
                      <button
                        onClick={() => exportGreeting("download")}
                        className="flex-1 py-3 px-4 rounded-2xl bg-rose-gradient text-white font-bold text-xs shadow-soft hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <Camera className="w-4 h-4" />
                        {isArabic ? "حمّلي بطاقة التهنئة" : "Download card"}
                      </button>
                      <button
                        onClick={() => exportGreeting("scrapbook")}
                        className="py-3 px-4 rounded-2xl bg-amber-500 text-white font-bold text-xs shadow-soft hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <Coins className="w-4 h-4 fill-white" />
                        {lang === "ar" ? "حفظ للقصاصات (+50 عملة)" : "Save (+50 Coins)"}
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === "dressup" && (
                <DressUpStudio
                  key="dressup"
                  look={look}
                  costume={equippedSkin}
                  canvas={dollCanvas}
                  scrapbook={scrapbook}
                  onLookChange={changeLook}
                  onCanvasReady={setDollCanvas}
                  onSave={saveScrapbookImage}
                  onRemove={removeScrapbookEntry}
                  onReward={(amount) => saveCoins(carrotCoins + amount)}
                />
              )}

              {activeTab === "tamagotchi" && (
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
                        <div className="flex gap-2 items-center">
                          <button 
                            onClick={() => {
                              const newMuted = !isSoundMuted;
                              setIsSoundMuted(newMuted);
                              globalIsSoundMuted = newMuted;
                              playSynthSound("click");
                            }}
                            className="bg-white/50 px-2 py-0.5 rounded-full cursor-pointer hover:bg-white"
                          >
                            {isSoundMuted ? "🔇" : "🔊"}
                          </button>
                          <span className="bg-rose-gradient px-2 py-0.5 rounded-full text-white">
                            Lv.{bunnyLevel} Cozy Kit
                          </span>
                        </div>
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
                        {bunnyState !== "sleeping" && activeBgDecor.includes("plushie") && (
                          <div className="absolute bottom-6 left-4 text-2xl select-none pointer-events-none z-0">
                            🧸
                          </div>
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
                                  {item.type === "cosmetic" && (lang === "ar" ? "إكسسوار للدمية وكوكو" : "Accessory for the doll and Coco")}
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
        </main>
      </div>

      <Footer />
    </div>
  );
}
