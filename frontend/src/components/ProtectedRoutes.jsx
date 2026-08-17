import { Outlet, Navigate } from "react-router-dom";
import Loading from "./Loading";
import { useAuthContext } from "../context/auth/AuthContextProvider";

function ProtectedRoutes() {
  const { user, loading } = useAuthContext();

  if (loading) {
    return <Loading />;
  }

  return user ? <Outlet /> : <Navigate to="/login" replace />;
}

export default ProtectedRoutes;
