import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

import { applyTheme, getInitialTheme } from "./theme";

import { registerSW } from "virtual:pwa-register";
registerSW({ immediate: true });

applyTheme(getInitialTheme());

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
