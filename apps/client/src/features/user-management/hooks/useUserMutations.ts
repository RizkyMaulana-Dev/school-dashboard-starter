import { useMutation, useQueryClient } from "@tanstack/react-query";
import { userService } from "@/services/user.service";
import { useUIStore } from "@/stores/ui.store";
import type { CreateUserDTO, UpdateUserDTO } from "@/types/entities";

export function useCreateUser() {
  const queryClient = useQueryClient();
  const addToast = useUIStore((state) => state.addToast);

  return useMutation({
    mutationFn: (data: CreateUserDTO) => userService.create(data),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      addToast({
        type: "success",
        title: "Berhasil",
        message: response.message || "User berhasil dibuat",
      });
    },
    onError: (error) => {
      addToast({
        type: "error",
        title: "Gagal",
        message: error instanceof Error ? error.message : "Gagal membuat user",
        duration: 8000,
      });
    },
  });
}

export function useUpdateUser() {
  const queryClient = useQueryClient();
  const addToast = useUIStore((state) => state.addToast);

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateUserDTO }) => userService.update(id, data),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      addToast({
        type: "success",
        title: "Berhasil",
        message: response.message || "User berhasil diupdate",
      });
    },
    onError: (error) => {
      addToast({
        type: "error",
        title: "Gagal",
        message: error instanceof Error ? error.message : "Gagal mengupdate user",
        duration: 8000,
      });
    },
  });
}

export function useDeleteUser() {
  const queryClient = useQueryClient();
  const addToast = useUIStore((state) => state.addToast);

  return useMutation({
    mutationFn: (id: string) => userService.delete(id),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      addToast({
        type: "success",
        title: "Berhasil",
        message: response.message || "User berhasil dihapus",
      });
    },
    onError: (error) => {
      addToast({
        type: "error",
        title: "Gagal",
        message: error instanceof Error ? error.message : "Gagal menghapus user",
        duration: 8000,
      });
    },
  });
}
