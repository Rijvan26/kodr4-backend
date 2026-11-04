import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
import AuthInitializer from "../../features/auth/components/AuthInitializer";
import CreatorProfilePage from "../../pages/CreatorProfilePage";
import DashboardPage from "../../pages/DashboardPage";
import LoginPage from "../../pages/LoginPage";
import PublicCreatorPage from "../../pages/PublicCreatorPage";
import RegisterPage from "../../pages/RegisterPage";
import AuthLayout from "../layout/AuthLayout";
import MainLayout from "../layout/MainLayout";
import ProtectedRoute from "./PrivateRoute";
import PublicRoute from "./PublicRoute";

const router = createBrowserRouter([
    {
        path: "/",
        element: <PublicRoute />,
        children: [
            {
                path: "",
                element: <AuthLayout />,
                children: [
                    {
                        index: true,
                        element: <Navigate to="/login" replace />,
                    },
                    {
                        path: "login",
                        element: <LoginPage />,
                    },
                    {
                        path: "register",
                        element: <RegisterPage />,
                    },
                ],
            },
        ],
    },
    {
        path: "/dashboard",
        element: <ProtectedRoute />,
        children: [
            {
                path: "",
                element: <MainLayout />,
                children: [
                    {
                        index: true,
                        element: <DashboardPage />,
                    },
                    {
                        path: "creator",
                        element: <CreatorProfilePage />,
                    },
                    {
                        path: "creater",
                        element: <Navigate to="/dashboard/creator" replace />,
                    },
                    {
                        path: "home",
                        element: <Navigate to="/dashboard" replace />,
                    },
                ],
            },
        ],
    },
    {
        path: "/:username",
        element: <PublicCreatorPage />,
    },
    {
        path: "*",
        element: <Navigate to="/login" replace />,
    },
]);

const AppRouter = () => (
    <AuthInitializer>
        <RouterProvider router={router} />
    </AuthInitializer>
);

export default AppRouter;
