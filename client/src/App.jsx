import Layout from "./components/Layout";
import "./index.css";
import { Routes, Route, Navigate } from "react-router-dom";
import HomePage from "./pages/Home/HomePage";

import { defaultUser } from "./data/defaultUser";
import { useState } from "react";
import JobListingPage from "./pages/JobListingPage/JobListingPage";

function App() {
  // eslint-disable-next-line no-unused-vars
  const [user, setUser] = useState(defaultUser);

  return (
    <Routes>
      <Route path="/" element={<Layout user={user} />}>
        <Route index element={<HomePage user={user} />} />
        <Route path="/jobs" element={<JobListingPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}

export default App;
