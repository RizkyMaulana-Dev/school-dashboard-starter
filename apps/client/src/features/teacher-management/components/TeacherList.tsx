import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { DataView } from "@/components/ui/DataView";
import type { FilterOption } from "@/components/ui/DataView";
import { Button, LoadingScreen } from "@/components/ui";
import { ConfirmDialog, ErrorMessage } from "@/components/feedback";
import { Pagination } from "@/components/ui/Pagination";
import { useTeachers } from "../hooks/useTeachers";
import { useDeleteTeacher } from "../hooks/useTeacherMutations";
import { usePagination, useDebounce } from "@/hooks";
import { ROUTE_PATHS } from "@/routes/route-paths";
import { formatGender } from "@/utils/formatters";
import type { Teacher } from "@/types/entities";

export default function TeacherList() {
    const navigate = useNavigate();
    const [search, setSearch] = useState("");
    const [deleteTarget, setDeleteTarget] = useState<Teacher | null>(null);
    const [filterValues, setFilterValues] = useState<Record<string, string>>({});
    const [groupBy, setGroupBy] = useState<string>("");

    const debouncedSearch = useDebounce(search, 500);
    const { page, limit, sortBy, sortOrder, queryParams, setSortBy, setPage, setTotalItems } =
        usePagination();

    const { data, isLoading, isError, error, refetch } = useTeachers({
        ...queryParams,
        search: debouncedSearch || undefined,
    });

    const deleteMutation = useDeleteTeacher();

    useEffect(() => {
        setPage(1);
    }, [debouncedSearch, filterValues, setPage]);

    useEffect(() => {
        if (data?.meta?.total !== undefined) {
            setTotalItems(data.meta.total);
        }
    }, [data?.meta?.total, setTotalItems]);

    // Filter options
    const filterOptions: FilterOption[] = [
        {
            key: "gender",
            label: "Gender",
            type: "select",
            options: [
                { value: "", label: "Semua" },
                { value: "MALE", label: "Laki-laki" },
                { value: "FEMALE", label: "Perempuan" },
            ],
            placeholder: "Semua Gender",
        },
        {
            key: "hasClass",
            label: "Status Mengajar",
            type: "select",
            options: [
                { value: "", label: "Semua" },
                { value: "yes", label: "Wali Kelas" },
                { value: "no", label: "Bukan Wali Kelas" },
            ],
            placeholder: "Semua",
        },
    ];

    // Group by options
    const groupByOptions = [
        { value: "", label: "Tidak Dikelompokkan" },
        { value: "gender", label: "Gender" },
        { value: "hasClass", label: "Status Wali Kelas" },
    ];

    // Transformasi data untuk filter & group by
    const transformedData = useMemo(() => {
        if (!data?.data) return [];
        let result = data.data.map((t: any) => ({
            ...t,
            genderGroup: t.gender === "MALE" ? "Laki-laki" : "Perempuan",
            hasClass: t.classes && t.classes.length > 0 ? "yes" : "no",
            hasClassGroup: t.classes && t.classes.length > 0 ? "Wali Kelas" : "Bukan Wali Kelas",
        }));

        // Filter client-side
        if (filterValues.gender) {
            result = result.filter((t: any) => t.gender === filterValues.gender);
        }
        if (filterValues.hasClass) {
            result = result.filter((t: any) => t.hasClass === filterValues.hasClass);
        }

        return result;
    }, [data?.data, filterValues]);

    const columns = [
        {
            key: "name",
            header: "Nama",
            sortable: true,
            render: (t: any) => (
                <div>
                    <p className="font-medium text-black">{t.name}</p>
                    <p className="text-sm text-black">{t.email}</p>
                </div>
            ),
        },
        {
            key: "gender",
            header: "Gender",
            render: (t: any) => <span className="text-black">{formatGender(t.gender)}</span>,
        },
        {
            key: "classes",
            header: "Kelas",
            render: (t: any) => {
                if (!t.classes || t.classes.length === 0) return <span className="text-black">-</span>;
                return <span className="text-black">{t.classes.map((c: any) => c.name ?? c).join(", ")}</span>;
            },
        },
        {
            key: "actions",
            header: "Aksi",
            align: "center" as const,
            render: (t: any) => (
                <div className="flex gap-2 justify-center">
                    <Button
                        size="sm"
                        variant="ghost"
                        onClick={(e) => {
                            e.stopPropagation();
                            navigate(ROUTE_PATHS.TEACHER_EDIT.replace(":id", t.id));
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
                            setDeleteTarget(t);
                        }}
                    >
                        Hapus
                    </Button>
                </div>
            ),
        },
    ];

    const renderGridItem = (t: any) => (
        <div className="space-y-2 text-black">
            <h3 className="font-semibold text-black">{t.name}</h3>
            <p className="text-sm text-black">{t.email}</p>
            <p className="text-sm text-black">Gender: {formatGender(t.gender)}</p>
            <p className="text-sm text-black">
                Kelas: {t.classes?.length ? t.classes.map((c: any) => c.name).join(", ") : "-"}
            </p>
        </div>
    );

    const handleBulkDelete = (teachers: Teacher[]) => {
        teachers.forEach((t) => deleteMutation.mutate(t.id));
    };

    if (isLoading && !data) return <LoadingScreen />;
    if (isError)
        return (
            <ErrorMessage title="Gagal memuat data Guru" message={error?.message} onRetry={refetch} />
        );

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-black">Manajemen Guru</h1>
                    <p className="text-sm text-gray-500">Data Guru dan kelas</p>
                </div>
                <Button onClick={() => navigate(ROUTE_PATHS.TEACHER_CREATE)}>+ Tambah Guru</Button>
            </div>

            <DataView<any>
                columns={columns}
                data={transformedData}
                keyExtractor={(t) => t.id}
                isLoading={isLoading}
                emptyMessage="Belum ada Guru"
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
                onRowClick={(t) => navigate(ROUTE_PATHS.TEACHER_DETAIL.replace(":id", t.id))}
                searchValue={search}
                onSearchChange={setSearch}
                searchPlaceholder="Cari nama atau email..."
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
                title="Hapus Guru"
                message={`Hapus ${deleteTarget?.name}?`}
                variant="danger"
                isLoading={deleteMutation.isPending}
            />
        </div>
    );
}