import { useParams, Link } from "react-router-dom";
import { useSessionDetail } from "../hooks/useSessions";
import { useQuery } from "@tanstack/react-query";
import { attendanceService } from "@/services/attendance.service";
import { LoadingScreen, Badge, Button, Table } from "@/components/ui";
import { ErrorMessage } from "@/components/feedback";
import { formatAttendanceStatus } from "@/utils/formatters";
import { ROUTE_PATHS } from "@/routes/route-paths";

export default function SessionDetail() {
    const { id } = useParams<{ id: string }>();

    const { data: sessionData, isLoading, isError, error, refetch } = useSessionDetail(id);
    const session = sessionData?.data;

    const {
        data: recordsData,
        isLoading: recordsLoading,
        isError: recordsError,
    } = useQuery({
        queryKey: ["attendance-records", id],
        queryFn: () => attendanceService.getBySession(id!),
        enabled: !!id,
    });

    if (isLoading) return <LoadingScreen />;
    if (isError) return <ErrorMessage title="Gagal memuat sesi" message={error?.message} onRetry={refetch} />;
    if (!session) return <ErrorMessage title="Sesi tidak ditemukan" />;

    const records = recordsData?.data ?? [];

    const sessionColumns = [
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

    const sessionTableData = [
        {
            id: "date",
            label: "Tanggal",
            value: new Date(session.date).toLocaleDateString("id-ID"),
        },
        {
            id: "startTime",
            label: "Mulai",
            value: session.startTime
                ? new Date(session.startTime).toLocaleTimeString("id-ID", {
                    hour: "2-digit",
                    minute: "2-digit",
                })
                : "-",
        },
        {
            id: "endTime",
            label: "Selesai",
            value: session.endTime
                ? new Date(session.endTime).toLocaleTimeString("id-ID", {
                    hour: "2-digit",
                    minute: "2-digit",
                })
                : "-",
        },
        {
            id: "schoolClass",
            label: "Kelas",
            value: session.schoolClass?.name ?? "-",
        },
    ];

    const recordColumns = [
        {
            key: "studentName",
            header: "Nama Siswa",
            render: (record: any) => record.student?.name ?? "Siswa",
        },
        {
            key: "status",
            header: "Status",
            align: "center" as const,
            render: (record: any) => (
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
            key: "notes",
            header: "Catatan",
            render: (record: any) => record.notes || "-",
        },
    ];

    return (
        <div className="space-y-6 max-w-4xl mx-auto">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold !text-gray-900" style={{ color: "#111827" }}>
                    {session.title}
                </h1>
                <Link to={ROUTE_PATHS.ATTENDANCE_SESSION_EDIT.replace(":id", session.id)}>
                    <Button size="sm" variant="outline">Edit</Button>
                </Link>
            </div>

            <div className="bg-white shadow rounded-lg p-6">
                <h2 className="text-lg font-semibold mb-4 text-gray-900">Informasi Sesi</h2>
                <Table
                    columns={sessionColumns}
                    data={sessionTableData}
                    keyExtractor={(item) => item.id}
                />
            </div>

            <div className="bg-white shadow rounded-lg p-6">
                <h2 className="text-lg font-semibold mb-4 text-gray-900">Kehadiran ({records.length})</h2>

                {recordsLoading && <LoadingScreen />}
                {recordsError && <p className="text-red-500">Gagal memuat data kehadiran.</p>}
                {!recordsLoading && !recordsError && records.length === 0 && (
                    <p className="text-sm text-gray-500">Belum ada data kehadiran.</p>
                )}
                {!recordsLoading && !recordsError && records.length > 0 && (
                    <Table
                        columns={recordColumns}
                        data={records}
                        keyExtractor={(record: any) => record.id}
                    />
                )}
            </div>
        </div>
    );
}