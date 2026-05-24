import { useI18n } from "@/lib/i18n";
import { PhoneFrame } from "./PhoneFrame";
import { FloatingDecor, Blob, HeartIcon } from "./Decor";
import { motion } from "framer-motion";
import { Heart, Sparkles, Play, Download, Wand2 } from "lucide-react";
import { ThreeDTilt } from "./ThreeDTilt";

const chipKeys = [
  "hero.chip.lang",
  "hero.chip.offline",
  "hero.chip.calm",
  "hero.chip.points",
  "hero.chip.private",
  "hero.chip.teen",
];

export function Hero() {
  const { t, lang } = useI18n();
  return (
    <section id="home" className="relative pt-28 pb-20 md:pt-36 md:pb-28 px-5 md:px-8 overflow-hidden bg-hero">
      <Blob className="w-[480px] h-[480px] -top-32 -left-20" color="oklch(0.86 0.07 5 / 0.6)" />
      <Blob className="w-[520px] h-[520px] top-40 -right-24" color="oklch(0.78 0.12 0 / 0.35)" />
      <FloatingDecor />

      <div className="max-w-7xl mx-auto relative grid lg:grid-cols-[1.1fr_1fr] gap-12 items-center">
        <div className="text-center lg:text-start">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/70 border border-[color:var(--border)] text-xs font-medium text-[color:var(--rose-deep)] backdrop-blur"
          >
            <Sparkles className="w-3.5 h-3.5" />
            {t("hero.eyebrow")}
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="mt-5 text-4xl sm:text-5xl md:text-6xl lg:text-[68px] leading-[1.05] font-semibold text-[color:var(--mauve)] text-balance"
          >
            {t("hero.title")}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mt-5 text-base md:text-lg text-[color:var(--mauve)]/70 max-w-xl mx-auto lg:mx-0 text-pretty"
          >
            {t("hero.subtitle")}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="mt-8 flex flex-wrap gap-3 justify-center lg:justify-start"
          >
            <a
              href="#download"
              className="group inline-flex items-center gap-2 px-6 py-3.5 rounded-full text-white bg-rose-gradient font-medium shadow-soft hover:scale-[1.04] active:scale-[0.98] transition heartbeat"
            >
              <Download className="w-4 h-4" />
              {t("hero.cta.download")}
            </a>
            <a
              href="#youtube"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-white text-[color:var(--rose-deep)] font-medium border border-[color:var(--border)] hover:bg-[color:var(--rose-soft)] transition"
            >
              <Play className="w-4 h-4 fill-current" />
              {t("hero.cta.youtube")}
            </a>
            <a
              href="#features"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-white/60 text-[color:var(--mauve)] font-medium border border-[color:var(--border)]/60 hover:bg-white transition"
            >
              <Wand2 className="w-4 h-4" />
              {t("hero.cta.features")}
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="mt-8 flex flex-wrap gap-2 justify-center lg:justify-start"
          >
            {chipKeys.map((k) => (
              <span key={k} className="px-3 py-1.5 rounded-full text-xs bg-white/70 border border-[color:var(--border)] text-[color:var(--mauve)]/80">
                ✿ {t(k)}
              </span>
            ))}
          </motion.div>
        </div>

        <div className="relative flex justify-center z-20">
          <ThreeDTilt maxRotation={15} scale={1.05}>
            <PhoneFrame glow>
              <HomeMockup lang={lang} />
            </PhoneFrame>
          </ThreeDTilt>
          {/* floating stickers around phone */}
          <motion.div
            animate={{ y: [-8, 8, -8], rotate: [-5, 5, -5] }}
            transition={{ duration: 5, repeat: Infinity }}
            className="absolute -top-4 -left-2 md:-left-8 px-3 py-2 rounded-2xl glass text-xs text-[color:var(--rose-deep)] flex items-center gap-1.5"
          >
            <HeartIcon className="w-3 h-3 text-[color:var(--rose-deep)]" /> +50 ✨
          </motion.div>
          <motion.div
            animate={{ y: [8, -8, 8], rotate: [3, -3, 3] }}
            transition={{ duration: 6, repeat: Infinity }}
            className="absolute bottom-10 -right-2 md:-right-6 px-3 py-2 rounded-2xl glass text-xs text-[color:var(--rose-deep)]"
          >
            🌸 {lang === "ar" ? "روتين الصباح ✓" : "Morning routine ✓"}
          </motion.div>
          <motion.div
            animate={{ y: [-10, 10, -10], rotate: [-8, 8, -8] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-[40%] -left-8 md:-left-16 p-4 rounded-2xl glass border border-white/60 shadow-lg flex flex-col items-center justify-center backdrop-blur-md hover:scale-105 transition-transform cursor-default select-none"
          >
            <div className="w-12 h-12 rounded-full bg-rose-gradient grid place-items-center text-white shadow-glow animate-pulse">
              <Heart className="w-6 h-6 fill-current text-white" />
            </div>
            <span className="text-[10px] font-semibold text-[color:var(--rose-deep)] mt-2">Glow Mode 🌸</span>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function HomeMockup({ lang }: { lang: "ar" | "en" }) {
  const isAr = lang === "ar";
  return (
    <div className="relative w-full h-full pt-10 px-3 text-[color:var(--mauve)]" dir={isAr ? "rtl" : "ltr"}>
      <div className="flex items-center justify-between text-[10px] opacity-70 px-2">
        <span>9:41</span>
        <span>🩷 ✦ ⚡</span>
      </div>
      <div className="mt-3 text-center">
        <p className="text-[10px] opacity-60">{isAr ? "أهلاً يا قمر" : "Hi gorgeous"}</p>
        <h3 className="text-base font-display font-semibold">{isAr ? "Girly Vibes 🩷" : "Girly Vibes 🩷"}</h3>
      </div>
      <div className="mt-3 mx-1 rounded-2xl bg-white/80 p-3 shadow-sm">
        <p className="text-[9px] opacity-60">{isAr ? "تذكير اليوم" : "Today's reminder"}</p>
        <p className="text-[11px] font-medium mt-0.5">{isAr ? "اشربي مية وخدي نفس عميق 🫧" : "Sip water, breathe deep 🫧"}</p>
      </div>
      <div className="mt-3 grid grid-cols-3 gap-1.5 px-1">
        {[
          { e: "🌸", l: isAr ? "روتين" : "Routine" },
          { e: "📖", l: isAr ? "قراءة" : "Read" },
          { e: "💗", l: isAr ? "هدوء" : "Calm" },
          { e: "✨", l: isAr ? "نقاط" : "Glow" },
          { e: "📔", l: isAr ? "يوميات" : "Diary" },
          { e: "🎀", l: isAr ? "بورد" : "Board" },
        ].map((b) => (
          <div key={b.l} className="aspect-square rounded-xl bg-white/70 grid place-items-center text-center">
            <div className="text-base">{b.e}</div>
            <div className="text-[8px] opacity-70">{b.l}</div>
          </div>
        ))}
      </div>
      <div className="mt-3 mx-1 rounded-2xl bg-gradient-to-br from-[#C88AA0] to-[#B55B72] text-white p-3">
        <div className="flex items-center justify-between">
          <p className="text-[9px] opacity-80">{isAr ? "نقاطك" : "Glow Points"}</p>
          <p className="text-[9px]">✨</p>
        </div>
        <p className="text-xl font-display font-bold">340</p>
        <div className="mt-1 h-1.5 rounded-full bg-white/30 overflow-hidden">
          <div className="h-full w-2/3 bg-white rounded-full" />
        </div>
      </div>
    </div>
  );
}
