import { useEffect, useState } from "react";
import { BrowserRouter, NavLink, Route, Routes } from "react-router-dom";
import { registerSW } from "virtual:pwa-register";

import Broms from "./pages/Broms";
import ATC from "./pages/ATC";
import Plattformar from "./pages/Plattformar";
import Lok from "./pages/Lok";
import Vinter from "./pages/Vinter";
import Forbattring from "./pages/Forbattring";
import ScrollToTop from "./ui/ScrollToTop";

import { applyTheme, getInitialTheme, toggleTheme } from "./theme";
import { useInstallPrompt } from "./hooks/useInstallPrompt";
import { WHATS_NEW, WHATS_NEW_VERSION } from "./whatsNew";

/* ================= NAV ================= */

const navWrapStyle: React.CSSProperties = {
  position: "fixed",
  left: 0,
  right: 0,
  bottom: 0,
  padding: 10,
  borderTop: "1px solid var(--border)",
  background: "var(--bg)",
  display: "flex",
  gap: 10,
  overflowX: "auto",
  WebkitOverflowScrolling: "touch",
  justifyContent: "flex-start",
  zIndex: 999,
};

const navLinkStyle = ({ isActive }: { isActive: boolean }): React.CSSProperties => ({
  flex: "0 0 auto",
  padding: "10px 12px",
  textDecoration: "none",
  borderRadius: 12,
  border: "1px solid var(--btn-border)",
  background: isActive ? "var(--pill)" : "var(--btn-bg)",
  color: "var(--btn-text)",
  fontWeight: 800,
  whiteSpace: "nowrap",
});

const iconBtnStyle: React.CSSProperties = {
  flex: "0 0 auto",
  padding: "10px 12px",
  borderRadius: 12,
  border: "1px solid var(--btn-border)",
  background: "var(--btn-bg)",
  color: "var(--btn-text)",
  fontWeight: 900,
  cursor: "pointer",
  whiteSpace: "nowrap",
};

function ThemeToggleBtn({ theme, onToggle }: { theme: "light" | "dark"; onToggle: () => void }) {
  return (
    <button type="button" onClick={onToggle} style={iconBtnStyle} aria-label="Växla tema" title="Växla tema">
      {theme === "dark" ? "☀️" : "🌙"}
    </button>
  );
}

/* ================= INSTALL ================= */

function InstallPopup({ onInstall }: { onInstall: () => void }) {
  return (
    <div
      style={{
        position: "fixed",
        left: 12,
        right: 12,
        bottom: 78,
        padding: 14,
        borderRadius: 18,
        background: "linear-gradient(135deg, #0b0b0c, #1a1a1d)",
        border: "1px solid rgba(255,255,255,0.12)",
        boxShadow: "0 10px 40px rgba(0,0,0,0.6)",
        zIndex: 2000,
        boxSizing: "border-box",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <div
          style={{
            width: 44,
            height: 44,
            borderRadius: 12,
            background: "linear-gradient(135deg, #ff2337, #8b0000)",
            display: "grid",
            placeItems: "center",
            fontWeight: 900,
            color: "white",
            boxShadow: "0 0 10px rgba(255,35,55,0.6)",
            flex: "0 0 auto",
          }}
        >
          🚂
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontWeight: 900, color: "white" }}>Installera DB Broms</div>
          <div style={{ fontSize: 13, color: "rgba(255,255,255,0.7)" }}>
            Offline i tunnlar. Snabbare start. Mindre stress.
          </div>
        </div>

        <button
          onClick={onInstall}
          style={{
            border: "none",
            padding: "10px 14px",
            borderRadius: 12,
            background: "#ff2337",
            color: "white",
            fontWeight: 900,
            cursor: "pointer",
            flex: "0 0 auto",
          }}
        >
          Installera
        </button>
      </div>
    </div>
  );
}

/* ================= UPDATE ================= */

