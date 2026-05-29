import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/site/Header";
import { Hero } from "@/components/site/Hero";
import { About, Features } from "@/components/site/About";
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
      { title: "Girly Vibes | Glow Up, Routines, Calm Room & Girl Advice" },
      { name: "description", content: "Girly Vibes is a soft self-care app for girls — routines, glow points, calming exercises, diary, reads, vision board, and YouTube updates. Arabic & English." },
      { name: "keywords", content: "girly vibes, glow up app, girl routine app, teen girl self care, Arabic girl advice, skincare routine app, calm breathing app, diary app for girls" },
      { property: "og:title", content: "Girly Vibes — your soft little glow-up space" },
      { property: "og:description", content: "Routines, calm room, glow points, diary and YouTube — all in one soft place made for girls." },
      { property: "og:type", content: "website" },
    ],
    links: [
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600;9..144,700&family=Plus+Jakarta+Sans:wght@400;500;600;700&family=Tajawal:wght@400;500;700&display=swap" },
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
