import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout";
import JobSearch from "./pages/jobSearch/JobSearch";
import OpenPositions from "./pages/openPositions/OpenPositions";
import UserProfile from "./pages/User/userProfile";
import "./index.css";

import { defaultUser } from "./data/defaultUser";
import { useState } from "react";

function App() {
  // eslint-disable-next-line no-unused-vars
  const [user, setUser] = useState(defaultUser);

  return (
    <Routes>
      <Route path="/" element={<Layout user={user} />}>
        <Route index element={<JobSearch user={user} />} />
        <Route path="/jobs" element={<OpenPositions />} />
        <Route path="/user-profile" element={<UserProfile user={user} />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}

export default App;
