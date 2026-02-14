import { useEffect, useState } from "react";
import { BrowserRouter, NavLink, Route, Routes } from "react-router-dom";

import Broms from "./pages/Broms";
import ATC from "./pages/ATC";
import Plattformar from "./pages/Plattformar";
import Lok from "./pages/Lok";
import Vinter from "./pages/Vinter";
import ScrollToTop from "./ui/ScrollToTop";
import Forbattring from "./pages/Forbattring";


import { applyTheme, getInitialTheme, toggleTheme } from "./theme";
import { useInstallPrompt } from "./hooks/useInstallPrompt";

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

export default function App() {
  const [theme, setTheme] = useState<"light" | "dark">("light");

  const { canInstall, install } = useInstallPrompt();

  useEffect(() => {
    const t = getInitialTheme();
    applyTheme(t);
    setTheme(t);
  }, []);

  const onToggleTheme = () => {
    const next = toggleTheme();
    setTheme(next);
  };

  return (
    <BrowserRouter>
      <ScrollToTop />

      {/* Extra padding */}
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

      {/* 🔥 Brutal install popup */}
      {canInstall && (
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
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            {/* brutal red square */}
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
              }}
            >
              🚂
            </div>

            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 900, color: "white" }}>
                Installera DB Broms
              </div>
              <div style={{ fontSize: 13, color: "rgba(255,255,255,0.7)" }}>
                Offline i tunnlar. Snabbare start. Mindre stress.
              </div>
            </div>

            <button
              onClick={install}
              style={{
                border: "none",
                padding: "10px 14px",
                borderRadius: 12,
                background: "#ff2337",
                color: "white",
                fontWeight: 900,
                cursor: "pointer",
              }}
            >
              Installera
            </button>
          </div>
        </div>
      )}

      {/* Bottom nav */}
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
