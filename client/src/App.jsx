import Layout from "./components/Layout";
import "./index.css";
import { Routes, Route, Navigate } from "react-router-dom";
import JobSearch from "./pages/jobSearch/JobSearch";
import MyFavorites from "./pages/MyFavorites/MyFavorites";
import { defaultUser } from "./data/defaultUser";
import { useState } from "react";
import OpenPositions from "./pages/openPositions/OpenPositions";

function App() {
  // eslint-disable-next-line no-unused-vars
  const [user, setUser] = useState(defaultUser);

  return (
    <Routes>
      <Route path="/" element={<Layout user={user} />}>
        <Route index element={<JobSearch user={user} />} />
        <Route path="/jobs" element={<OpenPositions />} />
        <Route path="/favorites" element={<MyFavorites />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}

export default App;
