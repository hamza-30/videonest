import { Navigate, Outlet } from "react-router-dom";

function PublicRoutes() {
  return user ? <Navigate to="/" replace /> : <Outlet />;
}

export default PublicRoutes;
