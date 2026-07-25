export type ThemePalette = {
  n: string;
  c: [string, string, string]; // [bg/soft, accent/blush, deep/primary]
};

export const themes: ThemePalette[] = [
  { n: "Classic Pink", c: ["#FBE4EC", "#F7C9D9", "#B55B72"] },
  { n: "Premium Gold", c: ["#FBEFE0", "#E4C28E", "#9A6B2F"] },
  { n: "Aqua Orchid", c: ["#E0F5F2", "#A8D8D6", "#6B8AA8"] },
  { n: "Fresh Garden", c: ["#E8F3DA", "#B8D898", "#5A7A3B"] },
  { n: "Soft Rose", c: ["#FDE8EE", "#F5BCCD", "#C0738C"] },
  { n: "Pearl Blush", c: ["#FBF0EC", "#E8C8C2", "#A88078"] },
  { n: "Lilac Cream", c: ["#F0EAF8", "#C9B3E0", "#8A6BB0"] },
  { n: "Mint Petal", c: ["#E4F3EC", "#A8D6BF", "#5A8A75"] },
  { n: "Black Velvet", c: ["#2a1f25", "#4a2f3a", "#C88AA0"] },
];

export const clearInlineThemeStyles = (root: HTMLElement) => {
  root.removeAttribute("data-selected-theme");
  root.style.removeProperty("--background");
  root.style.removeProperty("--secondary");
  root.style.removeProperty("--accent");
  root.style.removeProperty("--blush");
  root.style.removeProperty("--rose-soft");
  root.style.removeProperty("--rose-deep");
  root.style.removeProperty("--primary");
  root.style.removeProperty("--border");
  root.style.removeProperty("--mauve");
  root.style.removeProperty("--foreground");
  root.style.removeProperty("--card");
};

export const applyTheme = (themeName: string | null, isDark?: boolean) => {
  if (typeof window === "undefined") return;
  const root = document.documentElement;
  
  const currentMode = isDark !== undefined
    ? (isDark ? "dark" : "light")
    : (root.getAttribute("data-theme-mode") || (root.classList.contains("dark") ? "dark" : "light"));

  const dark = currentMode === "dark";

  if (!themeName) {
    clearInlineThemeStyles(root);
    localStorage.removeItem("gv-selected-theme");
    window.dispatchEvent(new Event("scroll"));
    return;
  }

  const th = themes.find((t) => t.n === themeName);
  if (!th) return;

  root.setAttribute("data-selected-theme", themeName);
  localStorage.setItem("gv-selected-theme", themeName);

  if (dark) {
    root.style.setProperty("--background", "#1e141a");
    root.style.setProperty("--card", "#2a1c25");
    root.style.setProperty("--mauve", "#fbe4ec");
    root.style.setProperty("--foreground", "#fbe4ec");
    root.style.setProperty("--rose-soft", "#32202c");
    root.style.setProperty("--rose-deep", th.c[2]);
    root.style.setProperty("--primary", th.c[2]);
    root.style.setProperty("--accent", th.c[1]);
    root.style.setProperty("--blush", th.c[1]);
    root.style.setProperty("--border", "rgba(251, 228, 236, 0.15)");
  } else {
    root.style.setProperty("--background", th.c[0]);
    root.style.setProperty("--secondary", th.c[0]);
    root.style.setProperty("--accent", th.c[1]);
    root.style.setProperty("--blush", th.c[1]);
    root.style.setProperty("--rose-soft", th.c[0]);
    root.style.setProperty("--rose-deep", th.c[2]);
    root.style.setProperty("--primary", th.c[2]);
    root.style.setProperty("--border", th.c[1]);
    root.style.setProperty("--mauve", "#321d28");
    root.style.setProperty("--foreground", "#321d28");
    root.style.setProperty("--card", "#ffffff");
  }
};
