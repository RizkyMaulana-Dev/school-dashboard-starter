import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input, Select, Button, LoadingScreen } from "@/components/ui";
import { useItemLoanDetail } from "../hooks/useItemLoan";
import { useCreateItemLoan, useUpdateItemLoan } from "../hooks/useItemLoanMutations";
import { useItems } from "../hooks/useItems";
import { useUsers } from "@/features/user-management/hooks/useUsers";
import { itemLoanSchema, type ItemLoanFormData } from "@/lib/validations/inventory.schema";
import { ROUTE_PATHS } from "@/routes/route-paths";

export default function ItemLoanForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEdit = !!id;

  const { data: loanResponse, isLoading: loadingDetail } = useItemLoanDetail(id);
  const { data: itemsResponse } = useItems({ limit: 1000 });
  const { data: usersResponse } = useUsers({ limit: 1000 });

  const createMutation = useCreateItemLoan();
  const updateMutation = useUpdateItemLoan();

  const loan = loanResponse?.data;
  const items = itemsResponse?.data ?? [];
  const users = usersResponse?.data ?? [];

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ItemLoanFormData>({
    resolver: zodResolver(itemLoanSchema),
    defaultValues: {
      itemId: "",
      userId: "",
      quantity: 1,
      borrowDate: new Date().toISOString().split("T")[0],
      dueDate: "",
      notes: "",
    },
  });

  useEffect(() => {
    if (loan && isEdit) {
      reset({
        itemId: loan.itemId,
        userId: loan.userId,
        quantity: loan.quantity,
        borrowDate: loan.borrowDate.split("T")[0],
        dueDate: loan.dueDate.split("T")[0],
        notes: loan.notes ?? "",
      });
    }
  }, [loan, isEdit, reset]);

  const onSubmit = (data: ItemLoanFormData) => {
    if (isEdit && id) {
      updateMutation.mutate({ id, data }, { onSuccess: () => navigate(ROUTE_PATHS.ITEM_LOANS) });
    } else {
      createMutation.mutate(data, { onSuccess: () => navigate(ROUTE_PATHS.ITEM_LOANS) });
    }
  };

  if (isEdit && loadingDetail) return <LoadingScreen />;

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">{isEdit ? "Edit Peminjaman" : "Pinjam Barang"}</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="bg-white shadow rounded-lg p-6 space-y-4">
        <Select
          label="Barang"
          options={items.map((item) => ({
            value: item.id,
            label: `${item.name} (${item.itemCode}) - Stok: ${item.stockAvailable}`,
            disabled: item.stockAvailable <= 0,
          }))}
          placeholder="Pilih barang..."
          {...register("itemId")}
          error={errors.itemId?.message}
          disabled={isEdit || isSubmitting}
          helperText={!isEdit ? "Stok tersedia harus > 0" : "Barang tidak dapat diubah"}
        />

        <Select
          label="Peminjam"
          options={users
            .filter((u) => u.isActive)
            .map((user) => ({ value: user.id, label: `${user.name} (${user.email})` }))}
          placeholder="Pilih peminjam..."
          {...register("userId")}
          error={errors.userId?.message}
          disabled={isSubmitting}
        />

        <div className="grid grid-cols-3 gap-4">
          <Input
            label="Jumlah"
            type="number"
            {...register("quantity", { valueAsNumber: true })}
            error={errors.quantity?.message}
            disabled={isSubmitting}
          />
          <Input
            label="Tanggal Pinjam"
            type="date"
            {...register("borrowDate")}
            error={errors.borrowDate?.message}
            disabled={isSubmitting}
          />
          <Input
            label="Jatuh Tempo"
            type="date"
            {...register("dueDate")}
            error={errors.dueDate?.message}
            disabled={isSubmitting}
          />
        </div>

        <Input label="Catatan (opsional)" {...register("notes")} disabled={isSubmitting} />

        <div className="flex justify-end gap-3 pt-4">
          <Button
            variant="ghost"
            type="button"
            onClick={() => navigate(ROUTE_PATHS.ITEM_LOANS)}
            disabled={isSubmitting}
          >
            Batal
          </Button>
          <Button type="submit" isLoading={isSubmitting}>
            {isEdit ? "Update" : "Pinjam"}
          </Button>
        </div>
      </form>
    </div>
  );
}
