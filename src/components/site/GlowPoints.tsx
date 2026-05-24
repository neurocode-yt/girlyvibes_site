import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useI18n } from "@/lib/i18n";
import { Section } from "./Decor";
import { Crown, Sparkles } from "lucide-react";

const top3 = [
  { name: "Layla", pts: 980, msg: "showing up 💗", rank: 2 },
  { name: "Hana", pts: 1240, msg: "1% every day ✨", rank: 1 },
  { name: "Mira", pts: 870, msg: "soft girl era 🎀", rank: 3 },
];
const list = [
  { name: "Yasmin", pts: 760 },
  { name: "Sara", pts: 690 },
];

function useCountdown() {
  const [t, setT] = useState({ d: 6, h: 3, m: 22 });
  useEffect(() => {
    const id = setInterval(() => {
      setT((x) => {
        let m = x.m - 1, h = x.h, d = x.d;
        if (m < 0) { m = 59; h -= 1; }
        if (h < 0) { h = 23; d -= 1; }
        if (d < 0) { d = 6; h = 23; m = 59; }
        return { d, h, m };
      });
    }, 60_000);
    return () => clearInterval(id);
  }, []);
  return t;
}

export function GlowPoints() {
  const { t, lang } = useI18n();
  const c = useCountdown();
  const isAr = lang === "ar";

  return (
    <Section id="glow">
      <div className="text-center mb-12">
        <p className="text-xs font-medium tracking-widest uppercase text-[color:var(--rose-deep)]">✿ Glow Points</p>
        <h2 className="mt-3 text-3xl md:text-5xl font-semibold text-[color:var(--mauve)]">{t("glow.title")}</h2>
        <p className="mt-3 text-[color:var(--mauve)]/70">{t("glow.lead")}</p>
      </div>

      <div className="max-w-3xl mx-auto rounded-[36px] bg-white p-6 md:p-10 shadow-card border border-[color:var(--border)] relative overflow-hidden">
        <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-[#FBE4EC] to-transparent" />

        <div className="relative">
          {/* Countdown */}
          <div className="flex items-center justify-between flex-wrap gap-3 mb-8">
            <div className="text-sm text-[color:var(--mauve)]/70">⏳ {t("glow.reset")}</div>
            <div className="flex gap-2 text-[color:var(--rose-deep)] font-display text-lg">
              <Stat n={c.d} l={isAr ? "يوم" : "d"} />
              <Stat n={c.h} l={isAr ? "س" : "h"} />
              <Stat n={c.m} l={isAr ? "د" : "m"} />
            </div>
          </div>

          {/* Podium */}
          <div className="grid grid-cols-3 gap-3 items-end">
            {[...top3].sort((a, b) => [2,1,3].indexOf(a.rank) - [2,1,3].indexOf(b.rank)).map((u, i) => {
              const heights = ["h-28", "h-36", "h-24"];
              return (
                <motion.div
                  key={u.name}
                  initial={{ y: 40, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.15, type: "spring" }}
                  className="text-center"
                >
                  <div className="relative mx-auto w-16 h-16 rounded-full bg-rose-gradient grid place-items-center text-white font-display text-xl">
                    {u.name[0]}
                    {u.rank === 1 && <Crown className="absolute -top-3 left-1/2 -translate-x-1/2 w-5 h-5 text-[color:var(--glow)]" fill="currentColor" />}
                  </div>
                  <p className="mt-2 text-sm font-medium text-[color:var(--mauve)]">{u.name}</p>
                  <p className="text-xs text-[color:var(--mauve)]/60">{u.pts} ✨</p>
                  <p className="text-[10px] text-[color:var(--rose-deep)] mt-0.5 italic">"{u.msg}"</p>
                  <div className={`${heights[i]} mt-3 rounded-t-2xl bg-gradient-to-t from-[#F7C9D9] to-[#FBE4EC] border-x border-t border-[color:var(--border)] grid place-items-center font-display text-[color:var(--rose-deep)]`}>
                    #{u.rank}
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* List */}
          <div className="mt-8 space-y-2">
            {list.map((u, i) => (
              <div key={u.name} className="flex items-center justify-between px-4 py-3 rounded-2xl bg-[color:var(--rose-soft)]/40">
                <div className="flex items-center gap-3">
                  <span className="w-6 text-center text-sm text-[color:var(--mauve)]/60">{i + 4}</span>
                  <div className="w-8 h-8 rounded-full bg-white grid place-items-center text-xs">{u.name[0]}</div>
                  <span className="text-sm text-[color:var(--mauve)]">{u.name}</span>
                </div>
                <span className="text-sm text-[color:var(--rose-deep)]">{u.pts} ✨</span>
              </div>
            ))}
          </div>

          {/* You */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            className="mt-6 p-5 rounded-2xl bg-rose-gradient text-white flex items-center justify-between"
          >
            <div>
              <p className="text-xs opacity-80">{t("glow.you")}</p>
              <p className="text-2xl font-display font-bold mt-0.5">340 ✨</p>
            </div>
            <div className="text-right">
              <Sparkles className="w-6 h-6 inline-block" />
              <p className="text-xs opacity-90 mt-1">{t("glow.motiv")}</p>
            </div>
          </motion.div>
        </div>
      </div>
    </Section>
  );
}

function Stat({ n, l }: { n: number; l: string }) {
  return (
    <span className="px-2.5 py-1 rounded-xl bg-[color:var(--rose-soft)]/70 text-sm">
      {n}<span className="text-xs opacity-70 ms-1">{l}</span>
    </span>
  );
}
