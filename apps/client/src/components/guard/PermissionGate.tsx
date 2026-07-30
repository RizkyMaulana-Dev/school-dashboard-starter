import type { ReactNode } from "react";
import { useAuthStore } from "@/stores/auth.store";

interface PermissionGateProps {
  children: ReactNode;
  requiredPermissions?: string | string[];
  requiredRoles?: string | string[];
  fallback?: ReactNode;
  mode?: "all" | "any"; // 'all' = must have all permissions, 'any' = at least one
}

/**
 * Component untuk membatasi akses ke komponen/fitur berdasarkan permission atau role
 *
 * @example
 * <PermissionGate requiredPermissions="user.create">
 *   <CreateUserButton />
 * </PermissionGate>
 *
 * @example
 * <PermissionGate requiredPermissions={['user.read', 'user.update']} mode="all">
 *   <UserManager />
 * </PermissionGate>
 */
export function PermissionGate({
  children,
  requiredPermissions = [],
  requiredRoles = [],
  fallback = null,
  mode = "all",
}: PermissionGateProps) {
  const { hasPermission, hasRole, isSuperAdmin } = useAuthStore();

  // Super Admin always has access
  if (isSuperAdmin()) {
    return <>{children}</>;
  }

  // Normalize to arrays
  const permissions = Array.isArray(requiredPermissions)
    ? requiredPermissions
    : [requiredPermissions];

  const roles = Array.isArray(requiredRoles) ? requiredRoles : [requiredRoles];

  // Check permissions
  const hasAllPermissions =
    permissions.length === 0 ||
    (mode === "all"
      ? permissions.every((p) => hasPermission(p))
      : permissions.some((p) => hasPermission(p)));

  // Check roles
  const hasAllRoles =
    roles.length === 0 ||
    (mode === "all" ? roles.every((r) => hasRole(r)) : roles.some((r) => hasRole(r)));

  // Show children only if all conditions are met
  if (hasAllPermissions && hasAllRoles) {
    return <>{children}</>;
  }

  // Return fallback (usually null or an unauthorized message)
  return <>{fallback}</>;
}
