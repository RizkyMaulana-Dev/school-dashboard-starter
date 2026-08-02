import { useParams, Link } from "react-router-dom";
import { useItemCategoryDetail } from "../hooks/useItemCategories";
import { LoadingScreen, Button } from "@/components/ui";
import { ErrorMessage } from "@/components/feedback";
import { ROUTE_PATHS } from "@/routes/route-paths";

export default function ItemCategoryDetail() {
  const { id } = useParams<{ id: string }>();
  const { data, isLoading, isError, error, refetch } = useItemCategoryDetail(id);
  const category = data?.data;

  if (isLoading) return <LoadingScreen />;
  if (isError)
    return (
      <ErrorMessage title="Gagal memuat kategori" message={error?.message} onRetry={refetch} />
    );
  if (!category) return <ErrorMessage title="Kategori tidak ditemukan" />;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">{category.name}</h1>
        <Link to={ROUTE_PATHS.ITEM_CATEGORY_EDIT.replace(":id", category.id)}>
          <Button size="sm" variant="outline">
            Edit
          </Button>
        </Link>
      </div>
      <div className="bg-white shadow rounded-lg p-6">
        <dl className="grid grid-cols-2 gap-4">
          <div>
            <dt className="text-sm text-gray-500">Nama</dt>
            <dd className="font-medium text-gray-900">{category.name}</dd>
          </div>
          <div>
            <dt className="text-sm text-gray-500">Deskripsi</dt>
            <dd className="font-medium text-gray-900">{category.description || "-"}</dd>
          </div>
          {/* Bisa tambahkan jumlah item di sini jika endpoint menyediakan */}
        </dl>
      </div>
    </div>
  );
}
