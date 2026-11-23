type Labels = { en: string; ar: string };
type LookOption = { id: string; label: Labels; swatch?: string };

export const dressUpOptions = {
  outfit: [
    { id: "petal-dress", label: { en: "Petal dress", ar: "فستان البتلات" } },
    { id: "bow-blouse", label: { en: "Bow blouse", ar: "بلوزة بفيونكة" } },
    { id: "garden-overalls", label: { en: "Garden overalls", ar: "أفرول الحديقة" } },
    { id: "embroidered-abaya", label: { en: "Embroidered abaya", ar: "عباية مطرّزة" } },
  ],
  palette: [
    { id: "rose", label: { en: "Rose", ar: "وردي" }, swatch: "#ce7b92" },
    { id: "lilac", label: { en: "Lilac", ar: "ليلكي" }, swatch: "#a795d5" },
    { id: "mint", label: { en: "Mint", ar: "نعناعي" }, swatch: "#83b39c" },
    { id: "berry", label: { en: "Berry", ar: "توتي" }, swatch: "#894a68" },
  ],
  hairStyle: [
    { id: "waves", label: { en: "Soft waves", ar: "تموّجات ناعمة" } },
    { id: "bob", label: { en: "Parisian bob", ar: "شعر قصير" } },
    { id: "bun", label: { en: "Twisted bun", ar: "كعكة ملتفّة" } },
    { id: "wrap", label: { en: "Silk hijab", ar: "حجاب حريري" } },
  ],
  hairColor: [
    { id: "espresso", label: { en: "Espresso", ar: "بني داكن" }, swatch: "#432824" },
    { id: "chestnut", label: { en: "Chestnut", ar: "كستنائي" }, swatch: "#925938" },
    { id: "rosewood", label: { en: "Rosewood", ar: "وردي خشبي" }, swatch: "#994d64" },
    { id: "honey", label: { en: "Honey", ar: "عسلي" }, swatch: "#dca464" },
  ],
  skin: [
    { id: "porcelain", label: { en: "Porcelain", ar: "عاجي" }, swatch: "#f4c3a8" },
    { id: "honey", label: { en: "Warm honey", ar: "عسلي دافئ" }, swatch: "#c98562" },
    { id: "umber", label: { en: "Deep umber", ar: "بني عميق" }, swatch: "#8f533e" },
  ],
  accessory: [
    { id: "none", label: { en: "None", ar: "بدون" } },
    { id: "pearl-necklace", label: { en: "Pearls", ar: "عقد لؤلؤ" } },
    { id: "ribbon", label: { en: "Satin ribbon", ar: "فيونكة ساتان" } },
    { id: "heart-purse", label: { en: "Heart purse", ar: "حقيبة قلب" } },
  ],
  backdrop: [
    { id: "rose", label: { en: "Rose salon", ar: "صالون وردي" }, swatch: "#e8afbc" },
    { id: "lilac", label: { en: "Lilac hour", ar: "أمسية ليلكية" }, swatch: "#b4a0d7" },
    { id: "mint", label: { en: "Glasshouse", ar: "الحديقة الزجاجية" }, swatch: "#a1c9b4" },
    { id: "midnight", label: { en: "Midnight", ar: "منتصف الليل" }, swatch: "#554363" },
  ],
} as const satisfies Record<string, readonly LookOption[]>;

export type LookKey = keyof typeof dressUpOptions;
export type DressUpLook = { [Key in LookKey]: (typeof dressUpOptions)[Key][number]["id"] };
export type DressUpCostume = "none" | "wings" | "hat";

const lookKeys = Object.keys(dressUpOptions) as LookKey[];

export const defaultLook: DressUpLook = {
  outfit: "petal-dress",
  palette: "rose",
  hairStyle: "waves",
  hairColor: "espresso",
  skin: "porcelain",
  accessory: "pearl-necklace",
  backdrop: "rose",
};

export const lookPresets = [
  { id: "rose-garden", name: { en: "Rose Garden", ar: "حديقة الورد" }, look: defaultLook },
  {
    id: "lilac-weekend",
    name: { en: "Lilac Weekend", ar: "عطلة ليلكية" },
    look: {
      ...defaultLook,
      outfit: "garden-overalls",
      palette: "lilac",
      hairStyle: "bob",
      hairColor: "chestnut",
      accessory: "heart-purse",
      backdrop: "mint",
    },
  },
  {
    id: "eid-evening",
    name: { en: "Eid Evening", ar: "أمسية العيد" },
    look: {
      ...defaultLook,
      outfit: "embroidered-abaya",
      palette: "berry",
      hairStyle: "wrap",
      hairColor: "rosewood",
      accessory: "ribbon",
      backdrop: "midnight",
    },
  },
] as const satisfies readonly { id: string; name: Labels; look: DressUpLook }[];

export function looksMatch(first: DressUpLook, second: DressUpLook) {
  return lookKeys.every((key) => first[key] === second[key]);
}

const draftStorageKey = "gv-dress-up-look";
const scrapbookStorageKey = "gv-doll-scrapbook";

