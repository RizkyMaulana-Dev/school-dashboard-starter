import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input, Select, Button, LoadingScreen } from "@/components/ui";
import { useItemDetail } from "../hooks/useItems";
import { useCreateItem, useUpdateItem } from "../hooks/useItemMutations";
import { useItemCategories } from "../hooks/useItemCategories"; // buat hook untuk kategori item
import { itemSchema, type ItemFormData } from "@/lib/validations/inventory.schema";
import { ROUTE_PATHS } from "@/routes/route-paths";

export default function ItemForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEdit = !!id;

  const { data: itemResponse, isLoading: loadingDetail } = useItemDetail(id);
  const { data: categoriesData } = useItemCategories(); // pastikan hook ini ada
  const createMutation = useCreateItem();
  const updateMutation = useUpdateItem();

  const item = itemResponse?.data;
  const categories = categoriesData?.data ?? [];

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<ItemFormData>({
    resolver: zodResolver(itemSchema),
    defaultValues: {
      itemCode: "",
      name: "",
      categoryId: "",
      stockTotal: 1,
      stockAvailable: 1,
      condition: "BAIK",
      location: "",
      purchaseDate: "",
    },
  });

  useEffect(() => {
    if (item) {
      reset({
        itemCode: item.itemCode,
        name: item.name,
        categoryId: item.categoryId,
        stockTotal: item.stockTotal,
        stockAvailable: item.stockAvailable,
        condition: item.condition,
        location: item.location ?? "",
        purchaseDate: item.purchaseDate?.split("T")[0] ?? "",
      });
    }
  }, [item, reset]);

  const onSubmit = (data: ItemFormData) => {
    if (isEdit && id) {
      updateMutation.mutate({ id, data }, { onSuccess: () => navigate(ROUTE_PATHS.ITEMS) });
    } else {
      createMutation.mutate(data, { onSuccess: () => navigate(ROUTE_PATHS.ITEMS) });
    }
  };

  if (isEdit && loadingDetail) return <LoadingScreen />;

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">{isEdit ? "Edit Barang" : "Tambah Barang"}</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="bg-white shadow rounded-lg p-6 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Kode Barang (SKU)"
            {...register("itemCode")}
            error={errors.itemCode?.message}
            disabled={isSubmitting}
          />
          <Input
            label="Nama Barang"
            {...register("name")}
            error={errors.name?.message}
            disabled={isSubmitting}
          />
        </div>
        <Select
          label="Kategori"
          options={categories.map((cat) => ({ value: cat.id, label: cat.name }))}
          {...register("categoryId")}
          error={errors.categoryId?.message}
          disabled={isSubmitting}
          placeholder="Pilih kategori"
        />
        <div className="grid grid-cols-3 gap-4">
          <Input
            label="Stok Total"
            type="number"
            {...register("stockTotal", { valueAsNumber: true })}
            error={errors.stockTotal?.message}
            disabled={isSubmitting}
          />
          <Input
            label="Stok Tersedia"
            type="number"
            {...register("stockAvailable", { valueAsNumber: true })}
            error={errors.stockAvailable?.message}
            disabled={isSubmitting}
          />
          <Select
            label="Kondisi"
            options={[
              { value: "BAIK", label: "Baik" },
              { value: "RUSAK_RINGAN", label: "Rusak Ringan" },
              { value: "RUSAK_BERAT", label: "Rusak Berat" },
            ]}
            {...register("condition")}
            error={errors.condition?.message}
            disabled={isSubmitting}
          />
        </div>
        <Input label="Lokasi" {...register("location")} disabled={isSubmitting} />
        <Input
          label="Tanggal Pembelian"
          type="date"
          {...register("purchaseDate")}
          disabled={isSubmitting}
        />
        <div className="flex justify-end gap-3 pt-4">
          <Button
            variant="ghost"
            type="button"
            onClick={() => navigate(ROUTE_PATHS.ITEMS)}
            disabled={isSubmitting}
          >
            Batal
          </Button>
          <Button type="submit" isLoading={isSubmitting}>
            {isEdit ? "Update" : "Simpan"}
          </Button>
        </div>
      </form>
    </div>
  );
}
