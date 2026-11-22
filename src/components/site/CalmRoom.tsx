import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Heart, Pause, Play, RotateCcw } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { Blob, Section } from "./Decor";

const cardKeys = ["calm.c1", "calm.c2", "calm.c3", "calm.c4"];
const stepSeconds = 4;
const steps = [
  { label: "calm.inhale", scale: 1.12, color: "bg-[#F7D4E4]" },
  { label: "calm.hold", scale: 1.12, color: "bg-[#FFE3EE]" },
  { label: "calm.exhale", scale: 0.92, color: "bg-[#D2EEE8]" },
  { label: "calm.rest", scale: 0.92, color: "bg-[#E8DDF7]" },
];

type BreathingClock = {
  started: boolean;
  runningSince: number | null;
  savedMilliseconds: number;
  seconds: number;
};

const initialClock: BreathingClock = {
  started: false,
  runningSince: null,
  savedMilliseconds: 0,
  seconds: 0,
};

function pauseClock(clock: BreathingClock, now: number): BreathingClock {
  if (clock.runningSince === null) return clock;
  const savedMilliseconds = clock.savedMilliseconds + now - clock.runningSince;
  return {
    ...clock,
    runningSince: null,
    savedMilliseconds,
    seconds: Math.floor(savedMilliseconds / 1000),
  };
}

export function CalmRoom() {
  const { t, lang } = useI18n();
  const [clock, setClock] = useState(initialClock);
  const playing = clock.runningSince !== null;
  const phase = steps[Math.floor(clock.seconds / stepSeconds) % steps.length];
  const secondsLeft = stepSeconds - (clock.seconds % stepSeconds);

  useEffect(() => {
    if (!playing) return;

    const timer = window.setInterval(() => {
      const now = performance.now();
      setClock((current) => {
        if (current.runningSince === null) return current;
        const seconds = Math.floor((current.savedMilliseconds + now - current.runningSince) / 1000);
        return seconds === current.seconds ? current : { ...current, seconds };
      });
    }, 100);

    const pauseInBackground = () => {
      if (document.hidden) {
        const now = performance.now();
        setClock((current) => pauseClock(current, now));
      }
    };
    document.addEventListener("visibilitychange", pauseInBackground);

    return () => {
      window.clearInterval(timer);
      document.removeEventListener("visibilitychange", pauseInBackground);
    };
  }, [playing]);

  const toggleClock = () => {
    const now = performance.now();
    setClock((current) =>
      current.runningSince === null
        ? { ...current, started: true, runningSince: now }
        : pauseClock(current, now),
    );
  };

  const restart = () => {
    const now = performance.now();
    setClock((current) =>
      current.runningSince === null
        ? initialClock
        : { ...initialClock, started: true, runningSince: now },
    );
  };

  const buttonLabel = playing ? "calm.pause" : clock.started ? "calm.resume" : "calm.start";

  return (
    <Section id="calm">
      <div className="relative overflow-hidden rounded-[40px] bg-gradient-to-br from-[#3a2230] via-[#52304a] to-[#7a3f5e] p-5 text-white sm:p-8 lg:p-14">
        <Blob className="-end-20 -top-20 size-[400px]" color="oklch(0.78 0.12 0 / 0.35)" />
        <div className="relative grid gap-6 lg:grid-cols-2 lg:gap-x-12">
          <div className="lg:col-start-1 lg:row-start-1 lg:self-end">
            <h2 className="text-balance text-3xl font-semibold md:text-5xl">{t("calm.title")}</h2>
            <p className="mt-3 text-pretty text-lg leading-relaxed text-white/90">
              {t("calm.lead")}
            </p>
          </div>

          <div className="rounded-[28px] border border-[#FFE3EE]/25 bg-[#311D2B] p-4 text-center sm:p-6 lg:col-start-2 lg:row-span-2 lg:row-start-1">
            <h3 className="text-xl font-semibold text-white">{t("calm.guide")}</h3>
            <p className="mt-1 text-sm text-[#EEDCE7]">{t("calm.timing")}</p>

            <div className="my-4 grid min-h-40 place-items-center overflow-hidden py-2">
              <motion.div
                initial={false}
                animate={{ scale: playing ? phase.scale : 1 }}
                transition={{ duration: playing ? stepSeconds : 0.25, ease: "easeInOut" }}
                className={`grid size-32 max-w-full place-content-center rounded-full text-[#321D2B] sm:size-36 ${phase.color}`}
              >
                <span role="timer" className="text-3xl font-semibold tabular-nums">
                  {new Intl.NumberFormat(lang === "ar" ? "ar-EG" : "en", {
                    style: "unit",
                    unit: "second",
                    unitDisplay: "short",
                  }).format(secondsLeft)}
                </span>
              </motion.div>
            </div>

            <p
              role="status"
              aria-atomic="true"
              className="mx-auto grid min-h-12 max-w-xs place-content-center text-pretty leading-snug"
            >
              {clock.started ? (
                <>
                  {!playing && <span className="text-sm text-[#EEDCE7]">{t("calm.paused")}</span>}
                  <span>{t(phase.label)}</span>
                </>
              ) : (
                t("calm.ready")
              )}
            </p>

            <div className="mt-4 flex flex-wrap justify-center gap-2">
              <button
                type="button"
                onClick={toggleClock}
                className="inline-flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-full bg-[#FFE3EE] px-5 py-2.5 font-semibold text-[#321D2B] transition-colors hover:bg-white focus-visible:outline-white"
              >
                {playing ? (
                  <Pause aria-hidden="true" className="size-4" />
                ) : (
                  <Play aria-hidden="true" className="size-4" />
                )}
                {t(buttonLabel)}
              </button>
              <button
                type="button"
                onClick={restart}
                disabled={!clock.started}
                className="inline-flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-full border border-white/35 px-4 py-2.5 font-semibold text-white transition-colors hover:bg-white/15 focus-visible:outline-white disabled:cursor-default disabled:opacity-50"
              >
                <RotateCcw aria-hidden="true" className="size-4" />
                {t("calm.restart")}
              </button>
            </div>
          </div>
          <div className="lg:col-start-1 lg:row-start-2">
            <ul className="grid gap-3 sm:grid-cols-2">
              {cardKeys.map((key) => (
                <li
                  key={key}
                  className="flex items-start gap-2 rounded-2xl border border-white/20 bg-white/10 p-3"
                >
                  <Heart aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-[#FFD9E7]" />
                  {t(key)}
                </li>
              ))}
            </ul>
            <p className="mt-6 max-w-lg text-sm leading-relaxed text-white/85">
              {t("calm.disclaimer")}
            </p>
          </div>
        </div>
      </div>
    </Section>
  );
}
