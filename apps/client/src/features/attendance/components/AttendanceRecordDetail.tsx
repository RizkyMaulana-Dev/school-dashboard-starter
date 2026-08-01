// src/features/attendance/components/AttendanceRecordDetail.tsx

import { useParams, Link } from "react-router-dom";
import { useAttendanceRecordDetail } from "../hooks/useAttendanceRecords";
import { LoadingScreen, Badge, Button } from "@/components/ui";
import { ErrorMessage } from "@/components/feedback";
import { formatAttendanceStatus, formatDate } from "@/utils/formatters";
import { ROUTE_PATHS } from "@/routes/route-paths";

export default function AttendanceRecordDetail() {
  const { id } = useParams<{ id: string }>();
  const { data: recordData, isLoading, isError, error, refetch } = useAttendanceRecordDetail(id);
  const record = recordData?.data;

  if (isLoading) return <LoadingScreen />;
  if (isError)
    return <ErrorMessage title="Gagal memuat data" message={error?.message} onRetry={refetch} />;
  if (!record) return <ErrorMessage title="Data tidak ditemukan" />;

  // Sesi dari respons backend terbaru (session) atau fallback ke attendanceSession
  const session = record.session || record.attendanceSession;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Detail Kehadiran</h1>
        <Link to={`/app/attendance/records/${record.id}/edit`}>
          <Button size="sm" variant="outline">
            Edit
          </Button>
        </Link>
      </div>

      <div className="bg-white shadow rounded-lg divide-y">
        {/* Informasi Utama */}
        <div className="p-6">
          <h2 className="text-lg font-semibold mb-4 text-gray-900">Informasi Kehadiran</h2>
          <dl className="grid grid-cols-2 gap-4">
            <div>
              <dt className="text-sm text-gray-500">Status</dt>
              <dd>
                <Badge
                  variant={
                    record.status === "PRESENT"
                      ? "success"
                      : record.status === "ABSENT"
                        ? "error"
                        : record.status === "LATE"
                          ? "warning"
                          : "info"
                  }
                >
                  {formatAttendanceStatus(record.status)}
                </Badge>
              </dd>
            </div>
            <div>
              <dt className="text-sm text-gray-500">Direkam Pada</dt>
              <dd className="font-medium text-gray-900">
                {record.recordedAt ? formatDate(record.recordedAt) : "-"}
              </dd>
            </div>
            <div className="col-span-2">
              <dt className="text-sm text-gray-500">Catatan</dt>
              <dd className="font-medium text-gray-900">{record.notes || "-"}</dd>
            </div>
          </dl>
        </div>

        {/* Data Sesi */}
        {session && (
          <div className="p-6">
            <h2 className="text-lg font-semibold mb-4 text-gray-900">Sesi</h2>
            <dl className="grid grid-cols-2 gap-4">
              <div>
                <dt className="text-sm text-gray-500">Judul Sesi</dt>
                <dd className="font-medium text-gray-900">{session.title}</dd>
              </div>
              <div>
                <dt className="text-sm text-gray-500">Tanggal</dt>
                <dd className="font-medium text-gray-900">
                  {session.date ? formatDate(session.date) : "-"}
                </dd>
              </div>
              <div>
                <dt className="text-sm text-gray-500">Kelas</dt>
                <dd className="font-medium text-gray-900">
                  {session.class?.name ? (
                    <Link
                      to={ROUTE_PATHS.CLASS_DETAIL.replace(":id", session.class.id)}
                      className="text-blue-600 hover:underline"
                    >
                      {session.class.name}
                    </Link>
                  ) : (
                    "-"
                  )}
                </dd>
              </div>
              <div>
                <dt className="text-sm text-gray-500">ID Sesi</dt>
                <dd className="text-sm text-gray-500">{session.id}</dd>
              </div>
            </dl>
          </div>
        )}

        {/* Data Siswa */}
        {record.student && (
          <div className="p-6">
            <h2 className="text-lg font-semibold mb-4 text-gray-900">Siswa</h2>
            <dl className="grid grid-cols-2 gap-4">
              <div>
                <dt className="text-sm text-gray-500">Nama</dt>
                <dd className="font-medium text-gray-900">
                  <Link
                    to={ROUTE_PATHS.STUDENT_DETAIL.replace(":id", record.student.id)}
                    className="text-blue-600 hover:underline"
                  >
                    {record.student.name}
                  </Link>
                </dd>
              </div>
              <div>
                <dt className="text-sm text-gray-500">ID Siswa</dt>
                <dd className="text-sm text-gray-500">{record.student.id}</dd>
              </div>
            </dl>
          </div>
        )}
      </div>
    </div>
  );
}
