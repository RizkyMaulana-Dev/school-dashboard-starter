// src/features/attendance/components/AttendanceRecordList.tsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Table, Badge, Input, Select, LoadingScreen, Button } from "@/components/ui";
import { ErrorMessage, EmptyState } from "@/components/feedback";
import { Pagination } from "@/components/ui/Pagination";
import { useAttendanceRecords } from "../hooks/useAttendanceRecords";
import { usePagination, useDebounce } from "@/hooks";
import { ROUTE_PATHS } from "@/routes/route-paths";
import { formatAttendanceStatus, formatDate } from "@/utils/formatters";

export default function AttendanceRecordList() {
    const navigate = useNavigate();
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("");
    const debouncedSearch = useDebounce(search, 500);

    const { page, limit, sortBy, sortOrder, queryParams, setSortBy, setPage, setTotalItems } =
        usePagination();

    const { data, isLoading, isError, error, refetch } = useAttendanceRecords({
        ...queryParams,
        search: debouncedSearch || undefined,
        ...(statusFilter && { status: statusFilter }),
    });

    // Reset halaman saat filter berubah
    useEffect(() => {
        setPage(1);
    }, [debouncedSearch, statusFilter, setPage]);

    // Sinkronkan total dari meta
    useEffect(() => {
        if (data?.meta?.total !== undefined) {
            setTotalItems(data.meta.total);
        }
    }, [data?.meta?.total, setTotalItems]);

    const columns = [
        {
            key: "session",
            header: "Sesi",
            render: (record: any) => (
                <div>
                    <p className="font-medium text-gray-900">{record.session?.title ?? "-"}</p>
                    <p className="text-sm text-gray-500">
                        {record.session?.date ? formatDate(record.session.date) : ""}
                    </p>
                </div>
            ),
        },
        {
            key: "class",
            header: "Kelas",
            render: (record: any) => record.session?.class?.name ?? "-",
        },
        {
            key: "student",
            header: "Siswa",
            render: (record: any) => <span className="font-medium">{record.student?.name ?? "-"}</span>,
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
        {
            key: "actions",
            header: "Aksi",
            align: "center" as const,
            render: (s: any) => (
                <Button
                    size="sm"
                    variant="ghost"
                    onClick={(e) => {
                        e.stopPropagation();
                        navigate(ROUTE_PATHS.ATTENDANCE_RECORD_EDIT.replace(":id", s.id));
                    }}
                >
                    Edit
                </Button>
            ),
        },
    ];

    if (isLoading && !data) return <LoadingScreen />;
    if (isError)
        return (
            <ErrorMessage title="Gagal memuat data presensi" message={error?.message} onRetry={refetch} />
        );

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-900">Rekap Kehadiran</h1>
            </div>

            <div className="flex gap-4 items-center">
                <Input
                    placeholder="Cari siswa atau sesi..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="max-w-md text-black"
                />
                <Select
                    options={[
                        { value: "", label: "Semua Status" },
                        { value: "PRESENT", label: "Hadir" },
                        { value: "ABSENT", label: "Tidak Hadir" },
                        { value: "LATE", label: "Terlambat" },
                        { value: "EXCUSED", label: "Izin" },
                    ]}
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="w-48 text-black"
                />
            </div>

            {data?.data.length === 0 ? (
                <EmptyState title="Belum ada data kehadiran" />
            ) : (
                <Table
                    columns={columns}
                    data={data?.data || []}
                    keyExtractor={(record) => record.id}
                    sortBy={sortBy}
                    sortOrder={sortOrder}
                    onSort={setSortBy}
                    onRowClick={(user) =>
                        navigate(ROUTE_PATHS.ATTENDANCE_RECORDS_DETAIL.replace(":id", user.id))
                    }
                />
            )}

            <Pagination
                page={page}
                totalPages={data?.meta?.totalPages ?? 1}
                total={data?.meta?.total ?? 0}
                limit={limit}
                onPageChange={setPage}
            />
        </div>
    );
}
