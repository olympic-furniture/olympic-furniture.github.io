import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { WoodPreview } from "./WoodPreview";
import "../styles.css";
import "./wood-preview.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <WoodPreview />
  </StrictMode>,
);
