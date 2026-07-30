import type { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/providers/AuthProvider";
import { ROUTE_PATHS } from "@/routes/route-paths";

interface AuthGuardProps {
  children: ReactNode;
  requireAuth?: boolean; // true = must be logged in, false = must be logged out
  redirectTo?: string;
}

/**
 * Component guard untuk proteksi route berdasarkan status autentikasi
 */
export function AuthGuard({ children, requireAuth = true, redirectTo }: AuthGuardProps) {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  // Show loading while checking auth state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500" />
      </div>
    );
  }

  // Redirect based on auth requirement
  if (requireAuth && !isAuthenticated) {
    const destination = redirectTo || ROUTE_PATHS.LOGIN;
    return <Navigate to={destination} state={{ from: location.pathname }} replace />;
  }

  if (!requireAuth && isAuthenticated) {
    const destination = redirectTo || ROUTE_PATHS.DASHBOARD_HOME;
    return <Navigate to={destination} replace />;
  }

  return <>{children}</>;
}