function readLook(value: unknown, base = defaultLook): DressUpLook {
  if (typeof value !== "object" || value === null) return base;
  const record = value as Record<string, unknown>;
  const parsed = { ...base };
  for (const key of lookKeys) {
    const option = dressUpOptions[key].find(({ id }) => id === record[key]);
    if (option) Object.assign(parsed, { [key]: option.id });
  }
  return parsed;
}

function readLegacyLook(record: Record<string, unknown>) {
  const legacyOutfits = {
    cardigan: "embroidered-abaya",
    strawberry: "bow-blouse",
    hoodie: "embroidered-abaya",
    tank: "bow-blouse",
    shrug: "petal-dress",
    blazer: "bow-blouse",
  };
  const legacyBackdrops = {
    "pink-room": "rose",
    sky: "lilac",
    "teal-records": "mint",
    garden: "midnight",
  };
  const legacyAccessories = {
    clips: "ribbon",
    ears: "pearl-necklace",
    headphones: "heart-purse",
    milk: "none",
    necklace: "pearl-necklace",
    none: "none",
  };
  const legacyHair = {
    braids: "espresso",
    waves: "rosewood",
    buns: "espresso",
    bob: "chestnut",
    crinkle: "honey",
    floral: "rosewood",
  };
  function option(options: Record<string, string>, value: unknown) {
    return typeof value === "string" && Object.hasOwn(options, value) ? options[value] : undefined;
  }

  const hairColor = option(legacyHair, record.hair);
  const outfit = option(legacyOutfits, record.top);
  const backdrop = option(legacyBackdrops, record.bg);
  const accessory = option(legacyAccessories, record.acc);
  const trousers =
    record.bottom === "overalls" || record.bottom === "jeans" || record.bottom === "linen";
  const skirt =
    record.bottom === "skirt" || record.bottom === "pleated" || record.bottom === "shorts";
  if (!hairColor && !outfit && !backdrop && !accessory && !trousers && !skirt) return null;

  return readLook({
    hairStyle: hairColor ? "wrap" : defaultLook.hairStyle,
    hairColor,
    outfit: outfit === "embroidered-abaya" ? outfit : trousers ? "garden-overalls" : outfit,
    palette: record.top === "strawberry" ? "berry" : record.top === "hoodie" ? "lilac" : undefined,
    accessory,
    backdrop,
  });
}

export function initialDressUpLook(
  params: URLSearchParams,
  getStorage: () => Storage,
): DressUpLook {
  const sharedLook = params.get("look");
  if (sharedLook) {
    const optionIds = sharedLook.split("~");
    const shared = Object.fromEntries(lookKeys.map((key, index) => [key, optionIds[index]]));
    return readLook(shared);
  }
  const legacy = readLegacyLook(Object.fromEntries(params.entries()));
  if (legacy) return legacy;
  try {
    return readLook(JSON.parse(getStorage().getItem(draftStorageKey) ?? "null"));
  } catch {
    return defaultLook;
  }
}

export function saveDressUpLook(storage: Storage, look: DressUpLook) {
  storage.setItem(draftStorageKey, JSON.stringify(look));
}

export function shareLookUrl(origin: string, look: DressUpLook) {
  const url = new URL("/games", origin);
  url.searchParams.set("look", lookKeys.map((key) => look[key]).join("~"));
  return url.href;
}

export type ScrapbookEntry = { id: string; caption: string; image?: string; look?: DressUpLook };

export function readScrapbook(storage: Storage): ScrapbookEntry[] {
  try {
    const entries: unknown = JSON.parse(storage.getItem(scrapbookStorageKey) ?? "[]");
    if (!Array.isArray(entries)) return [];
    return entries.flatMap((entry: unknown) => {
      if (typeof entry !== "object" || entry === null) return [];
      const { id, caption, image, look, ...legacy } = entry as Record<string, unknown>;
      if (typeof id !== "string" || typeof caption !== "string") return [];
      const savedImage =
        typeof image === "string" && /^data:image\/(?:png|webp|jpeg);base64,/i.test(image)
          ? image
          : undefined;
      return [
        {
          id,
          caption,
          image: savedImage,
          look: look ? readLook(look) : (readLegacyLook(legacy) ?? undefined),
        },
      ];
    });
  } catch {
    return [];
  }
}

export function writeScrapbook(storage: Storage, entries: ScrapbookEntry[]) {
  storage.setItem(scrapbookStorageKey, JSON.stringify(entries));
}

export function copyPortrait(source: HTMLCanvasElement, maxSide = 840) {
  const canvas = document.createElement("canvas");
  const scale = Math.min(1, maxSide / Math.max(source.width, source.height));
  canvas.width = Math.max(1, Math.round(source.width * scale));
  canvas.height = Math.max(1, Math.round(source.height * scale));
  const context = canvas.getContext("2d");
  if (!context) throw new Error("Image canvas unavailable");
  context.drawImage(source, 0, 0, canvas.width, canvas.height);
  return canvas;
}

export function downloadImage(image: string, filename: string) {
  const format = image.startsWith("data:image/webp")
    ? "webp"
    : image.startsWith("data:image/jpeg")
      ? "jpg"
      : "png";
  const link = document.createElement("a");
  link.href = image;
  link.download = filename + "." + format;
  link.click();
}
