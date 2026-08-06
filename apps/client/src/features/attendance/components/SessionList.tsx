import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { DataView } from "@/components/ui/DataView";
import type { FilterOption } from "@/components/ui/DataView";
import { Button, LoadingScreen } from "@/components/ui";
import { ConfirmDialog, ErrorMessage } from "@/components/feedback";
import { Pagination } from "@/components/ui/Pagination";
import { useSessions } from "../hooks/useSessions";
import { useDeleteSession } from "../hooks/useAttendanceMutations";
import { usePagination, useDebounce } from "@/hooks";
import { ROUTE_PATHS } from "@/routes/route-paths";
import type { AttendanceSession } from "@/types/entities";

export default function SessionList() {
    const navigate = useNavigate();
    const [search, setSearch] = useState("");
    const [deleteTarget, setDeleteTarget] = useState<AttendanceSession | null>(null);
    const [filterValues, setFilterValues] = useState<Record<string, string>>({});
    const [groupBy, setGroupBy] = useState<string>("");

    const debouncedSearch = useDebounce(search, 500);
    const { queryParams, limit, sortBy, sortOrder, setSortBy, page, setPage, setTotalItems } =
        usePagination();

    const { data, isLoading, isError, error, refetch } = useSessions({
        ...queryParams,
        search: debouncedSearch || undefined,
    });

    const deleteMutation = useDeleteSession();

    useEffect(() => {
        setPage(1);
    }, [debouncedSearch, filterValues, setPage]);

    useEffect(() => {
        if (data?.meta?.total !== undefined) {
            setTotalItems(data.meta.total);
        }
    }, [data?.meta?.total, setTotalItems]);

    // Filter options: extract unique class names and teacher names, guaranteeing strings
    const filterOptions: FilterOption[] = useMemo(() => {
        if (!data?.data) return [];
        const classes = Array.from(
            new Set(data.data.map((s) => s.schoolClass?.name ?? "Tanpa Kelas"))
        ).sort();
        const teachers = Array.from(
            new Set(data.data.map((s) => s.teacher?.name ?? "Tanpa Guru"))
        ).sort();

        return [
            {
                key: "class",
                label: "Kelas",
                type: "select",
                options: [{ value: "", label: "Semua" }, ...classes.map((c) => ({ value: c, label: c }))],
                placeholder: "Semua Kelas",
            },
            {
                key: "teacher",
                label: "Guru",
                type: "select",
                options: [{ value: "", label: "Semua" }, ...teachers.map((t) => ({ value: t, label: t }))],
                placeholder: "Semua Guru",
            },
        ];
    }, [data?.data]);

    // Group by keys correspond to transformed properties
    const groupByOptions = [
        { value: "", label: "Tidak Dikelompokkan" },
        { value: "className", label: "Kelas" },
        { value: "teacherName", label: "Guru" },
    ];

    // Transform data: add stable string properties for filtering & grouping
    const transformedData = useMemo(() => {
        if (!data?.data) return [];
        let result = data.data.map((s) => ({
            ...s,
            className: s.schoolClass?.name ?? "Tanpa Kelas",
            teacherName: s.teacher?.name ?? "Tanpa Guru",
        }));

        // Client‑side filtering
        if (filterValues.class) {
            result = result.filter((s) => s.className === filterValues.class);
        }
        if (filterValues.teacher) {
            result = result.filter((s) => s.teacherName === filterValues.teacher);
        }

        return result;
    }, [data?.data, filterValues]);

    const columns = [
        { key: "title", header: "Judul", sortable: true, render: (s: any) => <span className="text-black">{s.title}</span> },
        {
            key: "date",
            header: "Tanggal",
            render: (s: any) => <span className="text-black">{new Date(s.date).toLocaleDateString("id-ID")}</span>,
        },
        { key: "schoolClass", header: "Kelas", render: (s: any) => <span className="text-black">{s.schoolClass?.name ?? "-"}</span> },
        { key: "teacher", header: "Guru", render: (s: any) => <span className="text-black">{s.teacher?.name ?? "-"}</span> },
        {
            key: "actions",
            header: "Aksi",
            align: "center" as const,
            render: (s: any) => (
                <div className="flex gap-2 justify-center">
                    <Button
                        size="sm"
                        variant="ghost"
                        onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/app/attendance/sessions/${s.id}`);
                        }}
                    >
                        Isi Kehadiran
                    </Button>
                    <Button
                        size="sm"
                        variant="ghost"
                        onClick={(e) => {
                            e.stopPropagation();
                            navigate(ROUTE_PATHS.ATTENDANCE_SESSION_EDIT.replace(":id", s.id));
                        }}
                    >
                        Edit
                    </Button>
                    <Button
                        size="sm"
                        variant="ghost"
                        className="text-red-600"
                        onClick={(e) => {
                            e.stopPropagation();
                            setDeleteTarget(s);
                        }}
                    >
                        Hapus
                    </Button>
                </div>
            ),
        },
    ];

    const renderGridItem = (s: any) => (
        <div className="space-y-2 text-black">
            <h3 className="font-semibold text-black">{s.title}</h3>
            <p className="text-sm text-black">Tanggal: {new Date(s.date).toLocaleDateString("id-ID")}</p>
            <p className="text-sm text-black">Kelas: {s.schoolClass?.name ?? "-"}</p>
            <p className="text-sm text-black">Guru: {s.teacher?.name ?? "-"}</p>
        </div>
    );

    const handleBulkDelete = (sessions: AttendanceSession[]) => {
        sessions.forEach((s) => deleteMutation.mutate(s.id));
    };

    if (isLoading && !data) return <LoadingScreen />;
    if (isError)
        return <ErrorMessage title="Gagal memuat sesi" message={error?.message} onRetry={refetch} />;

    return (
        <div className="space-y-6">
            <div className="flex justify-between">
                <h1 className="text-2xl font-bold text-black">Sesi Presensi</h1>
                <Button onClick={() => navigate(ROUTE_PATHS.ATTENDANCE_SESSION_CREATE)}>+ Buat Sesi</Button>
            </div>

            <DataView<any>
                columns={columns}
                data={transformedData}
                keyExtractor={(s) => s.id}
                isLoading={isLoading}
                emptyMessage="Belum ada sesi"
                sortBy={sortBy}
                sortOrder={sortOrder}
                onSort={setSortBy}
                filters={filterOptions}
                onFilterChange={setFilterValues}
                onResetFilter={() => setFilterValues({})}
                enableBulkAction
                bulkActionLabel="Hapus Terpilih"
                onBulkAction={handleBulkDelete}
                renderGridItem={renderGridItem}
                defaultViewMode="table"
                onRowClick={(s) => navigate(ROUTE_PATHS.ATTENDANCE_SESSION_DETAIL.replace(":id", s.id))}
                searchValue={search}
                onSearchChange={setSearch}
                searchPlaceholder="Cari sesi..."
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

            <ConfirmDialog
                isOpen={!!deleteTarget}
                onClose={() => setDeleteTarget(null)}
                onConfirm={() => {
                    deleteMutation.mutate(deleteTarget!.id);
                    setDeleteTarget(null);
                }}
                title="Hapus Sesi"
                message={`Hapus sesi ${deleteTarget?.title}?`}
                variant="danger"
                isLoading={deleteMutation.isPending}
            />
        </div>
    );
}