import { useEffect } from "react";
import { clearInlineThemeStyles } from "@/lib/theme";

const supportsOklch = () => {
  if (typeof window === "undefined" || typeof CSS === "undefined" || !CSS.supports) return false;
  return CSS.supports("color", "oklch(0.9 0.1 20)");
};

const applyColors = (root: HTMLElement, h: number, isDark: boolean, oklch: boolean) => {
  if (isDark) {
    if (oklch) {
      root.style.setProperty("--background", `oklch(0.2 0.03 ${h})`);
      root.style.setProperty("--card", `oklch(0.25 0.04 ${h})`);
      root.style.setProperty("--blush", `oklch(0.4 0.08 ${h})`);
      root.style.setProperty("--rose-soft", `oklch(0.25 0.04 ${h})`);
      root.style.setProperty("--rose-deep", `oklch(0.78 0.12 ${h})`);
      root.style.setProperty("--mauve", `oklch(0.95 0.02 ${h})`);
      root.style.setProperty("--foreground", `oklch(0.95 0.02 ${h})`);
      root.style.setProperty("--glow", `oklch(0.78 0.12 ${h})`);
      root.style.setProperty("--primary", `oklch(0.78 0.12 ${h})`);
      root.style.setProperty("--secondary", `oklch(0.3 0.05 ${h})`);
      root.style.setProperty("--accent", `oklch(0.4 0.08 ${h})`);
      root.style.setProperty("--border", `oklch(0.95 0.02 ${h} / 12%)`);
    } else {
      root.style.setProperty("--background", `hsl(${h}, 15%, 15%)`);
      root.style.setProperty("--card", `hsl(${h}, 15%, 22%)`);
      root.style.setProperty("--blush", `hsl(${h}, 25%, 35%)`);
      root.style.setProperty("--rose-soft", `hsl(${h}, 15%, 22%)`);
      root.style.setProperty("--rose-deep", `hsl(${h}, 70%, 75%)`);
      root.style.setProperty("--mauve", `hsl(${h}, 20%, 95%)`);
      root.style.setProperty("--foreground", `hsl(${h}, 20%, 95%)`);
      root.style.setProperty("--glow", `hsl(${h}, 70%, 75%)`);
      root.style.setProperty("--primary", `hsl(${h}, 70%, 75%)`);
      root.style.setProperty("--secondary", `hsl(${h}, 15%, 27%)`);
      root.style.setProperty("--accent", `hsl(${h}, 25%, 35%)`);
      root.style.setProperty("--border", `hsla(${h}, 20%, 95%, 0.12)`);
    }
  } else {
    if (oklch) {
      root.style.setProperty("--background", `oklch(0.985 0.012 ${h})`);
      root.style.setProperty("--card", `#ffffff`);
      root.style.setProperty("--blush", `oklch(0.86 0.07 ${h})`);
      root.style.setProperty("--rose-soft", `oklch(0.93 0.04 ${h})`);
      root.style.setProperty("--rose-deep", `oklch(0.58 0.13 ${h})`);
      root.style.setProperty("--mauve", `oklch(0.32 0.05 ${h})`);
      root.style.setProperty("--foreground", `oklch(0.32 0.05 ${h})`);
      root.style.setProperty("--glow", `oklch(0.78 0.12 ${h})`);
      root.style.setProperty("--primary", `oklch(0.58 0.13 ${h})`);
      root.style.setProperty("--secondary", `oklch(0.93 0.04 ${h})`);
      root.style.setProperty("--accent", `oklch(0.86 0.07 ${h})`);
      root.style.setProperty("--border", `oklch(0.9 0.035 ${h})`);
    } else {
      root.style.setProperty("--background", `hsl(${h}, 80%, 98.5%)`);
      root.style.setProperty("--card", `#ffffff`);
      root.style.setProperty("--blush", `hsl(${h}, 75%, 86%)`);
      root.style.setProperty("--rose-soft", `hsl(${h}, 60%, 93%)`);
      root.style.setProperty("--rose-deep", `hsl(${h}, 40%, 58%)`);
      root.style.setProperty("--mauve", `hsl(${h}, 15%, 32%)`);
      root.style.setProperty("--foreground", `hsl(${h}, 15%, 32%)`);
      root.style.setProperty("--glow", `hsl(${h}, 65%, 78%)`);
      root.style.setProperty("--primary", `hsl(${h}, 40%, 58%)`);
      root.style.setProperty("--secondary", `hsl(${h}, 60%, 93%)`);
      root.style.setProperty("--accent", `hsl(${h}, 75%, 86%)`);
      root.style.setProperty("--border", `hsl(${h}, 30%, 90%)`);
    }
  }
};

export function ColorScroll() {
  useEffect(() => {
    const root = document.documentElement;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const oklch = supportsOklch();
    let frame: number | undefined;

    const updateColors = () => {
      frame = undefined;
      if (reducedMotion.matches || root.dataset.selectedTheme) return;

      const scrollY = window.scrollY;
      const maxScroll = Math.max(1, root.scrollHeight - window.innerHeight);
      const progress = Math.min(1, Math.max(0, scrollY / maxScroll));

      let hue = 25;
      if (progress < 0.25) {
        const p = progress / 0.25;
        hue = 25 + p * (310 - 25);
      } else if (progress < 0.5) {
        const p = (progress - 0.25) / 0.25;
        hue = 310 - p * (310 - 180);
      } else if (progress < 0.75) {
        const p = (progress - 0.5) / 0.25;
        hue = 180 - p * (180 - 75);
      } else {
        const p = (progress - 0.75) / 0.25;
        hue = 75 - p * (75 - 25);
      }

      const h = (hue + 360) % 360;
      applyColors(root, h, root.dataset.themeMode === "dark", oklch);
    };
    const handleScroll = () => {
      if (frame === undefined && !reducedMotion.matches && !root.dataset.selectedTheme) {
        frame = requestAnimationFrame(updateColors);
      }
    };
    const syncMotionPreference = () => {
      if (reducedMotion.matches) {
        if (!root.dataset.selectedTheme) clearInlineThemeStyles(root);
      } else {
        handleScroll();
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    reducedMotion.addEventListener("change", syncMotionPreference);
    syncMotionPreference();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      reducedMotion.removeEventListener("change", syncMotionPreference);
      if (frame !== undefined) cancelAnimationFrame(frame);
      if (!root.dataset.selectedTheme) clearInlineThemeStyles(root);
    };
  }, []);

  return null;
}
