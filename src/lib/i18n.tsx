import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type Lang = "ar" | "en";

type Dict = Record<string, string>;

const ar: Dict = {
  "nav.home": "الرئيسية",
  "nav.features": "المزايا",
  "nav.calm": "غرفة الهدوء",
  "nav.glow": "نقاط الجلو",
  "nav.youtube": "يوتيوب",
  "nav.updates": "التحديثات",
  "nav.faq": "أسئلة",
  "nav.download": "حمّلي التطبيق",

  "hero.eyebrow": "مساحتك الخاصة 🩷",
  "hero.title": "مساحتك اللطيفة للجلو أب والهدوء.",
  "hero.subtitle": "روتينك، يومياتك، قراءاتك، ولحظات هدوءك… كلها في مكان واحد. خطوات صغيرة تخليكِ تحسّي بنفسك أكثر كل يوم.",
  "hero.cta.download": "حمّلي التطبيق",
  "hero.cta.youtube": "شوفي اليوتيوب",
  "hero.cta.features": "اكتشفي المزايا",
  "hero.chip.lang": "عربي + إنجليزي",
  "hero.chip.offline": "يشتغل أوفلاين",
  "hero.chip.calm": "تمارين هدوء",
  "hero.chip.points": "نقاط الجلو",
  "hero.chip.private": "ملاحظات خاصة",
  "hero.chip.teen": "خاص للبنات",

  "about.title": "إيه هي Girly Vibes؟",
  "about.lead": "في أيام تحبي تعملي جلو أب، وفي أيام محتاجة بس دقيقة هادية. Girly Vibes بتديكِ الاتنين.",
  "about.body": "مش تطبيق إنتاجية للكبار. ده ركن لطيف ليكِ، فيه روتين، يوميات، قراءات، غرفة هدوء، رؤية بورد، أنشطة لمّا تتمللي، ولوحة نقاط أسبوعية. كله مرتب وهادي ومصمم بحب.",

  "features.title": "كل اللي محتاجاه في مكان واحد",
  "features.routines.t": "الروتين اليومي",
  "features.routines.d": "روتين الصباح، المدرسة، المساء، الشاور، والنظافة. تابعي خطواتك واعملي روتينك الخاص.",
  "features.glow.t": "نقاط الجلو",
  "features.glow.d": "اجمعي نقاط لمّا تكملي روتينك. اللوحة بتتجدد كل أسبوع — فرصة جديدة لكل بنت.",
  "features.calm.t": "غرفة الهدوء",
  "features.calm.d": "تمارين تنفس وكلمات لطيفة لمّا الدنيا تحس كبيرة. للقلق، الحزن، النوم، والثقة.",
  "features.read.t": "قراءات",
  "features.read.d": "نصايح حقيقية للحياة، الثقة، المدرسة، النظافة، والمشاعر. احفظي اللي يلمس قلبك.",
  "features.diary.t": "يوميات وملاحظات",
  "features.diary.d": "اكتبي مزاجك، ملاحظاتك، أفكارك. يوميات خاصة بكود سري لأفكارك الحساسة.",
  "features.vision.t": "رؤية بورد",
  "features.vision.d": "اختاري صور تلهمكِ وضعيها في إطار جميل. بورد أحلامك بشكل لطيف.",
  "features.bored.t": "ضد الملل",
  "features.bored.d": "أفكار أنشطة أوفلاين: رتبي غرفتك، اكتبي رسالة لنفسك المستقبلية، جربي تسريحة جديدة.",
  "features.youtube.t": "متصل باليوتيوب",
  "features.youtube.d": "شوفي فيديو، وكملي التحدي جوه التطبيق. لمّ نقاطك واكتبيها في الكومنتات.",
  "features.widgets.t": "ويدجتس للهوم",
  "features.widgets.d": "نقاطك، اللوحة، قراءة اليوم، وغرفة الهدوء — كلها على شاشة هاتفك مباشرة.",

  "calm.title": "غرفة الهدوء",
  "calm.lead": "لمّا الأفكار تبقى عالية، خذي دقيقة هنا.",
  "calm.c1": "لمّا أفكاري عالية",
  "calm.c2": "لمّا النوم بعيد",
  "calm.c3": "لمّا قلبي تقيل",
  "calm.c4": "لمّا محتاجة بداية صغيرة",
  "calm.disclaimer": "Girly Vibes للدعم اللطيف والعناية بالنفس. لو حسيتي إنك مش بخير، تكلمي مع شخص بالغ تثقي فيه أو خط دعم محلي.",
  "calm.breathe": "خذي نفس",

  "glow.title": "نقاط الجلو ولوحة الأسبوع",
  "glow.lead": "نقاطك بتتجدد كل أسبوع — كل بنت بتبدأ من جديد.",
  "glow.motiv": "١٪ أحسن كل يوم… برضو بيتحسب.",
  "glow.reset": "الباقي على التجديد",
  "glow.you": "نقاطك",

  "youtube.title": "قناة اليوتيوب",
  "youtube.lead": "شوفي فيديو اليوم، وكملي التحدي معانا.",
  "youtube.subscribe": "اشتركي في القناة",
  "youtube.watch": "تشغيل",
  "youtube.featured": "فيديو الأسبوع",
  "youtube.challenge": "تحدي هذا الأسبوع",
  "youtube.challenge.body": "بعد ما تخلصي الفيديو، افتحي التطبيق ولمّي نقاطك. اكتبي نقاطك تحت الفيديو ونشوف مين الأعلى الأسبوع ده 💗",

  "themes.title": "ثيمات داخل التطبيق",
  "themes.lead": "اختاري الجو اللي يناسبك.",

  "widgets.title": "ويدجتس على شاشتك",
  "widgets.lead": "نقاطك وقراءتك وهدوءك في خطوة واحدة.",

  "updates.title": "الجديد",
  "updates.lead": "آخر التحديثات والمزايا.",

  "download.title": "حمّلي Girly Vibes",
  "download.lead": "ابدئي يومك بخطوة صغيرة لطيفة.",
  "download.google": "قريبًا على جوجل بلاي",
  "download.apple": "قريبًا",

  "faq.title": "أسئلة بتيجي في بالك",
  "faq.q1": "Girly Vibes مجاني؟",
  "faq.a1": "أيوه، التطبيق مجاني للاستخدام مع مزايا ممكن تضاف لاحقًا.",
  "faq.q2": "التطبيق بالعربي؟",
  "faq.a2": "أكيد. عربي وإنجليزي، وبتقدري تبدّلي وقت ما تحبي.",
  "faq.q3": "يشتغل أوفلاين؟",
  "faq.a3": "معظم المزايا تشتغل من غير نت، زي الروتين والملاحظات وغرفة الهدوء.",
  "faq.q4": "يومياتي خاصة؟",
  "faq.a4": "بياناتك بتتخزن على هاتفك، ويوجد وضع يوميات خاص بكود سري للأفكار الحساسة.",
  "faq.q5": "غرفة الهدوء علاج نفسي؟",
  "faq.a5": "لأ. هي دعم لطيف وتمارين هدوء. لو محتاجة مساعدة حقيقية، تكلمي مع شخص بالغ تثقي فيه.",
  "faq.q6": "إزاي تشتغل نقاط الجلو؟",
  "faq.a6": "خلصي روتين تكسبي نقاط. الروتين الافتراضي بيدي نقاط أكثر من المخصص، والنقاط بتتجدد أسبوعيًا.",
  "faq.q7": "ينفع أستخدمه بدون إنترنت؟",
  "faq.a7": "أيوه، معظم المزايا أوفلاين. بعض الحاجات زي اللوحة العامة تحتاج نت.",
  "faq.q8": "فين أتفرج على فيديوهات اليوتيوب؟",
  "faq.a8": "روابط القناة في كل صفحة، وكمان قسم خاص في التطبيق.",

  "footer.tagline": "مساحتك اللطيفة للجلو أب والهدوء.",
  "footer.rights": "© Girly Vibes — كل الحقوق محفوظة.",
  "footer.privacy": "الخصوصية",
  "footer.terms": "الشروط",
  "footer.contact": "تواصلي",

  "nav.games": "ألعاب البنات 🎮",
  "games.title": "ركن ألعاب البنات 🌸",
  "games.subtitle": "ألعاب ممتعة ولطيفة ومصممة خصيصاً لكِ! جربي ستوديو التلبيس أو اعتني بالأرنوب كوكو 🐰",
  "games.dressup.title": "🌸 ستوديو تصميم الأزياء",
  "games.dressup.subtitle": "نسقي تسريحة الشعر، الملابس، والملحقات اللطيفة لخلق شخصيتكِ المثالية!",
  "games.pet.title": "🐰 الأرنوب اللطيف كوكو",
  "games.pet.subtitle": "اعتني بصديقكِ الرقمي الجديد. أطعميه، داعبيه، العبي معه بالبالونات، أو دعيه ينام بهدوء.",
  "games.dressup.hair": "الشعر 🎀",
  "games.dressup.tops": "البلوزات 👚",
  "games.dressup.bottoms": "التنانير/البنطلونات 👖",
  "games.dressup.acc": "الإكسسوارات 👑",
  "games.dressup.bg": "الخلفية 🖼️",
  "games.pet.pet": "مداعبة 👋",
  "games.pet.feed": "إطعام 🍰",
  "games.pet.play": "لعب بالونات 🎈",
  "games.pet.sleep": "نوم 💤",
  "games.pet.love": "الحب ❤️",
  "games.pet.energy": "الطاقة ⚡",
  "games.pet.status.happy": "كوكو سعيد ويحبكِ كثيراً! 🥰",
  "games.pet.status.eating": "يمم! كوكو يحب الكعك والجزر! 🥕🍰",
  "games.pet.status.playing": "واو! لنفرقع البالونات معاً! 🎈",
  "games.pet.status.sleeping": "شسسس... كوكو ينام في سريره الدافئ 💤",
  "games.pet.status.petting": "أوه! هذا دافئ ولطيف للغاية! 🐾❤️",
};

