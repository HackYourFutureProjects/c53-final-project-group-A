import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { StrictMode } from "react";
import { BrowserRouter } from "react-router-dom";
import { JobsProvider } from "./context/JobsContext.jsx";
import { FavoritesProvider } from "./context/FavoritesContext.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <JobsProvider>
        <FavoritesProvider>
          <App />
        </FavoritesProvider>
      </JobsProvider>
    </BrowserRouter>
  </StrictMode>,
);
