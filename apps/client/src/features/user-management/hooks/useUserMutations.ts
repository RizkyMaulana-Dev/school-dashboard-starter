import { useMutation, useQueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios"; // 👈 Import ini
import { userService } from "@/services/user.service";
import { useUIStore } from "@/stores/ui.store";
import type { CreateUserDTO, UpdateUserDTO } from "@/types/entities";

// 🔹 Helper untuk mengekstrak pesan dari backend
const getErrorMessage = (error: unknown, defaultMessage: string): string => {
  if (isAxiosError(error)) {
    // Ambil pesan dari backend, jika tidak ada baru pakai default Axios
    return error.response?.data?.message || error.message;
  }
  if (error instanceof Error) {
    return error.message;
  }
  return defaultMessage;
};

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
        // 👈 Gunakan helper di sini
        message: getErrorMessage(error, "Gagal membuat user"),
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
        // 👈 Gunakan helper di sini
        message: getErrorMessage(error, "Gagal mengupdate user"),
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
        // 👈 Gunakan helper di sini
        message: getErrorMessage(error, "Gagal menghapus user"),
        duration: 8000,
      });
    },
  });
}