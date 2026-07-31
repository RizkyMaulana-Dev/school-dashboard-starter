// src/features/library/components/BookDetail.tsx
import { useParams, Link } from "react-router-dom";
import { useBookDetail } from "../hooks/useBooks";
import { LoadingScreen, Button } from "@/components/ui";
import { ErrorMessage } from "@/components/feedback";
import { ROUTE_PATHS } from "@/routes/route-paths";

export default function BookDetail() {
  const { id } = useParams<{ id: string }>();
  const { data, isLoading, isError, error, refetch } = useBookDetail(id);
  const book = data?.data;

  if (isLoading) return <LoadingScreen />;
  if (isError)
    return <ErrorMessage title="Gagal memuat buku" message={error?.message} onRetry={refetch} />;
  if (!book) return <ErrorMessage title="Buku tidak ditemukan" />;

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-black">{book.title}</h1>
        <Link to={ROUTE_PATHS.BOOK_EDIT.replace(":id", book.id)}>
          <Button size="sm">Edit</Button>
        </Link>
      </div>

      <div className="bg-white shadow rounded-lg p-6 grid grid-cols-2 gap-4">
        <div>
          <dt className="text-sm text-gray-500">ISBN</dt>
          <dd className="font-medium text-black">{book.isbn}</dd>
        </div>
        <div>
          <dt className="text-sm text-gray-500">Penulis</dt>
          <dd>{book.author}</dd>
        </div>
        <div>
          <dt className="text-sm text-gray-500">Penerbit</dt>
          <dd className="font-medium text-black">{book.publisher}</dd>
        </div>
        <div>
          <dt className="text-sm text-gray-500">Tahun Terbit</dt>
          <dd className="font-medium text-black">{book.publishedYear}</dd>
        </div>
        <div>
          <dt className="text-sm text-gray-500">Kategori</dt>
          <dd className="font-medium text-black">
            {book.category?.name ?? book.bookCategory?.name ?? "-"}
          </dd>
        </div>
        <div>
          <dt className="text-sm text-gray-500">Lokasi Rak</dt>
          <dd className="font-medium text-black">{book.shelfLocation || "-"}</dd>
        </div>
        <div>
          <dt className="text-sm text-gray-500">Stok Total</dt>
          <dd className="font-medium text-black">{book.stockTotal}</dd>
        </div>
        <div>
          <dt className="text-sm text-gray-500">Stok Tersedia</dt>
          <dd className="font-medium text-black">{book.stockAvailable}</dd>
        </div>
      </div>
    </div>
  );
}
