import { useMutation, useQueryClient } from "@tanstack/react-query";
import { bookLoanService } from "@/services/book-loan.service";
import { useUIStore } from "@/stores/ui.store";
import type { CreateBookLoanDTO, UpdateBookLoanDTO } from "@/types/entities";

export function useCreateBookLoan() {
  const queryClient = useQueryClient();
  const addToast = useUIStore((state) => state.addToast);

  return useMutation({
    mutationFn: (data: CreateBookLoanDTO) => bookLoanService.create(data),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["book-loans"] });
      addToast({
        type: "success",
        title: "Berhasil",
        message: response.message || "Peminjaman berhasil dicatat",
      });
    },
    onError: (error) => {
      addToast({
        type: "error",
        title: "Gagal",
        message: error instanceof Error ? error.message : "Gagal membuat peminjaman",
        duration: 8000,
      });
    },
  });
}

export function useUpdateBookLoan() {
  const queryClient = useQueryClient();
  const addToast = useUIStore((state) => state.addToast);

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateBookLoanDTO }) =>
      bookLoanService.update(id, data),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["book-loans"] });
      addToast({
        type: "success",
        title: "Berhasil",
        message: response.message || "Status peminjaman diperbarui",
      });
    },
    onError: (error) => {
      addToast({
        type: "error",
        title: "Gagal",
        message: error instanceof Error ? error.message : "Gagal memperbarui peminjaman",
        duration: 8000,
      });
    },
  });
}

export function useDeleteBookLoan() {
  const queryClient = useQueryClient();
  const addToast = useUIStore((state) => state.addToast);

  return useMutation({
    mutationFn: (id: string) => bookLoanService.delete(id),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["book-loans"] });
      addToast({
        type: "success",
        title: "Dihapus",
        message: response.message || "Catatan peminjaman dihapus",
      });
    },
    onError: (error) => {
      addToast({
        type: "error",
        title: "Gagal",
        message: error instanceof Error ? error.message : "Gagal menghapus",
        duration: 8000,
      });
    },
  });
}

// Special mutation untuk pengembalian (shortcut)
export function useReturnBook() {
  const queryClient = useQueryClient();
  const addToast = useUIStore((state) => state.addToast);

  return useMutation({
    mutationFn: ({ id, notes }: { id: string; notes?: string }) =>
      bookLoanService.returnBook(id, notes),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["book-loans"] });
      addToast({
        type: "success",
        title: "Dikembalikan",
        message: response.message || "Buku berhasil dikembalikan",
      });
    },
    onError: (error) => {
      addToast({
        type: "error",
        title: "Gagal",
        message: error instanceof Error ? error.message : "Gagal mengembalikan buku",
        duration: 8000,
      });
    },
  });
}
