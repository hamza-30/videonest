import { Navigate, Outlet } from "react-router-dom";
import { useAuthContext } from "../context/auth/AuthContextProvider";
import Loading from "./Loading";

function PublicRoutes() {
  const { user, loading } = useAuthContext();

  if (loading) {
    return <Loading />;
  }

  return user ? <Navigate to="/" replace /> : <Outlet />;
}

export default PublicRoutes;
