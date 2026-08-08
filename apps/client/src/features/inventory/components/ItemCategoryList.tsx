// src/features/inventory/components/ItemCategoryList.tsx
import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { DataView } from "@/components/ui/DataView";
import type { FilterOption } from "@/components/ui/DataView";
import { Button, LoadingScreen } from "@/components/ui";
import { ConfirmDialog, ErrorMessage } from "@/components/feedback";
import { Pagination } from "@/components/ui/Pagination";
import { useItemCategories } from "../hooks/useItemCategories";
import { useDeleteItemCategory } from "../hooks/useItemCategoryMutations";
import { usePagination, useDebounce } from "@/hooks";
import { ROUTE_PATHS } from "@/routes/route-paths";
import type { ItemCategory } from "@/types/entities";

export default function ItemCategoryList() {
    const navigate = useNavigate();
    const [search, setSearch] = useState("");
    const [deleteTarget, setDeleteTarget] = useState<ItemCategory | null>(null);
    const [filterValues, setFilterValues] = useState<Record<string, string>>({});
    const [groupBy, setGroupBy] = useState<string>("");

    const debouncedSearch = useDebounce(search, 500);
    const { page, limit, sortBy, sortOrder, queryParams, setSortBy, setPage, setTotalItems } =
        usePagination();

    const { data, isLoading, isError, error, refetch } = useItemCategories({
        ...queryParams,
        search: debouncedSearch || undefined,
    });

    const deleteMutation = useDeleteItemCategory();

    useEffect(() => {
        setPage(1);
    }, [debouncedSearch, filterValues, setPage]);

    useEffect(() => {
        if (data?.meta?.total !== undefined) setTotalItems(data.meta.total);
    }, [data?.meta?.total, setTotalItems]);

    // Filter sederhana berdasarkan nama (jika diperlukan), kita buat filter input
    const filterOptions: FilterOption[] = [
        {
            key: "name",
            label: "Nama",
            type: "input",
            placeholder: "Cari nama...",
        },
    ];

    const groupByOptions = [
        { value: "", label: "Tidak Dikelompokkan" },
        { value: "firstLetter", label: "Huruf Pertama" },
    ];

    // Tambahkan properti turunan untuk group by
    const transformedData = useMemo(() => {
        if (!data?.data) return [];
        let result = data.data.map((cat) => ({
            ...cat,
            firstLetter: cat.name.charAt(0).toUpperCase(),
        }));

        // Filter client-side (jika filterValues.name ada)
        if (filterValues.name) {
            const searchTerm = filterValues.name.toLowerCase();
            result = result.filter(
                (cat) => cat.name.toLowerCase().includes(searchTerm)
            );
        }

        return result;
    }, [data?.data, filterValues]);

    const columns = [
        {
            key: "name",
            header: "Nama Kategori",
            sortable: true,
            render: (cat: ItemCategory) => <span className="text-black">{cat.name}</span>,
        },
        {
            key: "description",
            header: "Deskripsi",
            render: (cat: ItemCategory) => <span className="text-black">{cat.description || "-"}</span>,
        },
        {
            key: "actions",
            header: "Aksi",
            align: "center" as const,
            render: (cat: ItemCategory) => (
                <div className="flex gap-2 justify-center">
                    <Button
                        size="sm"
                        variant="ghost"
                        onClick={(e) => {
                            e.stopPropagation();
                            navigate(ROUTE_PATHS.ITEM_CATEGORY_EDIT.replace(":id", cat.id));
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
                            setDeleteTarget(cat);
                        }}
                    >
                        Hapus
                    </Button>
                </div>
            ),
        },
    ];

    const renderGridItem = (cat: ItemCategory) => (
        <div className="space-y-2 text-black">
            <h3 className="font-semibold text-black">{cat.name}</h3>
            <p className="text-sm text-black">{cat.description || "-"}</p>
        </div>
    );

    const handleBulkDelete = (categories: ItemCategory[]) => {
        categories.forEach((cat) => deleteMutation.mutate(cat.id));
    };

    if (isLoading && !data) return <LoadingScreen />;
    if (isError)
        return (
            <ErrorMessage title="Gagal memuat kategori" message={error?.message} onRetry={refetch} />
        );

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-900">Kategori Barang</h1>
                <Button onClick={() => navigate(ROUTE_PATHS.ITEM_CATEGORY_CREATE)}>
                    + Tambah Kategori
                </Button>
            </div>

            <DataView<ItemCategory>
                columns={columns}
                data={transformedData}
                keyExtractor={(cat) => cat.id}
                isLoading={isLoading}
                emptyMessage="Belum ada kategori"
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
                onRowClick={(cat) => navigate(ROUTE_PATHS.ITEM_CATEGORY_DETAIL.replace(":id", cat.id))}
                searchValue={search}
                onSearchChange={setSearch}
                searchPlaceholder="Cari kategori..."
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
                title="Hapus Kategori"
                message={`Hapus kategori ${deleteTarget?.name}?`}
                variant="danger"
                isLoading={deleteMutation.isPending}
            />
        </div>
    );
}