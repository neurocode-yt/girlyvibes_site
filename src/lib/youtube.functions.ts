import { createServerFn } from "@tanstack/react-start";
import { setResponseHeader } from "@tanstack/react-start/server";

import {
  CHANNEL_ID,
  HANDLE,
  FALLBACK_YOUTUBE_DATA,
  type YTPayload,
  type YTPlaylist,
  type YTVideo,
} from "./youtubeData.js";

if (typeof window === "undefined") {
  import("node:dns")
    .then((dns) => {
      if (typeof dns.setDefaultResultOrder === "function") {
        dns.setDefaultResultOrder("ipv4first");
      }
    })
    .catch(() => {});
}

const API = "https://www.googleapis.com/youtube/v3";

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
    if (
      !key &&
      typeof import.meta !== "undefined" &&
      (import.meta as any).env?.VITE_YOUTUBE_API_KEY
    ) {
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
        thumbnail:
          channel.snippet.thumbnails?.high?.url || channel.snippet.thumbnails?.default?.url,
        subscribers: Number(channel.statistics?.subscriberCount ?? 0),
        videoCount: Number(channel.statistics?.videoCount ?? 0),
        viewCount: Number(channel.statistics?.viewCount ?? 0),
        url: `https://www.youtube.com/@${HANDLE}`,
      },
      videos: videos.length ? videos : FALLBACK_YOUTUBE_DATA.videos,
      playlists: playlists.length ? playlists : FALLBACK_YOUTUBE_DATA.playlists,
      isFallback: videos.length === 0,
    };
  } catch {
    console.warn("[youtube] Channel data is unavailable. Serving the saved snapshot.");
    return FALLBACK_YOUTUBE_DATA;
  }
}

export const getChannelData = createServerFn({ method: "GET" }).handler(
  async (): Promise<YTPayload> => {
    const data = await fetchChannelData();
    if (!data.isFallback) {
      setResponseHeader("Cache-Control", "public, max-age=3600, s-maxage=3600");
    } else {
      setResponseHeader("Cache-Control", "no-store, must-revalidate");
    }
    return data;
  },
);
