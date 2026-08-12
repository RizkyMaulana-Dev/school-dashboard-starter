import { createBrowserRouter, Navigate } from "react-router-dom";
import { dashboardRoutes } from "./dashboard-routes";
import { publicRoutes } from "./public-routes";
import { authRoutes } from "./auth-routes";
import { ROUTE_PATHS } from "./route-paths";

/**
 * Root router configuration
 * Menggabungkan semua route modules
 */
export const router = createBrowserRouter([
    // Auth routes (login, etc.)
    ...authRoutes,

    // Dashboard routes (protected)
    ...dashboardRoutes,

    // Public routes (activity viewer)
    ...publicRoutes,

    // Root redirect
    {
        path: "/",
        element: <Navigate to={ROUTE_PATHS.PUBLIC_HOME} replace />,
    },

    // 404 Not Found
    {
        path: "*",
        element: <Navigate to={ROUTE_PATHS.NOT_FOUND} replace />,
    },
]);
