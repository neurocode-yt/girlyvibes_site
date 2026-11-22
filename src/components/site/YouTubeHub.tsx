import { useMemo, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { useI18n } from "@/lib/i18n";
import { Section } from "./Decor";
import { Play, Youtube as YT, Eye, Clock, Users } from "lucide-react";
import {
  FALLBACK_YOUTUBE_DATA,
  HANDLE,
  type YTPayload,
  type YTVideo,
  type YTPlaylist,
} from "@/lib/youtubeData";

const CHANNEL_URL = `https://www.youtube.com/@${HANDLE}`;

type FilterKey = "latest" | "popular" | "skincare" | "advice" | "glow" | "calm";

const FILTERS: { key: FilterKey; en: string; ar: string; kws: string[] }[] = [
  { key: "latest", en: "Latest", ar: "الأحدث", kws: [] },
  { key: "popular", en: "Most Watched", ar: "الأكثر مشاهدة", kws: [] },
  {
    key: "skincare",
    en: "Skincare",
    ar: "العناية",
    kws: [
      "skin",
      "skincare",
      "face",
      "بشرة",
      "عناية",
      "وجه",
      "حب الشباب",
      "acne",
      "glow up",
      "جلو",
    ],
  },
  {
    key: "advice",
    en: "Advice",
    ar: "نصائح",
    kws: ["advice", "tips", "girl", "نصيح", "بنات", "حياة", "school", "مدرسة", "confidence", "ثقة"],
  },
  {
    key: "glow",
    en: "Glow Up",
    ar: "جلو أب",
    kws: ["glow", "routine", "روتين", "transformation", "تغيير", "before", "after", "جلو"],
  },
  {
    key: "calm",
    en: "Calm",
    ar: "الهدوء",
    kws: ["calm", "relax", "هدوء", "تأمل", "تنفس", "نوم", "sleep", "anxiety", "قلق"],
  },
];

function formatDuration(iso: string) {
  const m = iso.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!m) return "";
  const [, h, mi, s] = m;
  const hh = h ? `${h}:` : "";
  const mm = (mi ?? "0").padStart(h ? 2 : 1, "0");
  const ss = (s ?? "0").padStart(2, "0");
  return `${hh}${mm}:${ss}`;
}

