import { useMutation, useQueryClient } from "@tanstack/react-query";
import { bookService } from "@/services/book.service";
import { useUIStore } from "@/stores/ui.store";
import type { CreateBookDTO, UpdateBookDTO } from "@/types/entities";

export function useCreateBook() {
  const qc = useQueryClient();
  const addToast = useUIStore((s) => s.addToast);
  return useMutation({
    mutationFn: (data: CreateBookDTO) => bookService.create(data),
    onSuccess: (res) => {
      qc.invalidateQueries({ queryKey: ["books"] });
      addToast({ type: "success", title: "Buku ditambahkan", message: res.message });
    },
    onError: (err) => addToast({ type: "error", title: "Gagal", message: err.message }),
  });
}
export function useUpdateBook() {
  const qc = useQueryClient();
  const addToast = useUIStore((s) => s.addToast);
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateBookDTO }) => bookService.update(id, data),
    onSuccess: (res) => {
      qc.invalidateQueries({ queryKey: ["books"] });
      addToast({ type: "success", title: "Buku diupdate", message: res.message });
    },
    onError: (err) => addToast({ type: "error", title: "Gagal", message: err.message }),
  });
}
export function useDeleteBook() {
  const qc = useQueryClient();
  const addToast = useUIStore((s) => s.addToast);
  return useMutation({
    mutationFn: (id: string) => bookService.delete(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["books"] });
      addToast({ type: "success", title: "Buku dihapus" });
    },
    onError: (err) => addToast({ type: "error", title: "Gagal", message: err.message }),
  });
}
