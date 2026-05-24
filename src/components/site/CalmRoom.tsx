import { motion } from "framer-motion";
import { useI18n } from "@/lib/i18n";
import { Section, Blob } from "./Decor";
import { PhoneFrame } from "./PhoneFrame";
import { Wind } from "lucide-react";

const cardKeys = ["calm.c1", "calm.c2", "calm.c3", "calm.c4"];

export function CalmRoom() {
  const { t, lang } = useI18n();
  const isAr = lang === "ar";
  return (
    <Section id="calm" className="overflow-hidden">
      <div className="relative rounded-[40px] p-8 md:p-14 overflow-hidden bg-gradient-to-br from-[#3a2230] via-[#52304a] to-[#7a3f5e]">
        <Blob className="w-[400px] h-[400px] -top-20 -right-20" color="oklch(0.78 0.12 0 / 0.4)" />
        <Blob className="w-[400px] h-[400px] -bottom-20 -left-20" color="oklch(0.65 0.1 320 / 0.3)" />

        <div className="relative grid lg:grid-cols-[1fr_1.1fr] gap-12 items-center">
          <div className="text-white">
            <p className="text-xs font-medium tracking-widest uppercase text-[#F7C9D9]">
              ✿ {t("calm.title")}
            </p>
            <h2 className="mt-3 text-3xl md:text-5xl font-semibold text-balance">{t("calm.lead")}</h2>

            <div className="mt-8 grid sm:grid-cols-2 gap-3">
              {cardKeys.map((k, i) => (
                <motion.div
                  key={k}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="p-4 rounded-2xl bg-white/10 backdrop-blur border border-white/15 text-sm"
                >
                  💗 {t(k)}
                </motion.div>
              ))}
            </div>

            <p className="mt-8 text-xs text-white/60 max-w-md leading-relaxed">
              ⓘ {t("calm.disclaimer")}
            </p>
          </div>

          <div className="relative flex justify-center">
            <PhoneFrame notch="dark">
              <div className="absolute inset-0 grid place-items-center text-white" dir={isAr ? "rtl" : "ltr"}>
                <div className="text-center">
                  <p className="text-[10px] opacity-70 tracking-widest">{isAr ? "تمرين تنفس" : "BREATHING"}</p>
                  <div className="relative mt-6 grid place-items-center">
                    <div className="absolute inset-0 grid place-items-center">
                      <div className="w-40 h-40 rounded-full bg-gradient-to-br from-[#F7C9D9] to-[#C88AA0] breathe" />
                    </div>
                    <div className="relative w-40 h-40 grid place-items-center">
                      <Wind className="w-7 h-7" />
                    </div>
                  </div>
                  <p className="mt-8 text-sm font-display">{t("calm.breathe")}</p>
                  <p className="mt-1 text-[10px] opacity-70">{isAr ? "شهيق… ثبات… زفير" : "Inhale… hold… exhale"}</p>
                </div>
              </div>
            </PhoneFrame>
          </div>
        </div>
      </div>
    </Section>
  );
}