const en: Dict = {
  "nav.home": "Home",
  "nav.features": "Features",
  "nav.calm": "Calm Room",
  "nav.glow": "Glow Points",
  "nav.youtube": "YouTube",
  "nav.updates": "Updates",
  "nav.faq": "FAQ",
  "nav.download": "Download App",

  "hero.eyebrow": "Your soft little space 🩷",
  "hero.title": "Glow up, calm down, and feel like yourself again.",
  "hero.subtitle": "Your routines, diary, reads, and quiet moments — all in one soft place. Small steps that make you feel a little more like you, every day.",
  "hero.cta.download": "Download App",
  "hero.cta.youtube": "Watch YouTube",
  "hero.cta.features": "Explore Features",
  "hero.chip.lang": "Arabic + English",
  "hero.chip.offline": "Offline-first",
  "hero.chip.calm": "Calm exercises",
  "hero.chip.points": "Glow Points",
  "hero.chip.private": "Private notes",
  "hero.chip.teen": "Made for girls",

  "about.title": "What is Girly Vibes?",
  "about.lead": "Some days you want to glow up. Some days you just need one calm minute. Girly Vibes gives you both.",
  "about.body": "Not a productivity app for adults. It's a soft little corner with routines, diary, reads, a calm room, a vision board, boredom busters, and a weekly Glow Points leaderboard. Gentle, organized, made with love.",

  "features.title": "Everything you need in one soft place",
  "features.routines.t": "Daily Routines",
  "features.routines.d": "Morning, school, evening, everything shower, and hygiene checklists. Tick steps, favorite routines, or build your own.",
  "features.glow.t": "Glow Points",
  "features.glow.d": "Earn points when you show up for yourself. Weekly leaderboard — every girl gets a fresh start.",
  "features.calm.t": "Calm Room",
  "features.calm.d": "Breathing and gentle words for when life feels loud. For anxiety, sad days, sleep, anger and confidence.",
  "features.read.t": "Reads",
  "features.read.d": "Real, warm reads for confidence, school, body care, and feelings. Save the ones that feel like they were written for you.",
  "features.diary.t": "Diary & Notes",
  "features.diary.d": "Track moods, write entries, add photo, voice, or checklist notes. A private diary mode with PIN for your deeper thoughts.",
  "features.vision.t": "Vision Board",
  "features.vision.d": "Pick images that inspire you and frame them beautifully. Your soft little dream board.",
  "features.bored.t": "Beat Boredom",
  "features.bored.d": "Offline activity ideas: rearrange your room, write to your future self, try a new hairstyle, bake something.",
  "features.youtube.t": "YouTube Connected",
  "features.youtube.d": "Watch a video, then continue the challenge in the app. Comment your weekly Glow Points under the video.",
  "features.widgets.t": "Home Widgets",
  "features.widgets.d": "Glow Points, leaderboard, read of the day, and calm — right on your home screen.",

  "calm.title": "The Calm Room",
  "calm.lead": "When everything feels loud, take one minute here.",
  "calm.c1": "When your thoughts feel loud",
  "calm.c2": "When sleep feels far",
  "calm.c3": "When your heart feels heavy",
  "calm.c4": "When you need one small start",
  "calm.disclaimer": "Girly Vibes is for gentle support and self-care. If you feel unsafe or overwhelmed, talk to a trusted adult or a local support service.",
  "calm.breathe": "Breathe",

  "glow.title": "Glow Points & the Weekly Leaderboard",
  "glow.lead": "Glow Points reset every week — every girl gets a fresh start.",
  "glow.motiv": "1% better every day still counts.",
  "glow.reset": "Until weekly reset",
  "glow.you": "Your points",

  "youtube.title": "YouTube Hub",
  "youtube.lead": "Watch today's video, then continue the challenge with us.",
  "youtube.subscribe": "Subscribe on YouTube",
  "youtube.watch": "Watch on YouTube",
  "youtube.featured": "This week's featured",
  "youtube.challenge": "This week's challenge",
  "youtube.challenge.body": "After today's video, open Girly Vibes and collect your Glow Points. Comment your weekly points under the video — let's see who's glowing this week 💗",

  "themes.title": "In-app themes",
  "themes.lead": "Pick the mood that feels like you today.",

  "widgets.title": "Widgets on your home screen",
  "widgets.lead": "Your points, reads and calm — one tap away.",

  "updates.title": "What's new",
  "updates.lead": "Latest features and little improvements.",

  "download.title": "Download Girly Vibes",
  "download.lead": "Start your day with one soft little step.",
  "download.google": "Coming soon on Google Play",
  "download.apple": "Coming soon",

  "faq.title": "Things girls usually ask",
  "faq.q1": "Is Girly Vibes free?",
  "faq.a1": "Yes — the app is free to use, with optional features added over time.",
  "faq.q2": "Is the app in Arabic?",
  "faq.a2": "Yes. Arabic and English, switch any time.",
  "faq.q3": "Does it work offline?",
  "faq.a3": "Most features work without internet — routines, notes, and the calm room.",
  "faq.q4": "Is my diary private?",
  "faq.a4": "Your data is stored on your phone, with a PIN-protected private diary mode for sensitive thoughts.",
  "faq.q5": "Is Calm Room therapy?",
  "faq.a5": "No. It's gentle support and breathing exercises. For real help, please talk to a trusted adult.",
  "faq.q6": "How do Glow Points work?",
  "faq.a6": "Finish a routine, earn points. Default routines give more than custom ones, and points reset weekly.",
  "faq.q7": "Can I use it without internet?",
  "faq.a7": "Yes — most things work offline. The public leaderboard needs internet.",
  "faq.q8": "Where can I watch the YouTube videos?",
  "faq.a8": "Channel links are everywhere on this site, and inside the app too.",

  "footer.tagline": "Your soft little glow-up space.",
  "footer.rights": "© Girly Vibes — all rights reserved.",
  "footer.privacy": "Privacy",
  "footer.terms": "Terms",
  "footer.contact": "Contact",

  "nav.games": "Girly Games 🎮",
  "games.title": "Girly Arcade Corner 🌸",
  "games.subtitle": "Cute, interactive, and cozy teen games made just for you! Dress up your doll or care for your digital bunny companion! 🐰",
  "games.dressup.title": "🌸 Fashion Dress-Up Studio",
  "games.dressup.subtitle": "Style your custom paper-doll with cute hairstyles, cardigans, overalls, and cozy rooms!",
  "games.pet.title": "🐰 Fluffy Bunny Pet",
  "games.pet.subtitle": "Take care of your digital pocket bunny, Coco! Feed, pet, play pop-balloons, or tuck them in to sleep.",
  "games.dressup.hair": "Hair 🎀",
  "games.dressup.tops": "Tops 👚",
  "games.dressup.bottoms": "Bottoms 👖",
  "games.dressup.acc": "Accessories 👑",
  "games.dressup.bg": "Backdrop 🖼️",
  "games.pet.pet": "Pet 👋",
  "games.pet.feed": "Feed 🍰",
  "games.pet.play": "Play Balloons 🎈",
  "games.pet.sleep": "Sleep 💤",
  "games.pet.love": "Love ❤️",
  "games.pet.energy": "Energy ⚡",
  "games.pet.status.happy": "Coco is happy and loves you! 🥰",
  "games.pet.status.eating": "Yum! Coco loves sweet treats! 🍰🥕",
  "games.pet.status.playing": "Wow! Let's pop all the colorful balloons! 🎈",
  "games.pet.status.sleeping": "Shhh... Coco is sleeping under a cozy blanket 💤",
  "games.pet.status.petting": "Aww, that tickles! So warm and soft! 🐾❤️",
};

const dicts = { ar, en };

type Ctx = { lang: Lang; setLang: (l: Lang) => void; t: (k: string) => string; dir: "rtl" | "ltr" };
const I18nContext = createContext<Ctx | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("ar");

  useEffect(() => {
    const saved = typeof window !== "undefined" ? (localStorage.getItem("gv-lang") as Lang | null) : null;
    if (saved === "ar" || saved === "en") setLangState(saved);
  }, []);

  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.lang = lang;
      document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
    }
  }, [lang]);

  const setLang = (l: Lang) => {
    setLangState(l);
    if (typeof window !== "undefined") localStorage.setItem("gv-lang", l);
  };

  const t = (k: string) => dicts[lang][k] ?? k;
  const dir = lang === "ar" ? "rtl" : "ltr";

  return <I18nContext.Provider value={{ lang, setLang, t, dir }}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be inside I18nProvider");
  return ctx;
}
