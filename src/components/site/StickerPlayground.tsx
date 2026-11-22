import { useRef, useState, type KeyboardEvent, type PointerEvent } from "react";
import { RotateCcw, RotateCw, Trash2, Undo2, ZoomIn, ZoomOut } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { Section } from "./Decor";

type StickerDesign = { art: string; en: string; ar: string; color?: string };

const stickerDesigns: StickerDesign[] = [
  { art: "🎀", en: "Bow", ar: "فيونكة" },
  { art: "🧸", en: "Teddy bear", ar: "دبدوب" },
  { art: "🌸", en: "Cherry blossom", ar: "زهرة كرز" },
  { art: "🍒", en: "Cherries", ar: "كرز" },
  { art: "💖", en: "Pink heart", ar: "قلب وردي" },
  { art: "☁️", en: "Cloud", ar: "سحابة" },
  { art: "✨", en: "Sparkles", ar: "لمعة" },
  { art: "🍓", en: "Strawberry", ar: "فراولة" },
  { art: "🍵", en: "Matcha", ar: "ماتشا" },
  { art: "🍰", en: "Cake", ar: "كيكة" },
  { art: "⭐", en: "Star", ar: "نجمة" },
  { art: "🐱", en: "Kitten", ar: "قطة صغيرة" },
];

const wordDesigns: StickerDesign[] = [
  { art: "Glow Mode", en: "Glow Mode", ar: "وضع التألّق", color: "from-[#F7C9D9] to-[#EAAFC6]" },
  {
    art: "You Got This",
    en: "You Got This",
    ar: "إنتِ قدّها",
    color: "from-[#FBEFE0] to-[#F4D6A6]",
  },
  { art: "Soft Girl", en: "Soft Girl", ar: "سوفت غيرل", color: "from-[#E0F5F2] to-[#BDD8E6]" },
  { art: "Cozy Vibes", en: "Cozy Vibes", ar: "أجواء دافئة", color: "from-[#F0EAF8] to-[#CCB5E2]" },
];

type PlacedSticker = {
  id: number;
  design: StickerDesign;
  x: number;
  y: number;
  scale: number;
  rotation: number;
};

const initialStickers: PlacedSticker[] = [
  { id: 1, design: stickerDesigns[0], x: 25, y: 23, scale: 1.2, rotation: -15 },
  { id: 2, design: stickerDesigns[4], x: 75, y: 74, scale: 1.2, rotation: 10 },
  { id: 3, design: wordDesigns[0], x: 50, y: 47, scale: 1, rotation: 5 },
];

const moves = [
  { key: "ArrowUp", en: "Up", ar: "فوق", dx: 0, dy: -1 },
  { key: "ArrowDown", en: "Down", ar: "تحت", dx: 0, dy: 1 },
  { key: "ArrowLeft", en: "Left", ar: "يسار", dx: -1, dy: 0 },
  { key: "ArrowRight", en: "Right", ar: "يمين", dx: 1, dy: 0 },
];

type Drag = {
  sticker: PlacedSticker;
  pointerId: number;
  clientX: number;
  clientY: number;
  width: number;
  height: number;
};

const controlClass =
  "inline-flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-xl border border-[color:var(--border)] bg-[color:var(--card)] px-3 py-2 text-sm font-semibold transition-colors hover:bg-[color:var(--rose-soft)] disabled:cursor-default disabled:opacity-55 disabled:hover:bg-[color:var(--card)]";

const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value));

