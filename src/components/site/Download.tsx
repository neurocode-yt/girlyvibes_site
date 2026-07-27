import { motion } from "framer-motion";
import { Link } from "@tanstack/react-router";
import { useI18n } from "@/lib/i18n";
import { Section, Blob, HeartIcon } from "./Decor";
import { Download, Apple } from "lucide-react";

// Set these to the real store URLs once the app is published —
// the buttons below automatically become clickable links.
const GOOGLE_PLAY_URL = "";
const APP_STORE_URL = "";
const YOUTUBE_CHANNEL_URL = "https://www.youtube.com/@girlyvibes0";

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
          <StoreButton
            url={GOOGLE_PLAY_URL}
            icon={<Download className="w-5 h-5" />}
            eyebrow={lang === "ar" ? "حمّلي على" : "Get it on"}
            label={t("download.google")}
            soonLabel={lang === "ar" ? "قريبًا 🌸" : "soon 🌸"}
            primary
          />
          <StoreButton
            url={APP_STORE_URL}
            icon={<Apple className="w-5 h-5" />}
            eyebrow="App Store"
            label={t("download.apple")}
            soonLabel={lang === "ar" ? "قريبًا 🌸" : "soon 🌸"}
          />
        </div>
      </div>
    </Section>
  );
}

function StoreButton({
  url,
  icon,
  eyebrow,
  label,
  soonLabel,
  primary = false,
}: {
  url: string;
  icon: React.ReactNode;
  eyebrow: string;
  label: string;
  soonLabel: string;
  primary?: boolean;
}) {
  const baseClass = primary
    ? "relative inline-flex items-center gap-3 px-6 py-4 rounded-2xl bg-white text-[color:var(--rose-deep)] font-medium shadow-soft"
    : "relative inline-flex items-center gap-3 px-6 py-4 rounded-2xl bg-white/15 backdrop-blur text-white font-medium border border-white/30";

  const content = (
    <>
      {icon}
      <div className="text-start">
        <div className={`text-[10px] ${primary ? "opacity-70" : "opacity-80"}`}>{eyebrow}</div>
        <div className="text-sm font-semibold">{label}</div>
      </div>
    </>
  );

  if (url) {
    return (
      <a href={url} target="_blank" rel="noreferrer" className={`${baseClass} hover:scale-[1.04] transition`}>
        {content}
      </a>
    );
  }

  // No store URL yet — show a soft "coming soon" card instead of a broken link
  return (
    <div className={`${baseClass} cursor-default select-none`} aria-disabled="true">
      {content}
      <span className="absolute -top-2 -end-2 px-2 py-0.5 rounded-full bg-white text-[color:var(--rose-deep)] text-[10px] font-bold shadow-soft border border-[color:var(--rose-soft)]">
        {soonLabel}
      </span>
    </div>
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
              <li><a href={YOUTUBE_CHANNEL_URL} target="_blank" rel="noreferrer" className="hover:text-[color:var(--rose-deep)] transition">YouTube</a></li>
              <li className="opacity-60 cursor-default">Instagram — {lang === "ar" ? "قريبًا" : "soon"} 🎀</li>
              <li className="opacity-60 cursor-default">TikTok — {lang === "ar" ? "قريبًا" : "soon"} 🎀</li>
              <li><a href="mailto:hello@girly-vibes.com" className="hover:text-[color:var(--rose-deep)] transition">{t("footer.contact")}</a></li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-6 border-t border-[color:var(--border)] flex flex-wrap items-center justify-between gap-3 text-xs text-[color:var(--mauve)]/60">
          <p>{t("footer.rights")} 🩷</p>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
            <Link
              to="/privacy"
              className="inline-flex items-center rounded-full border border-[color:var(--border)] bg-[color:var(--rose-soft)]/60 px-3 py-1 text-[color:var(--rose-deep)] transition hover:bg-[color:var(--rose-soft)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--rose-deep)]"
            >
              {lang === "ar" ? "سياسة الخصوصية" : "Privacy Policy"}
            </Link>
            <Link
              to="/delete-account"
              className="inline-flex items-center rounded-full border border-[color:var(--border)] bg-[color:var(--rose-soft)]/60 px-3 py-1 text-[color:var(--rose-deep)] transition hover:bg-[color:var(--rose-soft)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--rose-deep)]"
            >
              {lang === "ar" ? "حذف الحساب" : "Delete Account"}
            </Link>
            <Link to="/terms" className="hover:text-[color:var(--rose-deep)] transition">
              {t("footer.terms")}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
