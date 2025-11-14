import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { StrictMode } from "react";
import { BrowserRouter } from "react-router-dom";
import { JobsProvider } from "./context/JobsContext.jsx";
// import { FavoritesProvider } from "./context/FavoritesContext.jsx";
// import { SettingsProvider } from "./context/SettingsContext.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      {/* <SettingsProvider> */}
      <AuthProvider>
        <JobsProvider>
          {/* <FavoritesProvider> */}
          <App />
          {/* </FavoritesProvider> */}
        </JobsProvider>
      </AuthProvider>
      {/* </SettingsProvider> */}
    </BrowserRouter>
  </StrictMode>,
);
