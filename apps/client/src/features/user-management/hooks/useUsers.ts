import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { userService } from "@/services/user.service";
import type { QueryParams } from "@/types/api";

export function useUsers(params?: QueryParams) {
  return useQuery({
    queryKey: ["users", params],
    queryFn: () => userService.getAll(params),
    placeholderData: keepPreviousData
  });
}

export function useUserDetail(id: string | undefined) {
  return useQuery({
    queryKey: ["users", id],
    queryFn: () => userService.getById(id!),
    enabled: !!id,
  });
}
