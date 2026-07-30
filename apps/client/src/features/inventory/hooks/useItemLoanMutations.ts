import { useMutation, useQueryClient } from "@tanstack/react-query";
import { itemLoanService } from "@/services/item-loan.service";
import { useUIStore } from "@/stores/ui.store";
import type { CreateItemLoanDTO, UpdateItemLoanDTO } from "@/types/entities";

export function useCreateItemLoan() {
  const queryClient = useQueryClient();
  const addToast = useUIStore((state) => state.addToast);
  return useMutation({
    mutationFn: (data: CreateItemLoanDTO) => itemLoanService.create(data),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["item-loans"] });
      addToast({ type: "success", title: "Peminjaman dicatat", message: response.message });
    },
    onError: (error: Error) => addToast({ type: "error", title: "Gagal", message: error.message }),
  });
}

export function useUpdateItemLoan() {
  const queryClient = useQueryClient();
  const addToast = useUIStore((state) => state.addToast);
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateItemLoanDTO }) =>
      itemLoanService.update(id, data),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["item-loans"] });
      addToast({ type: "success", title: "Peminjaman diperbarui", message: response.message });
    },
    onError: (error: Error) => addToast({ type: "error", title: "Gagal", message: error.message }),
  });
}

export function useDeleteItemLoan() {
  const queryClient = useQueryClient();
  const addToast = useUIStore((state) => state.addToast);
  return useMutation({
    mutationFn: (id: string) => itemLoanService.delete(id),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["item-loans"] });
      addToast({ type: "success", title: "Peminjaman dihapus", message: response.message });
    },
    onError: (error: Error) => addToast({ type: "error", title: "Gagal", message: error.message }),
  });
}

// Special mutation untuk pengembalian
export function useReturnItem() {
  const queryClient = useQueryClient();
  const addToast = useUIStore((state) => state.addToast);
  return useMutation({
    mutationFn: ({ id, notes }: { id: string; notes?: string }) =>
      itemLoanService.returnItem(id, notes),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["item-loans"] });
      addToast({ type: "success", title: "Barang dikembalikan", message: response.message });
    },
    onError: (error: Error) => addToast({ type: "error", title: "Gagal", message: error.message }),
  });
}
