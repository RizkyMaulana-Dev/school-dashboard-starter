import { useMutation, useQueryClient } from "@tanstack/react-query";
import { classService } from "@/services/class.service";
import { useUIStore } from "@/stores/ui.store";
import type { CreateSchoolClassDTO, UpdateSchoolClassDTO } from "@/types/entities";

export function useCreateClass() {
  const qc = useQueryClient();
  const addToast = useUIStore((s) => s.addToast);
  return useMutation({
    mutationFn: (data: CreateSchoolClassDTO) => classService.create(data),
    onSuccess: (res) => {
      qc.invalidateQueries({ queryKey: ["classes"] });
      addToast({ type: "success", title: "Kelas dibuat", message: res.message });
    },
    onError: (err) => addToast({ type: "error", title: "Gagal", message: err.message }),
  });
}

export function useUpdateClass() {
  const qc = useQueryClient();
  const addToast = useUIStore((s) => s.addToast);
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateSchoolClassDTO }) =>
      classService.update(id, data),
    onSuccess: (res) => {
      qc.invalidateQueries({ queryKey: ["classes"] });
      addToast({ type: "success", title: "Kelas diupdate", message: res.message });
    },
    onError: (err) => addToast({ type: "error", title: "Gagal", message: err.message }),
  });
}

export function useDeleteClass() {
  const qc = useQueryClient();
  const addToast = useUIStore((s) => s.addToast);
  return useMutation({
    mutationFn: (id: string) => classService.delete(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["classes"] });
      addToast({ type: "success", title: "Kelas dihapus" });
    },
    onError: (err) => addToast({ type: "error", title: "Gagal", message: err.message }),
  });
}
