import { motion } from "framer-motion";
import { useI18n } from "@/lib/i18n";
import { Section } from "./Decor";
import { ThreeDTilt } from "./ThreeDTilt";
import {
  Sparkles, Sun, Moon, BookOpen, Heart, Image as ImageIcon,
  Gamepad2, Youtube, LayoutGrid, NotebookPen, ListChecks,
} from "lucide-react";

const features = [
  { k: "routines", Icon: ListChecks, tone: "from-[#FBE4EC] to-[#F7C9D9]" },
  { k: "glow", Icon: Sparkles, tone: "from-[#FFE0E9] to-[#FFC2D6]" },
  { k: "calm", Icon: Heart, tone: "from-[#F3DCE9] to-[#E9C0D6]" },
  { k: "read", Icon: BookOpen, tone: "from-[#FCE5EE] to-[#F8CFE0]" },
  { k: "diary", Icon: NotebookPen, tone: "from-[#FBDAE6] to-[#F4BBCF]" },
  { k: "vision", Icon: ImageIcon, tone: "from-[#FCDCE7] to-[#F5BCD0]" },
  { k: "bored", Icon: Gamepad2, tone: "from-[#FCE0EA] to-[#F6C2D5]" },
  { k: "youtube", Icon: Youtube, tone: "from-[#FFD8E4] to-[#FFB2CB]" },
  { k: "widgets", Icon: LayoutGrid, tone: "from-[#FBDDE8] to-[#F3BFD2]" },
];

export function About() {
  const { t } = useI18n();
  return (
    <Section id="about" className="bg-[color:var(--background)]">
      <div className="grid lg:grid-cols-[1fr_1.2fr] gap-12 items-center">
        <div>
          <p className="text-xs font-medium tracking-widest uppercase text-[color:var(--rose-deep)]">
            ✿ {t("about.title")}
          </p>
          <h2 className="mt-3 text-3xl md:text-5xl font-semibold text-[color:var(--mauve)] text-balance">
            {t("about.lead")}
          </h2>
          <p className="mt-5 text-[color:var(--mauve)]/70 text-lg leading-relaxed text-pretty">
            {t("about.body")}
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {[Sun, Moon, Heart, Sparkles, BookOpen, NotebookPen].map((Icon, i) => (
            <ThreeDTilt key={i} maxRotation={15} scale={1.05}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
                className="aspect-square rounded-3xl glass grid place-items-center text-[color:var(--rose-deep)] h-full"
              >
                <Icon className="w-7 h-7" />
              </motion.div>
            </ThreeDTilt>
          ))}
        </div>
      </div>
    </Section>
  );
}

export function Features() {
  const { t } = useI18n();
  return (
    <Section id="features" className="bg-[color:var(--rose-soft)]/30">
      <div className="text-center mb-14">
        <p className="text-xs font-medium tracking-widest uppercase text-[color:var(--rose-deep)]">✿ Features</p>
        <h2 className="mt-3 text-3xl md:text-5xl font-semibold text-[color:var(--mauve)] text-balance">
          {t("features.title")}
        </h2>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {features.map(({ k, Icon, tone }, i) => (
          <ThreeDTilt key={k} maxRotation={12} scale={1.03} className="h-full">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.5, delay: (i % 3) * 0.08 }}
              className="group relative p-6 rounded-3xl bg-white border border-[color:var(--border)] shadow-card overflow-hidden h-full"
            >
              <div className={`absolute -top-12 -right-12 w-40 h-40 rounded-full bg-gradient-to-br ${tone} opacity-70 blur-2xl group-hover:scale-110 transition-transform duration-700`} />
              <div className="relative">
                <div className="w-12 h-12 rounded-2xl bg-rose-gradient grid place-items-center text-white shadow-glow">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="mt-5 text-xl font-display font-semibold text-[color:var(--mauve)]">
                  {t(`features.${k}.t`)}
                </h3>
                <p className="mt-2 text-sm text-[color:var(--mauve)]/70 leading-relaxed">
                  {t(`features.${k}.d`)}
                </p>
              </div>
            </motion.div>
          </ThreeDTilt>
        ))}
      </div>
    </Section>
  );
}
