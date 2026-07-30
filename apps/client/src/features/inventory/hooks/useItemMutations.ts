import { useMutation, useQueryClient } from "@tanstack/react-query";
import { itemService } from "@/services/item.service";
import { useUIStore } from "@/stores/ui.store";
import type { CreateItemDTO, UpdateItemDTO } from "@/types/entities";

export function useCreateItem() {
  const queryClient = useQueryClient();
  const addToast = useUIStore((state) => state.addToast);
  return useMutation({
    mutationFn: (data: CreateItemDTO) => itemService.create(data),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["items"] });
      addToast({
        type: "success",
        title: "Berhasil",
        message: response.message || "Barang ditambahkan",
      });
    },
    onError: (error: Error) => addToast({ type: "error", title: "Gagal", message: error.message }),
  });
}

export function useUpdateItem() {
  const queryClient = useQueryClient();
  const addToast = useUIStore((state) => state.addToast);
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateItemDTO }) => itemService.update(id, data),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["items"] });
      addToast({ type: "success", title: "Barang diperbarui", message: response.message });
    },
    onError: (error: Error) => addToast({ type: "error", title: "Gagal", message: error.message }),
  });
}

export function useDeleteItem() {
  const queryClient = useQueryClient();
  const addToast = useUIStore((state) => state.addToast);
  return useMutation({
    mutationFn: (id: string) => itemService.delete(id),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["items"] });
      addToast({ type: "success", title: "Barang dihapus", message: response.message });
    },
    onError: (error: Error) => addToast({ type: "error", title: "Gagal", message: error.message }),
  });
}
