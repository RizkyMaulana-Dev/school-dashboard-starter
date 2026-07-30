import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Table, Button, Input, Badge, Select, LoadingScreen } from "@/components/ui";
import { ConfirmDialog, ErrorMessage, EmptyState } from "@/components/feedback";
import { useBookLoans } from "../hooks/useBookLoan";
import { useDeleteBookLoan, useReturnBook } from "../hooks/useBookLoanMutations";
import { usePagination, useDebounce } from "@/hooks";
import { ROUTE_PATHS } from "@/routes/route-paths";
import { formatDate, formatLoanStatus } from "@/utils/formatters";
import type { BookLoan } from "@/types/entities";

export default function BookLoanList() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [loanToDelete, setLoanToDelete] = useState<BookLoan | null>(null);
  const [loanToReturn, setLoanToReturn] = useState<BookLoan | null>(null);

  const debouncedSearch = useDebounce(search, 500);
  const { queryParams, sortBy, sortOrder, setSortBy, setPage, setTotalItems, page, limit } =
    usePagination();

  const { data, isLoading, isError, error, refetch } = useBookLoans({
    ...queryParams,
    search: debouncedSearch || undefined,
    ...(statusFilter && { status: statusFilter }),
  });

  const deleteMutation = useDeleteBookLoan();
  const returnMutation = useReturnBook();

  if (data?.meta?.totalItems !== undefined) setTotalItems(data.meta.totalItems);

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
          <p className="font-medium text-gray-900">{loan.book?.title ?? "Buku tidak dikenal"}</p>
          <p className="text-sm text-gray-500">{loan.book?.isbn}</p>
        </div>
      ),
    },
    {
      key: "user",
      header: "Peminjam",
      render: (loan: BookLoan) => (
        <div>
          <p className="text-sm font-medium">{loan.user?.name ?? "-"}</p>
          <p className="text-xs text-gray-500">{loan.user?.email}</p>
        </div>
      ),
    },
    {
      key: "borrowDate",
      header: "Tanggal Pinjam",
      sortable: true,
      render: (loan: BookLoan) => <span className="text-sm">{formatDate(loan.borrowDate)}</span>,
    },
    {
      key: "dueDate",
      header: "Jatuh Tempo",
      sortable: true,
      render: (loan: BookLoan) => <span className="text-sm">{formatDate(loan.dueDate)}</span>,
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
              className="text-green-600 hover:text-green-800"
              onClick={() => setLoanToReturn(loan)}
            >
              Kembalikan
            </Button>
          )}
          <Button
            size="sm"
            variant="ghost"
            onClick={() => navigate(ROUTE_PATHS.BOOK_LOAN_DETAIL.replace(":id", loan.id))}
          >
            Detail
          </Button>
          <Button
            size="sm"
            variant="ghost"
            className="text-red-600"
            onClick={() => setLoanToDelete(loan)}
          >
            Hapus
          </Button>
        </div>
      ),
    },
  ];

  if (isLoading) return <LoadingScreen message="Memuat data peminjaman..." />;
  if (isError)
    return <ErrorMessage title="Gagal memuat data" message={error?.message} onRetry={refetch} />;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Peminjaman Buku</h1>
          <p className="mt-1 text-sm text-gray-500">Kelola semua peminjaman buku</p>
        </div>
        <Button onClick={() => navigate(ROUTE_PATHS.BOOK_LOAN_CREATE)}>+ Pinjam Buku</Button>
      </div>

      <div className="flex gap-4 items-center">
        <Input
          placeholder="Cari judul buku atau nama peminjam..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-md flex-1"
        />
        <Select
          options={[
            { value: "", label: "Semua Status" },
            { value: "DIPINJAM", label: "Dipinjam" },
            { value: "DIKEMBALIKAN", label: "Dikembalikan" },
            { value: "TERLAMBAT", label: "Terlambat" },
            { value: "HILANG", label: "Hilang" },
          ]}
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="w-48"
        />
      </div>

      {data?.data.length === 0 ? (
        <EmptyState
          title="Belum ada peminjaman"
          description="Catat peminjaman buku baru"
          action={
            <Button onClick={() => navigate(ROUTE_PATHS.BOOK_LOAN_CREATE)}>Pinjam Buku</Button>
          }
        />
      ) : (
        <Table
          columns={columns}
          data={data?.data || []}
          keyExtractor={(loan) => loan.id}
          sortBy={sortBy}
          sortOrder={sortOrder}
          onSort={setSortBy}
        />
      )}

      {/* Pagination */}
      {data && data.meta.totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-600">
            Menampilkan {(page - 1) * limit + 1}-{Math.min(page * limit, data.meta.totalItems)} dari{" "}
            {data.meta.totalItems} data
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
            >
              Previous
            </Button>
            <span className="text-sm px-3">
              {page} / {data.meta.totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              disabled={page === data.meta.totalPages}
              onClick={() => setPage(page + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      )}

      {/* Confirm Return */}
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

      {/* Confirm Delete */}
      <ConfirmDialog
        isOpen={!!loanToDelete}
        onClose={() => setLoanToDelete(null)}
        onConfirm={() => {
          if (loanToDelete) {
            deleteMutation.mutate(loanToDelete.id);
            setLoanToDelete(null);
          }
        }}
        title="Hapus Peminjaman"
        message={`Hapus catatan peminjaman buku "${loanToDelete?.book?.title}"?`}
        confirmLabel="Hapus"
        variant="danger"
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
}
