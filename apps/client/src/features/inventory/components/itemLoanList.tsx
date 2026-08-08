// src/features/inventory/components/ItemLoanList.tsx
import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { DataView } from "@/components/ui/DataView";
import type { FilterOption } from "@/components/ui/DataView";
import { Badge, LoadingScreen, Button } from "@/components/ui";   // ✅ import Button
import { ErrorMessage } from "@/components/feedback";
import { Pagination } from "@/components/ui/Pagination";
import { useItemLoans } from "../hooks/useItemLoan";
import { usePagination, useDebounce } from "@/hooks";
import { ROUTE_PATHS } from "@/routes/route-paths";
import { formatDate, formatLoanStatus } from "@/utils/formatters";
import type { ItemLoan } from "@/types/entities";

export default function ItemLoanList() {
    const navigate = useNavigate();
    const [search, setSearch] = useState("");
    const [filterValues, setFilterValues] = useState<Record<string, string>>({});
    const [groupBy, setGroupBy] = useState<string>("");

    const debouncedSearch = useDebounce(search, 500);
    const { page, limit, sortBy, sortOrder, queryParams, setSortBy, setPage, setTotalItems } =
        usePagination();

    const { data, isLoading, isError, error, refetch } = useItemLoans({
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

    const filterOptions: FilterOption[] = [
        {
            key: "status",
            label: "Status",
            type: "select",
            options: [
                { value: "", label: "Semua" },
                { value: "DIPINJAM", label: "Dipinjam" },
                { value: "DIKEMBALIKAN", label: "Dikembalikan" },
                { value: "HILANG", label: "Hilang" },
                { value: "RUSAK", label: "Rusak" },
            ],
            placeholder: "Semua Status",
        },
    ];

    const groupByOptions = [
        { value: "", label: "Tidak Dikelompokkan" },
        { value: "status", label: "Status" },
        { value: "borrowerName", label: "Peminjam" },
    ];

    const transformedData = useMemo(() => {
        if (!data?.data) return [];
        return data.data.map((loan) => ({
            ...loan,
            statusLabel: formatLoanStatus(loan.status),
            borrowerName: loan.user?.name ?? "Tanpa Nama",
        }));
    }, [data?.data]);

    const getStatusBadge = (status: string) => {
        const variantMap: Record<string, "success" | "warning" | "error" | "info" | "default"> = {
            DIPINJAM: "info",
            DIKEMBALIKAN: "success",
            HILANG: "error",
            RUSAK: "warning",
        };
        return <Badge variant={variantMap[status] || "default"}>{formatLoanStatus(status)}</Badge>;
    };

    const columns = [
        {
            key: "item",
            header: "Barang",
            render: (loan: ItemLoan) => (
                <div>
                    <p className="font-medium text-black">{loan.item?.name ?? "-"}</p>
                    <p className="text-sm text-black">{loan.item?.itemCode}</p>
                </div>
            ),
        },
        {
            key: "user",
            header: "Peminjam",
            render: (loan: ItemLoan) => (
                <div>
                    <p className="text-sm font-medium text-black">{loan.user?.name ?? "-"}</p>
                    <p className="text-xs text-black">{loan.user?.email}</p>
                </div>
            ),
        },
        {
            key: "quantity",
            header: "Jumlah",
            align: "center" as const,
            render: (loan: ItemLoan) => <span className="text-black">{loan.quantity}</span>,
        },
        {
            key: "borrowDate",
            header: "Tanggal Pinjam",
            render: (loan: ItemLoan) => <span className="text-sm text-black">{formatDate(loan.borrowDate)}</span>,
        },
        {
            key: "dueDate",
            header: "Jatuh Tempo",
            render: (loan: ItemLoan) => <span className="text-sm text-black">{formatDate(loan.dueDate)}</span>,
        },
        {
            key: "status",
            header: "Status",
            align: "center" as const,
            render: (loan: ItemLoan) => getStatusBadge(loan.status),
        },
    ];

    const renderGridItem = (loan: ItemLoan) => (
        <div className="space-y-2 text-black">
            <h3 className="font-semibold text-black">{loan.item?.name ?? "-"}</h3>
            <p className="text-sm text-black">Kode: {loan.item?.itemCode}</p>
            <p className="text-sm text-black">Peminjam: {loan.user?.name ?? "-"}</p>
            <p className="text-sm text-black">Jumlah: {loan.quantity}</p>
            <p className="text-sm text-black">Pinjam: {formatDate(loan.borrowDate)}</p>
            <p className="text-sm text-black">Jatuh Tempo: {formatDate(loan.dueDate)}</p>
            {getStatusBadge(loan.status)}
        </div>
    );

    if (isLoading && !data) return <LoadingScreen />;
    if (isError)
        return <ErrorMessage title="Gagal memuat data" message={error?.message} onRetry={refetch} />;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-black">Peminjaman Barang</h1>
                {/* ✅ Tombol muncul di sini */}
                <Button onClick={() => navigate(ROUTE_PATHS.ITEM_LOAN_CREATE)}>
                    + Pinjam Barang
                </Button>
            </div>

            <DataView<ItemLoan>
                columns={columns}
                data={transformedData}
                keyExtractor={(loan) => loan.id}
                isLoading={isLoading}
                emptyMessage="Belum ada peminjaman"
                sortBy={sortBy}
                sortOrder={sortOrder}
                onSort={setSortBy}
                filters={filterOptions}
                onFilterChange={setFilterValues}
                onResetFilter={() => setFilterValues({})}
                renderGridItem={renderGridItem}
                defaultViewMode="table"
                onRowClick={(loan) => navigate(ROUTE_PATHS.ITEM_LOAN_DETAIL.replace(":id", loan.id))}
                searchValue={search}
                onSearchChange={setSearch}
                searchPlaceholder="Cari barang atau peminjam..."
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