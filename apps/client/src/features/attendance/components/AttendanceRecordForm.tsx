// src/features/attendance/components/AttendanceRecordForm.tsx
import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Select, Button, LoadingScreen, Input } from "@/components/ui";
import { ErrorMessage } from "@/components/feedback";
import { useAttendanceRecordDetail } from "../hooks/useAttendanceRecords";
import { useUpdateAttendanceRecord } from "../hooks/useAttendanceMutations";
import {
  attendanceRecordEditSchema,
  type AttendanceRecordEditFormData,
} from "@/lib/validations/attendance.schema";
import { formatDate } from "@/utils/formatters";
import { ROUTE_PATHS } from "@/routes/route-paths";

export default function AttendanceRecordForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const {
    data: recordData,
    isLoading: loadingRecord,
    isError,
    error,
    refetch,
  } = useAttendanceRecordDetail(id);
  const record = recordData?.data;

  const updateMutation = useUpdateAttendanceRecord();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AttendanceRecordEditFormData>({
    resolver: zodResolver(attendanceRecordEditSchema),
    defaultValues: {
      status: "PRESENT",
      notes: "",
    },
  });

  useEffect(() => {
    if (record) {
      reset({
        status: record.status,
        notes: record.notes ?? "",
      });
    }
  }, [record, reset]);

  const onSubmit = (data: AttendanceRecordEditFormData) => {
    if (!id) return;
    updateMutation.mutate(
      { id, data },
      { onSuccess: () => navigate(ROUTE_PATHS.ATTENDANCE_RECORDS) },
    );
  };

  if (loadingRecord) return <LoadingScreen />;
  if (isError)
    return <ErrorMessage title="Gagal memuat data" message={error?.message} onRetry={refetch} />;
  if (!record) return <ErrorMessage title="Data tidak ditemukan" />;

  // Gunakan session dari respons terbaru (jika ada), fallback ke attendanceSession
  const session = record.session || record.attendanceSession;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Edit Kehadiran</h1>
        <p className="text-sm text-gray-500 mt-1">Perbarui status kehadiran siswa</p>
      </div>

      <div className="bg-white shadow rounded-lg p-6 space-y-3">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-500">Sesi</span>
            <p className="font-medium text-gray-900">{session?.title ?? "-"}</p>
          </div>
          <div>
            <span className="text-gray-500">Tanggal</span>
            <p className="font-medium text-gray-900">
              {session?.date ? formatDate(session.date) : "-"}
            </p>
          </div>
          <div>
            <span className="text-gray-500">Kelas</span>
            <p className="font-medium text-gray-900">{session?.class?.name ?? "-"}</p>
          </div>
          <div>
            <span className="text-gray-500">Siswa</span>
            <p className="font-medium text-gray-900">{record.student?.name ?? "-"}</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="bg-white shadow rounded-lg p-6 space-y-4">
        <Select
          className="text-black"
          label="Status"
          options={[
            { value: "PRESENT", label: "Hadir" },
            { value: "ABSENT", label: "Tidak Hadir" },
            { value: "LATE", label: "Terlambat" },
            { value: "EXCUSED", label: "Izin" },
          ]}
          {...register("status")}
          error={errors.status?.message}
          disabled={updateMutation.isPending}
        />

        <Input
          className="text-black"
          label="Catatan"
          placeholder="Tambahkan catatan..."
          {...register("notes")}
          error={errors.notes?.message}
          disabled={updateMutation.isPending}
        />

        <div className="flex justify-end gap-3 pt-4">
          <Button
            variant="ghost"
            type="button"
            onClick={() => navigate(ROUTE_PATHS.ATTENDANCE_RECORDS)}
            disabled={updateMutation.isPending}
          >
            Batal
          </Button>
          <Button type="submit" isLoading={updateMutation.isPending}>
            Simpan Perubahan
          </Button>
        </div>
      </form>
    </div>
  );
}
