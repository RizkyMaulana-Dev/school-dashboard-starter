import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Table, Button, Input, Badge, Select, LoadingScreen } from "@/components/ui";
import { ConfirmDialog, ErrorMessage, EmptyState } from "@/components/feedback";
import { Pagination } from "@/components/ui/Pagination";
import { useItemLoans } from "../hooks/useItemLoan"; // perbaikan import
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

  // Reset halaman saat filter atau pencarian berubah
  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, statusFilter, setPage]);

  // Sinkronkan total dari meta backend
  useEffect(() => {
    if (data?.meta?.total !== undefined) {
      setTotalItems(data.meta.total);
    }
  }, [data?.meta?.total, setTotalItems]);

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

  if (isLoading && !data) return <LoadingScreen />;
  if (isError)
    return <ErrorMessage title="Gagal memuat data" message={error?.message} onRetry={refetch} />;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-black">Peminjaman Barang</h1>
        <Button onClick={() => navigate(ROUTE_PATHS.ITEM_LOAN_CREATE)}>+ Pinjam Barang</Button>
      </div>
      <div className="flex gap-4 items-center">
        <Input
          placeholder="Cari barang atau peminjam..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-md text-black"
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
          className="w-48 text-black"
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
          onRowClick={(user) => navigate(ROUTE_PATHS.ITEM_LOAN_DETAIL.replace(":id", user.id))}
        />
      )}

      {/* Pagination */}
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
