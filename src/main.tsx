import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "@lvucodes/ui/theme.css";
import "./index.css";
import App from "./App.tsx";
import { seedDefaultTheme } from "./theme-boot.ts";

seedDefaultTheme();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
