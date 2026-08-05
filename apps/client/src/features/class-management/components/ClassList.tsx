// src/features/class-management/components/ClassList.tsx
import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { DataView } from "@/components/ui/DataView";
import type { FilterOption } from "@/components/ui/DataView";
import { Button, LoadingScreen } from "@/components/ui";
import { ConfirmDialog, ErrorMessage } from "@/components/feedback";
import { Pagination } from "@/components/ui/Pagination";
import { useClasses } from "../hooks/useClasses";
import { useDeleteClass } from "../hooks/useClassMutations";
import { usePagination, useDebounce } from "@/hooks";
import { ROUTE_PATHS } from "@/routes/route-paths";
import type { SchoolClass } from "@/types/entities";

export default function ClassList() {
    const navigate = useNavigate();
    const [search, setSearch] = useState("");
    const [deleteTarget, setDeleteTarget] = useState<SchoolClass | null>(null);
    const [filterValues, setFilterValues] = useState<Record<string, string>>({});
    const [groupBy, setGroupBy] = useState<string>("");

    const debouncedSearch = useDebounce(search, 500);
    const { page, limit, sortBy, sortOrder, queryParams, setSortBy, setPage, setTotalItems } =
        usePagination();

    const { data, isLoading, isError, error, refetch } = useClasses({
        ...queryParams,
        search: debouncedSearch || undefined,
    });

    const deleteMutation = useDeleteClass();

    // Reset halaman saat search atau filter berubah
    useEffect(() => {
        setPage(1);
    }, [debouncedSearch, filterValues, setPage]);

    // Update total items dari meta backend
    useEffect(() => {
        if (data?.meta?.total !== undefined) setTotalItems(data.meta.total);
    }, [data?.meta?.total, setTotalItems]);

    // Filter options dinamis berdasarkan data yang ada
    const filterOptions: FilterOption[] = useMemo(() => {
        const grades = Array.from(
            new Set((data?.data ?? []).map((c) => String(c.grade)))
        ).sort((a, b) => Number(a) - Number(b));

        const academicYears = Array.from(
            new Set((data?.data ?? []).map((c) => c.academicYear).filter(Boolean))
        ).sort();

        return [
            {
                key: "grade",
                label: "Tingkat",
                type: "select",
                options: [
                    { value: "", label: "Semua" },
                    ...grades.map((g) => ({ value: g, label: `Kelas ${g}` })),
                ],
                placeholder: "Semua Tingkat",
            },
            {
                key: "academicYear",
                label: "Tahun Ajaran",
                type: "select",
                options: [
                    { value: "", label: "Semua" },
                    ...academicYears.map((y) => ({ value: y, label: y })),
                ],
                placeholder: "Semua Tahun",
            },
        ];
    }, [data?.data]);

    // Group by options
    const groupByOptions = [
        { value: "", label: "Tidak Dikelompokkan" },
        { value: "grade", label: "Tingkat" },
        { value: "academicYear", label: "Tahun Ajaran" },
    ];

    // Data yang sudah ditransformasi dengan field turunan untuk group by dan filter client-side
    const transformedData = useMemo(() => {
        let result = (data?.data ?? []).map((c) => ({
            ...c,
            gradeGroup: `Kelas ${c.grade}`,
            academicYearGroup: c.academicYear || "Tidak Ada",
        })) as (SchoolClass & { gradeGroup: string; academicYearGroup: string })[];

        // Filter client-side berdasarkan filterValues
        if (filterValues.grade) {
            result = result.filter((c) => String(c.grade) === filterValues.grade);
        }
        if (filterValues.academicYear) {
            result = result.filter((c) => c.academicYear === filterValues.academicYear);
        }
        return result;
    }, [data?.data, filterValues]);

    // Definisi kolom tabel dengan teks hitam
    const columns = [
        {
            key: "name",
            header: "Nama Kelas",
            sortable: true,
            render: (c: any) => <span className="font-medium text-black">{c.name}</span>,
        },
        {
            key: "grade",
            header: "Tingkat",
            render: (c: any) => <span className="text-black">{c.grade}</span>,
        },
        {
            key: "academicYear",
            header: "Tahun Ajaran",
            render: (c: any) => <span className="text-black">{c.academicYear}</span>,
        },
        {
            key: "studentCount",
            header: "Siswa",
            align: "center" as const,
            render: (c: any) => <span className="text-black">{c.studentCount ?? 0}</span>,
        },
        {
            key: "actions",
            header: "Aksi",
            align: "center" as const,
            render: (c: any) => (
                <div className="flex gap-2 justify-center">
                    <Button
                        size="sm"
                        variant="ghost"
                        onClick={(e) => {
                            e.stopPropagation();
                            navigate(ROUTE_PATHS.CLASS_EDIT.replace(":id", c.id));
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
                            setDeleteTarget(c);
                        }}
                    >
                        Hapus
                    </Button>
                </div>
            ),
        },
    ];

    // Render untuk tampilan grid
    const renderGridItem = (c: any) => (
        <div className="space-y-2 text-black">
            <h3 className="font-semibold text-black">{c.name}</h3>
            <p className="text-sm text-black">Tingkat: {c.grade}</p>
            <p className="text-sm text-black">Tahun Ajaran: {c.academicYear}</p>
            <p className="text-sm text-black">Siswa: {c.studentCount ?? 0}</p>
        </div>
    );

    // Handler untuk bulk delete
    const handleBulkDelete = (classes: SchoolClass[]) => {
        classes.forEach((c) => deleteMutation.mutate(c.id));
    };

    if (isLoading && !data) return <LoadingScreen />;
    if (isError)
        return (
            <ErrorMessage title="Gagal memuat kelas" message={error?.message} onRetry={refetch} />
        );

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-black">Manajemen Kelas</h1>
                    <p className="text-sm text-gray-500">Daftar kelas dan rombongan belajar</p>
                </div>
                <Button onClick={() => navigate(ROUTE_PATHS.CLASS_CREATE)}>+ Tambah Kelas</Button>
            </div>

            <DataView<any>
                columns={columns}
                data={transformedData}
                keyExtractor={(c) => c.id}
                isLoading={isLoading}
                emptyMessage="Belum ada kelas"
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
                onRowClick={(c) => navigate(ROUTE_PATHS.CLASS_DETAIL.replace(":id", c.id))}
                searchValue={search}
                onSearchChange={setSearch}
                searchPlaceholder="Cari kelas..."
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
                title="Hapus Kelas"
                message={`Hapus kelas ${deleteTarget?.name}?`}
                variant="danger"
                isLoading={deleteMutation.isPending}
            />
        </div>
    );
}