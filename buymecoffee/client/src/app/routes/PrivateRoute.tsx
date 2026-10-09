import { Navigate, Outlet } from "react-router-dom";
import { useAppSelector } from "../store/hook";

const ProtectedRoute = () => {
  const { accessToken, isInitialized } = useAppSelector((state) => state.auth);

  if (!isInitialized) {
    return <p className="p-page-gutter text-body text-muted" role="status">Checking your access...</p>;
  }

  if (!accessToken) {
    return <Navigate to = "/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;