import { lazy, Suspense, useEffect, useState } from "react";
import {
  BookHeart,
  Camera,
  Check,
  ChevronDown,
  Download,
  Expand,
  Images,
  Link2,
  RotateCcw,
  RotateCw,
  Scissors,
  Shirt,
  Sparkles,
  Trash2,
  UserRound,
} from "lucide-react";
import { useI18n } from "@/lib/i18n";
import {
  copyPortrait,
  defaultLook,
  downloadImage,
  dressUpOptions,
  looksMatch,
  lookPresets,
  shareLookUrl,
  type DressUpCostume,
  type DressUpLook,
  type LookKey,
  type ScrapbookEntry,
} from "./look";

const Stage = lazy(() => import("./DressUpStage"));

const wardrobePanels = [
  { id: "outfit", en: "Clothes", ar: "الملابس", icon: Shirt, fields: ["outfit", "palette"] },
  {
    id: "character",
    en: "Doll",
    ar: "الدمية",
    icon: UserRound,
    fields: ["hairStyle", "hairColor", "skin"],
  },
  {
    id: "details",
    en: "Details",
    ar: "التفاصيل",
    icon: Sparkles,
    fields: ["accessory", "backdrop"],
  },
] as const satisfies readonly {
  id: string;
  en: string;
  ar: string;
  icon: typeof Shirt;
  fields: readonly LookKey[];
}[];

const fieldNames = {
  outfit: { en: "Silhouette", ar: "تصميم الملابس" },
  palette: { en: "Fabric color", ar: "لون القماش" },
  hairStyle: { en: "Hair & headwear", ar: "تسريحة الشعر وغطاء الرأس" },
  hairColor: { en: "Color", ar: "اللون" },
  skin: { en: "Skin tone", ar: "لون البشرة" },
  accessory: { en: "Accessory", ar: "الإكسسوارات" },
  backdrop: { en: "Studio backdrop", ar: "خلفية الاستوديو" },
} satisfies Record<LookKey, { en: string; ar: string }>;

const challenges = [
  {
    id: "garden",
    name: { en: "Garden Party", ar: "حفلة الحديقة" },
    clues: [
      {
        field: "outfit",
        value: "petal-dress",
        en: "Wear the petal dress",
        ar: "اختاري فستان البتلات",
      },
      {
        field: "accessory",
        value: "pearl-necklace",
        en: "Add a pearl necklace",
        ar: "أضيفي عقد لؤلؤ",
      },
      {
        field: "backdrop",
        value: "mint",
        en: "Use the Glasshouse backdrop",
        ar: "اختاري خلفية الحديقة الزجاجية",
      },
    ],
  },
  {
    id: "weekend",
    name: { en: "Weekend Café", ar: "مقهى نهاية الأسبوع" },
    clues: [
      {
        field: "outfit",
        value: "garden-overalls",
        en: "Wear the garden overalls",
        ar: "اختاري أفرول الحديقة",
      },
      { field: "palette", value: "lilac", en: "Choose lilac fabric", ar: "اختاري قماشًا ليلكيًا" },
      {
        field: "accessory",
        value: "heart-purse",
        en: "Add the heart purse",
        ar: "أضيفي حقيبة القلب",
      },
    ],
  },
  {
    id: "evening",
    name: { en: "Eid Evening", ar: "أمسية العيد" },
    clues: [
      {
        field: "outfit",
        value: "embroidered-abaya",
        en: "Wear the embroidered abaya",
        ar: "اختاري العباية المطرّزة",
      },
      {
        field: "hairStyle",
        value: "wrap",
        en: "Choose the silk hijab",
        ar: "اختاري الحجاب الحريري",
      },
      {
        field: "backdrop",
        value: "midnight",
        en: "Use the Midnight backdrop",
        ar: "اختاري خلفية منتصف الليل",
      },
    ],
  },
] as const;

