import { createServerFn } from "@tanstack/react-start";
import { setResponseHeader } from "@tanstack/react-start/server";

if (typeof window === "undefined") {
  import("node:dns").then((dns) => {
    if (typeof dns.setDefaultResultOrder === "function") {
      dns.setDefaultResultOrder("ipv4first");
    }
  }).catch(() => {});
}

const HANDLE = "girlyvibes0";

export type YTVideo = {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  publishedAt: string;
  views: number;
  duration: string; // ISO 8601 e.g. PT3M21S
  url: string;
};

export type YTPlaylist = {
  id: string;
  title: string;
  thumbnail: string;
  itemCount: number;
  url: string;
};

export type YTPayload = {
  channel: {
    id: string;
    title: string;
    thumbnail: string;
    subscribers: number;
    videoCount: number;
    viewCount: number;
    url: string;
  } | null;
  videos: YTVideo[];
  playlists: YTPlaylist[];
  error?: string;
};

const API = "https://www.googleapis.com/youtube/v3";

export const FALLBACK_YOUTUBE_DATA: YTPayload = {
  channel: {
    id: "girlyvibes0",
    title: "Girly Vibes 🩷",
    thumbnail: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80",
    subscribers: 12500,
    videoCount: 24,
    viewCount: 450000,
    url: `https://www.youtube.com/@${HANDLE}`,
  },
  videos: [
    {
      id: "fallback-1",
      title: "روتين الصباح الكامل للجلو أب 🌸 | Full Morning Glow Up Routine",
      description: "خطوات روتين الصباح اللطيف لتحسي بالانتعاش والنشاط كل يوم. عناية بالبشرة، تنظيم، وهدوء.",
      thumbnail: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&auto=format&fit=crop&q=80",
      publishedAt: "2026-06-15T12:00:00Z",
      views: 48200,
      duration: "PT8M45S",
      url: `https://www.youtube.com/@${HANDLE}`,
    },
    {
      id: "fallback-2",
      title: "5 نصائح ذهبية للعناية بالبشرة لسن المراهقة ✨ | Teen Skincare Tips",
      description: "عناية بسيطة وطبيعية للبشرة بدون تعقيد، مناسبة للبنات اليومية.",
      thumbnail: "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=800&auto=format&fit=crop&q=80",
      publishedAt: "2026-06-10T14:30:00Z",
      views: 32100,
      duration: "PT6M12S",
      url: `https://www.youtube.com/@${HANDLE}`,
    },
    {
      id: "fallback-3",
      title: "جلسة هدوء وتنفس لمحو القلق والتوتر 🫧 | Calm & Breathing Session",
      description: "خذي نفس عميق واسترخي مع صوت المطر والكلمات المشجعة.",
      thumbnail: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&auto=format&fit=crop&q=80",
      publishedAt: "2026-05-28T18:00:00Z",
      views: 29500,
      duration: "PT10M00S",
      url: `https://www.youtube.com/@${HANDLE}`,
    },
    {
      id: "fallback-4",
      title: "طريقة تنظيم الوقت والدراسة بدون ضغط 📖 | Study & Time Management",
      description: "نصائح تنظيم الدفاتر والدراسة بأسلوب مريح ولطيف.",
      thumbnail: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&auto=format&fit=crop&q=80",
      publishedAt: "2026-05-18T10:15:00Z",
      views: 54100,
      duration: "PT12M30S",
      url: `https://www.youtube.com/@${HANDLE}`,
    },
    {
      id: "fallback-5",
      title: "أفكار أنشطة ممتعة لمواجهة الملل في البيت 🎀 | Fun Home Activities",
      description: "أفكار أنشطة أوفلاين لطيفة لمواجهة الملل واستثمار وقتك.",
      thumbnail: "https://images.unsplash.com/photo-1513151233558-d860c5398176?w=800&auto=format&fit=crop&q=80",
      publishedAt: "2026-05-02T16:45:00Z",
      views: 21800,
      duration: "PT7M50S",
      url: `https://www.youtube.com/@${HANDLE}`,
    },
    {
      id: "fallback-6",
      title: "روتين المساء والشاور قبل النوم لليلة هادئة 🌙 | Night Routine & Shower",
      description: "أفضل روتين للاسترخاء قبل النوم ولنوم عميق ومريح.",
      thumbnail: "https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=800&auto=format&fit=crop&q=80",
      publishedAt: "2026-04-20T20:00:00Z",
      views: 61400,
      duration: "PT9M15S",
      url: `https://www.youtube.com/@${HANDLE}`,
    },
  ],
  playlists: [
    {
      id: "pl-1",
      title: "روتينات الجلو أب 🌸",
      thumbnail: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&auto=format&fit=crop&q=80",
      itemCount: 8,
      url: `https://www.youtube.com/@${HANDLE}`,
    },
    {
      id: "pl-2",
      title: "عناية بالبشرة والجمال ✨",
      thumbnail: "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=800&auto=format&fit=crop&q=80",
      itemCount: 6,
      url: `https://www.youtube.com/@${HANDLE}`,
    },
    {
      id: "pl-3",
      title: "غرفة الهدوء والاسترخاء 🫧",
      thumbnail: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&auto=format&fit=crop&q=80",
      itemCount: 5,
      url: `https://www.youtube.com/@${HANDLE}`,
    },
    {
      id: "pl-4",
      title: "نصائح الدراسة والدفاتر 📖",
      thumbnail: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&auto=format&fit=crop&q=80",
      itemCount: 5,
      url: `https://www.youtube.com/@${HANDLE}`,
    },
  ],
};

