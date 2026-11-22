import { useI18n } from "@/lib/i18n";
import activitiesArt from "@/assets/app-preview/activities-v1.webp";
import readArt from "@/assets/app-preview/read-v1.webp";
import savedArt from "@/assets/app-preview/saved-v1.webp";
import { PhoneFrame } from "./PhoneFrame";
import { FloatingDecor, Blob } from "./Decor";
import { motion } from "framer-motion";
import { Flower2, MessageCircle, Sparkles, Smartphone, SquareCheck, Wand2 } from "lucide-react";
import { ThreeDTilt } from "./ThreeDTilt";

const chipKeys = [
  "hero.chip.lang",
  "hero.chip.offline",
  "hero.chip.private",
];

const homeShortcuts = [
  { label: "read", art: readArt },
  { label: "saved", art: savedArt },
  { label: "activities", art: activitiesArt },
];

export function Hero() {
  const { t } = useI18n();
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
              href="#features"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-[color:var(--mauve)] text-[color:var(--background)] font-medium shadow-soft hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[color:var(--rose-deep)] transition-opacity"
            >
              <Wand2 aria-hidden="true" className="w-4 h-4" />
              {t("hero.cta.features")}
            </a>
            <a
              href="#download"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-[color:var(--card)] text-[color:var(--mauve)] font-medium border border-[color:var(--border)] hover:bg-[color:var(--rose-soft)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[color:var(--rose-deep)] transition-colors"
            >
              <Smartphone aria-hidden="true" className="w-4 h-4" />
              {t("nav.download")}
            </a>
            <a
              href="#maryam"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-[color:var(--card)] text-[color:var(--mauve)] font-medium border border-[color:var(--border)] hover:bg-[color:var(--rose-soft)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[color:var(--rose-deep)] transition-colors"
            >
              <MessageCircle aria-hidden="true" className="w-4 h-4" />
              {t("maryam.title")}
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="mt-8 flex flex-wrap gap-2 justify-center lg:justify-start"
          >
            {chipKeys.map((k) => (
              <span key={k} className="px-3 py-1.5 rounded-full text-sm bg-[color:var(--card)] border border-[color:var(--border)] text-[color:var(--mauve)]">
                {t(k)}
              </span>
            ))}
          </motion.div>
        </div>

        <figure className="relative z-20 grid min-w-0 justify-items-center gap-4">
          <ThreeDTilt maxRotation={7} scale={1.01}>
            <PhoneFrame glow notch="cream">
              <HomeMockup />
            </PhoneFrame>
          </ThreeDTilt>
          <figcaption className="text-center text-sm text-[color:var(--mauve)]">
            {t("homePreview.caption")}
          </figcaption>
        </figure>
      </div>
    </section>
  );
}

function HomeMockup() {
  const { t } = useI18n();

  return (
    <div className="h-full bg-[#FFF9FB] px-3 pt-12 pb-4 text-[#350814] dark:bg-[#231722] dark:text-[#FFF1ED]">
      <div className="rounded-2xl bg-[#FFD9E7] px-4 py-4 dark:bg-[#422A3D]">
        <p className="text-sm">{t("homePreview.greeting")}</p>
        <p className="mt-1 text-xl font-semibold">Girly Vibes</p>
      </div>
      <div className="mt-3 rounded-2xl border border-[#F2D3D9] bg-white px-3 py-2.5 dark:border-[#654052] dark:bg-[#372632]">
        <p className="text-sm font-semibold">{t("homePreview.todo")}</p>
        <p className="mt-1 flex items-center gap-2 text-sm">
          <SquareCheck aria-hidden="true" className="size-4 shrink-0 text-[#9E4661] dark:text-[#FFA9C6]" />
          {t("homePreview.todoItem")}
        </p>
      </div>
      <ul className="mt-3 grid gap-2">
        {homeShortcuts.map(({ label, art }) => (
          <li
            key={label}
            className="flex min-h-16 items-center gap-2 rounded-2xl border border-[#F2D3D9] bg-gradient-to-br from-[#FDE8E2] to-[#FFF1ED] px-2 py-1.5 dark:border-[#654052] dark:from-[#382730] dark:to-[#472E3D]"
          >
            <img src={art} alt="" width={52} height={52} className="size-[52px] shrink-0 object-contain" />
            <span className="min-w-0 text-sm font-semibold leading-snug">{t(`homePreview.${label}`)}</span>
          </li>
        ))}
      </ul>
      <div className="mt-3 rounded-2xl border border-[#F2D3D9] bg-white p-3 dark:border-[#654052] dark:bg-[#372632]">
        <div className="flex items-center gap-2">
          <Flower2 aria-hidden="true" className="size-5 shrink-0 text-[#9E4661] dark:text-[#FFA9C6]" />
          <div>
            <p className="text-sm">{t("homePreview.favorite")}</p>
            <p className="text-base font-semibold">{t("homePreview.morning")}</p>
          </div>
        </div>
        <div aria-hidden="true" className="mt-2 h-2 overflow-hidden rounded-full bg-[#F8D5E1] dark:bg-[#553646]">
          <div className="h-full w-1/2 rounded-full bg-[#9E4661] dark:bg-[#FFA9C6]" />
        </div>
      </div>
    </div>
  );
}
