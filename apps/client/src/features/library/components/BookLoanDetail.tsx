// src/features/library/components/BookLoanDetail.tsx
import { useParams, Link } from "react-router-dom";
import { useBookLoanDetail } from "../hooks/useBookLoan";
import { LoadingScreen, Badge } from "@/components/ui";
import { ErrorMessage } from "@/components/feedback";
import { ROUTE_PATHS } from "@/routes/route-paths";
import { formatDate } from "@/utils/formatters";

export default function BookLoanDetail() {
  const { id } = useParams<{ id: string }>();
  const { data, isLoading, isError, error, refetch } = useBookLoanDetail(id);
  const loan = data?.data;

  if (isLoading) return <LoadingScreen />;
  if (isError)
    return (
      <ErrorMessage title="Gagal memuat peminjaman" message={error?.message} onRetry={refetch} />
    );
  if (!loan) return <ErrorMessage title="Peminjaman tidak ditemukan" />;

  const getStatusBadge = (status: string) => {
    const map: Record<string, "success" | "warning" | "error" | "info"> = {
      DIPINJAM: "info",
      DIKEMBALIKAN: "success",
      TERLAMBAT: "error",
      HILANG: "error",
    };
    return <Badge variant={map[status] || "default"}>{status}</Badge>;
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold text-black">Detail Peminjaman Buku</h1>

      <div className="bg-white shadow rounded-lg p-6 grid grid-cols-2 gap-4">
        <div>
          <dt className="text-sm text-gray-500">Buku</dt>
          <dd>
            {loan.book ? (
              <Link
                to={ROUTE_PATHS.BOOK_DETAIL.replace(":id", loan.book.id)}
                className="text-blue-600 hover:underline"
              >
                {loan.book.title}
              </Link>
            ) : (
              "-"
            )}
            <br />
            <span className="text-sm text-gray-500">{loan.book?.isbn}</span>
          </dd>
        </div>
        <div>
          <dt className="text-sm text-gray-500">Peminjam</dt>
          <dd>
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
            <br />
            <span className="text-sm text-gray-500">{loan.user?.email}</span>
          </dd>
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
          <dt className="text-sm text-gray-500">Denda</dt>
          <dd className="text-black">
            {loan.fineAmount ? `Rp ${loan.fineAmount.toLocaleString()}` : "-"}
          </dd>
        </div>
        <div>
          <dt className="text-sm text-gray-500">Status</dt>
          <dd className="text-black">{getStatusBadge(loan.status)}</dd>
        </div>
        <div className="col-span-2">
          <dt className="text-sm text-gray-500">Catatan</dt>
          <dd className="text-black">{loan.notes || "-"}</dd>
        </div>
      </div>
    </div>
  );
}