const copy = {
  en: {
    doll: "3D fashion doll",
    loading: "Opening the fitting room…",
    unavailable:
      "This device couldn’t open the 3D preview. You can still style and share the look.",
    view: "Doll view controls",
    rotateLeft: "Rotate left",
    rotateRight: "Rotate right",
    front: "Front view",
    closeUp: "Close-up",
    full: "Full look",
    photo: "Download photo",
    copy: "Copy look link",
    copied: "Look link copied.",
    share: "Share this link",
    wardrobe: "Wardrobe",
    reset: "Reset look",
    presets: "Outfit presets",
    categories: "Wardrobe categories",
    challenge: "Runway challenge",
    check: "Check my look",
    points: (matched: number, awarded: number) =>
      `${matched} of 3 details matched.${awarded ? ` +${awarded} Carrot Coins` : ""}`,
    scrapbook: "Scrapbook",
    caption: "Caption",
    newCaption: "My studio look",
    save: "Save look",
    saved: "Saved to your scrapbook.",
    saveError: "Couldn’t update the scrapbook on this device.",
    imageError: "Couldn’t capture the photo. Try again when the 3D view is ready.",
    empty: "Save a look to start your scrapbook.",
    remove: "Remove entry",
    removed: "Entry removed.",
    open: "Wear this look",
    download: "Download image",
  },
  ar: {
    doll: "دمية أزياء ثلاثية الأبعاد",
    loading: "جارٍ فتح غرفة القياس…",
    unavailable:
      "تعذّر فتح المعاينة ثلاثية الأبعاد على هذا الجهاز. ما زال بإمكانكِ تنسيق الإطلالة ومشاركتها.",
    view: "أدوات التحكم بعرض الدمية",
    rotateLeft: "تدوير إلى اليسار",
    rotateRight: "تدوير إلى اليمين",
    front: "عرض أمامي",
    closeUp: "عرض مقرّب",
    full: "الإطلالة كاملة",
    photo: "تحميل الصورة",
    copy: "نسخ رابط الإطلالة",
    copied: "تم نسخ رابط الإطلالة.",
    share: "رابط المشاركة",
    wardrobe: "خزانة الملابس",
    reset: "إعادة ضبط الإطلالة",
    presets: "إطلالات جاهزة",
    categories: "أقسام خزانة الملابس",
    challenge: "تحدّي عرض الأزياء",
    check: "تحقّقي من إطلالتكِ",
    points: (matched: number, awarded: number) => {
      const arNumber = new Intl.NumberFormat("ar");
      return `التفاصيل المطابقة: ${arNumber.format(matched)} من ٣.${awarded ? ` +${arNumber.format(awarded)} عملة جزر` : ""}`;
    },
    scrapbook: "دفتر الإطلالات",
    caption: "التعليق",
    newCaption: "إطلالتي في الاستوديو",
    save: "احفظي الإطلالة",
    saved: "حُفظت الإطلالة في دفتركِ.",
    saveError: "تعذّر تحديث دفتر الإطلالات على هذا الجهاز.",
    imageError: "تعذّر التقاط الصورة. حاولي مجددًا عندما تصبح المعاينة جاهزة.",
    empty: "احفظي إطلالة لبدء دفتر الإطلالات.",
    remove: "حذف الإطلالة",
    removed: "حُذفت الإطلالة.",
    open: "ارتدي هذه الإطلالة",
    download: "تحميل الصورة",
  },
};

type Props = {
  look: DressUpLook;
  costume: DressUpCostume;
  canvas: HTMLCanvasElement | null;
  scrapbook: ScrapbookEntry[];
  onLookChange: (look: DressUpLook) => void;
  onCanvasReady: (canvas: HTMLCanvasElement | null) => void;
  onSave: (caption: string, image: string, look: DressUpLook) => boolean;
  onRemove: (id: string) => boolean;
  onReward: (coins: number) => void;
};

