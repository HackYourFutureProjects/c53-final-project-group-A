import { Navigate } from "react-router-dom";
import { UseUser } from "../context/UserContext";

export default function ProtectedRoute({ children }) {
  const { user } = UseUser();

  // This check ONLY runs AFTER userLoading is false.
  if (!user || !user.userid) {
    return <Navigate to="/login" replace />;
  }

  // If user is logged in → allow access
  return children;
}