function UpdatePopup({
  onLater,
  onUpdateNow,
}: {
  onLater: () => void;
  onUpdateNow: () => void;
}) {
  return (
    <div
      style={{
        position: "fixed",
        left: 12,
        right: 12,
        bottom: 78,
        padding: 14,
        borderRadius: 18,
        background: "linear-gradient(135deg, #0b0b0c, #1a1a1d)",
        border: "1px solid rgba(255,255,255,0.12)",
        boxShadow: "0 10px 40px rgba(0,0,0,0.65)",
        zIndex: 2500,
        color: "white",
        boxSizing: "border-box",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <div
          style={{
            width: 44,
            height: 44,
            borderRadius: 12,
            background: "linear-gradient(135deg, #ff2337, #8b0000)",
            display: "grid",
            placeItems: "center",
            fontWeight: 900,
            color: "white",
            boxShadow: "0 0 10px rgba(255,35,55,0.6)",
            flex: "0 0 auto",
          }}
        >
          ⬆️
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontWeight: 900 }}>Ny version finns ({WHATS_NEW_VERSION})</div>

          <ul
            style={{
              margin: "6px 0 0",
              paddingLeft: 18,
              color: "rgba(255,255,255,0.8)",
              fontSize: 13,
              lineHeight: 1.35,
            }}
          >
            {WHATS_NEW.slice(0, 3).map((x) => (
              <li key={x}>{x}</li>
            ))}
          </ul>
        </div>
      </div>

      <div style={{ display: "flex", gap: 10, marginTop: 12 }}>
        <button
          onClick={onLater}
          style={{
            flex: 1,
            padding: "10px 12px",
            borderRadius: 12,
            border: "1px solid rgba(255,255,255,0.16)",
            background: "transparent",
            color: "white",
            fontWeight: 900,
            cursor: "pointer",
          }}
        >
          Senare
        </button>

        <button
          onClick={onUpdateNow}
          style={{
            flex: 1,
            padding: "10px 12px",
            borderRadius: 12,
            border: "none",
            background: "#ff2337",
            color: "white",
            fontWeight: 900,
            cursor: "pointer",
          }}
        >
          Uppdatera nu
        </button>
      </div>
    </div>
  );
}

/* ================= APP ================= */

export default function App() {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const { canInstall, install } = useInstallPrompt();

  const [showUpdate, setShowUpdate] = useState(false);
  const [doUpdate, setDoUpdate] = useState<null | ((reload?: boolean) => Promise<void>)>(null);

  const onToggleTheme = () => {
    const next = toggleTheme();
    setTheme(next);
  };

  useEffect(() => {
    // Theme init
    const t = getInitialTheme();
    applyTheme(t);
    setTheme(t);

    // PWA update handling (vite.config: registerType:"prompt" + workbox.skipWaiting:false + clientsClaim:false)
    const updateFn = registerSW({
      immediate: true,
      onNeedRefresh() {
        setShowUpdate(true);
      },
    });

    setDoUpdate(() => updateFn);

    // Checka uppdateringar lagom (utan spam)
    const checkForUpdates = () => updateFn(false);

    const tId = window.setTimeout(checkForUpdates, 1500);
    window.addEventListener("focus", checkForUpdates);

    return () => {
      window.removeEventListener("focus", checkForUpdates);
      window.clearTimeout(tId);
    };
  }, []);

  const installPopupVisible = canInstall && !showUpdate; // om båda triggar: visa update först

  return (
    <BrowserRouter>
      <ScrollToTop />

      <div style={{ paddingBottom: 120, maxWidth: "100%", overflowX: "hidden" }}>
        <Routes>
          <Route path="/" element={<Broms />} />
          <Route path="/ATC" element={<ATC />} />
          <Route path="/plattformar" element={<Plattformar />} />
          <Route path="/lok" element={<Lok />} />
          <Route path="/vinter" element={<Vinter />} />
          <Route path="/forbattring" element={<Forbattring />} />
        </Routes>
      </div>

      {/* UPDATE */}
      {showUpdate && (
        <UpdatePopup
          onLater={() => setShowUpdate(false)}
          onUpdateNow={async () => {
            if (!doUpdate) return;
            await doUpdate(true); // aktivera nya SW + reload
          }}
        />
      )}

      {/* INSTALL */}
      {installPopupVisible && <InstallPopup onInstall={install} />}

      {/* NAV */}
      <div style={navWrapStyle}>
        <NavLink to="/" style={navLinkStyle} end>
          Broms
        </NavLink>
        <NavLink to="/ATC" style={navLinkStyle}>
          ATC
        </NavLink>
        <NavLink to="/plattformar" style={navLinkStyle}>
          Plattformar
        </NavLink>
        <NavLink to="/lok" style={navLinkStyle}>
          Lok
        </NavLink>
        <NavLink to="/vinter" style={navLinkStyle}>
          Vinter
        </NavLink>
        <NavLink to="/forbattring" style={navLinkStyle}>
          Förslag
        </NavLink>

        <ThemeToggleBtn theme={theme} onToggle={onToggleTheme} />
      </div>
    </BrowserRouter>
  );
}
