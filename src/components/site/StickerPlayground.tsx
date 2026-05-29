import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Trash2, RotateCw, ZoomIn, ZoomOut, RotateCcw, RefreshCw } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { Section } from "./Decor";

const STICKERS = [
  { emoji: "🎀", name: "Bow" },
  { emoji: "🧸", name: "Bear" },
  { emoji: "🌸", name: "Sakura" },
  { emoji: "🍒", name: "Cherries" },
  { emoji: "💖", name: "Pink Heart" },
  { emoji: "☁️", name: "Cloud" },
  { emoji: "✨", name: "Sparkles" },
  { emoji: "🍓", name: "Strawberry" },
  { emoji: "🍵", name: "Matcha" },
  { emoji: "🍰", name: "Cake" },
  { emoji: "⭐", name: "Star" },
  { emoji: "🐱", name: "Kitty" },
];

const TEXT_STICKERS = [
  { text: "GLOW MODE", color: "from-[#F7C9D9] to-[#C88AA0]" },
  { text: "YOU GOT THIS", color: "from-[#FBEFE0] to-[#E4C28E]" },
  { text: "SOFT GIRL", color: "from-[#E0F5F2] to-[#6B8AA8]" },
  { text: "COZY VIBES", color: "from-[#F0EAF8] to-[#8A6BB0]" },
];

type PlacedSticker = {
  id: number;
  emoji: string;
  isText: boolean;
  text?: string;
  textColor?: string;
  x: number; // percentage width
  y: number; // percentage height
  scale: number;
  rotate: number;
};

