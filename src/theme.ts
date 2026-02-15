const KEY = "theme_v1";

export function getInitialTheme(): "light" | "dark" {
    const saved = localStorage.getItem(KEY);
    if (saved === "light" || saved === "dark") return saved;

    return window.matchMedia?.("(prefers-color-scheme: dark)")?.matches
        ? "dark"
        : "light";
}

function setThemeColorFromCssVar() {
    let metaTheme = document.querySelector(
        'meta[name="theme-color"]'
    ) as HTMLMetaElement | null;

    if (!metaTheme) {
        metaTheme = document.createElement("meta");
        metaTheme.name = "theme-color";
        document.head.appendChild(metaTheme);
    }

    const bg = getComputedStyle(document.documentElement)
        .getPropertyValue("--bg")
        .trim();

    metaTheme.content = bg || "#0b0b0b";
}

export function applyTheme(theme: "light" | "dark") {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem(KEY, theme);

    // 🔥 matcha notishyllan/statusbaren med --bg
    setThemeColorFromCssVar();

    // 🔥 notify app
    window.dispatchEvent(new CustomEvent("themechange", { detail: theme }));
}

export function toggleTheme() {
    const current =
        (document.documentElement.dataset.theme as "light" | "dark") || "light";
    const next = current === "dark" ? "light" : "dark";
    applyTheme(next);
    return next;
}
