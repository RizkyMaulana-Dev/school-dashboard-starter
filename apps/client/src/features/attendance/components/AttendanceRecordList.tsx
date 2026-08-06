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

<<<<<<< Updated upstream
    // Reset halaman saat filter berubah
=======
>>>>>>> Stashed changes
    useEffect(() => {
        setPage(1);
    }, [debouncedSearch, statusFilter, setPage]);

    // Sinkronkan total dari meta
    useEffect(() => {
        if (data?.meta?.total !== undefined) {
            setTotalItems(data.meta.total);
        }
    }, [data?.meta?.total, setTotalItems]);

<<<<<<< Updated upstream
=======
    const filterOptions: FilterOption[] = useMemo(() => {
        if (!data?.data) return [];

        const sessions = Array.from(
            new Set(data.data.map((r) => r.session?.title).filter(Boolean))
        ).sort() as string[];

        const classes = Array.from(
            new Set(data.data.map((r) => r.session?.class?.name).filter(Boolean))
        ).sort() as string[];

        const options: FilterOption[] = [
            {
                key: "status",
                label: "Status",
                type: "select",
                options: [
                    { value: "", label: "Semua" },
                    { value: "PRESENT", label: "Hadir" },
                    { value: "ABSENT", label: "Tidak Hadir" },
                    { value: "LATE", label: "Terlambat" },
                    { value: "EXCUSED", label: "Izin" },
                ],
                placeholder: "Semua Status",
            },
        ];

        if (sessions.length > 0) {
            options.push({
                key: "sessionTitle",
                label: "Sesi",
                type: "select",
                options: [{ value: "", label: "Semua" }, ...sessions.map((s) => ({ value: s, label: s }))],
                placeholder: "Semua Sesi",
            });
        }

        if (classes.length > 0) {
            options.push({
                key: "class",
                label: "Kelas",
                type: "select",
                options: [{ value: "", label: "Semua" }, ...classes.map((c) => ({ value: c, label: c }))],
                placeholder: "Semua Kelas",
            });
        }

        return options;
    }, [data?.data]);

    const groupByOptions = [
        { value: "", label: "Tidak Dikelompokkan" },
        { value: "status", label: "Status" },
        { value: "sessionTitle", label: "Sesi" },
        { value: "className", label: "Kelas" },
    ];

    const transformedData = useMemo(() => {
        if (!data?.data) return [];
        let result = data.data.map((r) => ({
            ...r,
            sessionTitle: r.session?.title ?? "Tanpa Sesi",
            className: r.session?.class?.name ?? "Tanpa Kelas",
            statusLabel: formatAttendanceStatus(r.status),
        }));

        if (filterValues.status) {
            result = result.filter((r) => r.status === filterValues.status);
        }
        if (filterValues.sessionTitle) {
            result = result.filter((r) => r.sessionTitle === filterValues.sessionTitle);
        }
        if (filterValues.class) {
            result = result.filter((r) => r.className === filterValues.class);
        }

        return result;
    }, [data?.data, filterValues]);

>>>>>>> Stashed changes
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

<<<<<<< Updated upstream
=======
    const renderGridItem = (r: any) => (
        <div className="space-y-2 text-black">
            <h3 className="font-semibold text-black">{r.student?.name ?? "-"}</h3>
            <p className="text-sm text-black">Sesi: {r.session?.title ?? "-"}</p>
            <p className="text-sm text-black">Kelas: {r.session?.class?.name ?? "-"}</p>
            <p className="text-sm text-black">Tanggal: {r.session?.date ? formatDate(r.session.date) : ""}</p>
            <Badge
                variant={
                    r.status === "PRESENT" ? "success" : r.status === "ABSENT" ? "error" : r.status === "LATE" ? "warning" : "info"
                }
            >
                {formatAttendanceStatus(r.status)}
            </Badge>
        </div>
    );

>>>>>>> Stashed changes
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

<<<<<<< Updated upstream
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
=======
            <DataView<any>
                columns={columns}
                data={transformedData}
                keyExtractor={(r) => r.id}
                isLoading={isLoading}
                emptyMessage="Belum ada data kehadiran"
                sortBy={sortBy}
                sortOrder={sortOrder}
                onSort={setSortBy}
                filters={filterOptions}
                onFilterChange={setFilterValues}
                onResetFilter={() => setFilterValues({})}
                renderGridItem={renderGridItem}
                defaultViewMode="table"
                onRowClick={(r) => navigate(ROUTE_PATHS.ATTENDANCE_RECORDS_DETAIL.replace(":id", r.id))}
                searchValue={search}
                onSearchChange={setSearch}
                searchPlaceholder="Cari siswa atau sesi..."
                groupBy={groupBy}
                groupByOptions={groupByOptions}
                onGroupByChange={setGroupBy}
            />
>>>>>>> Stashed changes

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
