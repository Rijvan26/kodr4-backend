import { createBrowserRouter, RouterProvider } from "react-router-dom";
import AuthInitializer from "../../features/auth/components/AuthInitializer";
import CreaterPage from "../../pages/CreaterPage";
import CreatorProfilePage from "../../pages/CreatorProfilePage";
import DashboardPage from "../../pages/DashboardPage";
import HomePage from "../../pages/HomePage";
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
                        path: "home",
                        element: <HomePage />,
                    },
                    {
                        path: "creater",
                        element: <CreaterPage />,
                    },
                    {
                        path: "creator",
                        element: <CreatorProfilePage />,
                    },
                ],
            },
        ],
    },
    {
        path: "/:username",
        element: <PublicCreatorPage />,
    },
]);

const AppRouter = () => (
    <AuthInitializer>
        <RouterProvider router={router} />
    </AuthInitializer>
);

export default AppRouter;

