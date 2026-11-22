import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/site/Header";
import { Hero } from "@/components/site/Hero";
import { About, Features } from "@/components/site/About";
import { Maryam } from "@/components/site/Maryam";
import { AppPreview } from "@/components/site/AppPreview";
import { StickerPlayground } from "@/components/site/StickerPlayground";
import { CalmRoom } from "@/components/site/CalmRoom";
import { GlowPoints } from "@/components/site/GlowPoints";
import { YouTubeHub } from "@/components/site/YouTubeHub";
import { Themes, Widgets, Updates, FAQ } from "@/components/site/Misc";
import { DownloadCTA, Footer } from "@/components/site/Download";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "Girly Vibes | Routines, Calm Room & Maryam" },
      { name: "description", content: "Explore the Girly Vibes app preview in Arabic and English, with self-care routines, reads, Calm Room exercises, and Maryam for advice and plans." },
      { name: "keywords", content: "girly vibes, glow up app, girl routine app, teen girl self care, Arabic girl advice, skincare routine app, calm breathing app, diary app for girls" },
      { property: "og:title", content: "Girly Vibes — your soft little glow-up space" },
      { property: "og:description", content: "Explore self-care routines, reads, Calm Room exercises, and Maryam in the Girly Vibes app preview." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://girly-vibes.com/" },
      { property: "og:image", content: "https://girly-vibes.com/og-image.png" },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      { name: "twitter:title", content: "Girly Vibes — your soft little glow-up space" },
      { name: "twitter:description", content: "Explore self-care routines, reads, Calm Room exercises, and Maryam in the Girly Vibes app preview." },
      { name: "twitter:image", content: "https://girly-vibes.com/og-image.png" },
    ],
    links: [
      { rel: "canonical", href: "https://girly-vibes.com/" },
    ],
  }),
});

function Index() {
  return (
    <div className="min-h-screen bg-[color:var(--background)] text-[color:var(--mauve)] overflow-x-hidden relative">
      <div className="relative z-10">
        <Header />
        <main>
          <Hero />
          <About />
          <Features />
          <Maryam />
          <AppPreview />
          <StickerPlayground />
          <CalmRoom />
          <GlowPoints />
          <YouTubeHub />
          <Themes />
          <Widgets />
          <Updates />
          <DownloadCTA />
          <FAQ />
        </main>
        <Footer />
      </div>
    </div>
  );
}
