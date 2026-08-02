import { useQuery } from "@tanstack/react-query";
import { roleService } from "@/services/role.service";

export function useRoles() {
  return useQuery({
    queryKey: ["roles"],
    queryFn: () => roleService.getAll({ limit: 100 }), // Get all roles without pagination
    staleTime: 10 * 60 * 1000, // Cache for 10 minutes
  });
}