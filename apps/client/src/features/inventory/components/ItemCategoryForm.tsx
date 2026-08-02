import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input, Button, LoadingScreen } from "@/components/ui";
import { useItemCategoryDetail } from "../hooks/useItemCategories";
import { useCreateItemCategory, useUpdateItemCategory } from "../hooks/useItemCategoryMutations";
import { ROUTE_PATHS } from "@/routes/route-paths";

const schema = z.object({
  name: z.string().min(1, "Nama wajib diisi"),
  description: z.string().optional().nullable(),
});

type FormData = z.infer<typeof schema>;

export default function ItemCategoryForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEdit = !!id;
  const { data: detail, isLoading } = useItemCategoryDetail(id);
  const createMutation = useCreateItemCategory();
  const updateMutation = useUpdateItemCategory();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { name: "", description: "" },
  });

  useEffect(() => {
    if (detail?.data) reset({ name: detail.data.name, description: detail.data.description });
  }, [detail, reset]);

  const onSubmit = (data: FormData) => {
    // Normalisasi: null → undefined
    const payload = {
      name: data.name,
      description: data.description ?? undefined,
    };

    if (isEdit && id) {
      updateMutation.mutate(
        { id, data: payload },
        { onSuccess: () => navigate(ROUTE_PATHS.ITEM_CATEGORIES) },
      );
    } else {
      createMutation.mutate(payload, {
        onSuccess: () => navigate(ROUTE_PATHS.ITEM_CATEGORIES),
      });
    }
  };
  if (isEdit && isLoading) return <LoadingScreen />;

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">{isEdit ? "Edit Kategori" : "Tambah Kategori"}</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="bg-white shadow rounded-lg p-6 space-y-4">
        <Input
          label="Nama"
          {...register("name")}
          error={errors.name?.message}
          disabled={isSubmitting}
        />
        <Input
          label="Deskripsi"
          {...register("description")}
          error={errors.description?.message}
          disabled={isSubmitting}
        />
        <div className="flex justify-end gap-3">
          <Button
            variant="ghost"
            type="button"
            onClick={() => navigate(ROUTE_PATHS.ITEM_CATEGORIES)}
          >
            Batal
          </Button>
          <Button type="submit" isLoading={isSubmitting}>
            Simpan
          </Button>
        </div>
      </form>
    </div>
  );
}
