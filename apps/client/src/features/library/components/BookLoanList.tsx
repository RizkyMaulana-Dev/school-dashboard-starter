// src/features/library/components/BookLoanList.tsx
import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { DataView } from "@/components/ui/DataView";
import type { FilterOption } from "@/components/ui/DataView";
import { Button, Badge, LoadingScreen } from "@/components/ui";
import { ConfirmDialog, ErrorMessage } from "@/components/feedback";
import { Pagination } from "@/components/ui/Pagination";
import { useBookLoans } from "../hooks/useBookLoan";
import { useReturnBook } from "../hooks/useBookLoanMutations";
import { usePagination, useDebounce } from "@/hooks";
import { ROUTE_PATHS } from "@/routes/route-paths";
import { formatDate, formatLoanStatus } from "@/utils/formatters";
import type { BookLoan } from "@/types/entities";

export default function BookLoanList() {
    const navigate = useNavigate();
    const [search, setSearch] = useState("");
    const [filterValues, setFilterValues] = useState<Record<string, string>>({});
    const [groupBy, setGroupBy] = useState<string>("");
    const [loanToReturn, setLoanToReturn] = useState<BookLoan | null>(null);

    const debouncedSearch = useDebounce(search, 500);
    const { page, limit, sortBy, sortOrder, queryParams, setSortBy, setPage, setTotalItems } =
        usePagination();

    const { data, isLoading, isError, error, refetch } = useBookLoans({
        ...queryParams,
        search: debouncedSearch || undefined,
        ...filterValues,
    });

    const returnMutation = useReturnBook();

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
                { value: "TERLAMBAT", label: "Terlambat" },
                { value: "HILANG", label: "Hilang" },
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
            TERLAMBAT: "error",
            HILANG: "error",
        };
        return <Badge variant={variantMap[status] || "default"}>{formatLoanStatus(status)}</Badge>;
    };

    const columns = [
        {
            key: "book",
            header: "Buku",
            render: (loan: BookLoan) => (
                <div>
                    <p className="font-medium text-black">{loan.book?.title ?? "Buku tidak dikenal"}</p>
                    <p className="text-sm text-black">{loan.book?.isbn}</p>
                </div>
            ),
        },
        {
            key: "user",
            header: "Peminjam",
            render: (loan: BookLoan) => (
                <div>
                    <p className="text-sm font-medium text-black">{loan.user?.name ?? "-"}</p>
                    <p className="text-xs text-black">{loan.user?.email}</p>
                </div>
            ),
        },
        {
            key: "borrowDate",
            header: "Tanggal Pinjam",
            sortable: true,
            render: (loan: BookLoan) => <span className="text-sm text-black">{formatDate(loan.borrowDate)}</span>,
        },
        {
            key: "dueDate",
            header: "Jatuh Tempo",
            sortable: true,
            render: (loan: BookLoan) => <span className="text-sm text-black">{formatDate(loan.dueDate)}</span>,
        },
        {
            key: "status",
            header: "Status",
            align: "center" as const,
            render: (loan: BookLoan) => getStatusBadge(loan.status),
        },
        {
            key: "actions",
            header: "Aksi",
            align: "center" as const,
            render: (loan: BookLoan) => (
                <div className="flex gap-1 justify-center">
                    {loan.status === "DIPINJAM" && (
                        <Button
                            size="sm"
                            variant="ghost"
                            className="text-green-600"
                            onClick={(e) => {
                                e.stopPropagation();
                                setLoanToReturn(loan);
                            }}
                        >
                            Kembalikan
                        </Button>
                    )}
                    <Button
                        size="sm"
                        variant="ghost"
                        onClick={(e) => {
                            e.stopPropagation();
                            navigate(ROUTE_PATHS.BOOK_LOAN_EDIT.replace(":id", loan.id));
                        }}
                    >
                        Edit
                    </Button>
                </div>
            ),
        },
    ];

    const renderGridItem = (loan: BookLoan) => (
        <div className="space-y-2 text-black">
            <h3 className="font-semibold text-black">{loan.book?.title ?? "Buku tidak dikenal"}</h3>
            <p className="text-sm text-black">ISBN: {loan.book?.isbn}</p>
            <p className="text-sm text-black">Peminjam: {loan.user?.name ?? "-"}</p>
            <p className="text-sm text-black">Pinjam: {formatDate(loan.borrowDate)}</p>
            <p className="text-sm text-black">Jatuh Tempo: {formatDate(loan.dueDate)}</p>
            {getStatusBadge(loan.status)}
        </div>
    );

    if (isLoading && !data) return <LoadingScreen message="Memuat data peminjaman..." />;
    if (isError)
        return <ErrorMessage title="Gagal memuat data" message={error?.message} onRetry={refetch} />;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-black">Peminjaman Buku</h1>
                    <p className="mt-1 text-sm text-black">Kelola semua peminjaman buku</p>
                </div>
                <Button onClick={() => navigate(ROUTE_PATHS.BOOK_LOAN_CREATE)}>+ Pinjam Buku</Button>
            </div>

            <DataView<BookLoan>
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
                onRowClick={(loan) => navigate(ROUTE_PATHS.BOOK_LOAN_DETAIL.replace(":id", loan.id))}
                searchValue={search}
                onSearchChange={setSearch}
                searchPlaceholder="Cari judul buku atau nama peminjam..."
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
                isOpen={!!loanToReturn}
                onClose={() => setLoanToReturn(null)}
                onConfirm={() => {
                    if (loanToReturn) {
                        returnMutation.mutate({ id: loanToReturn.id });
                        setLoanToReturn(null);
                    }
                }}
                title="Kembalikan Buku"
                message={`Konfirmasi pengembalian buku "${loanToReturn?.book?.title}" oleh ${loanToReturn?.user?.name}?`}
                confirmLabel="Kembalikan"
                variant="info"
                isLoading={returnMutation.isPending}
            />
        </div>
    );
}