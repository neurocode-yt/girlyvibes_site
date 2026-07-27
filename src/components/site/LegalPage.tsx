import { Link } from "@tanstack/react-router";
import { useI18n } from "@/lib/i18n";
import { HeartIcon } from "./Decor";

type LegalSection = { title: { ar: string; en: string }; body: { ar: string; en: string } };

export function LegalPage({
  title,
  intro,
  sections,
  updated,
}: {
  title: { ar: string; en: string };
  intro: { ar: string; en: string };
  sections: LegalSection[];
  updated: string;
}) {
  const { lang } = useI18n();
  const isAr = lang === "ar";
  const pick = (v: { ar: string; en: string }) => (isAr ? v.ar : v.en);

  return (
    <div className="min-h-screen bg-[color:var(--background)] text-[color:var(--mauve)] px-5 py-10 md:py-16">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <Link to="/" className="flex items-center gap-2 font-display text-xl font-semibold text-[color:var(--rose-deep)]">
            <span className="w-8 h-8 rounded-full bg-rose-gradient grid place-items-center text-white">
              <HeartIcon className="w-4 h-4" />
            </span>
            Girly Vibes
          </Link>
          <Link
            to="/"
            className="px-4 py-2 rounded-full text-sm bg-white border border-[color:var(--border)] text-[color:var(--rose-deep)] hover:bg-[color:var(--rose-soft)] transition"
          >
            {isAr ? "🌸 رجوع للرئيسية" : "🌸 Back home"}
          </Link>
        </div>

        <div className="mt-8 rounded-[32px] bg-white border border-[color:var(--border)] shadow-card p-7 md:p-12">
          <p className="text-xs font-medium tracking-widest uppercase text-[color:var(--rose-deep)]">✿ Girly Vibes</p>
          <h1 className="mt-2 text-3xl md:text-4xl font-semibold">{pick(title)}</h1>
          <p className="mt-1.5 text-xs text-[color:var(--mauve)]/50">
            {isAr ? "آخر تحديث:" : "Last updated:"} {updated}
          </p>
          <p className="mt-5 text-[color:var(--mauve)]/75 leading-relaxed">{pick(intro)}</p>

          <div className="mt-8 space-y-7">
            {sections.map((s, i) => (
              <section key={i}>
                <h2 className="text-lg font-display font-semibold text-[color:var(--rose-deep)]">
                  {pick(s.title)}
                </h2>
                <p className="mt-2 text-sm text-[color:var(--mauve)]/75 leading-relaxed">{pick(s.body)}</p>
              </section>
            ))}
          </div>

          <div className="mt-10 pt-6 border-t border-[color:var(--border)] text-sm text-[color:var(--mauve)]/70">
            {isAr ? "أي سؤال؟ تواصلي معنا على " : "Questions? Reach us at "}
            <a href="mailto:hello@girly-vibes.com" className="text-[color:var(--rose-deep)] underline underline-offset-2">
              hello@girly-vibes.com
            </a>{" "}
            🩷
          </div>
        </div>
      </div>
    </div>
  );
}

export type { LegalSection };
export function legalHead(path: string, titleEn: string, description: string) {
  return {
    meta: [
      { title: `${titleEn} | Girly Vibes` },
      { name: "description", content: description },
      { property: "og:title", content: `${titleEn} | Girly Vibes` },
      { property: "og:description", content: description },
    ],
    links: [{ rel: "canonical", href: `https://girly-vibes.com${path}` }],
  };
}
