import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Table, Button, Input, Badge, Select, LoadingScreen } from "@/components/ui";
import { ConfirmDialog, ErrorMessage, EmptyState } from "@/components/feedback";
import { useItemLoans } from "../hooks/useItemLoan";
import { useDeleteItemLoan, useReturnItem } from "../hooks/useItemLoanMutations";
import { usePagination, useDebounce } from "@/hooks";
import { ROUTE_PATHS } from "@/routes/route-paths";
import { formatDate, formatLoanStatus } from "@/utils/formatters";
import type { ItemLoan } from "@/types/entities";

export default function ItemLoanList() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [loanToDelete, setLoanToDelete] = useState<ItemLoan | null>(null);
  const [loanToReturn, setLoanToReturn] = useState<ItemLoan | null>(null);
  const debouncedSearch = useDebounce(search, 500);
  const { queryParams, sortBy, sortOrder, setSortBy, setPage, setTotalItems, page, limit } =
    usePagination();
  const { data, isLoading, isError, error, refetch } = useItemLoans({
    ...queryParams,
    search: debouncedSearch || undefined,
    ...(statusFilter && { status: statusFilter }),
  });
  const deleteMutation = useDeleteItemLoan();
  const returnMutation = useReturnItem();

  if (data?.meta?.totalItems !== undefined) setTotalItems(data.meta.totalItems);

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
          <p className="font-medium">{loan.item?.name ?? "-"}</p>
          <p className="text-sm text-gray-500">{loan.item?.itemCode}</p>
        </div>
      ),
    },
    {
      key: "user",
      header: "Peminjam",
      render: (loan: ItemLoan) => (
        <div>
          <p className="text-sm font-medium">{loan.user?.name ?? "-"}</p>
          <p className="text-xs text-gray-500">{loan.user?.email}</p>
        </div>
      ),
    },
    {
      key: "quantity",
      header: "Jumlah",
      align: "center" as const,
    },
    {
      key: "borrowDate",
      header: "Tanggal Pinjam",
      render: (loan: ItemLoan) => formatDate(loan.borrowDate),
    },
    {
      key: "dueDate",
      header: "Jatuh Tempo",
      render: (loan: ItemLoan) => formatDate(loan.dueDate),
    },
    {
      key: "status",
      header: "Status",
      align: "center" as const,
      render: (loan: ItemLoan) => getStatusBadge(loan.status),
    },
    {
      key: "actions",
      header: "Aksi",
      align: "center" as const,
      render: (loan: ItemLoan) => (
        <div className="flex gap-1 justify-center">
          {loan.status === "DIPINJAM" && (
            <Button
              size="sm"
              variant="ghost"
              className="text-green-600"
              onClick={() => setLoanToReturn(loan)}
            >
              Kembalikan
            </Button>
          )}
          <Button
            size="sm"
            variant="ghost"
            onClick={() => navigate(ROUTE_PATHS.ITEM_LOAN_DETAIL.replace(":id", loan.id))}
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

  if (isLoading) return <LoadingScreen />;
  if (isError)
    return <ErrorMessage title="Gagal memuat data" message={error?.message} onRetry={refetch} />;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Peminjaman Barang</h1>
        <Button onClick={() => navigate(ROUTE_PATHS.ITEM_LOAN_CREATE)}>+ Pinjam Barang</Button>
      </div>
      <div className="flex gap-4 items-center">
        <Input
          placeholder="Cari barang atau peminjam..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-md"
        />
        <Select
          options={[
            { value: "", label: "Semua Status" },
            { value: "DIPINJAM", label: "Dipinjam" },
            { value: "DIKEMBALIKAN", label: "Dikembalikan" },
            { value: "HILANG", label: "Hilang" },
            { value: "RUSAK", label: "Rusak" },
          ]}
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="w-48"
        />
      </div>
      {data?.data.length === 0 ? (
        <EmptyState
          title="Belum ada peminjaman"
          action={
            <Button onClick={() => navigate(ROUTE_PATHS.ITEM_LOAN_CREATE)}>Pinjam Barang</Button>
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
      {data && data.meta.totalPages > 1 && (
        <div className="flex justify-between items-center">
          <p className="text-sm text-gray-600">
            Menampilkan {(page - 1) * limit + 1}-{Math.min(page * limit, data.meta.totalItems)} dari{" "}
            {data.meta.totalItems}
          </p>
          <div className="flex gap-2">
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

      <ConfirmDialog
        isOpen={!!loanToReturn}
        onClose={() => setLoanToReturn(null)}
        onConfirm={() => {
          if (loanToReturn) {
            returnMutation.mutate({ id: loanToReturn.id });
            setLoanToReturn(null);
          }
        }}
        title="Kembalikan Barang"
        message={`Konfirmasi pengembalian ${loanToReturn?.quantity} unit "${loanToReturn?.item?.name}" dari ${loanToReturn?.user?.name}?`}
        confirmLabel="Kembalikan"
        variant="info"
        isLoading={returnMutation.isPending}
      />

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
        message={`Hapus catatan peminjaman barang "${loanToDelete?.item?.name}"?`}
        variant="danger"
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
}
