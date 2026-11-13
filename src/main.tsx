import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { seedDefaultTheme } from "@lvucodes/ui";
import "@lvucodes/ui/theme.css";
import "./index.css";
import App from "./App.tsx";

seedDefaultTheme();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
