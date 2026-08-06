// src/features/library/components/BookList.tsx
import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { DataView } from "@/components/ui/DataView";
import type { FilterOption } from "@/components/ui/DataView";
import { Button, Badge, LoadingScreen } from "@/components/ui";
import { ConfirmDialog, ErrorMessage } from "@/components/feedback";
import { Pagination } from "@/components/ui/Pagination";
import { useBooks } from "../hooks/useBooks";
import { useDeleteBook } from "../hooks/useBookMutations";
import { usePagination, useDebounce } from "@/hooks";
import { ROUTE_PATHS } from "@/routes/route-paths";
import type { Book } from "@/types/entities";

export default function BookList() {
    const navigate = useNavigate();
    const [search, setSearch] = useState("");
    const [deleteTarget, setDeleteTarget] = useState<Book | null>(null);
    const [filterValues, setFilterValues] = useState<Record<string, string>>({});
    const [groupBy, setGroupBy] = useState<string>("");

    const debouncedSearch = useDebounce(search, 500);
    const { page, limit, sortBy, sortOrder, queryParams, setSortBy, setPage, setTotalItems } =
        usePagination();

    const { data, isLoading, isError, error, refetch } = useBooks({
        ...queryParams,
        search: debouncedSearch || undefined,
    });

    const deleteMutation = useDeleteBook();

    useEffect(() => {
        setPage(1);
    }, [debouncedSearch, filterValues, setPage]);

    useEffect(() => {
        if (data?.meta?.total !== undefined) setTotalItems(data.meta.total);
    }, [data?.meta?.total, setTotalItems]);

    // Bangun opsi filter dari data buku yang sudah diambil
    const filterOptions: FilterOption[] = useMemo(() => {
        if (!data?.data) return [];

        const categories = Array.from(
            new Set(data.data.map((b) => b.category?.name).filter(Boolean))
        ).sort() as string[];

        const authors = Array.from(
            new Set(data.data.map((b) => b.author).filter(Boolean))
        ).sort() as string[];

        const options: FilterOption[] = [];

        if (categories.length > 0) {
            options.push({
                key: "category",
                label: "Kategori",
                type: "select",
                options: [{ value: "", label: "Semua" }, ...categories.map((c) => ({ value: c, label: c }))],
                placeholder: "Semua Kategori",
            });
        }

        if (authors.length > 0) {
            options.push({
                key: "author",
                label: "Penulis",
                type: "select",
                options: [{ value: "", label: "Semua" }, ...authors.map((a) => ({ value: a, label: a }))],
                placeholder: "Semua Penulis",
            });
        }

        options.push({
            key: "stockStatus",
            label: "Status Stok",
            type: "select",
            options: [
                { value: "", label: "Semua" },
                { value: "available", label: "Tersedia" },
                { value: "empty", label: "Habis" },
            ],
            placeholder: "Semua Status",
        });

        return options;
    }, [data?.data]);

    const groupByOptions = [
        { value: "", label: "Tidak Dikelompokkan" },
        { value: "categoryName", label: "Kategori" },
        { value: "author", label: "Penulis" },
        { value: "stockStatus", label: "Status Stok" },
    ];

    // Transformasi data: tambahkan properti turunan untuk filter & group by
    const transformedData = useMemo(() => {
        if (!data?.data) return [];
        let result = data.data.map((b) => ({
            ...b,
            categoryName: b.category?.name ?? "Tanpa Kategori",
            stockStatus: (b.stockAvailable ?? 0) > 0 ? "available" : "empty",
            stockStatusLabel: (b.stockAvailable ?? 0) > 0 ? "Tersedia" : "Habis",
        }));

        // Filter client‑side
        if (filterValues.category) {
            result = result.filter((b) => b.categoryName === filterValues.category);
        }
        if (filterValues.author) {
            result = result.filter((b) => b.author === filterValues.author);
        }
        if (filterValues.stockStatus) {
            result = result.filter((b) => b.stockStatus === filterValues.stockStatus);
        }

        return result;
    }, [data?.data, filterValues]);

    const columns = [
        {
            key: "title",
            header: "Judul",
            sortable: true,
            render: (b: any) => (
                <div>
                    <p className="font-medium text-black">{b.title}</p>
                    <p className="text-sm text-black">{b.isbn}</p>
                </div>
            ),
        },
        { key: "author", header: "Penulis", render: (b: any) => <span className="text-black">{b.author}</span> },
        {
            key: "stock",
            header: "Stok",
            render: (b: any) => <span className="text-black">{b.stockAvailable}/{b.stockTotal}</span>,
        },
        { key: "category", header: "Kategori", render: (b: any) => <span className="text-black">{b.category?.name ?? "-"}</span> },
        {
            key: "actions",
            header: "Aksi",
            align: "center" as const,
            render: (b: any) => (
                <div className="flex gap-2 justify-center">
                    <Button
                        size="sm"
                        variant="ghost"
                        onClick={(e) => {
                            e.stopPropagation();
                            navigate(ROUTE_PATHS.BOOK_EDIT.replace(":id", b.id));
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
                            setDeleteTarget(b);
                        }}
                    >
                        Hapus
                    </Button>
                </div>
            ),
        },
    ];

    const renderGridItem = (b: any) => (
        <div className="space-y-2 text-black">
            <h3 className="font-semibold text-black">{b.title}</h3>
            <p className="text-sm text-black">ISBN: {b.isbn}</p>
            <p className="text-sm text-black">Penulis: {b.author}</p>
            <p className="text-sm text-black">Stok: {b.stockAvailable}/{b.stockTotal}</p>
            <p className="text-sm text-black">Kategori: {b.category?.name ?? "-"}</p>
            <Badge variant={(b.stockAvailable ?? 0) > 0 ? "success" : "error"}>
                {(b.stockAvailable ?? 0) > 0 ? "Tersedia" : "Habis"}
            </Badge>
        </div>
    );

    const handleBulkDelete = (books: Book[]) => {
        books.forEach((b) => deleteMutation.mutate(b.id));
    };

    if (isLoading && !data) return <LoadingScreen />;
    if (isError)
        return <ErrorMessage title="Gagal memuat buku" message={error?.message} onRetry={refetch} />;

    return (
        <div className="space-y-6">
            <div className="flex justify-between">
                <h1 className="text-2xl font-bold text-black">Manajemen Buku</h1>
                <Button onClick={() => navigate(ROUTE_PATHS.BOOK_CREATE)}>+ Tambah Buku</Button>
            </div>

            <DataView<any>
                columns={columns}
                data={transformedData}
                keyExtractor={(b) => b.id}
                isLoading={isLoading}
                emptyMessage="Belum ada buku"
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
                onRowClick={(b) => navigate(ROUTE_PATHS.BOOK_DETAIL.replace(":id", b.id))}
                searchValue={search}
                onSearchChange={setSearch}
                searchPlaceholder="Cari judul, penulis, ISBN..."
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
                title="Hapus Buku"
                message={`Hapus buku "${deleteTarget?.title}"?`}
                variant="danger"
                isLoading={deleteMutation.isPending}
            />
        </div>
    );
}