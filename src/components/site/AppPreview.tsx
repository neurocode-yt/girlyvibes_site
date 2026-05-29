import { motion } from "framer-motion";
import { useI18n } from "@/lib/i18n";
import { Section } from "./Decor";
import { PhoneFrame } from "./PhoneFrame";
import { BookOpen, Heart, NotebookPen, Sparkles, Image as ImageIcon } from "lucide-react";

export function AppPreview() {
  const { lang } = useI18n();
  const isAr = lang === "ar";

  const screens = [
    { notch: "rose" as const, render: <LeaderboardMock isAr={isAr} /> },
    { notch: "rose" as const, render: <ReadMock isAr={isAr} /> },
    { notch: "rose" as const, render: <NotesMock isAr={isAr} /> },
    { notch: "rose" as const, render: <VisionMock isAr={isAr} /> },
    { notch: "rose" as const, render: <ThemeMock isAr={isAr} /> },
  ];

  return (
    <Section id="preview" className="overflow-hidden">
      <div className="text-center mb-12">
        <p className="text-xs font-medium tracking-widest uppercase text-[color:var(--rose-deep)]">✿ Inside the app</p>
        <h2 className="mt-3 text-3xl md:text-5xl font-semibold text-[color:var(--mauve)]">
          {isAr ? "نظرة لطيفة جوّه التطبيق" : "A soft peek inside"}
        </h2>
      </div>

      <div className="overflow-x-auto pb-6 -mx-5 px-5 scroll-pl-5 snap-x">
        <div className="flex gap-6 min-w-max">
          {screens.map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ delay: i * 0.08 }}
              className="snap-center"
            >
              <PhoneFrame notch={s.notch}>{s.render}</PhoneFrame>
            </motion.div>
          ))}
        </div>
      </div>
    </Section>
  );
}

function LeaderboardMock({ isAr }: { isAr: boolean }) {
  return (
    <div className="absolute inset-0 pt-10 px-3 text-[color:var(--mauve)]" dir={isAr ? "rtl" : "ltr"}>
      <p className="text-center text-[10px] opacity-60 mt-2">{isAr ? "اللوحة" : "Leaderboard"}</p>
      <p className="text-center text-base font-display">{isAr ? "ترتيب الأسبوع 🩷" : "This week 🩷"}</p>
      <div className="mt-3 grid grid-cols-3 gap-1 items-end">
        {[
          { n: "L", h: "h-14", r: 2 },
          { n: "H", h: "h-20", r: 1 },
          { n: "M", h: "h-12", r: 3 },
        ].map((u, i) => (
          <div key={i} className="text-center">
            <div className="mx-auto w-8 h-8 rounded-full bg-rose-gradient grid place-items-center text-white text-xs">{u.n}</div>
            <div className={`${u.h} mt-1 rounded-t-lg bg-[#FBE4EC] dark:bg-[#4a2f3a] grid place-items-center text-[10px]`}>#{u.r}</div>
          </div>
        ))}
      </div>
      <div className="mt-3 space-y-1">
        {["Y 760", "S 690", "R 520"].map((x) => (
          <div key={x} className="px-2 py-1.5 rounded-lg bg-white/70 text-[10px] flex justify-between">
            <span>{x.split(" ")[0]}</span><span>{x.split(" ")[1]} ✨</span>
          </div>
        ))}
      </div>
      <div className="mt-3 mx-1 p-2 rounded-xl bg-rose-gradient text-white text-center">
        <p className="text-[9px] opacity-80">{isAr ? "نقاطك" : "You"}</p>
        <p className="text-lg font-bold">340 ✨</p>
      </div>
    </div>
  );
}

function ReadMock({ isAr }: { isAr: boolean }) {
  return (
    <div className="absolute inset-0 pt-10 px-3 text-[color:var(--mauve)]" dir={isAr ? "rtl" : "ltr"}>
      <div className="flex items-center justify-between text-[10px] opacity-70 mt-2 px-1">
        <span>{isAr ? "قراءة" : "Read"}</span>
        <BookOpen className="w-3 h-3" />
      </div>
      <div className="mt-3 aspect-video rounded-xl bg-gradient-to-br from-[#F7C9D9] to-[#C88AA0]" />
      <p className="mt-3 text-sm font-display leading-snug">
        {isAr ? "خمس عادات بسيطة بتغير يومك 🌸" : "5 small habits that change your day 🌸"}
      </p>
      <p className="mt-1 text-[10px] opacity-60">{isAr ? "3 دقائق قراءة" : "3 min read"}</p>
      <div className="mt-3 space-y-1">
        {[1,2,3,4].map(i => <div key={i} className="h-1.5 rounded-full bg-white/70" />)}
      </div>
      <div className="mt-3 flex gap-1 flex-wrap">
        {(isAr ? ["الثقة","الجسم","المشاعر"] : ["Confidence","Body","Feelings"]).map(t => (
          <span key={t} className="px-2 py-0.5 rounded-full text-[9px] bg-white/80">{t}</span>
        ))}
      </div>
    </div>
  );
}

