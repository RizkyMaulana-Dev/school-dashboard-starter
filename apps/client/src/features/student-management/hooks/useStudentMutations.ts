import { useMutation, useQueryClient } from "@tanstack/react-query";
import { studentService } from "@/services/student.service";
import { useUIStore } from "@/stores/ui.store";
import type { CreateStudentDTO, UpdateStudentDTO } from "@/types/entities";

export function useCreateStudent() {
  const qc = useQueryClient();
  const addToast = useUIStore((s) => s.addToast);
  return useMutation({
    mutationFn: (data: CreateStudentDTO) => studentService.create(data),
    onSuccess: (res) => {
      qc.invalidateQueries({ queryKey: ["students"] });
      addToast({ type: "success", title: "Siswa dibuat", message: res.message });
    },
    onError: (err) => addToast({ type: "error", title: "Gagal", message: err.message }),
  });
}

export function useUpdateStudent() {
  const qc = useQueryClient();
  const addToast = useUIStore((s) => s.addToast);
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateStudentDTO }) =>
      studentService.update(id, data),
    onSuccess: (res) => {
      qc.invalidateQueries({ queryKey: ["students"] });
      addToast({ type: "success", title: "Siswa diupdate", message: res.message });
    },
    onError: (err) => addToast({ type: "error", title: "Gagal", message: err.message }),
  });
}

export function useDeleteStudent() {
  const qc = useQueryClient();
  const addToast = useUIStore((s) => s.addToast);
  return useMutation({
    mutationFn: (id: string) => studentService.delete(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["students"] });
      addToast({ type: "success", title: "Siswa dihapus" });
    },
    onError: (err) => addToast({ type: "error", title: "Gagal", message: err.message }),
  });
}
