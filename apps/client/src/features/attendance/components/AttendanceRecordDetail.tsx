import { useParams, Link } from "react-router-dom";
import { useAttendanceRecordDetail } from "../hooks/useAttendanceRecords";
import { LoadingScreen, Badge, Button, Table } from "@/components/ui";
import { ErrorMessage } from "@/components/feedback";
import { formatAttendanceStatus, formatDate } from "@/utils/formatters";
import { ROUTE_PATHS } from "@/routes/route-paths";

export default function AttendanceRecordDetail() {
    const { id } = useParams<{ id: string }>();
    const { data: recordData, isLoading, isError, error, refetch } = useAttendanceRecordDetail(id);
    const record = recordData?.data;

    if (isLoading) return <LoadingScreen />;
    if (isError) return <ErrorMessage title="Gagal memuat data" message={error?.message} onRetry={refetch} />;
    if (!record) return <ErrorMessage title="Data tidak ditemukan" />;

    // Sesi dari respons backend terbaru (session) atau fallback ke attendanceSession
    const session = record.session || record.attendanceSession;
    console.log(session)

    // 1. Definisikan kolom untuk tabel (Kiri: Label, Kanan: Value)
    const columns = [
        {
            key: "label",
            header: "Informasi",
            render: (item: any) => <span className="font-medium text-gray-500">{item.label}</span>,
        },
        {
            key: "value",
            header: "Detail",
            render: (item: any) => <div className="text-gray-900 font-medium">{item.value}</div>,
        },
    ];

    // 2. Ubah data tunggal menjadi format array (baris) agar bisa dibaca oleh komponen Table
    const tableData = [
        {
            id: "status",
            label: "Status",
            value: (
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
            ),
        },
        {
            id: "recordedAt",
            label: "Direkam Pada",
            value: record.recordedAt ? formatDate(record.recordedAt) : "-",
        },
        {
            id: "notes",
            label: "Catatan",
            value: record.notes || "-",
        },
        {
            id: "sessionTitle",
            label: "Judul Sesi",
            value: session?.title ? (<Link to={ROUTE_PATHS.ATTENDANCE_SESSION_DETAIL.replace(":id", session?.id)} className="text-blue-600 hover:underline">
                {session?.title}
            </Link>) : (
                "-"
            ),
        },
        {
            id: "sessionDate",
            label: "Tanggal Sesi",
            value: session?.date ? formatDate(session.date) : "-",
        },
        {
            id: "sessionClass",
            label: "Kelas",
            value: session?.class?.name ? (
                <Link
                    to={ROUTE_PATHS.CLASS_DETAIL.replace(":id", session.class.id)}
                    className="text-blue-600 hover:underline"
                >
                    {session.class.name}
                </Link>
            ) : (
                "-"
            ),
        },
        {
            id: "studentName",
            label: "Nama Siswa",
            value: record.student ? (
                <Link
                    to={ROUTE_PATHS.STUDENT_DETAIL.replace(":id", record.student.id)}
                    className="text-blue-600 hover:underline"
                >
                    {record.student.name}
                </Link>
            ) : (
                "-"
            ),
        },
    ];

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

            <div className="bg-white shadow rounded-lg p-6">
                {/* Render komponen Table yang sudah ada */}
                <Table
                    columns={columns}
                    data={tableData}
                    keyExtractor={(item) => item.id}
                />
            </div>
        </div>
    );
}