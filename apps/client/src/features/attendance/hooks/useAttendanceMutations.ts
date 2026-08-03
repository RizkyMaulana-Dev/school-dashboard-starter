import { useMutation, useQueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios"; // 👈 Import ini untuk mengecek error Axios
import { attendanceSessionService } from "@/services/attendance-session.service";
import { attendanceService } from "@/services/attendance.service";
import { useUIStore } from "@/stores/ui.store";
import type {
  CreateAttendanceSessionDTO,
  UpdateAttendanceSessionDTO,
  CreateAttendanceRecordDTO,
  UpdateAttendanceRecordDTO,
} from "@/types/entities";

// 🔹 Fungsi pembantu untuk membongkar pesan dari Backend
const getErrorMessage = (error: unknown): string => {
  if (isAxiosError(error)) {
    return error.response?.data?.message || error.message;
  }
  if (error instanceof Error) {
    return error.message;
  }
  return "Terjadi kesalahan yang tidak terduga";
};

export function useCreateSession() {
  const qc = useQueryClient();
  const addToast = useUIStore((s) => s.addToast);
  return useMutation({
    mutationFn: (data: CreateAttendanceSessionDTO) => attendanceSessionService.create(data),
    onSuccess: (res) => {
      qc.invalidateQueries({ queryKey: ["attendance-sessions"] });
      addToast({ type: "success", title: "Sesi dibuat", message: res.message });
    },
    // 👈 Gunakan getErrorMessage di sini
    onError: (err) => addToast({ type: "error", title: "Gagal", message: getErrorMessage(err) }),
  });
}

export function useUpdateSession() {
  const qc = useQueryClient();
  const addToast = useUIStore((s) => s.addToast);
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateAttendanceSessionDTO }) =>
      attendanceSessionService.update(id, data),
    onSuccess: (res) => {
      qc.invalidateQueries({ queryKey: ["attendance-sessions"] });
      addToast({ type: "success", title: "Sesi diupdate", message: res.message });
    },
    // 👈 Gunakan getErrorMessage di sini
    onError: (err) => addToast({ type: "error", title: "Gagal", message: getErrorMessage(err) }),
  });
}

export function useDeleteSession() {
  const qc = useQueryClient();
  const addToast = useUIStore((s) => s.addToast);
  return useMutation({
    mutationFn: (id: string) => attendanceSessionService.delete(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["attendance-sessions"] });
      addToast({ type: "success", title: "Sesi dihapus" });
    },
    // 👈 Gunakan getErrorMessage di sini
    onError: (err) => addToast({ type: "error", title: "Gagal", message: getErrorMessage(err) }),
  });
}

export function useUpdateAttendanceRecord() {
  const queryClient = useQueryClient();
  const addToast = useUIStore((s) => s.addToast);
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateAttendanceRecordDTO }) =>
      attendanceService.update(id, data),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["attendance-records"] });
      addToast({
        type: "success",
        title: "Berhasil",
        message: response.message || "Kehadiran diperbarui",
      });
    },
    // 👈 Gunakan getErrorMessage di sini
    onError: (err) => addToast({ type: "error", title: "Gagal", message: getErrorMessage(err) }),
  });
}

export function useCreateAttendanceRecord() {
  const qc = useQueryClient();
  const addToast = useUIStore((s) => s.addToast);
  return useMutation({
    mutationFn: (data: CreateAttendanceRecordDTO) => attendanceService.create(data),
    onSuccess: (res) => {
      qc.invalidateQueries({ queryKey: ["attendance-records"] });
      addToast({ type: "success", title: "Kehadiran dicatat", message: res.message });
    },
    // 👈 Gunakan getErrorMessage di sini
    onError: (err) => addToast({ type: "error", title: "Gagal", message: getErrorMessage(err) }),
  });
}