export function DressUpStudio({
  look,
  costume,
  canvas,
  scrapbook,
  onLookChange,
  onCanvasReady,
  onSave,
  onRemove,
  onReward,
}: Props) {
  const { lang } = useI18n();
  const t = copy[lang];
  const [mounted, setMounted] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [portrait, setPortrait] = useState(false);
  const [panel, setPanel] = useState<(typeof wardrobePanels)[number]["id"]>("outfit");
  const [caption, setCaption] = useState("");
  const [status, setStatus] = useState<"copied" | "imageError" | null>(null);
  const [scrapbookStatus, setScrapbookStatus] = useState<
    "saved" | "removed" | "saveError" | "imageError" | null
  >(null);
  const [shareUrl, setShareUrl] = useState("");
  const [challengeId, setChallengeId] = useState<string>(challenges[0].id);
  const [score, setScore] = useState<{
    id: string;
    look: DressUpLook;
    matched: number;
    awarded: number;
  }>();
  const [rewards, setRewards] = useState<Record<string, number>>({});

  useEffect(() => setMounted(true), []);

  const selectedPanel = wardrobePanels.find((item) => item.id === panel) ?? wardrobePanels[0];
  const challenge = challenges.find((item) => item.id === challengeId) ?? challenges[0];

  const updateLook = (next: DressUpLook) => {
    setShareUrl("");
    setStatus(null);
    onLookChange(next);
  };

  const takePhoto = () => {
    try {
      if (!canvas) return;
      downloadImage(copyPortrait(canvas).toDataURL("image/png"), "girly-vibes-look");
    } catch {
      setStatus("imageError");
    }
  };

  const copyLook = async () => {
    const href = shareLookUrl(window.location.origin, look);
    try {
      await navigator.clipboard.writeText(href);
      setShareUrl("");
      setStatus("copied");
    } catch {
      setShareUrl(href);
      setStatus(null);
    }
  };

  const saveLook = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    let image = "";
    try {
      if (canvas) image = copyPortrait(canvas, 480).toDataURL("image/webp", 0.88);
    } catch {
      setScrapbookStatus("imageError");
      return;
    }
    if (onSave(caption.trim() || t.newCaption, image, look)) {
      setCaption("");
      setScrapbookStatus("saved");
    } else {
      setScrapbookStatus("saveError");
    }
  };

  const checkChallenge = () => {
    const matched = challenge.clues.filter((clue) => look[clue.field] === clue.value).length;
    const total = [0, 10, 30, 60][matched];
    const awarded = Math.max(0, total - (rewards[challenge.id] ?? 0));
    if (awarded) {
      setRewards({ ...rewards, [challenge.id]: total });
      onReward(awarded);
    }
    setScore({ id: challenge.id, look, matched, awarded });
  };

  const loadingView = (
    <div className="atelier-stage-loading" role="status">
      <Sparkles aria-hidden="true" size={26} />
      <p>{t.loading}</p>
    </div>
  );

  return (
    <section id="dress-up" className="atelier" aria-label={t.doll}>
      <div className="atelier-layout">
        <div className="atelier-card atelier-view-card">
          <div className="atelier-stage" data-backdrop={look.backdrop}>
            {mounted ? (
              <Suspense fallback={loadingView}>
                <Stage
                  look={{ ...look, costume }}
                  rotation={rotation}
                  onRotate={setRotation}
                  portrait={portrait}
                  label={t.doll}
                  loadingLabel={t.loading}
                  unavailableLabel={t.unavailable}
                  onCanvasReady={onCanvasReady}
                />
              </Suspense>
            ) : (
              loadingView
            )}
          </div>
          <div className="atelier-view-actions" role="group" aria-label={t.view}>
            <button
              aria-label={t.rotateLeft}
              title={t.rotateLeft}
              type="button"
              onClick={() => setRotation((value) => value - Math.PI / 6)}
            >
              <RotateCcw aria-hidden="true" size={19} />
            </button>
            <button
              aria-label={t.rotateRight}
              title={t.rotateRight}
              type="button"
              onClick={() => setRotation((value) => value + Math.PI / 6)}
            >
              <RotateCw aria-hidden="true" size={19} />
            </button>
            <button type="button" onClick={() => setRotation(0)}>
              {t.front}
            </button>
            <button type="button" onClick={() => setPortrait(!portrait)}>
              <Expand aria-hidden="true" size={17} /> {portrait ? t.full : t.closeUp}
            </button>
          </div>
        </div>

        <div className="atelier-card atelier-wardrobe">
          <div className="atelier-wardrobe-heading">
            <h2>{t.wardrobe}</h2>
            <button
              type="button"
              onClick={() => {
                updateLook(defaultLook);
                setRotation(0);
                setPortrait(false);
              }}
            >
              {t.reset}
            </button>
          </div>

          <div className="atelier-presets" role="group" aria-label={t.presets}>
            {lookPresets.map((item) => (
              <button
                key={item.id}
                type="button"
                aria-pressed={looksMatch(look, item.look)}
                onClick={() => updateLook(item.look)}
              >
                {item.name[lang]}
              </button>
            ))}
          </div>

          <div className="atelier-panels" role="group" aria-label={t.categories}>
            {wardrobePanels.map((item) => (
              <button
                key={item.id}
                type="button"
                aria-pressed={panel === item.id}
                onClick={() => setPanel(item.id)}
              >
                <item.icon aria-hidden="true" size={18} /> {item[lang]}
              </button>
            ))}
          </div>

          <div className="atelier-fields">
            {selectedPanel.fields.map((field) => (
              <fieldset className="atelier-field" data-field={field} key={field}>
                <legend>{fieldNames[field][lang]}</legend>
                <div className="atelier-options">
                  {dressUpOptions[field].map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      aria-pressed={look[field] === item.id}
                      onClick={() => updateLook({ ...look, [field]: item.id })}
                    >
                      {field === "outfit" && (
                        <img
                          className="atelier-outfit-thumb"
                          src={"/games/dress-up/" + item.id + ".webp"}
                          width={112}
                          height={176}
                          alt=""
                        />
                      )}
                      {"swatch" in item && (
                        <span
                          className="atelier-swatch"
                          aria-hidden="true"
                          style={{ backgroundColor: item.swatch }}
                        />
                      )}
                      {item.label[lang]}
                    </button>
                  ))}
                </div>
              </fieldset>
            ))}
          </div>

          <div className="atelier-photo-actions">
            <button
              className="atelier-primary"
              type="button"
              onClick={takePhoto}
              disabled={!canvas}
            >
              <Camera aria-hidden="true" size={19} /> {t.photo}
            </button>
            <button type="button" onClick={copyLook}>
              <Link2 aria-hidden="true" size={19} /> {t.copy}
            </button>
          </div>
          {shareUrl && (
            <label className="atelier-share">
              {t.share}
              <input
                value={shareUrl}
                readOnly
                dir="ltr"
                onFocus={(event) => event.currentTarget.select()}
              />
            </label>
          )}
          <p role="status" className="atelier-status">
            {status && t[status]}
          </p>
        </div>
      </div>

      <div className="atelier-extras">
        <details className="atelier-card atelier-detail">
          <summary>
            <Scissors aria-hidden="true" size={20} />
            <span>{t.challenge}</span>
            <ChevronDown className="atelier-chevron" aria-hidden="true" size={19} />
          </summary>
          <div className="atelier-detail-content">
            <select
              aria-label={t.challenge}
              value={challengeId}
              onChange={(event) => {
                setChallengeId(event.target.value);
                setScore(undefined);
              }}
            >
              {challenges.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name[lang]}
                </option>
              ))}
            </select>
            <ul className="atelier-challenge-clues">
              {challenge.clues.map((clue) => (
                <li key={clue.field}>
                  {look[clue.field] === clue.value && <Check aria-hidden="true" size={16} />}
                  {clue[lang]}
                </li>
              ))}
            </ul>
            <button className="atelier-primary" type="button" onClick={checkChallenge}>
              {t.check}
            </button>
            <p role="status" className="atelier-status">
              {score?.id === challengeId && looksMatch(score.look, look)
                ? t.points(score.matched, score.awarded)
                : null}
            </p>
          </div>
        </details>

        <details className="atelier-card atelier-detail">
          <summary>
            <BookHeart aria-hidden="true" size={20} />
            <span>{t.scrapbook}</span>
            <ChevronDown className="atelier-chevron" aria-hidden="true" size={19} />
          </summary>
          <div className="atelier-detail-content">
            <form className="atelier-caption" onSubmit={saveLook}>
              <label>
                {t.caption}
                <input
                  type="text"
                  value={caption}
                  maxLength={80}
                  placeholder={t.newCaption}
                  onChange={(event) => setCaption(event.target.value)}
                />
              </label>
              <button className="atelier-primary" type="submit">
                {t.save}
              </button>
            </form>
            <p role="status" className="atelier-status">
              {scrapbookStatus && t[scrapbookStatus]}
            </p>
            {scrapbook.length ? (
              <ul className="atelier-scrapbook">
                {scrapbook.map((item) => (
                  <li key={item.id}>
                    <div className="atelier-saved-preview">
                      {item.image ? (
                        <img src={item.image} alt="" loading="lazy" />
                      ) : (
                        <Images aria-hidden="true" size={22} />
                      )}
                    </div>
                    <p dir="auto">{item.caption}</p>
                    <div className="atelier-saved-actions">
                      {item.look && (
                        <button type="button" onClick={() => item.look && updateLook(item.look)}>
                          {t.open}
                        </button>
                      )}
                      {item.image && (
                        <button
                          type="button"
                          aria-label={t.download}
                          title={t.download}
                          onClick={() =>
                            item.image && downloadImage(item.image, "girly-vibes-scrapbook")
                          }
                        >
                          <Download aria-hidden="true" size={17} />
                        </button>
                      )}
                      <button
                        type="button"
                        aria-label={t.remove}
                        title={t.remove}
                        onClick={() =>
                          setScrapbookStatus(onRemove(item.id) ? "removed" : "saveError")
                        }
                      >
                        <Trash2 aria-hidden="true" size={17} />
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="atelier-empty">{t.empty}</p>
            )}
          </div>
        </details>
      </div>
    </section>
  );
}
