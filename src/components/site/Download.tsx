import { motion } from "framer-motion";
import { useI18n } from "@/lib/i18n";
import { Section, Blob, HeartIcon } from "./Decor";
import { Download, Apple } from "lucide-react";

const GOOGLE_PLAY_URL = "GOOGLE_PLAY_URL_HERE";
const APP_STORE_URL = "APP_STORE_URL_HERE";
const YOUTUBE_CHANNEL_URL = "YOUTUBE_CHANNEL_URL_HERE";

export function DownloadCTA() {
  const { t, lang } = useI18n();
  return (
    <Section id="download">
      <div className="relative rounded-[40px] overflow-hidden p-10 md:p-16 text-center bg-rose-gradient text-white">
        <Blob className="w-[400px] h-[400px] -top-32 -left-20" color="rgba(255,255,255,0.25)" />
        <Blob className="w-[400px] h-[400px] -bottom-32 -right-20" color="rgba(255,255,255,0.2)" />

        <motion.div
          initial={{ scale: 0 }}
          whileInView={{ scale: 1 }}
          viewport={{ once: true }}
          transition={{ type: "spring", delay: 0.1 }}
          className="relative inline-flex w-16 h-16 items-center justify-center rounded-3xl bg-white/20 backdrop-blur heartbeat"
        >
          <HeartIcon className="w-8 h-8" />
        </motion.div>

        <h2 className="relative mt-6 text-3xl md:text-5xl font-semibold text-balance max-w-2xl mx-auto">
          {t("download.title")}
        </h2>
        <p className="relative mt-4 text-white/85 max-w-md mx-auto">{t("download.lead")}</p>

        <div className="relative mt-8 flex flex-wrap justify-center gap-3">
          <a
            href={GOOGLE_PLAY_URL}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-3 px-6 py-4 rounded-2xl bg-white text-[color:var(--rose-deep)] font-medium hover:scale-[1.04] transition shadow-soft"
          >
            <Download className="w-5 h-5" />
            <div className="text-start">
              <div className="text-[10px] opacity-70">{lang === "ar" ? "حمّلي على" : "Get it on"}</div>
              <div className="text-sm font-semibold">{t("download.google")}</div>
            </div>
          </a>
          <a
            href={APP_STORE_URL}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-3 px-6 py-4 rounded-2xl bg-white/15 backdrop-blur text-white font-medium border border-white/30 hover:bg-white/25 transition"
          >
            <Apple className="w-5 h-5" />
            <div className="text-start">
              <div className="text-[10px] opacity-80">App Store</div>
              <div className="text-sm font-semibold">{t("download.apple")}</div>
            </div>
          </a>
        </div>
      </div>
    </Section>
  );
}

export function Footer() {
  const { t, lang, setLang } = useI18n();
  return (
    <footer className="px-5 md:px-8 pb-10">
      <div className="max-w-7xl mx-auto rounded-[32px] bg-white border border-[color:var(--border)] p-8 md:p-12">
        <div className="grid md:grid-cols-[1.4fr_1fr_1fr] gap-8">
          <div>
            <div className="flex items-center gap-2 font-display text-xl text-[color:var(--rose-deep)] font-semibold">
              <span className="w-8 h-8 rounded-full bg-rose-gradient grid place-items-center text-white">
                <HeartIcon className="w-4 h-4" />
              </span>
              Girly Vibes
            </div>
            <p className="mt-3 text-sm text-[color:var(--mauve)]/70 max-w-xs">{t("footer.tagline")}</p>
            <button
              onClick={() => setLang(lang === "ar" ? "en" : "ar")}
              className="mt-5 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[color:var(--rose-soft)]/50 text-xs text-[color:var(--rose-deep)]"
            >
              🌐 {lang === "ar" ? "English" : "العربية"}
            </button>
          </div>
          <div className="text-sm">
            <p className="text-xs uppercase tracking-widest text-[color:var(--rose-deep)] mb-3">✿ Links</p>
            <ul className="space-y-2 text-[color:var(--mauve)]/80">
              <li><a href="#features">{t("nav.features")}</a></li>
              <li><a href="#calm">{t("nav.calm")}</a></li>
              <li><a href="#glow">{t("nav.glow")}</a></li>
              <li><a href="#faq">{t("nav.faq")}</a></li>
            </ul>
          </div>
          <div className="text-sm">
            <p className="text-xs uppercase tracking-widest text-[color:var(--rose-deep)] mb-3">✿ Connect</p>
            <ul className="space-y-2 text-[color:var(--mauve)]/80">
              <li><a href={YOUTUBE_CHANNEL_URL} target="_blank" rel="noreferrer">YouTube</a></li>
              <li><a href="#" >Instagram</a></li>
              <li><a href="#" >TikTok</a></li>
              <li><a href="mailto:hello@girlyvibes.app">{t("footer.contact")}</a></li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-6 border-t border-[color:var(--border)] flex flex-wrap items-center justify-between gap-3 text-xs text-[color:var(--mauve)]/60">
          <p>{t("footer.rights")} 🩷</p>
          <div className="flex gap-4">
            <a href="#">{t("footer.privacy")}</a>
            <a href="#">{t("footer.terms")}</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
