import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { DataView } from "@/components/ui/DataView";
import type { FilterOption } from "@/components/ui/DataView";
import { Button, LoadingScreen } from "@/components/ui";
import { ConfirmDialog, ErrorMessage } from "@/components/feedback";
import { Pagination } from "@/components/ui/Pagination";
import { useStudents } from "../hooks/useStudents";
import { useDeleteStudent } from "../hooks/useStudentMutations";
import { usePagination, useDebounce } from "@/hooks";
import { ROUTE_PATHS } from "@/routes/route-paths";
import { formatGender } from "@/utils/formatters";
import type { Student } from "@/types/entities";

export default function StudentList() {
    const navigate = useNavigate();
    const [search, setSearch] = useState("");
    const [deleteTarget, setDeleteTarget] = useState<Student | null>(null);
    const [filterValues, setFilterValues] = useState<Record<string, string>>({});
    const [groupBy, setGroupBy] = useState<string>("");

    const debouncedSearch = useDebounce(search, 500);
    const { page, limit, sortBy, sortOrder, queryParams, setSortBy, setPage, setTotalItems } =
        usePagination();

    const { data, isLoading, isError, error, refetch } = useStudents({
        ...queryParams,
        search: debouncedSearch || undefined,
    });

    const deleteMutation = useDeleteStudent();

    // Reset halaman saat search/filter berubah
    useEffect(() => {
        setPage(1);
    }, [debouncedSearch, filterValues, setPage]);

    // Sinkronkan total dari meta
    useEffect(() => {
        if (data?.meta?.total !== undefined) {
            setTotalItems(data.meta.total);
        }
    }, [data?.meta?.total, setTotalItems]);

    // Bangun opsi filter secara dinamis dari data yang sudah diambil
    const filterOptions: FilterOption[] = useMemo(() => {
        if (!data?.data) return [];

        const uniqueClasses = Array.from(
            new Set(data.data.map((s: any) => s.className).filter(Boolean))
        ).sort();

        const classOptions = [
            { value: "", label: "Semua Kelas" },
            ...uniqueClasses.map((c: any) => ({ value: c, label: c })),
        ];

        return [
            {
                key: "className",
                label: "Kelas",
                type: "select",
                options: classOptions,
                placeholder: "Semua Kelas",
            },
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
        ];
    }, [data?.data]);

    // Group by options
    const groupByOptions = [
        { value: "", label: "Tidak Dikelompokkan" },
        { value: "className", label: "Kelas" },
        { value: "gender", label: "Gender" },
    ];

    // Data siswa yang sudah difilter (client‑side) dan ditambah properti turunan untuk group by
    const transformedData = useMemo(() => {
        if (!data?.data) return [];

        let result = data.data.map((s: any) => ({
            ...s,
            genderGroup: s.gender === "MALE" ? "Laki-laki" : "Perempuan",
            className: s.className || "Tanpa Kelas",
        }));

        // Filter client‑side
        if (filterValues.className) {
            result = result.filter((s: any) => s.className === filterValues.className);
        }
        if (filterValues.gender) {
            result = result.filter((s: any) => s.gender === filterValues.gender);
        }

        return result;
    }, [data?.data, filterValues]);

    // Definisi kolom dengan teks hitam
    const columns = [
        {
            key: "name",
            header: "Nama",
            sortable: true,
            render: (s: any) => (
                <div>
                    <p className="font-medium text-black">{s.name}</p>
                    <p className="text-sm text-black">{s.email}</p>
                </div>
            ),
        },
        { key: "gender", header: "Gender", render: (s: any) => <span className="text-black">{formatGender(s.gender)}</span> },
        { key: "className", header: "Kelas", render: (s: any) => <span className="text-black">{s.className}</span> },
        {
            key: "birthDate",
            header: "Tgl Lahir",
            render: (s: any) => <span className="text-black">{new Date(s.birthDate).toLocaleDateString("id-ID")}</span>,
        },
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
                            navigate(ROUTE_PATHS.STUDENT_EDIT.replace(":id", s.id));
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

    // Render untuk tampilan grid
    const renderGridItem = (s: any) => (
        <div className="space-y-2 text-black">
            <h3 className="font-semibold text-black">{s.name}</h3>
            <p className="text-sm text-black">{s.email}</p>
            <p className="text-sm text-black">Kelas: {s.className}</p>
            <p className="text-sm text-black">Gender: {formatGender(s.gender)}</p>
            <p className="text-sm text-black">Tgl Lahir: {new Date(s.birthDate).toLocaleDateString("id-ID")}</p>
        </div>
    );

    const handleBulkDelete = (students: Student[]) => {
        students.forEach((s) => deleteMutation.mutate(s.id));
    };

    if (isLoading && !data) return <LoadingScreen />;
    if (isError)
        return (
            <ErrorMessage title="Gagal memuat data siswa" message={error?.message} onRetry={refetch} />
        );

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-black">Manajemen Siswa</h1>
                    <p className="text-sm text-gray-500">Data siswa dan kelas</p>
                </div>
                <Button onClick={() => navigate(ROUTE_PATHS.STUDENT_CREATE)}>+ Tambah Siswa</Button>
            </div>

            <DataView<any>
                columns={columns}
                data={transformedData}
                keyExtractor={(s) => s.id}
                isLoading={isLoading}
                emptyMessage="Belum ada siswa"
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
                onRowClick={(s) => navigate(ROUTE_PATHS.STUDENT_DETAIL.replace(":id", s.id))}
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
                title="Hapus Siswa"
                message={`Hapus ${deleteTarget?.name}?`}
                variant="danger"
                isLoading={deleteMutation.isPending}
            />
        </div>
    );
}