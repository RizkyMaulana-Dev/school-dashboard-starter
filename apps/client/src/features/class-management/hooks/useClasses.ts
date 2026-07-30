import { useQuery } from "@tanstack/react-query";
import { classService } from "@/services/class.service";
import type { QueryParams } from "@/types/api";

export function useClasses(params?: QueryParams) {
  return useQuery({
    queryKey: ["classes", params],
    queryFn: () => classService.getAll(params),
  });
}

export function useClassDetail(id: string | undefined) {
  return useQuery({
    queryKey: ["classes", id],
    queryFn: () => classService.getById(id!),
    enabled: !!id,
  });
}
