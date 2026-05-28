import { createServerFn } from "@tanstack/react-start";
import { setResponseHeader } from "@tanstack/react-start/server";
import { getEvent } from "vinxi/http";

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

function getApiKey(): string | undefined {
  // 1. Try local process.env (Vite/Node)
  if (typeof process !== "undefined" && process.env?.YOUTUBE_API_KEY) {
    return process.env.YOUTUBE_API_KEY;
  }

  // 2. Try Vinxi/Cloudflare context
  try {
    const event = getEvent();
    const cfEnv = (event?.context as any)?.cloudflare?.env;
    if (cfEnv?.YOUTUBE_API_KEY) {
      return cfEnv.YOUTUBE_API_KEY;
    }
  } catch (e) {
    // Ignore error if getEvent is called outside request context
  }

  // 3. Try Cloudflare global binding
  if (typeof globalThis !== "undefined" && (globalThis as any).YOUTUBE_API_KEY) {
    return (globalThis as any).YOUTUBE_API_KEY;
  }

  return undefined;
}

async function yt<T>(path: string, params: Record<string, string>): Promise<T> {
  const key = getApiKey();
  if (!key) throw new Error("Missing YouTube API Key");
  const url = new URL(`${API}/${path}`);
  Object.entries({ ...params, key }).forEach(([k, v]) => url.searchParams.set(k, v));
  const res = await fetch(url.toString());
  if (!res.ok) throw new Error(`YT ${path} ${res.status}: ${await res.text()}`);
  return res.json() as Promise<T>;
}

export const getChannelData = createServerFn({ method: "GET" }).handler(async (): Promise<YTPayload> => {
  try {
    const key = getApiKey();
    if (!key) {
      return { channel: null, videos: [], playlists: [], error: "Missing API key" };
    }

    // 1) Channel
    const ch = await yt<any>("channels", {
      part: "snippet,contentDetails,statistics",
      forHandle: `@${HANDLE}`,
    });
    const channel = ch.items?.[0];
    if (!channel) return { channel: null, videos: [], playlists: [], error: "Channel not found" };

    const uploadsId = channel.contentDetails.relatedPlaylists.uploads;
    const channelId = channel.id;

    // 2) Uploads (up to 50)
    const uploads = await yt<any>("playlistItems", {
      part: "snippet,contentDetails",
      playlistId: uploadsId,
      maxResults: "50",
    });
    const videoIds: string[] = uploads.items.map((i: any) => i.contentDetails.videoId);

    // 3) Video stats
    let videos: YTVideo[] = [];
    if (videoIds.length) {
      const stats = await yt<any>("videos", {
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
    const pl = await yt<any>("playlists", {
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

    // Cache 1h at edge ONLY for successful responses
    setResponseHeader("Cache-Control", "public, max-age=3600, s-maxage=3600");

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
      videos,
      playlists,
    };
  } catch (e: any) {
    console.error("[youtube] fetch failed", e);
    // Explicitly prevent browser from caching the error
    setResponseHeader("Cache-Control", "no-store, must-revalidate");
    return { channel: null, videos: [], playlists: [], error: e?.message ?? "Unknown error" };
  }
});
