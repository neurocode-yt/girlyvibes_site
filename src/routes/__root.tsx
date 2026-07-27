import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";

import appCss from "../styles.css?url";
import { CursorTrail } from "@/components/site/CursorTrail";
import { Scroll3D } from "@/components/site/Scroll3D";
import { ColorScroll } from "@/components/site/ColorScroll";
import { CozyAudioPlayer } from "@/components/site/CozyAudioPlayer";
import { I18nProvider } from "@/lib/i18n";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <p className="text-5xl select-none" aria-hidden>🎀</p>
        <h1 className="mt-4 text-7xl font-bold font-display text-primary">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">This page wandered off</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved. Let's take you somewhere soft instead 🩷
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-full bg-rose-gradient px-6 py-2.5 text-sm font-medium text-white shadow-soft transition hover:scale-[1.03]"
          >
            Back home 🌸
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <p className="text-5xl select-none" aria-hidden>🫧</p>
        <h1 className="mt-4 text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. Take a soft breath, then try refreshing or head back home 🩷
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-full bg-rose-gradient px-6 py-2.5 text-sm font-medium text-white shadow-soft transition hover:scale-[1.03]"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-full border border-border bg-white px-6 py-2.5 text-sm font-medium text-foreground transition hover:bg-secondary"
          >
            Go home 🌸
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Girly Vibes 🩷" },
      { name: "description", content: "Girly Vibes — your soft little glow-up space." },
      { name: "theme-color", content: "#FBE4EC" },
      { property: "og:type", content: "website" },
      { property: "og:site_name", content: "Girly Vibes" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
      { rel: "icon", href: "/favicon.svg", type: "image/svg+xml" },
      { rel: "icon", href: "/favicon.ico", sizes: "32x32" },
      { rel: "apple-touch-icon", href: "/apple-touch-icon.png" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Fredoka:wght@400;500;600;700&family=Nunito:wght@300;400;500;600;700&family=Tajawal:wght@400;500;700&display=swap",
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <head>
        <HeadContent />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var saved = localStorage.getItem('gv-theme-mode');
                  var selectedTheme = localStorage.getItem('gv-selected-theme');
                  var mode = saved || 'light';
                  document.documentElement.setAttribute('data-theme-mode', mode);
                  if (mode === 'dark') {
                    document.documentElement.classList.add('dark');
                  } else {
                    document.documentElement.classList.remove('dark');
                  }
                  if (selectedTheme) {
                    document.documentElement.setAttribute('data-selected-theme', selectedTheme);
                  }
                  var lang = localStorage.getItem('gv-lang');
                  if (lang !== 'ar' && lang !== 'en') lang = 'ar';
                  document.documentElement.lang = lang;
                  document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
                } catch (e) {}
              })();
            `
          }}
        />
      </head>
      <body suppressHydrationWarning>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <I18nProvider>
        <Outlet />
        <CursorTrail />
        <Scroll3D />
        <ColorScroll />
        <CozyAudioPlayer />
      </I18nProvider>
    </QueryClientProvider>
  );
}