function formatViews(n: number, isAr: boolean) {
  return new Intl.NumberFormat(isAr ? "ar-EG" : "en", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(n);
}

function VideoDate({ value, isAr }: { value: string; isAr: boolean }) {
  const date = new Date(value);
  if (!Number.isFinite(date.getTime())) return null;
  return (
    <time dateTime={value}>
      {new Intl.DateTimeFormat(isAr ? "ar-EG" : "en-GB", {
        dateStyle: "medium",
        timeZone: "UTC",
      }).format(date)}
    </time>
  );
}

async function loadChannel(signal: AbortSignal): Promise<YTPayload> {
  try {
    if (import.meta.env.DEV) {
      const { getChannelData } = await import("@/lib/youtube.functions");
      return await getChannelData();
    }

    const response = await fetch("/api/youtube", { signal });
    if (response.ok && response.headers.get("content-type")?.includes("application/json")) {
      const data = (await response.json()) as YTPayload;
      if (Array.isArray(data?.videos) && data.videos.length && Array.isArray(data.playlists)) {
        return data;
      }
    }
  } catch (error) {
    if (signal.aborted) throw error;
  }
  return FALLBACK_YOUTUBE_DATA;
}

export function YouTubeHub() {
  const { t, lang } = useI18n();
  const isAr = lang === "ar";
  const sectionRef = useRef<HTMLElement>(null);
  const nearYouTube = useInView(sectionRef, { once: true, margin: "400px 0px" });
  const { data } = useQuery({
    queryKey: ["yt-channel"],
    queryFn: ({ signal }) => loadChannel(signal),
    enabled: nearYouTube,
    initialData: FALLBACK_YOUTUBE_DATA,
    initialDataUpdatedAt: 0,
    staleTime: (query) => (query.state.data?.isFallback ? 60_000 : 30 * 60_000),
  });
  const [filter, setFilter] = useState<FilterKey>("latest");

  const { videos, playlists, channel, isFallback } = data;

  const filtered = useMemo(() => {
    if (filter === "latest") {
      return [...videos].sort((a, b) => +new Date(b.publishedAt) - +new Date(a.publishedAt));
    }
    if (filter === "popular") {
      return [...videos].sort((a, b) => b.views - a.views);
    }
    const f = FILTERS.find((x) => x.key === filter)!;
    return videos.filter((v) => {
      const hay = `${v.title} ${v.description}`.toLowerCase();
      return f.kws.some((k) => hay.includes(k.toLowerCase()));
    });
  }, [videos, filter]);

  const featured = useMemo(() => {
    if (!videos.length) return null;
    return [...videos].sort((a, b) => b.views - a.views)[0];
  }, [videos]);

  return (
    <Section id="youtube" ref={sectionRef}>
      <div className="mb-10 text-center">
        <h2 className="text-3xl md:text-5xl font-semibold text-[color:var(--mauve)]">
          {t("youtube.title")}
        </h2>
        <p className="mt-3 text-[color:var(--mauve)]/70">{t("youtube.lead")}</p>

        {channel && (
          <div className="mt-6 inline-flex max-w-full flex-wrap items-center justify-center gap-3 rounded-3xl border border-[color:var(--border)] bg-[color:var(--card)] p-3 shadow-sm sm:rounded-full sm:px-5">
            {channel.thumbnail && (
              <img
                src={channel.thumbnail}
                alt=""
                className="w-9 h-9 rounded-full"
                loading="lazy"
                decoding="async"
                width={36}
                height={36}
              />
            )}
            <div className="text-start">
              <p className="text-sm font-semibold text-[color:var(--mauve)]">{channel.title}</p>
              <p className="flex flex-wrap items-center gap-1.5 text-sm text-[color:var(--mauve)]">
                <Users aria-hidden="true" className="size-3.5" />{" "}
                {formatViews(channel.subscribers, isAr)} {isAr ? "مشترك" : "subscribers"}
                <span>·</span>
                <span>
                  {channel.videoCount} {isAr ? "فيديو" : "videos"}
                </span>
              </p>
            </div>
            <a
              href={CHANNEL_URL}
              target="_blank"
              rel="noreferrer"
              className="inline-flex min-h-11 items-center gap-1.5 rounded-full bg-[color:var(--mauve)] px-4 text-sm font-medium text-[color:var(--background)] hover:opacity-90"
            >
              <YT aria-hidden="true" className="size-4" /> {t("youtube.subscribe")}
            </a>
          </div>
        )}
        {isFallback && (
          <p className="mt-3 text-sm text-[color:var(--mauve)]">{t("youtube.saved")}</p>
        )}
      </div>

      {/* Featured */}
      {featured && (
        <a
          href={featured.url}
          target="_blank"
          rel="noreferrer"
          className="group mb-10 grid overflow-hidden rounded-3xl border border-[color:var(--border)] bg-[color:var(--card)] shadow-card transition-colors hover:bg-[color:var(--rose-soft)]/40 md:grid-cols-[1.15fr_1fr]"
        >
          <div className="relative aspect-video bg-[color:var(--rose-soft)]">
            <img
              src={featured.thumbnail}
              alt=""
              loading="lazy"
              decoding="async"
              className="absolute inset-0 size-full object-cover"
            />
            <div
              aria-hidden="true"
              className="absolute inset-0 grid place-items-center bg-black/20"
            >
              <span className="grid size-14 place-items-center rounded-full bg-white text-[#7B3D54] shadow-card">
                <Play className="size-6 fill-current" />
              </span>
            </div>
          </div>
          <div className="self-center p-4 sm:p-6">
            <p className="text-sm text-[color:var(--mauve)]">
              {isAr ? "الأكثر مشاهدة" : "Most watched"}
            </p>
            <h3 className="mt-1 font-semibold text-[color:var(--mauve)] sm:text-xl" dir="auto">
              {featured.title}
            </h3>
            <p className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-[color:var(--mauve)]">
              <span className="inline-flex items-center gap-1">
                <Eye aria-hidden="true" className="size-4" /> {formatViews(featured.views, isAr)}
              </span>
              <span className="inline-flex items-center gap-1">
                <Clock aria-hidden="true" className="size-4" />{" "}
                <bdi>{formatDuration(featured.duration)}</bdi>
              </span>
              <VideoDate value={featured.publishedAt} isAr={isAr} />
            </p>
          </div>
        </a>
      )}

      {/* Filter tabs */}
      <div
        role="group"
        aria-label={t("youtube.filters")}
        className="flex flex-wrap justify-center gap-2 mb-8"
      >
        {FILTERS.map((f) => {
          const active = filter === f.key;
          return (
            <button
              key={f.key}
              type="button"
              aria-pressed={active}
              onClick={() => setFilter(f.key)}
              className={`min-h-11 cursor-pointer rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
                active
                  ? "bg-[color:var(--mauve)] text-[color:var(--background)] border-transparent"
                  : "bg-[color:var(--card)] text-[color:var(--mauve)] border-[color:var(--border)] hover:bg-[color:var(--rose-soft)]"
              }`}
            >
              {isFallback && f.key === "latest" ? t("youtube.savedFilter") : isAr ? f.ar : f.en}
            </button>
          );
        })}
      </div>

      {/* Video grid */}
      {filtered.length === 0 ? (
        <div role="status" className="text-center py-12 text-[color:var(--mauve)]">
          {isAr ? "لا توجد فيديوهات في هذا القسم بعد." : "No videos in this section yet."}
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.slice(0, 12).map((v, i) => (
            <VideoCard key={v.id} v={v} i={i} isAr={isAr} />
          ))}
        </div>
      )}

      {/* Playlists */}
      {playlists.length > 0 && (
        <div className="mt-14">
          <h3 className="text-2xl font-display font-semibold text-[color:var(--mauve)] mb-5 text-center">
            {isAr ? "قوائم التشغيل" : "Playlists"}
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {playlists.map((p, i) => (
              <PlaylistCard key={p.id} p={p} i={i} isAr={isAr} />
            ))}
          </div>
        </div>
      )}
    </Section>
  );
}

