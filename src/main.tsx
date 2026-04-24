import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./app/App";
import { VocabularyProvider } from "./features/vocabulary/VocabularyContext";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <VocabularyProvider>
        <App />
      </VocabularyProvider>
    </BrowserRouter>
  </StrictMode>
);
