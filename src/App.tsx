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
    <button type="button" onClick={onToggle} style={iconBtnStyle}>
      {theme === "dark" ? "☀️" : "🌙"}
    </button>
  );
}

/* ================= INSTALL ================= */

function InstallPopup({ onInstall }: { onInstall: () => void }) {
  return (
    <div style={{ position: "fixed", left: 12, right: 12, bottom: 78, zIndex: 2000 }}>
      <button onClick={onInstall}>Installera</button>
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
        background: "#111",
        zIndex: 2500,
        color: "white",
      }}
    >
      <div style={{ fontWeight: 900 }}>
        Ny version finns ({WHATS_NEW_VERSION})
      </div>

      <ul style={{ marginTop: 6 }}>
        {WHATS_NEW.slice(0, 3).map((x) => (
          <li key={x}>{x}</li>
        ))}
      </ul>

      <div style={{ display: "flex", gap: 10 }}>
        <button onClick={onLater}>Senare</button>
        <button onClick={onUpdateNow}>Uppdatera nu</button>
      </div>
    </div>
  );
}

/* ================= APP ================= */

export default function App() {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const { canInstall, install } = useInstallPrompt();

  const [showUpdate, setShowUpdate] = useState(false);
  const [doUpdate, setDoUpdate] =
    useState<null | ((reload?: boolean) => Promise<void>)>(null);

  useEffect(() => {
    /* THEME */
    const t = getInitialTheme();
    applyTheme(t);
    setTheme(t);

    /* ===== PWA UPDATE ===== */
    const updateFn = registerSW({
      // 🔥 viktigast: INTE immediate
      immediate: false,

      onNeedRefresh() {
        setShowUpdate(true);
      },
    });

    setDoUpdate(() => updateFn);

    // Checka efter update lugnt (utan reload)
    const checkForUpdates = () => updateFn(false);

    const tId = window.setTimeout(checkForUpdates, 2000);
    window.addEventListener("focus", checkForUpdates);

    return () => {
      window.removeEventListener("focus", checkForUpdates);
      window.clearTimeout(tId);
    };
  }, []);

  const onToggleTheme = () => {
    const next = toggleTheme();
    setTheme(next);
  };

  const installPopupVisible = canInstall && !showUpdate;

  return (
    <BrowserRouter>
      <ScrollToTop />

      <div style={{ paddingBottom: 120 }}>
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
            await doUpdate(true);
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
