import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useI18n } from "@/lib/i18n";
import { Section } from "./Decor";
import { Play, Youtube as YT, Eye, Clock, Users, Loader2 } from "lucide-react";
import { getChannelData, type YTVideo, type YTPlaylist } from "@/lib/youtube.functions";

const CHANNEL_URL = "https://www.youtube.com/@girlyvibes0";

type FilterKey = "latest" | "popular" | "skincare" | "advice" | "glow" | "calm";

const FILTERS: { key: FilterKey; en: string; ar: string; kws: string[] }[] = [
  { key: "latest", en: "Latest", ar: "الأحدث", kws: [] },
  { key: "popular", en: "Most Watched", ar: "الأكثر مشاهدة", kws: [] },
  { key: "skincare", en: "Skincare", ar: "العناية", kws: ["skin", "skincare", "face", "بشرة", "عناية", "وجه", "حب الشباب", "acne", "glow up", "جلو"] },
  { key: "advice", en: "Advice", ar: "نصائح", kws: ["advice", "tips", "girl", "نصيح", "بنات", "حياة", "school", "مدرسة", "confidence", "ثقة"] },
  { key: "glow", en: "Glow Up", ar: "جلو أب", kws: ["glow", "routine", "روتين", "transformation", "تغيير", "before", "after", "جلو"] },
  { key: "calm", en: "Calm", ar: "الهدوء", kws: ["calm", "relax", "هدوء", "تأمل", "تنفس", "نوم", "sleep", "anxiety", "قلق"] },
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

function formatViews(n: number) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return String(n);
}

function timeAgo(iso: string, isAr: boolean) {
  const diff = (Date.now() - new Date(iso).getTime()) / 1000;
  const u = (n: number, en: string, ar: string) =>
    isAr ? `قبل ${Math.floor(n)} ${ar}` : `${Math.floor(n)} ${en} ago`;
  if (diff < 3600) return u(diff / 60, "min", "د");
  if (diff < 86400) return u(diff / 3600, "h", "س");
  if (diff < 604800) return u(diff / 86400, "d", "ي");
  if (diff < 2592000) return u(diff / 604800, "w", "أسبوع");
  if (diff < 31536000) return u(diff / 2592000, "mo", "شهر");
  return u(diff / 31536000, "y", "سنة");
}

