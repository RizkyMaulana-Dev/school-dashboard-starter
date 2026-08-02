// src/features/inventory/components/ItemLoanDetail.tsx
import { useParams, Link } from "react-router-dom";
import { useItemLoanDetail } from "../hooks/useItemLoan";
import { LoadingScreen, Badge, Button } from "@/components/ui";
import { ErrorMessage } from "@/components/feedback";
import { ROUTE_PATHS } from "@/routes/route-paths";
import { formatDate } from "@/utils/formatters";

export default function ItemLoanDetail() {
  const { id } = useParams<{ id: string }>();
  const { data, isLoading, isError, error, refetch } = useItemLoanDetail(id);
  const loan = data?.data;

  if (isLoading) return <LoadingScreen />;
  if (isError)
    return <ErrorMessage title="Gagal memuat" message={error?.message} onRetry={refetch} />;
  if (!loan) return <ErrorMessage title="Data tidak ditemukan" />;

  const statusMap: Record<string, "success" | "warning" | "error" | "info"> = {
    DIPINJAM: "info",
    DIKEMBALIKAN: "success",
    HILANG: "error",
    RUSAK: "warning",
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-black">Detail Peminjaman Barang</h1>
        <Link to={ROUTE_PATHS.ITEM_LOAN_EDIT.replace(":id", loan.id)}>
          <Button size="sm" variant="outline">
            Edit
          </Button>
        </Link>
      </div>

      <div className="bg-white shadow rounded-lg p-6 grid grid-cols-2 gap-4">
        {/* Informasi sama seperti sebelumnya */}
        <div>
          <dt className="text-sm text-gray-500">Barang</dt>
          <dd className="text-black">
            {loan.item ? (
              <Link
                to={ROUTE_PATHS.ITEM_DETAIL.replace(":id", loan.item.id)}
                className="text-blue-600 hover:underline"
              >
                {loan.item.name}
              </Link>
            ) : (
              "-"
            )}
            ({loan.item?.itemCode})
          </dd>
        </div>
        <div>
          <dt className="text-sm text-gray-500">Peminjam</dt>
          <dd className="text-black">
            {loan.user ? (
              <Link
                to={ROUTE_PATHS.USER_DETAIL.replace(":id", loan.user.id)}
                className="text-blue-600 hover:underline"
              >
                {loan.user.name}
              </Link>
            ) : (
              "-"
            )}
          </dd>
        </div>
        <div>
          <dt className="text-sm text-gray-500">Jumlah</dt>
          <dd className="text-black">{loan.quantity}</dd>
        </div>
        <div>
          <dt className="text-sm text-gray-500">Tanggal Pinjam</dt>
          <dd className="text-black">{formatDate(loan.borrowDate)}</dd>
        </div>
        <div>
          <dt className="text-sm text-gray-500">Jatuh Tempo</dt>
          <dd className="text-black">{formatDate(loan.dueDate)}</dd>
        </div>
        <div>
          <dt className="text-sm text-gray-500">Tanggal Kembali</dt>
          <dd className="text-black">{loan.returnDate ? formatDate(loan.returnDate) : "-"}</dd>
        </div>
        <div>
          <dt className="text-sm text-gray-500">Status</dt>
          <dd className="text-black">
            <Badge variant={statusMap[loan.status] || "default"}>{loan.status}</Badge>
          </dd>
        </div>
        <div className="col-span-2">
          <dt className="text-sm text-gray-500">Catatan</dt>
          <dd className="text-black">{loan.notes || "-"}</dd>
        </div>
      </div>
    </div>
  );
}
