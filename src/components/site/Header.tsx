import { useEffect, useRef, useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { Link } from "@tanstack/react-router";
import { Globe, Menu, Moon, Sun, X } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { applyTheme } from "@/lib/theme";
import { HeartIcon, SparkleMark } from "./Decor";

const sectionLinks = [
  { id: "features", label: "nav.features" },
  { id: "maryam", label: "maryam.title" },
  { id: "calm", label: "nav.calm" },
  { id: "glow", label: "nav.glow" },
  { id: "youtube", label: "nav.youtube" },
  { id: "updates", label: "nav.updates" },
  { id: "faq", label: "nav.faq" },
];

const controlClass =
  "min-h-11 min-w-11 shrink-0 cursor-pointer items-center justify-center gap-2 rounded-full border border-[color:var(--border)] bg-[color:var(--card)] text-[color:var(--mauve)] transition-colors hover:bg-[color:var(--rose-soft)]";

function NavigationLinks({
  compact = false,
  onNavigate,
}: {
  compact?: boolean;
  onNavigate?: () => void;
}) {
  const { t } = useI18n();
  const linkClass = compact
    ? "flex min-h-11 items-center rounded-xl px-3 py-2 text-base font-semibold transition-colors hover:bg-[color:var(--rose-soft)]"
    : "whitespace-nowrap rounded-full px-2.5 py-2 text-sm font-medium transition-colors hover:bg-[color:var(--rose-soft)]";

  return (
    <>
      {sectionLinks.map(({ id, label }) => (
        <a key={id} href={`/#${id}`} onClick={onNavigate} className={linkClass}>
          {t(label)}
        </a>
      ))}
      <Link
        to="/games"
        onClick={onNavigate}
        className={`${linkClass} bg-[color:var(--rose-soft)]/60`}
      >
        {t("nav.games")}
      </Link>
    </>
  );
}

export function Header() {
  const { t, lang, setLang } = useI18n();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [themeMode, setThemeMode] = useState<"light" | "dark">("light");
  const navigatedFromMenu = useRef(false);
  const dark = themeMode === "dark";
  const otherLanguage = lang === "ar" ? "en" : "ar";

  useEffect(() => {
    const root = document.documentElement;
    setThemeMode(root.classList.contains("dark") ? "dark" : "light");
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    const wideNavigation = window.matchMedia("(min-width: 80rem)");
    const closeWideMenu = () => {
      if (wideNavigation.matches) setOpen(false);
    };
    wideNavigation.addEventListener("change", closeWideMenu);
    return () => {
      window.removeEventListener("scroll", onScroll);
      wideNavigation.removeEventListener("change", closeWideMenu);
    };
  }, []);

  const toggleTheme = () => {
    const nextMode = dark ? "light" : "dark";
    const root = document.documentElement;
    setThemeMode(nextMode);
    root.dataset.themeMode = nextMode;
    root.classList.toggle("dark", nextMode === "dark");
    localStorage.setItem("gv-theme-mode", nextMode);
    applyTheme(localStorage.getItem("gv-selected-theme"), nextMode === "dark");
  };

  const toggleLanguage = () => setLang(otherLanguage);

  const closeForNavigation = () => {
    navigatedFromMenu.current = true;
    setOpen(false);
  };

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 motion-safe:transition-[padding] ${scrolled ? "py-2.5" : "py-4"}`}
    >
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:start-4 focus:top-2 focus:z-10 focus:rounded-full focus:bg-[color:var(--card)] focus:px-4 focus:py-2"
      >
        {t("nav.skip")}
      </a>
      <Dialog.Root open={open} onOpenChange={setOpen}>
        <div className="mx-auto max-w-7xl px-3 sm:px-4">
          <div
            className={`flex items-center justify-between gap-2 rounded-full px-3 py-2 sm:px-5 ${scrolled ? "glass" : ""}`}
          >
            <Link
              to="/"
              className="flex min-w-0 items-center gap-2 rounded-full font-display text-lg font-semibold leading-tight text-[color:var(--rose-deep)] sm:text-xl"
            >
              <span className="relative inline-flex size-8 shrink-0 items-center justify-center rounded-full bg-rose-gradient text-white shadow-glow">
                <HeartIcon className="size-4" />
                <SparkleMark className="absolute -end-1 -top-1 size-3 text-[color:var(--glow)] sparkle-spin" />
              </span>
              <bdi>Girly Vibes</bdi>
            </Link>

            <nav aria-label={t("nav.label")} className="hidden items-center gap-1 xl:flex">
              <NavigationLinks />
            </nav>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                className={`${controlClass} hidden sm:inline-flex`}
                onClick={toggleTheme}
                aria-pressed={dark}
                aria-label={t("nav.darkMode")}
              >
                {dark ? (
                  <Sun aria-hidden="true" className="size-5" />
                ) : (
                  <Moon aria-hidden="true" className="size-5" />
                )}
              </button>
              <button
                type="button"
                className={`${controlClass} inline-flex px-2 text-sm font-semibold`}
                onClick={toggleLanguage}
                aria-label={t("nav.switchLanguage")}
              >
                <Globe aria-hidden="true" className="hidden size-4 sm:block" />
                <span lang={otherLanguage}>{otherLanguage === "en" ? "EN" : "ع"}</span>
              </button>
              <a
                href="/#download"
                className="hidden min-h-11 items-center gap-2 whitespace-nowrap rounded-full bg-[color:var(--mauve)] px-4 py-2 text-sm font-medium text-[color:var(--background)] hover:opacity-90 md:inline-flex"
              >
                <HeartIcon className="size-3.5" />
                {t("nav.download")}
              </a>
              <Dialog.Trigger asChild>
                <button
                  type="button"
                  className={`${controlClass} inline-flex xl:hidden`}
                  aria-label={t("nav.openMenu")}
                >
                  <Menu aria-hidden="true" className="size-5" />
                </button>
              </Dialog.Trigger>
            </div>
          </div>
        </div>

        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-[1000] bg-[color:var(--background)]/95 backdrop-blur-xl" />
          <Dialog.Content
            aria-describedby={undefined}
            className="fixed inset-0 z-[1001] overflow-y-auto overscroll-contain p-4 text-[color:var(--mauve)] sm:p-8"
            onCloseAutoFocus={(event) => {
              if (navigatedFromMenu.current) {
                event.preventDefault();
                navigatedFromMenu.current = false;
              }
            }}
          >
            <div className="mx-auto max-w-lg rounded-3xl border border-[color:var(--border)] bg-[color:var(--card)] p-4 shadow-card sm:p-6">
              <div className="flex items-center justify-between gap-3">
                <Dialog.Title className="text-xl font-semibold">{t("nav.menu")}</Dialog.Title>
                <Dialog.Close asChild>
                  <button
                    type="button"
                    className={`${controlClass} inline-flex`}
                    aria-label={t("nav.closeMenu")}
                  >
                    <X aria-hidden="true" className="size-5" />
                  </button>
                </Dialog.Close>
              </div>
              <nav aria-label={t("nav.label")} className="mt-4 grid gap-1">
                <NavigationLinks compact onNavigate={closeForNavigation} />
                <a
                  href="/#download"
                  onClick={closeForNavigation}
                  className="mt-2 flex min-h-11 items-center justify-center rounded-xl bg-[color:var(--mauve)] px-3 py-2 text-center font-semibold text-[color:var(--background)]"
                >
                  {t("nav.download")}
                </a>
              </nav>
              <div className="mt-4 flex flex-wrap gap-2 border-t border-[color:var(--border)] pt-4">
                <button
                  type="button"
                  className={`${controlClass} inline-flex px-3 text-sm font-semibold`}
                  aria-pressed={dark}
                  onClick={toggleTheme}
                >
                  {dark ? (
                    <Sun aria-hidden="true" className="size-4" />
                  ) : (
                    <Moon aria-hidden="true" className="size-4" />
                  )}
                  {t("nav.darkMode")}
                </button>
                <button
                  type="button"
                  className={`${controlClass} inline-flex px-3 text-sm font-semibold`}
                  onClick={toggleLanguage}
                  aria-label={t("nav.switchLanguage")}
                >
                  <Globe aria-hidden="true" className="size-4" />
                  <span lang={otherLanguage}>{otherLanguage === "en" ? "English" : "العربية"}</span>
                </button>
              </div>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </header>
  );
}
