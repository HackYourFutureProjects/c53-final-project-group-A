import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { StrictMode } from "react";
import { BrowserRouter } from "react-router-dom";
import { JobsProvider } from "./context/JobsContext.jsx";
import { UserContextProvider } from "./context/UserContext.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <UserContextProvider>
        <JobsProvider>
          <App />
        </JobsProvider>
      </UserContextProvider>
    </BrowserRouter>
  </StrictMode>,
);