export function YouTubeHub() {
  const { t, lang } = useI18n();
  const isAr = lang === "ar";
  const fetchFn = useServerFn(getChannelData);
  const { data, isLoading } = useQuery({
    queryKey: ["yt-channel"],
    queryFn: () => fetchFn(),
    staleTime: 1000 * 60 * 30,
  });
  const [filter, setFilter] = useState<FilterKey>("latest");

  const videos = data?.videos ?? [];
  const playlists = data?.playlists ?? [];
  const channel = data?.channel;

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
    <Section id="youtube">
      <div className="text-center mb-10">
        <p className="text-xs font-medium tracking-widest uppercase text-[color:var(--rose-deep)]">✿ YouTube</p>
        <h2 className="mt-3 text-3xl md:text-5xl font-semibold text-[color:var(--mauve)]">{t("youtube.title")}</h2>
        <p className="mt-3 text-[color:var(--mauve)]/70">{t("youtube.lead")}</p>

        {channel && (
          <div className="mt-6 inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-white/80 border border-[color:var(--border)] shadow-sm">
            {channel.thumbnail && (
              <img src={channel.thumbnail} alt={channel.title} className="w-9 h-9 rounded-full" loading="lazy" />
            )}
            <div className="text-start">
              <p className="text-sm font-semibold text-[color:var(--mauve)]">{channel.title}</p>
              <p className="text-[11px] text-[color:var(--mauve)]/60 flex items-center gap-2">
                <Users className="w-3 h-3" /> {formatViews(channel.subscribers)} {isAr ? "مشترك" : "subscribers"}
                <span>·</span>
                <span>{channel.videoCount} {isAr ? "فيديو" : "videos"}</span>
              </p>
            </div>
            <a
              href={CHANNEL_URL}
              target="_blank"
              rel="noreferrer"
              className="ms-2 inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-rose-gradient text-white text-xs font-medium hover:scale-105 transition"
            >
              <YT className="w-3.5 h-3.5" /> {t("youtube.subscribe")}
            </a>
          </div>
        )}
      </div>

      {/* Featured */}
      {featured && (
        <motion.a
          href={featured.url}
          target="_blank"
          rel="noreferrer"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="group relative block aspect-video rounded-3xl overflow-hidden shadow-card mb-10"
        >
          <img src={featured.thumbnail} alt={featured.title} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition duration-700" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
          <div className="absolute inset-0 grid place-items-center">
            <div className="w-20 h-20 rounded-full bg-white/95 grid place-items-center group-hover:scale-110 transition shadow-glow">
              <Play className="w-8 h-8 text-[color:var(--rose-deep)] fill-current ms-1" />
            </div>
          </div>
          <div className="absolute inset-x-0 bottom-0 p-6 text-white">
            <p className="text-xs uppercase tracking-widest opacity-80">⭐ {isAr ? "الأكثر مشاهدة" : "Most Watched"}</p>
            <p className="mt-1 text-xl md:text-2xl font-display font-semibold line-clamp-2">{featured.title}</p>
            <p className="mt-2 text-xs opacity-80 flex items-center gap-3">
              <span className="inline-flex items-center gap-1"><Eye className="w-3.5 h-3.5" /> {formatViews(featured.views)}</span>
              <span className="inline-flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {formatDuration(featured.duration)}</span>
              <span>{timeAgo(featured.publishedAt, isAr)}</span>
            </p>
          </div>
        </motion.a>
      )}

      {/* Filter tabs */}
      <div className="flex flex-wrap justify-center gap-2 mb-8">
        {FILTERS.map((f) => {
          const active = filter === f.key;
          return (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition border ${
                active
                  ? "bg-rose-gradient text-white border-transparent shadow-glow"
                  : "bg-white text-[color:var(--mauve)] border-[color:var(--border)] hover:bg-[color:var(--blush)]"
              }`}
            >
              {isAr ? f.ar : f.en}
            </button>
          );
        })}
      </div>

      {/* Video grid */}
      {isLoading ? (
        <div className="grid place-items-center py-16">
          <Loader2 className="w-8 h-8 animate-spin text-[color:var(--rose-deep)]" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-12 text-[color:var(--mauve)]/60">
          {data?.error
            ? (isAr ? "تعذّر تحميل الفيديوهات." : "Couldn't load videos right now.")
            : (isAr ? "لا توجد فيديوهات في هذا القسم بعد." : "No videos in this section yet.")}
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
      className="group rounded-2xl overflow-hidden bg-white border border-[color:var(--border)] shadow-sm hover:shadow-card transition"
    >
      <div className="relative aspect-video overflow-hidden bg-[color:var(--blush)]">
        <img src={v.thumbnail} alt={v.title} loading="lazy" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition duration-500" />
        <div className="absolute bottom-2 end-2 px-1.5 py-0.5 rounded bg-black/80 text-white text-[10px] font-medium">
          {formatDuration(v.duration)}
        </div>
        <div className="absolute inset-0 grid place-items-center opacity-0 group-hover:opacity-100 transition bg-black/30">
          <div className="w-12 h-12 rounded-full bg-white/95 grid place-items-center">
            <Play className="w-5 h-5 text-[color:var(--rose-deep)] fill-current ms-0.5" />
          </div>
        </div>
      </div>
      <div className="p-4">
        <p className="font-medium text-sm text-[color:var(--mauve)] line-clamp-2 leading-snug">{v.title}</p>
        <div className="mt-2 flex items-center gap-3 text-[11px] text-[color:var(--mauve)]/60">
          <span className="inline-flex items-center gap-1"><Eye className="w-3 h-3" /> {formatViews(v.views)}</span>
          <span>·</span>
          <span>{timeAgo(v.publishedAt, isAr)}</span>
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
      className="group rounded-2xl overflow-hidden bg-white border border-[color:var(--border)] shadow-sm hover:shadow-card hover:scale-[1.02] transition"
    >
      <div className="relative aspect-video overflow-hidden">
        {p.thumbnail ? (
          <img src={p.thumbnail} alt={p.title} loading="lazy" className="absolute inset-0 w-full h-full object-cover" />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-[#FFD6E3] to-[#F4A4C0]" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
        <div className="absolute bottom-2 end-2 px-2 py-0.5 rounded bg-black/80 text-white text-[10px] font-medium flex items-center gap-1">
          <Play className="w-2.5 h-2.5 fill-current" /> {p.itemCount}
        </div>
      </div>
      <div className="p-3">
        <p className="font-medium text-sm text-[color:var(--mauve)] line-clamp-2">{p.title}</p>
        <p className="text-[11px] text-[color:var(--mauve)]/60 mt-1">
          {p.itemCount} {isAr ? "فيديو" : "videos"}
        </p>
      </div>
    </motion.a>
  );
}
