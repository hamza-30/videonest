import { Outlet, Navigate } from "react-router-dom";

function ProtectedRoutes() {
  return user ? <Outlet /> : <Navigate to="/login" replace />;
}

export default ProtectedRoutes;
