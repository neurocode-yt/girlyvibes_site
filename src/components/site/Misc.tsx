import { motion } from "framer-motion";
import { useState } from "react";
import { useI18n } from "@/lib/i18n";
import { Section } from "./Decor";
import { ChevronDown, Sparkles } from "lucide-react";

const themes = [
  { n: "Classic Pink", c: ["#FBE4EC", "#F7C9D9", "#B55B72"] },
  { n: "Premium", c: ["#FBEFE0", "#E4C28E", "#9A6B2F"] },
  { n: "Aqua Orchid", c: ["#E0F5F2", "#A8D8D6", "#6B8AA8"] },
  { n: "Fresh Garden", c: ["#E8F3DA", "#B8D898", "#5A7A3B"] },
  { n: "Soft Rose", c: ["#FDE8EE", "#F5BCCD", "#C0738C"] },
  { n: "Pearl Blush", c: ["#FBF0EC", "#E8C8C2", "#A88078"] },
  { n: "Lilac Cream", c: ["#F0EAF8", "#C9B3E0", "#8A6BB0"] },
  { n: "Mint Petal", c: ["#E4F3EC", "#A8D6BF", "#5A8A75"] },
  { n: "Black Velvet", c: ["#2a1f25", "#4a2f3a", "#C88AA0"] },
];

const widgets = [
  { t: "Glow Points", ta: "نقاط الجلو", v: "340 ✨" },
  { t: "Leaderboard", ta: "اللوحة", v: "#4 🌸" },
  { t: "Calm", ta: "هدوء", v: "🫧 1 min" },
  { t: "Read of the Day", ta: "قراءة اليوم", v: "💗 ready" },
  { t: "Vision Board", ta: "بورد الرؤية", v: "🎀" },
];

const updates = [
  { t: "New Calm Room sessions", ta: "جلسات جديدة في غرفة الهدوء", date: "v2.4" },
  { t: "Glow Points leaderboard is live", ta: "لوحة النقاط الأسبوعية شغالة", date: "v2.3" },
  { t: "New Android home widgets", ta: "ويدجتس جديدة للأندرويد", date: "v2.2" },
  { t: "More Arabic reads added", ta: "قراءات عربية جديدة", date: "v2.1" },
  { t: "Notes redesigned softly", ta: "تصميم جديد للملاحظات", date: "v2.0" },
];

export function Themes() {
  const { t, lang } = useI18n();
  return (
    <Section id="themes">
      <div className="text-center mb-12">
        <p className="text-xs font-medium tracking-widest uppercase text-[color:var(--rose-deep)]">✿ Themes</p>
        <h2 className="mt-3 text-3xl md:text-5xl font-semibold text-[color:var(--mauve)]">{t("themes.title")}</h2>
        <p className="mt-3 text-[color:var(--mauve)]/70">{t("themes.lead")}</p>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-5">
        {themes.map((th, i) => (
          <motion.div
            key={th.n}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.04 }}
            whileHover={{ y: -4 }}
            className="group relative p-5 rounded-3xl bg-white shadow-card border border-[color:var(--border)] overflow-hidden"
          >
            <div className="flex gap-1.5">
              {th.c.map((color) => (
                <div key={color} className="flex-1 h-20 rounded-2xl relative overflow-hidden" style={{ background: color }}>
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity shimmer" />
                </div>
              ))}
            </div>
            <p className="mt-4 font-display text-[color:var(--mauve)]">{th.n}</p>
          </motion.div>
        ))}
      </div>
      <p className="text-center text-xs text-[color:var(--mauve)]/50 mt-6">
        {lang === "ar" ? "9 ثيمات داخل التطبيق" : "9 in-app themes"}
      </p>
    </Section>
  );
}

export function Widgets() {
  const { t, lang } = useI18n();
  const isAr = lang === "ar";
  return (
    <Section id="widgets" className="bg-[color:var(--rose-soft)]/30">
      <div className="text-center mb-12">
        <p className="text-xs font-medium tracking-widest uppercase text-[color:var(--rose-deep)]">✿ Widgets</p>
        <h2 className="mt-3 text-3xl md:text-5xl font-semibold text-[color:var(--mauve)]">{t("widgets.title")}</h2>
        <p className="mt-3 text-[color:var(--mauve)]/70">{t("widgets.lead")}</p>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {widgets.map((w, i) => (
          <motion.div
            key={w.t}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.05 }}
            className="aspect-square rounded-3xl bg-white p-5 shadow-card border border-[color:var(--border)] flex flex-col justify-between"
          >
            <p className="text-[10px] uppercase tracking-widest text-[color:var(--mauve)]/50">{isAr ? w.ta : w.t}</p>
            <p className="text-2xl font-display text-[color:var(--rose-deep)]">{w.v}</p>
          </motion.div>
        ))}
      </div>
    </Section>
  );
}

export function Updates() {
  const { t, lang } = useI18n();
  const isAr = lang === "ar";
  return (
    <Section id="updates">
      <div className="text-center mb-12">
        <p className="text-xs font-medium tracking-widest uppercase text-[color:var(--rose-deep)]">✿ Updates</p>
        <h2 className="mt-3 text-3xl md:text-5xl font-semibold text-[color:var(--mauve)]">{t("updates.title")}</h2>
        <p className="mt-3 text-[color:var(--mauve)]/70">{t("updates.lead")}</p>
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {updates.map((u, i) => (
          <motion.div
            key={u.t}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.07 }}
            className="p-6 rounded-3xl bg-white border border-[color:var(--border)] shadow-card"
          >
            <div className="flex items-center justify-between">
              <Sparkles className="w-5 h-5 text-[color:var(--rose-deep)]" />
              <span className="text-xs px-2 py-1 rounded-full bg-[color:var(--rose-soft)] text-[color:var(--rose-deep)]">{u.date}</span>
            </div>
            <p className="mt-4 text-[color:var(--mauve)] font-medium">{isAr ? u.ta : u.t}</p>
          </motion.div>
        ))}
      </div>
    </Section>
  );
}

const faqs = ["1", "2", "3", "4", "5", "6", "7", "8"];

export function FAQ() {
  const { t } = useI18n();
  const [open, setOpen] = useState<string | null>("1");
  return (
    <Section id="faq" className="bg-[color:var(--rose-soft)]/20">
      <div className="text-center mb-12">
        <p className="text-xs font-medium tracking-widest uppercase text-[color:var(--rose-deep)]">✿ FAQ</p>
        <h2 className="mt-3 text-3xl md:text-5xl font-semibold text-[color:var(--mauve)]">{t("faq.title")}</h2>
      </div>
      <div className="max-w-3xl mx-auto space-y-3">
        {faqs.map((n) => {
          const isOpen = open === n;
          return (
            <div key={n} className="rounded-2xl bg-white border border-[color:var(--border)] overflow-hidden">
              <button
                onClick={() => setOpen(isOpen ? null : n)}
                className="w-full flex items-center justify-between p-5 text-start"
              >
                <span className="font-medium text-[color:var(--mauve)]">{t(`faq.q${n}`)}</span>
                <ChevronDown className={`w-4 h-4 text-[color:var(--rose-deep)] transition-transform ${isOpen ? "rotate-180" : ""}`} />
              </button>
              <motion.div
                initial={false}
                animate={{ height: isOpen ? "auto" : 0, opacity: isOpen ? 1 : 0 }}
                className="overflow-hidden"
              >
                <p className="px-5 pb-5 text-sm text-[color:var(--mauve)]/70 leading-relaxed">
                  {t(`faq.a${n}`)}
                </p>
              </motion.div>
            </div>
          );
        })}
      </div>
    </Section>
  );
}
