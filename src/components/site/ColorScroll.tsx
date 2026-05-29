import { useEffect } from "react";

export function ColorScroll() {
  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleScroll = () => {
      if (document.documentElement.getAttribute("data-selected-theme")) return;

      const scrollY = window.scrollY;
      const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      const progress = Math.min(1, Math.max(0, scrollY / maxScroll));

      // Breathtaking scroll-linked OKLCH hue morphing
      // Hero (pink): Hue 25
      // About/Features (soft lavender): Hue 300 to 330
      // Calm Room (calming mint/teal): Hue 180 to 220
      // YouTube/Themes (luxurious warm gold): Hue 65 to 85
      // FAQ/Footer (blush rose): returns to Hue 25
      let hue = 25;
      if (progress < 0.25) {
        // Hero to About: 25 -> 310
        const p = progress / 0.25;
        hue = 25 + p * (310 - 25);
      } else if (progress < 0.5) {
        // About to Calm: 310 -> 180
        const p = (progress - 0.25) / 0.25;
        hue = 310 - p * (310 - 180);
      } else if (progress < 0.75) {
        // Calm to YouTube: 180 -> 75
        const p = (progress - 0.5) / 0.25;
        hue = 180 - p * (180 - 75);
      } else {
        // YouTube to Footer: 75 -> 25
        const p = (progress - 0.75) / 0.25;
        hue = 75 - p * (75 - 25);
      }

      // Keep it within 0-360 range
      const h = (hue + 360) % 360;

      // Update root oklch variables dynamically for full-site color transition
      const root = document.documentElement;
      const mode = root.getAttribute("data-theme-mode") || "light";

      if (mode === "dark") {
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
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    // Trigger on mount
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      // Clean up properties on unmount to reset default pink theme
      const root = document.documentElement;
      root.style.removeProperty("--background");
      root.style.removeProperty("--blush");
      root.style.removeProperty("--rose-soft");
      root.style.removeProperty("--rose-deep");
      root.style.removeProperty("--mauve");
      root.style.removeProperty("--foreground");
      root.style.removeProperty("--glow");
      root.style.removeProperty("--primary");
      root.style.removeProperty("--secondary");
      root.style.removeProperty("--accent");
      root.style.removeProperty("--border");
      root.style.removeProperty("--card");
    };
  }, []);

  return null;
}
