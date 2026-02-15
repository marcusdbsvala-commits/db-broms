const KEY = "theme_v1";

export function getInitialTheme(): "light" | "dark" {
    const saved = localStorage.getItem(KEY);
    if (saved === "light" || saved === "dark") return saved;

    return window.matchMedia?.("(prefers-color-scheme: dark)")?.matches
        ? "dark"
        : "light";
}

function readCssVar(name: string) {
    const htmlVal = getComputedStyle(document.documentElement)
        .getPropertyValue(name)
        .trim();
    if (htmlVal) return htmlVal;

    const bodyVal = document.body
        ? getComputedStyle(document.body).getPropertyValue(name).trim()
        : "";
    if (bodyVal) return bodyVal;

    return "";
}

function ensureThemeColorMeta() {
    let meta = document.querySelector('meta[name="theme-color"]') as HTMLMetaElement | null;
    if (!meta) {
        meta = document.createElement("meta");
        meta.name = "theme-color";
        document.head.appendChild(meta);
    }
    return meta;
}

function setThemeColorFromBg() {
    const meta = ensureThemeColorMeta();

    const bgVar = readCssVar("--bg");

    // Om --bg inte finns (eller är tom), ta faktisk bakgrundsfärg
    const fallbackBg =
        getComputedStyle(document.body || document.documentElement).backgroundColor || "#0b0b0b";

    // Om din --bg är typ "#0b0b0b" funkar den direkt. Om den är tom → fallback.
    meta.content = bgVar || fallbackBg;
}

export function applyTheme(theme: "light" | "dark") {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem(KEY, theme);

    // Vänta en frame så CSS variablerna hinner uppdateras efter dataset-byten
    requestAnimationFrame(() => {
        setThemeColorFromBg();
    });

    window.dispatchEvent(new CustomEvent("themechange", { detail: theme }));
}

export function toggleTheme() {
    const current =
        (document.documentElement.dataset.theme as "light" | "dark") || "light";
    const next = current === "dark" ? "light" : "dark";
    applyTheme(next);
    return next;
}
