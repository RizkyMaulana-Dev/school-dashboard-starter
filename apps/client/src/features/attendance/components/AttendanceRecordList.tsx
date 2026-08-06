// src/features/attendance/components/AttendanceRecordList.tsx
import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { DataView } from "@/components/ui/DataView";
import type { FilterOption } from "@/components/ui/DataView";
import { Badge, LoadingScreen, Button } from "@/components/ui";
import { ErrorMessage } from "@/components/feedback";
import { Pagination } from "@/components/ui/Pagination";
import { useAttendanceRecords } from "../hooks/useAttendanceRecords";
import { usePagination, useDebounce } from "@/hooks";
import { ROUTE_PATHS } from "@/routes/route-paths";
import { formatAttendanceStatus, formatDate } from "@/utils/formatters";

export default function AttendanceRecordList() {
    const navigate = useNavigate();
    const [search, setSearch] = useState("");
    const [filterValues, setFilterValues] = useState<Record<string, string>>({});
    const [groupBy, setGroupBy] = useState<string>("");

    const debouncedSearch = useDebounce(search, 500);
    const { page, limit, sortBy, sortOrder, queryParams, setSortBy, setPage, setTotalItems } =
        usePagination();

    const { data, isLoading, isError, error, refetch } = useAttendanceRecords({
        ...queryParams,
        search: debouncedSearch || undefined,
        ...filterValues,
    });

    useEffect(() => {
        setPage(1);
    }, [debouncedSearch, filterValues, setPage]);

    useEffect(() => {
        if (data?.meta?.total !== undefined) {
            setTotalItems(data.meta.total);
        }
    }, [data?.meta?.total, setTotalItems]);

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

    const columns = [
        {
            key: "session",
            header: "Sesi",
            render: (r: any) => (
                <div>
                    <p className="font-medium text-black">{r.session?.title ?? "-"}</p>
                    <p className="text-sm text-black">
                        {r.session?.date ? formatDate(r.session.date) : ""}
                    </p>
                </div>
            ),
        },
        {
            key: "class",
            header: "Kelas",
            render: (r: any) => <span className="text-black">{r.session?.class?.name ?? "-"}</span>,
        },
        {
            key: "student",
            header: "Siswa",
            render: (r: any) => <span className="font-medium text-black">{r.student?.name ?? "-"}</span>,
        },
        {
            key: "status",
            header: "Status",
            align: "center" as const,
            render: (r: any) => (
                <Badge
                    variant={
                        r.status === "PRESENT"
                            ? "success"
                            : r.status === "ABSENT"
                                ? "error"
                                : r.status === "LATE"
                                    ? "warning"
                                    : "info"
                    }
                >
                    {formatAttendanceStatus(r.status)}
                </Badge>
            ),
        },
        {
            key: "notes",
            header: "Catatan",
            render: (r: any) => <span className="text-black">{r.notes || "-"}</span>,
        },
        {
            key: "actions",
            header: "Aksi",
            align: "center" as const,
            render: (r: any) => (
                <div className="flex gap-2 justify-center">
                    <Button
                        size="sm"
                        variant="ghost"
                        onClick={(e) => {
                            e.stopPropagation();
                            navigate(ROUTE_PATHS.ATTENDANCE_RECORD_EDIT.replace(":id", r.id));
                        }}
                    >
                        Edit
                    </Button>
                </div>
            ),
        },
    ];

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

    if (isLoading && !data) return <LoadingScreen />;
    if (isError)
        return (
            <ErrorMessage title="Gagal memuat data presensi" message={error?.message} onRetry={refetch} />
        );

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-black">Rekap Kehadiran</h1>
            </div>

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