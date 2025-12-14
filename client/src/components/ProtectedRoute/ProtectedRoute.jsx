import { Navigate } from "react-router-dom";
import { UseUser } from "../../context/UserContext";

export default function ProtectedRoute({ children }) {
  const {
    user,
    // , loading: userLoading
  } = UseUser();

  // Show loading spinner while context is checking user (userLoading is TRUE initially)
  // if (userLoading) {
  //   return <p>Loading...</p>;
  // }

  // This check ONLY runs AFTER userLoading is false.
  if (!user || !user.userid) {
    return <Navigate to="/login" replace />;
  }

  // If user is logged in → allow access
  return children;
}
