import type { RouteObject } from "react-router-dom";
import { ROUTE_PATHS } from "./route-paths";
import { AuthLayout } from "@/layouts/AuthLayout";
import { lazy } from "react";

const LoginPage = lazy(() => import("@/features/auth/components/LoginForm"));

export const authRoutes: RouteObject[] = [
  {
    path: ROUTE_PATHS.LOGIN,
    element: <AuthLayout />,
    children: [
      {
        index: true,
        element: <LoginPage />,
      },
    ],
  },
];
