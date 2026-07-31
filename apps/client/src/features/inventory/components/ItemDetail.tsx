// src/features/inventory/components/ItemDetail.tsx
import { useParams, Link } from "react-router-dom";
import { useItemDetail } from "../hooks/useItems";
import { LoadingScreen, Badge, Button } from "@/components/ui";
import { ErrorMessage } from "@/components/feedback";
import { ROUTE_PATHS } from "@/routes/route-paths";
import { formatItemCondition } from "@/utils/formatters";

export default function ItemDetail() {
  const { id } = useParams<{ id: string }>();
  const { data, isLoading, isError, error, refetch } = useItemDetail(id);
  const item = data?.data;

  if (isLoading) return <LoadingScreen />;
  if (isError)
    return <ErrorMessage title="Gagal memuat barang" message={error?.message} onRetry={refetch} />;
  if (!item) return <ErrorMessage title="Barang tidak ditemukan" />;

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-black">{item.name}</h1>
        <Link to={ROUTE_PATHS.ITEM_EDIT.replace(":id", item.id)}>
          <Button size="sm">Edit</Button>
        </Link>
      </div>

      <div className="bg-white shadow rounded-lg p-6 grid grid-cols-2 gap-4">
        <div>
          <dt className="text-sm text-gray-500">Kode Barang</dt>
          <dd className="font-medium text-black">{item.itemCode}</dd>
        </div>
        <div>
          <dt className="text-sm text-gray-500">Kategori</dt>
          <dd className="text-black">{item.category?.name ?? "-"}</dd>
        </div>
        <div>
          <dt className="text-sm text-gray-500">Kondisi</dt>
          <dd className="text-black">
            <Badge variant={item.condition === "BAIK" ? "success" : "warning"}>
              {formatItemCondition(item.condition)}
            </Badge>
          </dd>
        </div>
        <div>
          <dt className="text-sm text-gray-500">Stok Total</dt>
          <dd className="text-black">{item.stockTotal}</dd>
        </div>
        <div>
          <dt className="text-sm text-gray-500">Stok Tersedia</dt>
          <dd className="text-black">{item.stockAvailable}</dd>
        </div>
        <div>
          <dt className="text-sm text-gray-500">Lokasi</dt>
          <dd className="text-black">{item.location || "-"}</dd>
        </div>
        <div>
          <dt className="text-sm text-gray-500">Tanggal Pembelian</dt>
          <dd className="text-black">
            {item.purchaseDate ? new Date(item.purchaseDate).toLocaleDateString("id-ID") : "-"}
          </dd>
        </div>
      </div>
    </div>
  );
}
