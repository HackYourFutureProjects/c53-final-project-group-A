import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout";
import JobSearch from "./pages/jobSearch/JobSearch";
import OpenPositions from "./pages/openPositions/OpenPositions";
import Profile from "./pages/User/Profile";
import "./index.css";
import MyFavorites from "./pages/MyFavorites/MyFavorites";
import AuthForms from "./components/AuthForms/AuthForms";
import About from "./pages/About/About";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";
import ResetPasswordForm from "./pages/ResetPassword/ResetPassword";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<JobSearch />} />
        <Route path="jobs" element={<OpenPositions />} />
        <Route
          path="profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route path="favorites" element={<MyFavorites />} />
        <Route path="reset-password" element={<ResetPasswordForm />} />
        <Route path="login" element={<AuthForms />} />
        <Route path="auth" element={<AuthForms />} />
        <Route path="about" element={<About />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}

export default App;
