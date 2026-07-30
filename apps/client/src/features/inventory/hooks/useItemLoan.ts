import { useQuery } from "@tanstack/react-query";
import { itemLoanService } from "@/services/item-loan.service";
import type { QueryParams } from "@/types/api";

export function useItemLoans(params?: QueryParams) {
  return useQuery({
    queryKey: ["item-loans", params],
    queryFn: () => itemLoanService.getAll(params),
  });
}

export function useItemLoanDetail(id: string | undefined) {
  return useQuery({
    queryKey: ["item-loans", id],
    queryFn: () => itemLoanService.getById(id!),
    enabled: !!id,
  });
}