export function StickerPlayground() {
  const { lang, t } = useI18n();
  const isAr = lang === "ar";

  const [placedStickers, setPlacedStickers] = useState<PlacedSticker[]>([
    // A couple of beautiful default stickers to welcome the user
    { id: 1, emoji: "🎀", isText: false, x: 25, y: 20, scale: 1.4, rotate: -15 },
    { id: 2, emoji: "💖", isText: false, x: 75, y: 70, scale: 1.2, rotate: 10 },
    { id: 3, emoji: "GLOW MODE", isText: true, text: "GLOW MODE", textColor: "from-[#F7C9D9] to-[#C88AA0]", x: 50, y: 45, scale: 1.0, rotate: 5 },
  ]);

  const [selectedId, setSelectedId] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const dragInfo = useRef<{ id: number; startX: number; startY: number; itemX: number; itemY: number } | null>(null);

  // Spawn a new emoji sticker
  const handleAddEmoji = (emoji: string) => {
    const id = Date.now();
    const newSticker: PlacedSticker = {
      id,
      emoji,
      isText: false,
      x: 35 + Math.random() * 30, // scatter in middle
      y: 35 + Math.random() * 30,
      scale: 1.2,
      rotate: (Math.random() - 0.5) * 40,
    };
    setPlacedStickers((prev) => [...prev, newSticker]);
    setSelectedId(id);
  };

  // Spawn a new text sticker
  const handleAddText = (text: string, color: string) => {
    const id = Date.now();
    const newSticker: PlacedSticker = {
      id,
      emoji: text,
      isText: true,
      text,
      textColor: color,
      x: 30 + Math.random() * 40,
      y: 30 + Math.random() * 40,
      scale: 1.0,
      rotate: (Math.random() - 0.5) * 20,
    };
    setPlacedStickers((prev) => [...prev, newSticker]);
    setSelectedId(id);
  };

  // Drag handlers
  const handlePointerDown = (e: React.PointerEvent, id: number) => {
    e.stopPropagation();
    setSelectedId(id);

    const sticker = placedStickers.find((s) => s.id === id);
    if (!sticker) return;

    dragInfo.current = {
      id,
      startX: e.clientX,
      startY: e.clientY,
      itemX: sticker.x,
      itemY: sticker.y,
    };

    const target = e.currentTarget as HTMLElement;
    target.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!dragInfo.current || !containerRef.current) return;

    const info = dragInfo.current;
    const containerRect = containerRef.current.getBoundingClientRect();

    const deltaX = e.clientX - info.startX;
    const deltaY = e.clientY - info.startY;

    // Convert deltas to percentage values
    const pctDeltaX = (deltaX / containerRect.width) * 100;
    const pctDeltaY = (deltaY / containerRect.height) * 100;

    let newX = Math.max(5, Math.min(95, info.itemX + pctDeltaX));
    let newY = Math.max(5, Math.min(95, info.itemY + pctDeltaY));

    setPlacedStickers((prev) =>
      prev.map((s) => (s.id === info.id ? { ...s, x: newX, y: newY } : s))
    );
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!dragInfo.current) return;
    const target = e.currentTarget as HTMLElement;
    target.releasePointerCapture(e.pointerId);
    dragInfo.current = null;
  };

  // Adjust properties of selected sticker
  const adjustScale = (amount: number) => {
    if (selectedId === null) return;
    setPlacedStickers((prev) =>
      prev.map((s) => (s.id === selectedId ? { ...s, scale: Math.max(0.5, Math.min(3, s.scale + amount)) } : s))
    );
  };

  const adjustRotation = (amount: number) => {
    if (selectedId === null) return;
    setPlacedStickers((prev) =>
      prev.map((s) => (s.id === selectedId ? { ...s, rotate: (s.rotate + amount) % 360 } : s))
    );
  };

  const deleteSelected = () => {
    if (selectedId === null) return;
    setPlacedStickers((prev) => prev.filter((s) => s.id !== selectedId));
    setSelectedId(null);
  };

  const clearAll = () => {
    setPlacedStickers([]);
    setSelectedId(null);
  };

  // Deselect when clicking canvas background
  const handleCanvasClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      setSelectedId(null);
    }
  };

  return (
    <Section id="sticker-locker" className="bg-[color:var(--rose-soft)]/20 relative overflow-hidden">
      {/* Decorative floating sparkles in background */}
      <div className="absolute top-10 left-10 text-[color:var(--rose-deep)]/10 text-6xl sparkle-spin select-none pointer-events-none">✿</div>
      <div className="absolute bottom-10 right-10 text-[color:var(--rose-deep)]/10 text-5xl float-slow select-none pointer-events-none">✨</div>

      <div className="text-center mb-10">
        <span className="inline-flex flex-wrap items-center gap-1.5 px-3 py-1 rounded-full bg-white/70 border border-[color:var(--border)] text-xs font-semibold text-[color:var(--rose-deep)]">
          <Sparkles className="w-3.5 h-3.5" />
          {isAr ? "مساحة التزيين الخاصة بكِ 🎀" : "Your Cozy Customization Space 🎀"}
          <span className="ml-1 text-[8px] sm:text-[9px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-[color:var(--rose-deep)] text-white">
            {isAr ? "حصري للموقع" : "Exclusive for website"}
          </span>
        </span>
        <h2 className="mt-3 text-3xl md:text-5xl font-semibold text-[color:var(--mauve)]">
          {isAr ? "لوحة ستيكرات الجيل اللطيف" : "Aesthetic Sticker Locker"}
        </h2>
        <p className="mt-3 text-sm text-[color:var(--mauve)]/70 max-w-md mx-auto leading-relaxed">
          {isAr
            ? "زيني خزانتك الافتراضية بألطف الستيكرات والعبارات! اضغطي لإضافتها، ثم اسحبيها ورتبيها واصنعي لوحتك الملهمة."
            : "Decorate your virtual dream locker with cute custom stickers! Click to add, drag to arrange, and design your cozy canvas."}
        </p>
      </div>

      <div className="grid lg:grid-cols-[1.2fr_1fr] gap-8 items-stretch max-w-5xl mx-auto">
        {/* Left column: Active Decor Locker Canvas */}
        <div className="flex flex-col gap-4">
          <div
            ref={containerRef}
            onClick={handleCanvasClick}
            className="aspect-[4/3] rounded-[36px] bg-white border-2 border-dashed border-[color:var(--rose-deep)]/30 relative overflow-hidden shadow-card cursor-default select-none group"
            style={{
              backgroundImage: "radial-gradient(oklch(0.58 0.13 5 / 0.04) 1.5px, transparent 1.5px)",
              backgroundSize: "24px 24px",
            }}
          >
            {/* Locker Header */}
            <div className="absolute top-4 left-6 right-6 flex justify-between items-center z-10 pointer-events-none select-none">
              <span className="text-[10px] uppercase font-bold tracking-widest text-[color:var(--rose-deep)] bg-white/80 px-3 py-1 rounded-full border border-[color:var(--border)]">
                🌸 {isAr ? "خزانتك اللطيفة" : "My Cozy Locker"}
              </span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  clearAll();
                }}
                className="pointer-events-auto p-2 rounded-full bg-white/90 hover:bg-red-50 text-red-500 shadow border border-[color:var(--border)] active:scale-95 transition-all flex items-center gap-1.5 text-xs font-semibold"
                title={isAr ? "مسح اللوحة" : "Clear locker"}
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{isAr ? "تفريغ" : "Clear"}</span>
              </button>
            </div>

            {/* Sticker renderer */}
            <AnimatePresence>
              {placedStickers.map((sticker) => {
                const isSelected = selectedId === sticker.id;
                return (
                  <div
                    key={sticker.id}
                    onPointerDown={(e) => handlePointerDown(e, sticker.id)}
                    onPointerMove={handlePointerMove}
                    onPointerUp={handlePointerUp}
                    className={`absolute select-none touch-none cursor-grab active:cursor-grabbing origin-center select-none ${
                      isSelected ? "z-40" : "z-20 hover:z-30"
                    }`}
                    style={{
                      left: `${sticker.x}%`,
                      top: `${sticker.y}%`,
                      transform: `translate(-50%, -50%) rotate(${sticker.rotate}deg) scale(${sticker.scale})`,
                    }}
                  >
                    {/* Sticker Content */}
                    <div className="relative p-1">
                      {/* Active border & halo */}
                      {isSelected && (
                        <div className="absolute inset-0 border-2 border-dashed border-[color:var(--rose-deep)] rounded-xl scale-110 animate-pulse pointer-events-none" />
                      )}

                      {sticker.isText ? (
                        <div className={`px-4 py-2 rounded-2xl bg-gradient-to-br ${sticker.textColor} text-white font-display font-black text-xs shadow-soft uppercase whitespace-nowrap border border-white/20 select-none`}>
                          ★ {sticker.emoji} ★
                        </div>
                      ) : (
                        <span
                          className="text-4xl sm:text-5xl leading-none select-none filter drop-shadow-[0_4px_6px_rgba(181,91,114,0.15)] block"
                          style={{ fontSize: "52px" }}
                        >
                          {sticker.emoji}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </AnimatePresence>

            {placedStickers.length === 0 && (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 opacity-30 select-none pointer-events-none">
                <span className="text-6xl mb-2">🩰</span>
                <p className="text-sm font-semibold">{isAr ? "اللوحة فارغة تمامًا" : "Locker is empty!"}</p>
                <p className="text-xs">{isAr ? "اضغطي على الملصقات بالأسفل لتزيينها" : "Click stickers on the right to start decorating"}</p>
              </div>
            )}
          </div>

          {/* Quick controls for selected sticker */}
          <AnimatePresence>
            {selectedId !== null && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="p-3 rounded-2xl glass border border-white/40 flex flex-wrap gap-2 items-center justify-between shadow-soft text-[color:var(--mauve)]"
              >
                <span className="text-xs font-semibold text-[color:var(--rose-deep)] px-2">
                  ✨ {isAr ? "تعديل الملصق النشط" : "Editing Sticker"}
                </span>

                <div className="flex gap-1.5">
                  <button
                    onClick={() => adjustScale(0.1)}
                    className="p-2 rounded-xl bg-white hover:bg-[color:var(--rose-soft)] border border-[color:var(--border)] active:scale-95 transition-all text-xs flex items-center gap-1"
                    title={isAr ? "تكبير" : "Scale up"}
                  >
                    <ZoomIn className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => adjustScale(-0.1)}
                    className="p-2 rounded-xl bg-white hover:bg-[color:var(--rose-soft)] border border-[color:var(--border)] active:scale-95 transition-all text-xs flex items-center gap-1"
                    title={isAr ? "تصغير" : "Scale down"}
                  >
                    <ZoomOut className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => adjustRotation(-15)}
                    className="p-2 rounded-xl bg-white hover:bg-[color:var(--rose-soft)] border border-[color:var(--border)] active:scale-95 transition-all text-xs flex items-center gap-1"
                    title={isAr ? "تدوير يسار" : "Rotate counter-clockwise"}
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => adjustRotation(15)}
                    className="p-2 rounded-xl bg-white hover:bg-[color:var(--rose-soft)] border border-[color:var(--border)] active:scale-95 transition-all text-xs flex items-center gap-1"
                    title={isAr ? "تدوير يمين" : "Rotate clockwise"}
                  >
                    <RotateCw className="w-3.5 h-3.5" />
                  </button>
                  <div className="w-[1px] h-6 bg-[color:var(--border)] mx-1" />
                  <button
                    onClick={deleteSelected}
                    className="p-2 rounded-xl bg-red-50 hover:bg-red-100 border border-red-200 text-red-500 active:scale-95 transition-all text-xs flex items-center gap-1"
                    title={isAr ? "حذف الملصق" : "Delete sticker"}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Right column: Sticker palette selector */}
        <div className="flex flex-col gap-5 p-6 rounded-[36px] bg-white border border-[color:var(--border)] shadow-card justify-between">
          <div>
            <h3 className="font-display font-semibold text-lg text-[color:var(--mauve)] flex items-center gap-1.5">
              <span>🌸</span> {isAr ? "ملصقات الزينة" : "Aesthetic Stickers"}
            </h3>
            <p className="text-xs text-[color:var(--mauve)]/60 mt-1">
              {isAr ? "اضغطي على ملصق لإضافته في الخزانة مباشرة:" : "Tap a sticker to add it to your custom locker:"}
            </p>

            <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-4 gap-3 mt-4">
              {STICKERS.map((s) => (
                <button
                  key={s.emoji}
                  onClick={() => handleAddEmoji(s.emoji)}
                  className="aspect-square rounded-2xl bg-[color:var(--rose-soft)]/20 hover:bg-[color:var(--rose-soft)]/55 border border-[color:var(--border)] hover:scale-105 active:scale-95 transition-all grid place-items-center text-3xl group shadow-sm"
                  title={s.name}
                >
                  <span className="group-hover:animate-bounce pointer-events-none">{s.emoji}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="border-t border-[color:var(--border)] pt-4 mt-2">
            <h3 className="font-display font-semibold text-lg text-[color:var(--mauve)] flex items-center gap-1.5">
              <span>★</span> {isAr ? "بطاقات الملصقات الملونة" : "Cute Words & Badges"}
            </h3>
            <p className="text-xs text-[color:var(--mauve)]/60 mt-1">
              {isAr ? "عبارات جلو أب لطيفة تضاف كباقي الملصقات:" : "Add text badges to highlight your goals:"}
            </p>

            <div className="flex flex-wrap gap-2 mt-3">
              {TEXT_STICKERS.map((s) => (
                <button
                  key={s.text}
                  onClick={() => handleAddText(s.text, s.color)}
                  className={`px-3 py-2 rounded-2xl bg-gradient-to-br ${s.color} hover:scale-105 active:scale-95 text-white font-display font-extrabold text-[10px] tracking-wide shadow transition-all border border-white/20`}
                >
                  ★ {s.text} ★
                </button>
              ))}
            </div>
          </div>

          <div className="border-t border-[color:var(--border)] pt-4 mt-2 text-[10px] text-[color:var(--mauve)]/50 italic flex items-center justify-between">
            <span>✨ {isAr ? "تزيين سعيد!" : "Happy Decorating!"}</span>
            <span>📱 {isAr ? "يدعم شاشات اللمس" : "Touch & Mobile Friendly"}</span>
          </div>
        </div>
      </div>
    </Section>
  );
}
