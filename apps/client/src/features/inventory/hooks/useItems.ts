import { useQuery } from "@tanstack/react-query";
import { itemService } from "@/services/item.service";
import type { QueryParams } from "@/types/api";

export function useItems(params?: QueryParams) {
  return useQuery({ queryKey: ["items", params], queryFn: () => itemService.getAll(params) });
}
export function useItemDetail(id?: string) {
  return useQuery({
    queryKey: ["items", id],
    queryFn: () => itemService.getById(id!),
    enabled: !!id,
  });
}
