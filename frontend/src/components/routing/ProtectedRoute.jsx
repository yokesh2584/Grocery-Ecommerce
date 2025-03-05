import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Loader from "../ui/Loader";

const ProtectedRoute = () => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <Loader />;
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
};

export default ProtectedRoute;