export function StickerPlayground() {
  const { lang } = useI18n();
  const ar = lang === "ar";
  const [stickers, setStickers] = useState(initialStickers);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [clearedStickers, setClearedStickers] = useState<PlacedSticker[] | null>(null);
  const [feedback, setFeedback] = useState("");
  const board = useRef<HTMLDivElement>(null);
  const nextId = useRef(initialStickers.length + 1);
  const drag = useRef<Drag | null>(null);
  const selected = stickers.find((sticker) => sticker.id === selectedId);

  const updateSticker = (id: number, update: (sticker: PlacedSticker) => PlacedSticker) => {
    setStickers((current) =>
      current.map((sticker) => (sticker.id === id ? update(sticker) : sticker)),
    );
  };

  const addSticker = (design: StickerDesign) => {
    const id = nextId.current++;
    setStickers((current) => [
      ...current,
      {
        id,
        design,
        x: 38 + (id % 5) * 6,
        y: 38 + (id % 4) * 8,
        scale: 1,
        rotation: 0,
      },
    ]);
    setSelectedId(id);
    setFeedback(ar ? "اتضاف " + design.ar : "Added " + design.en);
  };

  const moveSticker = (id: number, dx: number, dy: number) => {
    updateSticker(id, (sticker) => ({
      ...sticker,
      x: clamp(sticker.x + dx, 10, 90),
      y: clamp(sticker.y + dy, 10, 90),
    }));
  };

  const removeSticker = (sticker: PlacedSticker) => {
    board.current?.focus({ preventScroll: true });
    setStickers((current) => current.filter(({ id }) => id !== sticker.id));
    setSelectedId(null);
    setFeedback(ar ? "اتشال " + sticker.design.ar : "Removed " + sticker.design.en);
  };

  const clearBoard = () => {
    setClearedStickers(stickers);
    setStickers([]);
    setSelectedId(null);
    setFeedback(ar ? "اللوحة اتفرغت. تقدري ترجّعي الملصقات." : "Board cleared. You can undo it.");
  };

  const undoClear = () => {
    if (!clearedStickers) return;
    setStickers((current) => [...clearedStickers, ...current]);
    setClearedStickers(null);
    setFeedback(ar ? "الملصقات رجعت." : "Stickers restored.");
  };

  const startDrag = (event: PointerEvent<HTMLButtonElement>, sticker: PlacedSticker) => {
    if (!event.isPrimary || event.button !== 0 || !board.current) return;
    const { width, height } = board.current.getBoundingClientRect();
    if (!width || !height) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    drag.current = {
      sticker,
      pointerId: event.pointerId,
      clientX: event.clientX,
      clientY: event.clientY,
      width,
      height,
    };
    setSelectedId(sticker.id);
  };

  const dragSticker = (event: PointerEvent<HTMLButtonElement>) => {
    const active = drag.current;
    if (!active || active.pointerId !== event.pointerId) return;
    const x = clamp(
      active.sticker.x + ((event.clientX - active.clientX) / active.width) * 100,
      10,
      90,
    );
    const y = clamp(
      active.sticker.y + ((event.clientY - active.clientY) / active.height) * 100,
      10,
      90,
    );
    updateSticker(active.sticker.id, (sticker) => ({ ...sticker, x, y }));
  };

  const endDrag = (event: PointerEvent<HTMLButtonElement>) => {
    if (drag.current?.pointerId === event.pointerId) drag.current = null;
  };

  const handleStickerKeys = (event: KeyboardEvent<HTMLButtonElement>, sticker: PlacedSticker) => {
    const move = moves.find(({ key }) => key === event.key);
    if (move) {
      event.preventDefault();
      moveSticker(sticker.id, move.dx * 3, move.dy * 3);
    } else if (event.key === "Delete" || event.key === "Backspace") {
      event.preventDefault();
      removeSticker(sticker);
    }
  };

  const boardName = ar ? "لوحة الملصقات" : "Sticker board";
  const stickerNames = ar ? "أضيفي" : "Add";

  return (
    <Section id="sticker-locker" className="bg-[color:var(--rose-soft)]/20">
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-semibold md:text-5xl">{boardName}</h2>
        <p className="mx-auto mt-3 max-w-2xl leading-relaxed">
          {ar
            ? "اختاري ملصق عشان تضيفيه. اسحبيه أو حرّكيه بالأسهم في لوحة المفاتيح أو بأزرار التحريك."
            : "Pick a sticker to add it. Drag it into place, or move it with the arrow keys or the move buttons."}
        </p>
      </div>

      <div className="grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="min-w-0 space-y-3">
          <div className="flex flex-wrap items-center justify-end gap-2">
            <button
              type="button"
              onClick={undoClear}
              disabled={!clearedStickers}
              className={controlClass}
            >
              <Undo2 aria-hidden="true" className="size-4" />
              {ar ? "تراجعي عن التفريغ" : "Undo clear"}
            </button>
            <button
              type="button"
              onClick={clearBoard}
              disabled={!stickers.length}
              className={controlClass}
            >
              <Trash2 aria-hidden="true" className="size-4" />
              {ar ? "فرّغي اللوحة" : "Clear board"}
            </button>
          </div>

          <div
            ref={board}
            tabIndex={-1}
            aria-label={boardName}
            role="group"
            onClick={(event) => {
              if (event.target === event.currentTarget) setSelectedId(null);
            }}
            className="relative h-[clamp(16rem,52vw,25rem)] overflow-hidden rounded-3xl border border-[color:var(--border)] bg-[color:var(--card)] shadow-card"
            style={{
              backgroundImage: "radial-gradient(var(--border) 1px, transparent 1px)",
              backgroundSize: "22px 22px",
            }}
          >
            {!stickers.length && (
              <p className="pointer-events-none grid h-full place-items-center px-5 text-center">
                {ar ? "اختاري ملصق عشان تبدأي." : "Pick a sticker to start decorating."}
              </p>
            )}
            {stickers.map((sticker) => (
              <button
                key={sticker.id}
                type="button"
                onPointerDown={(event) => startDrag(event, sticker)}
                onPointerMove={dragSticker}
                onPointerUp={endDrag}
                onLostPointerCapture={endDrag}
                onPointerCancel={endDrag}
                onFocus={() => setSelectedId(sticker.id)}
                onClick={() => setSelectedId(sticker.id)}
                onKeyDown={(event) => handleStickerKeys(event, sticker)}
                aria-label={sticker.design[lang]}
                aria-pressed={sticker.id === selectedId}
                aria-keyshortcuts="ArrowUp ArrowDown ArrowLeft ArrowRight Delete"
                className={
                  "absolute min-h-11 min-w-11 touch-none cursor-grab select-none rounded-xl p-1 active:cursor-grabbing " +
                  (sticker.id === selectedId
                    ? "z-20 ring-2 ring-inset ring-[color:var(--rose-deep)]"
                    : "z-10")
                }
                style={{
                  left: sticker.x + "%",
                  top: sticker.y + "%",
                  transform:
                    "translate(-50%, -50%) rotate(" +
                    sticker.rotation +
                    "deg) scale(" +
                    sticker.scale +
                    ")",
                }}
              >
                <span
                  aria-hidden="true"
                  className={
                    sticker.design.color
                      ? "inline-flex whitespace-nowrap rounded-xl bg-gradient-to-br px-3 py-2 font-semibold text-[#352335] " +
                        sticker.design.color
                      : "block text-4xl leading-none sm:text-5xl"
                  }
                >
                  {sticker.design.art}
                </span>
              </button>
            ))}
          </div>

          {selected && (
            <div className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--card)] p-3">
              <p className="text-sm font-semibold">
                {ar ? "تعديل" : "Editing"} <bdi>{selected.design[lang]}</bdi>
              </p>
              <div
                role="group"
                aria-label={ar ? "تحريك الملصق" : "Move sticker"}
                className="mt-2 flex flex-wrap gap-1.5"
              >
                {moves.map(({ key, dx, dy, ...move }) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => moveSticker(selected.id, dx * 3, dy * 3)}
                    className={controlClass}
                  >
                    {move[lang]}
                  </button>
                ))}
              </div>
              <div
                role="group"
                aria-label={ar ? "تعديل الملصق" : "Adjust sticker"}
                className="mt-2 flex flex-wrap gap-1.5"
              >
                {[
                  {
                    Icon: ZoomIn,
                    en: "Enlarge",
                    ar: "كبّري",
                    update: (sticker: PlacedSticker) => ({
                      ...sticker,
                      scale: clamp(sticker.scale + 0.15, 0.5, 2.5),
                    }),
                  },
                  {
                    Icon: ZoomOut,
                    en: "Shrink",
                    ar: "صغّري",
                    update: (sticker: PlacedSticker) => ({
                      ...sticker,
                      scale: clamp(sticker.scale - 0.15, 0.5, 2.5),
                    }),
                  },
                  {
                    Icon: RotateCcw,
                    en: "Rotate left",
                    ar: "لفّي يسار",
                    update: (sticker: PlacedSticker) => ({
                      ...sticker,
                      rotation: (sticker.rotation - 15) % 360,
                    }),
                  },
                  {
                    Icon: RotateCw,
                    en: "Rotate right",
                    ar: "لفّي يمين",
                    update: (sticker: PlacedSticker) => ({
                      ...sticker,
                      rotation: (sticker.rotation + 15) % 360,
                    }),
                  },
                ].map(({ Icon, update, ...label }) => (
                  <button
                    key={label.en}
                    type="button"
                    aria-label={label[lang]}
                    title={label[lang]}
                    onClick={() => updateSticker(selected.id, update)}
                    className={controlClass}
                  >
                    <Icon aria-hidden="true" className="size-4" />
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => removeSticker(selected)}
                  className={controlClass}
                >
                  <Trash2 aria-hidden="true" className="size-4" />
                  {ar ? "شيلي الملصق" : "Remove sticker"}
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="min-w-0 self-start rounded-3xl border border-[color:var(--border)] bg-[color:var(--card)] p-4 shadow-card sm:p-6">
          <h3 className="text-xl font-semibold">{ar ? "اختاري ملصق" : "Pick a sticker"}</h3>
          <div className="mt-4 grid grid-cols-4 gap-2">
            {stickerDesigns.map((design) => (
              <button
                key={design.art}
                type="button"
                aria-label={stickerNames + " " + design[lang]}
                onClick={() => addSticker(design)}
                className={controlClass + " px-1 text-xl"}
              >
                <span aria-hidden="true">{design.art}</span>
              </button>
            ))}
          </div>
          <h3 className="mt-6 text-lg font-semibold">{ar ? "ملصقات بعبارات" : "Word stickers"}</h3>
          <div className="mt-3 flex flex-wrap gap-2">
            {wordDesigns.map((design) => (
              <button
                key={design.art}
                type="button"
                aria-label={stickerNames + " " + design[lang]}
                onClick={() => addSticker(design)}
                className={controlClass + " bg-gradient-to-br text-[#352335] " + design.color}
              >
                <bdi>{design.art}</bdi>
              </button>
            ))}
          </div>
          <p role="status" className="mt-3 min-h-5 text-sm">
            {feedback}
          </p>
        </div>
      </div>
    </Section>
  );
}
