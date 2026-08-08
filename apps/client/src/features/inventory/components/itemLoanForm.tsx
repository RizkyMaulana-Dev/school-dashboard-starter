// src/features/inventory/components/ItemLoanForm.tsx
import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Select, Button, LoadingScreen, Input } from "@/components/ui";
import { SearchableSelect } from "@/components/ui/SearchableSelect";
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
        setValue: setValueCreate,
        watch: watchCreate,
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

    // Komponen readonly info
    const ReadOnlyInfo = ({ label, value }: { label: string; value: string }) => (
        <div>
            <label className="text-gray-600 text-sm">{label}</label>
            <p className="font-medium text-black">{value}</p>
        </div>
    );

    // Jika edit, tampilkan info readonly + form status
    if (isEdit && loan) {
        const isSubmitting = updateMutation.isPending;
        return (
            <div className="max-w-2xl mx-auto space-y-6">
                <h1 className="text-2xl font-bold text-black">Edit Peminjaman Barang</h1>
                <form onSubmit={handleSubmitEdit(onSubmitEdit)} className="space-y-6">
                    <div className="bg-white shadow rounded-lg p-6 space-y-4">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <ReadOnlyInfo
                                label="Barang"
                                value={`${loan.item?.name ?? "-"} (${loan.item?.itemCode})`}
                            />
                            <ReadOnlyInfo
                                label="Peminjam"
                                value={`${loan.user?.name ?? "-"} (${loan.user?.email})`}
                            />
                            <ReadOnlyInfo label="Jumlah" value={String(loan.quantity)} />
                            <ReadOnlyInfo
                                label="Tanggal Pinjam"
                                value={new Date(loan.borrowDate).toLocaleDateString("id-ID")}
                            />
                            <ReadOnlyInfo
                                label="Jatuh Tempo"
                                value={new Date(loan.dueDate).toLocaleDateString("id-ID")}
                            />
                            <ReadOnlyInfo
                                label="Tanggal Kembali"
                                value={loan.returnDate ? new Date(loan.returnDate).toLocaleDateString("id-ID") : "-"}
                            />
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

    // Tampilan tambah (create)
    const isSubmittingCreate = createMutation.isPending;

    const itemOptions = items.map((item) => ({
        value: item.id,
        label: `${item.name} (${item.itemCode}) - Stok: ${item.stockAvailable}`,
        disabled: item.stockAvailable <= 0,
    }));

    const userOptions = users
        .filter((u) => u.isActive)
        .map((user) => ({
            value: user.id,
            label: `${user.name} (${user.email})`,
        }));

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <h1 className="text-2xl font-bold text-black">Pinjam Barang</h1>
            <form
                onSubmit={handleSubmitCreate(onSubmitCreate)}
                className="bg-white shadow rounded-lg p-6 space-y-4"
            >
                <div>
                    <SearchableSelect
                        label="Barang"
                        options={itemOptions}
                        value={watchCreate("itemId") || ""}
                        onChange={(val) => setValueCreate("itemId", val, { shouldValidate: true })}
                        placeholder="Cari barang..."
                        error={errorsCreate.itemId?.message}
                        disabled={isSubmittingCreate}
                        className="text-gray-900"
                    />
                    <p className="text-xs text-gray-600 mt-1">Stok tersedia harus &gt; 0</p>
                </div>

                <div>
                    <SearchableSelect
                        label="Peminjam"
                        options={userOptions}
                        value={watchCreate("userId") || ""}
                        onChange={(val) => setValueCreate("userId", val, { shouldValidate: true })}
                        placeholder="Cari peminjam..."
                        error={errorsCreate.userId?.message}
                        disabled={isSubmittingCreate}
                        className="text-gray-900"
                    />
                    <p className="text-xs text-gray-600 mt-1">Hanya user aktif yang dapat meminjam</p>
                </div>

                <div className="grid grid-cols-3 gap-4">
                    <Input
                        label="Jumlah"
                        type="number"
                        {...registerCreate("quantity", { valueAsNumber: true })}
                        error={errorsCreate.quantity?.message}
                        disabled={isSubmittingCreate}
                        className="text-gray-900"
                    />
                    <Input
                        label="Tanggal Pinjam"
                        type="date"
                        {...registerCreate("borrowDate")}
                        error={errorsCreate.borrowDate?.message}
                        disabled={isSubmittingCreate}
                        className="text-gray-900"
                    />
                    <Input
                        label="Jatuh Tempo"
                        type="date"
                        {...registerCreate("dueDate")}
                        error={errorsCreate.dueDate?.message}
                        disabled={isSubmittingCreate}
                        className="text-gray-900"
                    />
                </div>

                <Input
                    label="Catatan (opsional)"
                    {...registerCreate("notes")}
                    disabled={isSubmittingCreate}
                    className="text-gray-900"
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