import { Navigate, Outlet } from "react-router-dom";
import { useAppSelector } from "../store/hook";

const PublicRoute = () => {
  const { accessToken, isInitialized } = useAppSelector((state) => state.auth);

  if (!isInitialized) {
    return <p className="p-page-gutter text-body text-muted" role="status">Checking your session...</p>;
  }

  if (accessToken) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
};

export default PublicRoute;