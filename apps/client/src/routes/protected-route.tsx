import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/providers/AuthProvider";
import { ROUTE_PATHS } from "./route-paths";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredPermissions?: string[];
  requiredRoles?: string[];
}

export function ProtectedRoute({
  children,
  requiredPermissions = [],
  requiredRoles = [],
}: ProtectedRouteProps) {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  // Show loading spinner while checking auth state
  if (isLoading) {
    return <div>Loading...</div>; // TODO: Replace with proper LoadingScreen component
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to={ROUTE_PATHS.LOGIN} state={{ from: location.pathname }} replace />;
  }

  // TODO: Add permission/role checking logic here
  // This will be implemented when PermissionGate component is ready

  return <>{children}</>;
}
