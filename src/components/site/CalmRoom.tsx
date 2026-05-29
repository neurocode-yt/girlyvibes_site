import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useI18n } from "@/lib/i18n";
import { Section, Blob } from "./Decor";
import { PhoneFrame } from "./PhoneFrame";
import { Wind, Play, Pause, RefreshCw } from "lucide-react";

const cardKeys = ["calm.c1", "calm.c2", "calm.c3", "calm.c4"];

type BreathStep = "inhale" | "holdIn" | "exhale" | "holdOut";

export function CalmRoom() {
  const { t, lang } = useI18n();
  const isAr = lang === "ar";

  // Guided breathing states
  const [isActive, setIsActive] = useState(false);
  const [breathStep, setBreathStep] = useState<BreathStep>("inhale");
  const [timeLeft, setTimeLeft] = useState(4);

  // Box breathing timing cycle (4 seconds for each step)
  useEffect(() => {
    if (!isActive) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          // Move to next step
          setBreathStep((current) => {
            switch (current) {
              case "inhale":
                return "holdIn";
              case "holdIn":
                return "exhale";
              case "exhale":
                return "holdOut";
              case "holdOut":
                return "inhale";
              default:
                return "inhale";
            }
          });
          return 4; // Reset timer to 4 seconds
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isActive]);

  const handleToggleActive = () => {
    setIsActive(!isActive);
    if (!isActive) {
      setBreathStep("inhale");
      setTimeLeft(4);
    }
  };

  const getStepText = (step: BreathStep) => {
    if (isAr) {
      switch (step) {
        case "inhale":
          return "شهيق... خذي نفسًا عميقًا 🌸";
        case "holdIn":
          return "ثبات... استرخي بسلام 🧘";
        case "exhale":
          return "زفير... أخرجي الهواء ببطء 🫧";
        case "holdOut":
          return "استراحة... لحظة سكون 🌙";
      }
    } else {
      switch (step) {
        case "inhale":
          return "Inhale... breathe in deep 🌸";
        case "holdIn":
          return "Hold... just relax in peace 🧘";
        case "exhale":
          return "Exhale... let it out slowly 🫧";
        case "holdOut":
          return "Rest... embrace stillness 🌙";
      }
    }
  };

  const getCircleScale = (step: BreathStep, active: boolean) => {
    if (!active) return 1.0;
    switch (step) {
      case "inhale":
        return 1.35; // Expand
      case "holdIn":
        return 1.35; // Stay expanded
      case "exhale":
        return 0.9;  // Shrink
      case "holdOut":
        return 0.9;  // Stay shrunk
    }
  };

  const getCircleColor = (step: BreathStep) => {
    switch (step) {
      case "inhale":
        return "from-[#F7C9D9] to-[#C88AA0] shadow-[0_0_50px_oklch(0.86_0.07_5_/_0.5)]";
      case "holdIn":
        return "from-[#FFE0E9] to-[#FFC2D6] shadow-[0_0_60px_oklch(0.78_0.12_0_/_0.6)] border border-white/40";
      case "exhale":
        return "from-[#E0F5F2] to-[#A8D8D6] shadow-[0_0_40px_oklch(0.8_0.08_180_/_0.4)]";
      case "holdOut":
        return "from-[#F0EAF8] to-[#C9B3E0] shadow-[0_0_30px_oklch(0.75_0.1_300_/_0.3)]";
    }
  };

  return (
    <Section id="calm" className="overflow-hidden">
      <div className="relative rounded-[40px] p-8 md:p-14 overflow-hidden bg-gradient-to-br from-[#3a2230] via-[#52304a] to-[#7a3f5e]">
        <Blob className="w-[400px] h-[400px] -top-20 -right-20" color="oklch(0.78 0.12 0 / 0.4)" />
        <Blob className="w-[400px] h-[400px] -bottom-20 -left-20" color="oklch(0.65 0.1 320 / 0.3)" />

        <div className="relative grid lg:grid-cols-[1fr_1.1fr] gap-12 items-center">
          <div className="text-white">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 border border-white/15 text-xs font-semibold text-[#F7C9D9] backdrop-blur-sm">
              ✿ {t("calm.title")}
            </span>
            <h2 className="mt-3 text-3xl md:text-5xl font-semibold text-balance leading-tight">{t("calm.lead")}</h2>

            <div className="mt-8 grid sm:grid-cols-2 gap-3">
              {cardKeys.map((k, i) => (
                <motion.div
                  key={k}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 hover:border-white/20 transition text-sm flex items-start gap-2.5"
                >
                  <span className="text-base select-none">🩷</span>
                  <span className="text-white/90 font-medium">{t(k)}</span>
                </motion.div>
              ))}
            </div>

            <p className="mt-8 text-xs text-white/50 max-w-md leading-relaxed">
              ⓘ {t("calm.disclaimer")}
            </p>
          </div>

          <div className="relative flex justify-center">
            <PhoneFrame notch="dark" glow>
              <div className="absolute inset-0 flex flex-col justify-between pt-10 pb-8 px-4 text-white" dir={isAr ? "rtl" : "ltr"}>
                {/* Header info */}
                <div className="text-center">
                  <p className="text-[10px] uppercase font-bold tracking-widest text-[#F7C9D9] bg-white/10 px-3 py-0.5 rounded-full inline-block">
                    {isAr ? "تمرين التنفس المربع" : "Box Breathing Guide"}
                  </p>
                  <p className="text-[9px] text-white/60 mt-1">{isAr ? "4 ثوانٍ لكل خطوة" : "4s Cycle • Simple & Calming"}</p>
                </div>

                {/* Animated Breathing Circle */}
                <div className="relative flex-1 flex flex-col items-center justify-center">
                  <div className="relative w-44 h-44 flex items-center justify-center">
                    {/* Background breathing ripple */}
                    <AnimatePresence>
                      {isActive && (
                        <motion.div
                          key={breathStep}
                          initial={{ scale: 0.9, opacity: 0.2 }}
                          animate={{ scale: getCircleScale(breathStep, true) * 1.25, opacity: 0 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 4, ease: "linear", repeat: Infinity }}
                          className="absolute w-36 h-36 rounded-full bg-white/20 pointer-events-none"
                        />
                      )}
                    </AnimatePresence>

                    {/* Main pulsing circle */}
                    <motion.div
                      animate={{ scale: getCircleScale(breathStep, isActive) }}
                      transition={{ duration: isActive ? 4 : 1, ease: "easeInOut" }}
                      className={`w-36 h-36 rounded-full bg-gradient-to-br ${
                        isActive ? getCircleColor(breathStep) : "from-white/20 to-white/10 border border-white/20"
                      } flex flex-col items-center justify-center transition-all duration-700`}
                    >
                      {isActive ? (
                        <div className="text-center">
                          <span className="text-2xl font-bold font-display">{timeLeft}s</span>
                          <p className="text-[8px] tracking-wider uppercase font-semibold text-white/80 mt-0.5">
                            {isAr ? "متبقي" : "Left"}
                          </p>
                        </div>
                      ) : (
                        <Wind className="w-8 h-8 text-[#F7C9D9] animate-pulse" />
                      )}
                    </motion.div>
                  </div>

                  {/* Step instructions */}
                  <div className="mt-8 text-center px-4 min-h-[48px] flex items-center justify-center">
                    <AnimatePresence mode="wait">
                      <motion.p
                        key={isActive ? breathStep : "idle"}
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -5 }}
                        className="text-xs sm:text-sm font-display font-medium text-[#FBE4EC]"
                      >
                        {isActive ? getStepText(breathStep) : (isAr ? "جاهزة للبدء؟ خذي دقيقة هدوء 🧘" : "Ready? Take a quiet minute for yourself 🧘")}
                      </motion.p>
                    </AnimatePresence>
                  </div>
                </div>

                {/* Control Actions */}
                <div className="flex gap-2 justify-center px-4">
                  <button
                    onClick={handleToggleActive}
                    className={`flex-1 py-3 px-4 rounded-2xl flex items-center justify-center gap-2 text-xs font-semibold shadow-soft active:scale-95 transition-all duration-300 ${
                      isActive
                        ? "bg-red-500/20 border border-red-500/30 text-red-200 hover:bg-red-500/30"
                        : "bg-white text-[color:var(--rose-deep)] border border-transparent hover:bg-[#FBE4EC]"
                    }`}
                  >
                    {isActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
                    {isActive ? (isAr ? "إيقاف مؤقت" : "Pause") : (isAr ? "ابدئي التمرين" : "Start Exercise")}
                  </button>

                  {isActive && (
                    <button
                      onClick={() => {
                        setBreathStep("inhale");
                        setTimeLeft(4);
                      }}
                      className="p-3 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/10 active:scale-95 transition-all"
                      title={isAr ? "إعادة تعيين" : "Restart cycle"}
                    >
                      <RefreshCw className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </PhoneFrame>
          </div>
        </div>
      </div>
    </Section>
  );
}
