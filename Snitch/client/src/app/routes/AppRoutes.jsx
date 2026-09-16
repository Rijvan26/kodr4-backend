import { createBrowserRouter, RouterProvider} from "react-router-dom"
import Register from "../../features/auth/ui/page/Register"
import Login from "../../features/auth/ui/page/Login"
import HomePage from "../../features/products/ui/pages/ProductPage"
import ProductPage from "../../features/products/ui/pages/ProductPage"

const AppRouter = () => {
    let router = createBrowserRouter([
    {
        path:"/login",
        element:<Login />
    },
    {
        path:"/register",
        element:<Register />
    },
    {
        path:"/home",
        element:<ProductPage />
    }

])

return (
    <RouterProvider router={router} />
)
}

export default AppRouter

