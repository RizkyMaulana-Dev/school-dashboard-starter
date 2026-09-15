import { createBrowserRouter, Navigate } from "react-router-dom";
import { dashboardRoutes } from "./dashboard.routes";
import { publicRoutes } from "./public.routes";
import { authRoutes } from "./auth.routes";
import { ROUTE_PATHS } from "./route.paths";
import { lazy } from "react";

const PageNotFound = lazy(() => import("@/components/feedback/404"));

export const router = createBrowserRouter(
    [
        ...authRoutes,
        ...dashboardRoutes,
        ...publicRoutes,

        {
            path: "/",
            element: <Navigate to={ROUTE_PATHS.PUBLIC_HOME} replace />,
        },

        {
            path: ROUTE_PATHS.NOT_FOUND,
            element: <PageNotFound />,
        },

        {
            path: "*",
            element: <Navigate to={ROUTE_PATHS.NOT_FOUND} replace />,
        },
    ],
    {
        basename: import.meta.env.BASE_URL.replace(/\/$/, ""),
    },
);