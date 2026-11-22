import { useState } from "react";
import { Coffee, Compass, Image, MessageCircle, Play, Wind } from "lucide-react";
import maryamStill from "@/assets/app-preview/maryam-welcome-still.png";
import maryamWelcome from "@/assets/app-preview/maryam-welcome.webp";
import { useI18n } from "@/lib/i18n";
import { Section } from "./Decor";

const modes = [
  { key: "heart", Icon: MessageCircle },
  { key: "advice", Icon: Compass },
  { key: "calm", Icon: Wind },
  { key: "gossip", Icon: Coffee },
];

export function Maryam() {
  const { t } = useI18n();
  const [showAnimation, setShowAnimation] = useState(false);
  const [animationFailed, setAnimationFailed] = useState(false);

  return (
    <Section id="maryam">
      <div className="grid items-center gap-8 rounded-[32px] border border-[color:var(--border)] bg-[color:var(--rose-soft)]/40 p-6 md:grid-cols-[1.15fr_1fr] md:p-12">
        <div>
          <h2 className="text-3xl font-semibold text-[color:var(--mauve)] md:text-5xl">
            {t("maryam.title")}
          </h2>
          <p className="mt-4 max-w-xl leading-relaxed text-[color:var(--mauve)]">
            {t("maryam.lead")}
          </p>
          <ul className="mt-6 grid gap-2 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2">
            {modes.map(({ key, Icon }) => (
              <li
                key={key}
                className="flex items-center gap-3 rounded-2xl border border-[color:var(--border)] bg-[color:var(--card)] px-4 py-3 font-semibold text-[color:var(--mauve)]"
              >
                <Icon
                  aria-hidden="true"
                  className="size-5 shrink-0 text-[color:var(--rose-deep)]"
                />
                {t(`maryam.mode.${key}`)}
              </li>
            ))}
          </ul>
          <p className="mt-5 max-w-xl text-sm leading-relaxed text-[color:var(--mauve)]">
            {t("maryam.note")}
          </p>
        </div>
        <div className="flex min-w-0 flex-col items-center gap-4">
          <img
            id="maryam-art"
            src={showAnimation ? maryamWelcome : maryamStill}
            alt={t("maryam.portrait")}
            width={512}
            height={512}
            loading={showAnimation ? "eager" : "lazy"}
            className="h-auto w-full max-w-80"
            onError={() => {
              if (showAnimation) {
                setShowAnimation(false);
                setAnimationFailed(true);
              }
            }}
          />
          <button
            type="button"
            aria-controls="maryam-art"
            className="inline-flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-full border border-[color:var(--border)] bg-[color:var(--card)] px-5 py-2.5 text-start text-sm font-semibold text-[color:var(--mauve)] transition-colors hover:bg-[color:var(--rose-soft)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[color:var(--rose-deep)]"
            onClick={() => {
              setAnimationFailed(false);
              setShowAnimation(!showAnimation);
            }}
          >
            {showAnimation ? (
              <Image aria-hidden="true" className="size-4 shrink-0" />
            ) : (
              <Play aria-hidden="true" className="size-4 shrink-0" />
            )}
            {t(showAnimation ? "maryam.still" : "maryam.play")}
          </button>
          {animationFailed && (
            <p role="status" className="text-sm">
              {t("maryam.animationFailed")}
            </p>
          )}
        </div>
      </div>
    </Section>
  );
}
