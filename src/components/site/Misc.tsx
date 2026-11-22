import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { Link } from "@tanstack/react-router";
import { useI18n } from "@/lib/i18n";
import { Section } from "./Decor";
import { ChevronDown } from "lucide-react";

import { themes, applyTheme } from "@/lib/theme";

const widgets = [
  { t: "Glow Points", ta: "نقاط الجلو", v: "340 ✨" },
  { t: "Leaderboard", ta: "اللوحة", v: "#4 🌸" },
  { t: "Calm", ta: "هدوء", v: "🫧 1 min" },
  { t: "Read of the Day", ta: "قراءة اليوم", v: "💗 ready" },
  { t: "Vision Board", ta: "بورد الرؤية", v: "🎀" },
];

const updates = [
  { key: "diary", date: "2026-11-21" },
  { key: "home", date: "2026-11-03" },
  { key: "maryam", date: "2026-11-03" },
  { key: "consent", date: "2026-10-25" },
];

export function Themes() {
  const { t, lang } = useI18n();
  const isAr = lang === "ar";
  const [selectedTheme, setSelectedTheme] = useState<string | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("gv-selected-theme");
    if (saved) {
      setSelectedTheme(saved);
      applyTheme(saved);
    }
  }, []);

  const handleThemeClick = (themeName: string) => {
    setSelectedTheme(themeName);
    applyTheme(themeName);
  };

  const handleResetClick = () => {
    setSelectedTheme(null);
    applyTheme(null);
  };

  return (
    <Section id="themes">
      <div className="text-center mb-12">
        <p className="text-xs font-medium tracking-widest uppercase text-[color:var(--rose-deep)]">✿ Themes</p>
        <h2 className="mt-3 text-3xl md:text-5xl font-semibold text-[color:var(--mauve)]">{t("themes.title")}</h2>
        <p className="mt-3 text-[color:var(--mauve)]/70">{t("themes.lead")}</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-5">
        {themes.map((th, i) => {
          const isActive = selectedTheme === th.n;
          return (
            <motion.div
              key={th.n}
              onClick={() => handleThemeClick(th.n)}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.04 }}
              whileHover={{ y: -4 }}
              className={`group relative p-5 rounded-3xl bg-white shadow-card border cursor-pointer overflow-hidden transition-all duration-300 ${
                isActive ? "border-[color:var(--rose-deep)] scale-[1.03] ring-2 ring-[color:var(--rose-deep)]/20" : "border-[color:var(--border)]"
              }`}
            >
              <div className="flex gap-1.5">
                {th.c.map((color) => (
                  <div key={color} className="flex-1 h-20 rounded-2xl relative overflow-hidden" style={{ background: color }}>
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity shimmer" />
                  </div>
                ))}
              </div>
              <div className="mt-4 flex items-center justify-between">
                <p className="font-display text-[color:var(--mauve)] font-semibold text-sm sm:text-base">{th.n}</p>
                {isActive && <span className="text-xs font-bold text-[color:var(--rose-deep)] bg-[color:var(--rose-soft)] px-2.5 py-0.5 rounded-full">✓</span>}
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="flex flex-col items-center gap-3 mt-8">
        <button
          onClick={handleResetClick}
          className={`px-6 py-3 rounded-full text-xs font-semibold shadow-soft border transition-all duration-300 active:scale-95 ${
            selectedTheme === null
              ? "bg-[color:var(--rose-soft)] border-[color:var(--rose-deep)]/40 text-[color:var(--rose-deep)] cursor-default opacity-85"
              : "bg-white border-[color:var(--border)] hover:bg-[color:var(--rose-soft)] text-[color:var(--mauve)]"
          }`}
        >
          🌈 {isAr ? "تفعيل تدفق الألوان التلقائي (قوس قزح)" : "Enable Dynamic Rainbow Hue-Morphing"}
        </button>
        <p className="text-center text-[10px] text-[color:var(--mauve)]/50">
          {lang === "ar" ? "9 ثيمات داخل التطبيق" : "9 in-app themes"}
        </p>
      </div>
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
  const formatDate = new Intl.DateTimeFormat(lang === "ar" ? "ar-EG" : "en-GB", {
    dateStyle: "medium",
    timeZone: "UTC",
  });
  return (
    <Section id="updates">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-5xl font-semibold text-[color:var(--mauve)]">{t("updates.title")}</h2>
        <p className="mt-3 text-[color:var(--mauve)]/70">{t("updates.lead")}</p>
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        {updates.map(({ key, date }) => (
          <article
            key={key}
            className="p-6 rounded-3xl bg-[color:var(--card)] border border-[color:var(--border)] shadow-card"
          >
            <time dateTime={date} className="text-sm text-[color:var(--mauve)]/80">
              {formatDate.format(new Date(date))}
            </time>
            <h3 className="mt-3 text-xl font-semibold">{t(`updates.${key}.title`)}</h3>
            <p className="mt-2 leading-relaxed">{t(`updates.${key}.body`)}</p>
          </article>
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
        <h2 className="text-3xl md:text-5xl font-semibold text-[color:var(--mauve)]">{t("faq.title")}</h2>
      </div>
      <div className="max-w-3xl mx-auto space-y-3">
        {faqs.map((n) => {
          const isOpen = open === n;
          return (
            <div key={n} className="rounded-2xl bg-[color:var(--card)] border border-[color:var(--border)]">
              <button
                type="button"
                aria-expanded={isOpen}
                aria-controls={`faq-answer-${n}`}
                onClick={() => setOpen(isOpen ? null : n)}
                className="w-full flex cursor-pointer items-center justify-between gap-3 p-5 text-start rounded-2xl hover:bg-[color:var(--rose-soft)]/30 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--rose-deep)] transition-colors"
              >
                <span className="font-medium text-[color:var(--mauve)]">{t(`faq.q${n}`)}</span>
                <ChevronDown aria-hidden="true" className={`size-4 shrink-0 text-[color:var(--rose-deep)] motion-safe:transition-transform ${isOpen ? "rotate-180" : ""}`} />
              </button>
              <div id={`faq-answer-${n}`} hidden={!isOpen} className="px-5 pb-5 leading-relaxed">
                <p>{t(`faq.a${n}`)}</p>
                {n === "4" && (
                  <Link to="/privacy" className="mt-2 inline-block font-semibold underline underline-offset-4">
                    {t("footer.privacy")}
                  </Link>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </Section>
  );
}
