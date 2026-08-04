import { useMutation, useQueryClient } from "@tanstack/react-query";
import { teacherService } from "@/services/teacher.service";
import { useUIStore } from "@/stores/ui.store";
import type { CreateTeacherDTO, UpdateTeacherDTO } from "@/types/entities";

// 🔥 Helper untuk mengambil pesan error dari response server
function getErrorMessage(error: any): string {
  return error?.response?.data?.message || error.message || "Terjadi kesalahan";
}

export function useCreateTeacher() {
  const qc = useQueryClient();
  const addToast = useUIStore((s) => s.addToast);
  return useMutation({
    mutationFn: (data: CreateTeacherDTO) => teacherService.create(data),
    onSuccess: (res) => {
      qc.invalidateQueries({ queryKey: ["teachers"] });
      addToast({ type: "success", title: "Guru dibuat", message: res.message });
    },
    onError: (err) =>
      addToast({ type: "error", title: "Gagal", message: getErrorMessage(err) }),
  });
}

export function useUpdateTeacher() {
  const qc = useQueryClient();
  const addToast = useUIStore((s) => s.addToast);
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateTeacherDTO }) =>
      teacherService.update(id, data),
    onSuccess: (res) => {
      qc.invalidateQueries({ queryKey: ["teachers"] });
      addToast({ type: "success", title: "Guru diupdate", message: res.message });
    },
    onError: (err) =>
      addToast({ type: "error", title: "Gagal", message: getErrorMessage(err) }),
  });
}

export function useDeleteTeacher() {
  const qc = useQueryClient();
  const addToast = useUIStore((s) => s.addToast);
  return useMutation({
    mutationFn: (id: string) => teacherService.delete(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["teachers"] });
      addToast({ type: "success", title: "Guru dihapus" });
    },
    onError: (err) =>
      addToast({ type: "error", title: "Gagal", message: getErrorMessage(err) }),
  });
}