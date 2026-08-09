import type { RouteObject } from "react-router-dom";
import { ROUTE_PATHS } from "./route-paths";
import { PublicLayout } from "@/layouts/PublicLayout";
import { lazy } from "react";

const PublicAttendance = lazy(
    () => import("@/features/public-activity/components/AttendanceViewer"),
);
const PublicLoans = lazy(() => import("@/features/public-activity/components/LoanHistory"));
const PublicProfile = lazy(() => import("@/features/public-activity/components/PublicProfile"));
const PublicHome = lazy(() => import("@/features/public-activity/components/PublicHome"));

export const publicRoutes: RouteObject[] = [
    {
        path: ROUTE_PATHS.PUBLIC,
        element: <PublicLayout />,
        children: [
            {
                path: "home",
                element: <PublicHome />
            },
            {
                path: "attendance",
                element: <PublicAttendance />,
            },
            {
                path: "loans",
                element: <PublicLoans />,
            },
            {
                path: "profile",
                element: <PublicProfile />,
            },
        ],
    },
];
