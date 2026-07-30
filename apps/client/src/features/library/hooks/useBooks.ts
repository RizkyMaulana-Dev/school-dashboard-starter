import { useQuery } from "@tanstack/react-query";
import { bookService } from "@/services/book.service";
import type { QueryParams } from "@/types/api";

export function useBooks(params?: QueryParams) {
  return useQuery({ queryKey: ["books", params], queryFn: () => bookService.getAll(params) });
}
export function useBookDetail(id?: string) {
  return useQuery({
    queryKey: ["books", id],
    queryFn: () => bookService.getById(id!),
    enabled: !!id,
  });
}
export function useBookCategories() {
  return useQuery({ queryKey: ["book-categories"], queryFn: () => bookService.getAllCategories() });
}
