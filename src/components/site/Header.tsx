import { useEffect, useState } from "react";
import { useI18n } from "@/lib/i18n";
import { HeartIcon, SparkleMark } from "./Decor";
import { Menu, X, Globe, Moon, Sun } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const navKeys = [
  { key: "nav.home", id: "home" },
  { key: "nav.features", id: "features" },
  { key: "nav.calm", id: "calm" },
  { key: "nav.glow", id: "glow" },
  { key: "nav.youtube", id: "youtube" },
  { key: "nav.updates", id: "updates" },
  { key: "nav.faq", id: "faq" },
];

export function Header() {
  const { t, lang, setLang } = useI18n();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [themeMode, setThemeMode] = useState<"light" | "dark">("light");

  useEffect(() => {
    if (typeof window === "undefined") return;
    const activeMode = document.documentElement.getAttribute("data-theme-mode") as "light" | "dark" || "light";
    setThemeMode(activeMode);
    window.dispatchEvent(new Event("scroll"));
  }, []);

  const toggleThemeMode = () => {
    const nextMode = themeMode === "light" ? "dark" : "light";
    setThemeMode(nextMode);
    document.documentElement.setAttribute("data-theme-mode", nextMode);
    if (nextMode === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("gv-theme-mode", nextMode);
    window.dispatchEvent(new Event("scroll"));
  };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled ? "py-2.5" : "py-4"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4">
        <div
          className={`flex items-center justify-between rounded-full px-4 md:px-6 py-2.5 transition-all duration-300 ${
            scrolled ? "glass" : "bg-transparent"
          }`}
        >
          <a href="#home" className="flex items-center gap-2 font-display text-xl font-semibold text-[color:var(--rose-deep)]">
            <span className="relative inline-flex w-8 h-8 items-center justify-center rounded-full bg-rose-gradient text-white shadow-glow">
              <HeartIcon className="w-4 h-4" />
              <SparkleMark className="absolute -top-1 -right-1 w-3 h-3 text-[color:var(--glow)] sparkle-spin" />
            </span>
            Girly Vibes
          </a>

          <nav className="hidden lg:flex items-center gap-1">
            {navKeys.map((n) => (
              <a
                key={n.id}
                href={`#${n.id}`}
                className="px-3 py-1.5 rounded-full text-sm text-[color:var(--mauve)]/80 hover:text-[color:var(--rose-deep)] hover:bg-white/60 transition"
              >
                {t(n.key)}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <button
              onClick={toggleThemeMode}
              className="flex items-center justify-center w-9 h-9 rounded-full text-[color:var(--mauve)] bg-white/70 hover:bg-white transition border border-[color:var(--border)] shadow-sm active:scale-95"
              aria-label="Toggle theme mode"
              title={themeMode === "light" ? (lang === "ar" ? "تفعيل الوضع المظلم المخملي" : "Switch to Velvet Dark") : (lang === "ar" ? "تفعيل الوضع المضيء" : "Switch to Pastel Light")}
            >
              {themeMode === "light" ? <Moon className="w-4.5 h-4.5" /> : <Sun className="w-4.5 h-4.5 text-amber-400" />}
            </button>
            <button
              onClick={() => setLang(lang === "ar" ? "en" : "ar")}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium text-[color:var(--mauve)] bg-white/70 hover:bg-white transition border border-[color:var(--border)]"
              aria-label="Toggle language"
            >
              <Globe className="w-3.5 h-3.5" />
              {lang === "ar" ? "EN" : "ع"}
            </button>
            <a
              href="#download"
              className="hidden md:inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium text-white bg-rose-gradient shadow-soft hover:scale-[1.03] transition heartbeat"
            >
              <HeartIcon className="w-3.5 h-3.5" />
              {t("nav.download")}
            </a>
            <button
              onClick={() => setOpen(true)}
              className="lg:hidden inline-flex w-9 h-9 items-center justify-center rounded-full bg-white/70 border border-[color:var(--border)]"
              aria-label="Open menu"
            >
              <Menu className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-[color:var(--background)]/95 backdrop-blur-xl lg:hidden"
          >
            <div className="flex items-center justify-between p-5">
              <span className="font-display text-xl text-[color:var(--rose-deep)]">Girly Vibes</span>
              <button
                onClick={() => setOpen(false)}
                className="w-9 h-9 inline-flex items-center justify-center rounded-full bg-white/70 border"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <nav className="flex flex-col px-6 gap-2 mt-4">
              {navKeys.map((n) => (
                <a
                  key={n.id}
                  href={`#${n.id}`}
                  onClick={() => setOpen(false)}
                  className="py-3 text-xl font-display text-[color:var(--mauve)] border-b border-[color:var(--border)]"
                >
                  {t(n.key)}
                </a>
              ))}
              <button
                onClick={toggleThemeMode}
                className="mt-4 self-start flex items-center gap-2 px-4 py-2 rounded-full bg-white border font-medium text-sm text-[color:var(--mauve)]"
              >
                {themeMode === "light" ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4 text-amber-400" />}
                {themeMode === "light" ? (lang === "ar" ? "الوضع المظلم المخملي" : "Velvet Dark Mode") : (lang === "ar" ? "الوضع المضيء" : "Pastel Light Mode")}
              </button>
              <button
                onClick={() => setLang(lang === "ar" ? "en" : "ar")}
                className="mt-2 self-start flex items-center gap-2 px-4 py-2 rounded-full bg-white border"
              >
                <Globe className="w-4 h-4" />
                {lang === "ar" ? "English" : "العربية"}
              </button>
              <a
                href="#download"
                onClick={() => setOpen(false)}
                className="mt-4 text-center py-3 rounded-full text-white bg-rose-gradient font-medium"
              >
                {t("nav.download")}
              </a>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
