import { useQuery } from "@tanstack/react-query";
import { bookLoanService } from "@/services/book-loan.service";
import type { QueryParams } from "@/types/api";

export function useBookLoans(params?: QueryParams) {
  return useQuery({
    queryKey: ["book-loans", params],
    queryFn: () => bookLoanService.getAll(params),
  });
}

export function useBookLoanDetail(id: string | undefined) {
  return useQuery({
    queryKey: ["book-loans", id],
    queryFn: () => bookLoanService.getById(id!),
    enabled: !!id,
  });
}
