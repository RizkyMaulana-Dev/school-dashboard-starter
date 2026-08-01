import { useMutation, useQueryClient } from "@tanstack/react-query";
import { attendanceSessionService } from "@/services/attendance-session.service";
import { attendanceService } from "@/services/attendance.service";
import { useUIStore } from "@/stores/ui.store";
import type {
  CreateAttendanceSessionDTO,
  UpdateAttendanceSessionDTO,
  CreateAttendanceRecordDTO,
} from "@/types/entities";

import type { UpdateAttendanceRecordDTO } from "@/types/entities";

export function useCreateSession() {
  const qc = useQueryClient();
  const addToast = useUIStore((s) => s.addToast);
  return useMutation({
    mutationFn: (data: CreateAttendanceSessionDTO) => attendanceSessionService.create(data),
    onSuccess: (res) => {
      qc.invalidateQueries({ queryKey: ["attendance-sessions"] });
      addToast({ type: "success", title: "Sesi dibuat", message: res.message });
    },
    onError: (err) => addToast({ type: "error", title: "Gagal", message: err.message }),
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
    onError: (err) => addToast({ type: "error", title: "Gagal", message: err.message }),
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
    onError: (err) => addToast({ type: "error", title: "Gagal", message: err.message }),
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
    onError: (error) => addToast({ type: "error", title: "Gagal", message: error.message }),
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
    onError: (err) => addToast({ type: "error", title: "Gagal", message: err.message }),
  });
}
