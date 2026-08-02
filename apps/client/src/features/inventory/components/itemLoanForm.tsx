// src/features/inventory/components/ItemLoanForm.tsx
import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Select, Button, LoadingScreen, Input } from "@/components/ui";
import { useItemLoanDetail } from "../hooks/useItemLoan";
import { useCreateItemLoan, useUpdateItemLoan } from "../hooks/useItemLoanMutations";
import { useItems } from "../hooks/useItems";
import { useUsers } from "@/features/user-management/hooks/useUsers";
import {
  itemLoanSchema,
  itemLoanEditSchema,
  type ItemLoanFormData,
  type ItemLoanEditFormData,
} from "@/lib/validations/inventory.schema";
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

  // Form untuk tambah
  const {
    register: registerCreate,
    handleSubmit: handleSubmitCreate,
    // reset: resetCreate,
    formState: { errors: errorsCreate },
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

  // Form untuk edit
  const {
    register: registerEdit,
    handleSubmit: handleSubmitEdit,
    reset: resetEdit,
    formState: { errors: errorsEdit },
  } = useForm<ItemLoanEditFormData>({
    resolver: zodResolver(itemLoanEditSchema),
    defaultValues: {
      status: "DIPINJAM",
      notes: "",
    },
  });

  // Reset form edit saat data loan tersedia
  useEffect(() => {
    if (loan && isEdit) {
      resetEdit({
        status: loan.status,
        notes: loan.notes ?? "",
      });
    }
  }, [loan, isEdit, resetEdit]);

  const onSubmitCreate = (data: ItemLoanFormData) => {
    createMutation.mutate(data, { onSuccess: () => navigate(ROUTE_PATHS.ITEM_LOANS) });
  };

  const onSubmitEdit = (data: ItemLoanEditFormData) => {
    if (isEdit && id) {
      updateMutation.mutate({ id, data }, { onSuccess: () => navigate(ROUTE_PATHS.ITEM_LOANS) });
    }
  };

  if (isEdit && loadingDetail) return <LoadingScreen />;

  // Jika edit, tampilkan info readonly + form status
  if (isEdit && loan) {
    const isSubmitting = updateMutation.isPending;
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <h1 className="text-2xl font-bold text-black">Edit Peminjaman Barang</h1>
        <form onSubmit={handleSubmitEdit(onSubmitEdit)} className="space-y-6">
          <div className="bg-white shadow rounded-lg p-6 space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <label className="text-gray-500">Barang</label>
                <p className="font-medium text-black">{loan.item?.name ?? "-"}</p>
                <p className="text-xs text-gray-500">{loan.item?.itemCode}</p>
              </div>
              <div>
                <label className="text-gray-500">Peminjam</label>
                <p className="font-medium text-black">{loan.user?.name ?? "-"}</p>
                <p className="text-xs text-gray-500">{loan.user?.email}</p>
              </div>
              <div>
                <label className="text-gray-500">Jumlah</label>
                <p className="font-medium text-black">{loan.quantity}</p>
              </div>
              <div>
                <label className="text-gray-500">Tanggal Pinjam</label>
                <p className="font-medium text-black">
                  {new Date(loan.borrowDate).toLocaleDateString("id-ID")}
                </p>
              </div>
              <div>
                <label className="text-gray-500">Jatuh Tempo</label>
                <p className="font-medium text-black">
                  {new Date(loan.dueDate).toLocaleDateString("id-ID")}
                </p>
              </div>
              <div>
                <label className="text-gray-500">Tanggal Kembali</label>
                <p className="font-medium text-black">
                  {loan.returnDate ? new Date(loan.returnDate).toLocaleDateString("id-ID") : "-"}
                </p>
              </div>
            </div>

            <hr />

            <Select
              label="Status"
              options={[
                { value: "DIPINJAM", label: "Dipinjam" },
                { value: "DIKEMBALIKAN", label: "Dikembalikan" },
                { value: "HILANG", label: "Hilang" },
                { value: "RUSAK", label: "Rusak" },
              ]}
              {...registerEdit("status")}
              error={errorsEdit.status?.message}
              disabled={isSubmitting}
              className="text-black"
            />

            <Input
              label="Catatan (opsional)"
              {...registerEdit("notes")}
              error={errorsEdit.notes?.message}
              disabled={isSubmitting}
              className="text-black"
            />
          </div>

          <div className="flex justify-end gap-3">
            <Button
              variant="ghost"
              type="button"
              onClick={() => navigate(ROUTE_PATHS.ITEM_LOANS)}
              disabled={isSubmitting}
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

  // Tampilan tambah (create) biasa
  const isSubmittingCreate = createMutation.isPending;
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">Pinjam Barang</h1>
      <form
        onSubmit={handleSubmitCreate(onSubmitCreate)}
        className="bg-white shadow rounded-lg p-6 space-y-4"
      >
        <Select
          label="Barang"
          options={items.map((item) => ({
            value: item.id,
            label: `${item.name} (${item.itemCode}) - Stok: ${item.stockAvailable}`,
            disabled: item.stockAvailable <= 0,
          }))}
          placeholder="Pilih barang..."
          {...registerCreate("itemId")}
          error={errorsCreate.itemId?.message}
          disabled={isSubmittingCreate}
          helperText="Stok tersedia harus > 0"
        />

        <Select
          label="Peminjam"
          options={users
            .filter((u) => u.isActive)
            .map((user) => ({ value: user.id, label: `${user.name} (${user.email})` }))}
          placeholder="Pilih peminjam..."
          {...registerCreate("userId")}
          error={errorsCreate.userId?.message}
          disabled={isSubmittingCreate}
        />

        <div className="grid grid-cols-3 gap-4">
          <Input
            label="Jumlah"
            type="number"
            {...registerCreate("quantity", { valueAsNumber: true })}
            error={errorsCreate.quantity?.message}
            disabled={isSubmittingCreate}
          />
          <Input
            label="Tanggal Pinjam"
            type="date"
            {...registerCreate("borrowDate")}
            error={errorsCreate.borrowDate?.message}
            disabled={isSubmittingCreate}
          />
          <Input
            label="Jatuh Tempo"
            type="date"
            {...registerCreate("dueDate")}
            error={errorsCreate.dueDate?.message}
            disabled={isSubmittingCreate}
          />
        </div>

        <Input
          label="Catatan (opsional)"
          {...registerCreate("notes")}
          disabled={isSubmittingCreate}
        />

        <div className="flex justify-end gap-3 pt-4">
          <Button
            variant="ghost"
            type="button"
            onClick={() => navigate(ROUTE_PATHS.ITEM_LOANS)}
            disabled={isSubmittingCreate}
          >
            Batal
          </Button>
          <Button type="submit" isLoading={isSubmittingCreate}>
            Pinjam
          </Button>
        </div>
      </form>
    </div>
  );
}
