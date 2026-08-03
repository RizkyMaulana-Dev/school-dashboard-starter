import { useMutation, useQueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios"; // 👈 Import Axios Error Checker
import { studentService } from "@/services/student.service";
import { useUIStore } from "@/stores/ui.store";
import type { CreateStudentDTO, UpdateStudentDTO } from "@/types/entities";

// 🔹 Helper untuk membongkar pesan dari Backend
const getErrorMessage = (error: unknown, defaultMessage: string): string => {
  if (isAxiosError(error)) {
    // Ambil pesan dari backend, jika kosong pakai bawaan Axios
    return error.response?.data?.message || error.message;
  }
  if (error instanceof Error) {
    return error.message;
  }
  return defaultMessage;
};

export function useCreateStudent() {
  const qc = useQueryClient();
  const addToast = useUIStore((s) => s.addToast);
  
  return useMutation({
    mutationFn: (data: CreateStudentDTO) => studentService.create(data),
    onSuccess: (res) => {
      qc.invalidateQueries({ queryKey: ["students"] });
      addToast({ type: "success", title: "Siswa dibuat", message: res.message });
    },
    // 👈 Gunakan helper di sini
    onError: (err) => addToast({ 
      type: "error", 
      title: "Gagal", 
      message: getErrorMessage(err, "Gagal membuat siswa") 
    }),
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
    // 👈 Gunakan helper di sini
    onError: (err) => addToast({ 
      type: "error", 
      title: "Gagal", 
      message: getErrorMessage(err, "Gagal mengupdate siswa") 
    }),
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
    // 👈 Gunakan helper di sini
    onError: (err) => addToast({ 
      type: "error", 
      title: "Gagal", 
      message: getErrorMessage(err, "Gagal menghapus siswa") 
    }),
  });
}