function VideoCard({ v, i, isAr }: { v: YTVideo; i: number; isAr: boolean }) {
  return (
    <motion.a
      href={v.url}
      target="_blank"
      rel="noreferrer"
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: Math.min(i * 0.04, 0.3) }}
      className="group relative p-2 rounded-[24px] bg-gradient-to-tr from-[#FFB2CB] via-[#FFF9F7] to-[#FCE5EE] border border-[#FFD6E3] hover:shadow-glow hover:scale-[1.02] transition duration-300 block"
    >
      {/* Cute Floating Ribbon decoration */}
      <div
        className="absolute -top-2.5 -left-2.5 text-xl z-20 select-none drop-shadow-sm filter animate-pulse"
        style={{ animationDuration: "4s" }}
      >
        🎀
      </div>
      {/* Cute Flower decoration on the bottom-right of frame */}
      <div className="absolute -bottom-2 -right-2 text-lg z-20 select-none drop-shadow-sm">🌸</div>

      {/* Inner Card Content */}
      <div className="rounded-[18px] overflow-hidden bg-white border border-[#FFD6E3]/40 shadow-sm h-full flex flex-col">
        <div className="relative aspect-video overflow-hidden bg-[color:var(--blush)]">
          <img
            src={v.thumbnail}
            alt=""
            loading="lazy"
            decoding="async"
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition duration-500"
          />
          <div className="absolute bottom-2 end-2 px-1.5 py-0.5 rounded bg-black/80 text-white text-[10px] font-medium">
            {formatDuration(v.duration)}
          </div>
          <div className="absolute inset-0 grid place-items-center opacity-0 group-hover:opacity-100 transition bg-black/30">
            <div className="w-12 h-12 rounded-full bg-white/95 grid place-items-center">
              <Play className="w-5 h-5 text-[color:var(--rose-deep)] fill-current ms-0.5" />
            </div>
          </div>
        </div>
        <div className="p-4 flex-1 flex flex-col justify-between">
          <p className="font-medium text-sm text-[color:var(--mauve)] line-clamp-2 leading-snug">
            {v.title}
          </p>
          <div className="mt-2.5 flex items-center gap-3 text-[11px] text-[color:var(--mauve)]/60">
            <span className="inline-flex items-center gap-1">
              <Eye aria-hidden="true" className="w-3 h-3" /> {formatViews(v.views, isAr)}
            </span>
            <span>·</span>
            <VideoDate value={v.publishedAt} isAr={isAr} />
          </div>
        </div>
      </div>
    </motion.a>
  );
}

function PlaylistCard({ p, i, isAr }: { p: YTPlaylist; i: number; isAr: boolean }) {
  return (
    <motion.a
      href={p.url}
      target="_blank"
      rel="noreferrer"
      initial={{ opacity: 0, scale: 0.96 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ delay: i * 0.04 }}
      className="group relative p-1.5 rounded-[20px] bg-gradient-to-tr from-[#FFD6E3] via-[#FFF9F7] to-[#FCE5EE] border border-[#FFD6E3]/60 hover:shadow-glow hover:scale-[1.02] transition duration-300 block"
    >
      {/* Tiny Tulip emoji */}
      <div className="absolute -top-1.5 -left-1.5 text-sm z-20 select-none">🌷</div>
      <div className="rounded-[14px] overflow-hidden bg-white border border-[#FFD6E3]/30 h-full flex flex-col">
        <div className="relative aspect-video overflow-hidden">
          {p.thumbnail ? (
            <img
              src={p.thumbnail}
              alt=""
              loading="lazy"
              decoding="async"
              className="absolute inset-0 w-full h-full object-cover"
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-[#FFD6E3] to-[#F4A4C0]" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
          <div className="absolute bottom-2 end-2 px-2 py-0.5 rounded bg-black/80 text-white text-[10px] font-medium flex items-center gap-1">
            <Play className="w-2.5 h-2.5 fill-current" /> {p.itemCount}
          </div>
        </div>
        <div className="p-3 flex-1 flex flex-col justify-between">
          <p className="font-medium text-sm text-[color:var(--mauve)] line-clamp-2 leading-tight">
            {p.title}
          </p>
          <p className="text-[11px] text-[color:var(--mauve)]/60 mt-1.5">
            {p.itemCount} {isAr ? "فيديو" : "videos"}
          </p>
        </div>
      </div>
    </motion.a>
  );
}