async function yt<T>(key: string, path: string, params: Record<string, string>): Promise<T> {
  const url = new URL(`${API}/${path}`);
  Object.entries({ ...params, key }).forEach(([k, v]) => url.searchParams.set(k, v));
  const res = await fetch(url.toString());
  if (!res.ok) throw new Error(`YT ${path} ${res.status}: ${await res.text()}`);
  return res.json() as Promise<T>;
}

export async function fetchChannelData(): Promise<YTPayload> {
  try {
    let key: string | undefined = undefined;

    if (typeof process !== "undefined" && process.env?.YOUTUBE_API_KEY) {
      key = process.env.YOUTUBE_API_KEY;
    }
    if (!key && typeof import.meta !== "undefined" && (import.meta as any).env?.VITE_YOUTUBE_API_KEY) {
      key = (import.meta as any).env.VITE_YOUTUBE_API_KEY;
    }

    if (!key || key === "your_youtube_api_key_here") {
      return FALLBACK_YOUTUBE_DATA;
    }

    // 1) Channel
    const ch = await yt<any>(key, "channels", {
      part: "snippet,contentDetails,statistics",
      forHandle: `@${HANDLE}`,
    });
    const channel = ch.items?.[0];
    if (!channel) return FALLBACK_YOUTUBE_DATA;

    const uploadsId = channel.contentDetails.relatedPlaylists.uploads;
    const channelId = channel.id;

    // 2) Uploads (up to 50)
    const uploads = await yt<any>(key, "playlistItems", {
      part: "snippet,contentDetails",
      playlistId: uploadsId,
      maxResults: "50",
    });
    const videoIds: string[] = uploads.items.map((i: any) => i.contentDetails.videoId);

    // 3) Video stats
    let videos: YTVideo[] = [];
    if (videoIds.length) {
      const stats = await yt<any>(key, "videos", {
        part: "snippet,contentDetails,statistics",
        id: videoIds.join(","),
      });
      videos = stats.items.map((v: any) => ({
        id: v.id,
        title: v.snippet.title,
        description: v.snippet.description ?? "",
        thumbnail:
          v.snippet.thumbnails?.maxres?.url ||
          v.snippet.thumbnails?.standard?.url ||
          v.snippet.thumbnails?.high?.url ||
          v.snippet.thumbnails?.medium?.url ||
          v.snippet.thumbnails?.default?.url,
        publishedAt: v.snippet.publishedAt,
        views: Number(v.statistics?.viewCount ?? 0),
        duration: v.contentDetails.duration,
        url: `https://www.youtube.com/watch?v=${v.id}`,
      }));
    }

    // 4) Playlists
    const pl = await yt<any>(key, "playlists", {
      part: "snippet,contentDetails",
      channelId,
      maxResults: "50",
    });
    const playlists: YTPlaylist[] = (pl.items ?? []).map((p: any) => ({
      id: p.id,
      title: p.snippet.title,
      thumbnail:
        p.snippet.thumbnails?.maxres?.url ||
        p.snippet.thumbnails?.high?.url ||
        p.snippet.thumbnails?.medium?.url ||
        p.snippet.thumbnails?.default?.url,
      itemCount: p.contentDetails.itemCount,
      url: `https://www.youtube.com/playlist?list=${p.id}`,
    }));

    return {
      channel: {
        id: channelId,
        title: channel.snippet.title,
        thumbnail: channel.snippet.thumbnails?.high?.url || channel.snippet.thumbnails?.default?.url,
        subscribers: Number(channel.statistics?.subscriberCount ?? 0),
        videoCount: Number(channel.statistics?.videoCount ?? 0),
        viewCount: Number(channel.statistics?.viewCount ?? 0),
        url: `https://www.youtube.com/@${HANDLE}`,
      },
      videos: videos.length ? videos : FALLBACK_YOUTUBE_DATA.videos,
      playlists: playlists.length ? playlists : FALLBACK_YOUTUBE_DATA.playlists,
    };
  } catch (e: any) {
    console.warn("[youtube] fetch failed:", e);
    return FALLBACK_YOUTUBE_DATA;
  }
}

export const getChannelData = createServerFn({ method: "GET" }).handler(async (): Promise<YTPayload> => {
  const data = await fetchChannelData();
  if (data.channel?.id !== "girlyvibes0") {
    setResponseHeader("Cache-Control", "public, max-age=3600, s-maxage=3600");
  } else {
    setResponseHeader("Cache-Control", "no-store, must-revalidate");
  }
  return data;
});