function NotesMock({ isAr }: { isAr: boolean }) {
  return (
    <div className="absolute inset-0 pt-10 px-3 text-[color:var(--mauve)]" dir={isAr ? "rtl" : "ltr"}>
      <div className="flex items-center justify-between mt-2 px-1">
        <span className="text-sm font-display">{isAr ? "يومياتي" : "My Diary"}</span>
        <NotebookPen className="w-3.5 h-3.5" />
      </div>
      <div className="mt-3 flex gap-1">
        {["💗","🌸","☀️","🌧️","🌙"].map((e,i) => (
          <div key={i} className={`flex-1 aspect-square rounded-lg grid place-items-center text-sm ${i===1?"bg-rose-gradient text-white":"bg-white/70"}`}>{e}</div>
        ))}
      </div>
      <p className="mt-3 text-[10px] opacity-60">{isAr ? "اليوم" : "Today"}</p>
      <div className="mt-1.5 p-2.5 rounded-xl bg-white/80 text-[10px] leading-relaxed">
        {isAr ? "حسيت إن يومي كان هادي. خدت دقيقة هدوء قبل النوم 🩷" : "Today felt soft. Took a calm minute before bed 🩷"}
      </div>
      <div className="mt-2 p-2.5 rounded-xl bg-white/80 text-[10px] leading-relaxed">
        {isAr ? "بدأت أحب روتيني الجديد ✨" : "I'm starting to love my new routine ✨"}
      </div>
    </div>
  );
}

function VisionMock({ isAr }: { isAr: boolean }) {
  return (
    <div className="absolute inset-0 pt-10 px-3" dir={isAr ? "rtl" : "ltr"}>
      <div className="flex items-center justify-between mt-2 px-1 text-[color:var(--mauve)]">
        <span className="text-sm font-display">{isAr ? "بورد الرؤية" : "Vision Board"}</span>
        <ImageIcon className="w-3.5 h-3.5" />
      </div>
      <div className="mt-3 grid grid-cols-3 gap-1.5">
        {[
          "from-[#F7C9D9] to-[#C88AA0]",
          "from-[#FBE4EC] to-[#F7C9D9]",
          "from-[#FFE0E9] to-[#FFC2D6]",
          "from-[#FCE5EE] to-[#F8CFE0]",
          "from-[#FBDAE6] to-[#F4BBCF]",
          "from-[#FDE8EE] to-[#F5BCCD]",
        ].map((c, i) => (
          <div key={i} className={`aspect-square rounded-lg bg-gradient-to-br ${c}`} />
        ))}
      </div>
      <p className="mt-3 text-[10px] text-center text-[color:var(--mauve)]/70 italic">
        {isAr ? "أحلامك في إطار جميل ✨" : "Your dreams, framed softly ✨"}
      </p>
    </div>
  );
}

function ThemeMock({ isAr }: { isAr: boolean }) {
  const themes = [
    { n: isAr?"كلاسيك":"Classic", c: ["#FBE4EC","#F7C9D9"] },
    { n: isAr?"بريميوم":"Premium", c: ["#FBEFE0","#E4C28E"] },
    { n: isAr?"أكوا":"Aqua", c: ["#E0F5F2","#A8D8D6"] },
    { n: isAr?"حديقة":"Garden", c: ["#E8F3DA","#B8D898"] },
    { n: isAr?"وردي ناعم":"Soft Rose", c: ["#FDE8EE","#F5BCCD"] },
    { n: isAr?"بيرل":"Pearl", c: ["#FBF0EC","#E8C8C2"] },
  ];
  return (
    <div className="absolute inset-0 pt-10 px-3 text-[color:var(--mauve)]" dir={isAr ? "rtl" : "ltr"}>
      <div className="flex items-center justify-between mt-2 px-1">
        <span className="text-sm font-display">{isAr ? "الثيمات" : "Themes"}</span>
        <Sparkles className="w-3.5 h-3.5" />
      </div>
      <div className="mt-3 grid grid-cols-2 gap-1.5">
        {themes.map((t,i) => (
          <div key={i} className="p-2 rounded-xl bg-white/80">
            <div className="flex gap-1">
              {t.c.map(c => <div key={c} className="flex-1 h-6 rounded" style={{background:c}} />)}
            </div>
            <p className="text-[9px] mt-1 text-center">{t.n}</p>
          </div>
        ))}
      </div>
      <div className="mt-3 p-2 rounded-xl bg-rose-gradient text-white text-[10px] text-center inline-flex items-center justify-center gap-1 w-full">
        <Heart className="w-3 h-3 fill-current" /> {isAr ? "اختيارك المفضل" : "Your pick"}
      </div>
    </div>
  );
}
