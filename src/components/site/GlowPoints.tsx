import { motion } from "framer-motion";
import { Link } from "@tanstack/react-router";
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

export function GlowPoints() {
  const { t } = useI18n();

  return (
    <Section id="glow">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-5xl font-semibold text-[color:var(--mauve)]">{t("glow.title")}</h2>
        <p className="mt-3 text-[color:var(--mauve)]/70">{t("glow.lead")}</p>
      </div>

      <div className="max-w-3xl mx-auto rounded-[36px] bg-white p-6 md:p-10 shadow-card border border-[color:var(--border)] relative overflow-hidden">
        <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-[#FBE4EC] to-transparent" />

        <div className="relative">
          <h3 className="mb-8 text-lg font-semibold">{t("glow.example")}</h3>

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
                  <div className="relative mx-auto size-10 sm:size-16 rounded-full bg-rose-gradient grid place-items-center text-white font-display text-xl">
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
            <div className="text-end">
              <Sparkles className="w-6 h-6 inline-block" />
              <p className="text-xs opacity-90 mt-1">{t("glow.motiv")}</p>
            </div>
          </motion.div>
        </div>
      </div>
      <div className="mt-6 max-w-3xl mx-auto leading-relaxed">
        <p>{t("glow.rules")}</p>
        <Link to="/terms" className="mt-2 inline-block font-semibold underline underline-offset-4">
          {t("footer.terms")}
        </Link>
      </div>
    </Section>
  );
}
