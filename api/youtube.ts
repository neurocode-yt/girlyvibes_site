import { fetchChannelData } from "../src/lib/youtube.functions.js";

export async function GET() {
  const data = await fetchChannelData();

  return Response.json(data, {
    headers: {
      "Cache-Control": data.isFallback
        ? "no-store, must-revalidate"
        : "public, max-age=1800, s-maxage=1800, stale-while-revalidate=3600",
    },
  });
}
