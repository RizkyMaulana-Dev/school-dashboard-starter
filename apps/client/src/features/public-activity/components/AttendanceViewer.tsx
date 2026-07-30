import { useQuery } from "@tanstack/react-query";
import { attendanceService } from "@/services/attendance.service";
import { useCurrentStudent } from "../hooks/useCurrentStudent";
import { Table, LoadingScreen, Badge } from "@/components/ui";
import { ErrorMessage, EmptyState } from "@/components/feedback";
import { formatDate, formatAttendanceStatus } from "@/utils/formatters";
import type { AttendanceRecord } from "@/types/entities";

export default function AttendanceViewer() {
  const student = useCurrentStudent();

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["my-attendance", student?.id],
    queryFn: () => attendanceService.getByStudent(student!.id),
    enabled: !!student?.id,
  });

  if (!student) {
    return (
      <EmptyState
        title="Tidak ada data siswa"
        description="Akun Anda belum terhubung dengan data siswa. Hubungi administrator."
      />
    );
  }

  if (isLoading) return <LoadingScreen message="Memuat data kehadiran..." />;
  if (isError)
    return (
      <ErrorMessage
        title="Gagal memuat data kehadiran"
        message={error?.message}
        onRetry={refetch}
      />
    );

  const records = data?.data ?? [];

  const columns = [
    {
      key: "session",
      header: "Sesi",
      render: (record: AttendanceRecord) => (
        <div>
          <p className="font-medium">{record.attendanceSession?.title ?? "Tanpa Judul"}</p>
          <p className="text-sm text-gray-500">
            {record.attendanceSession?.date ? formatDate(record.attendanceSession.date) : "-"}
          </p>
        </div>
      ),
    },
    {
      key: "status",
      header: "Status",
      align: "center" as const,
      render: (record: AttendanceRecord) => {
        const variantMap: Record<string, "success" | "error" | "warning" | "info"> = {
          PRESENT: "success",
          ABSENT: "error",
          LATE: "warning",
          EXCUSED: "info",
        };
        return (
          <Badge variant={variantMap[record.status] ?? "default"}>
            {formatAttendanceStatus(record.status)}
          </Badge>
        );
      },
    },
    {
      key: "notes",
      header: "Catatan",
      render: (record: AttendanceRecord) => record.notes || "-",
    },
    {
      key: "recordedAt",
      header: "Direkam",
      render: (record: AttendanceRecord) => formatDate(record.recordedAt),
    },
  ];

  if (records.length === 0) {
    return (
      <EmptyState
        title="Belum ada catatan kehadiran"
        description="Anda belum memiliki riwayat presensi."
      />
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Riwayat Kehadiran</h2>
      <p className="text-sm text-gray-600">
        Menampilkan kehadiran Anda pada setiap sesi yang telah dilaksanakan.
      </p>
      <Table columns={columns} data={records} keyExtractor={(r) => r.id} />
    </div>
  );
}
