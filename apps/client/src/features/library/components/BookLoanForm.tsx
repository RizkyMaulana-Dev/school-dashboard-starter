// src/features/library/components/BookLoanForm.tsx
import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input, Button, Select, LoadingScreen } from "@/components/ui";
import { SearchableSelect } from "@/components/ui/SearchableSelect";
import { useBookLoanDetail } from "../hooks/useBookLoan";
import { useCreateBookLoan, useUpdateBookLoan } from "../hooks/useBookLoanMutations";
import { useBooks } from "../hooks/useBooks";
import { useUsers } from "@/features/user-management/hooks/useUsers";
import { bookLoanSchema, type BookLoanFormData } from "@/lib/validations/book.schema";
import { ROUTE_PATHS } from "@/routes/route-paths";

export default function BookLoanForm() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const isEdit = !!id;

    const { data: loanResponse, isLoading: isLoadingDetail } = useBookLoanDetail(id);
    const { data: booksResponse } = useBooks({ limit: 1000 });
    const { data: usersResponse } = useUsers({ limit: 1000 });

    const createMutation = useCreateBookLoan();
    const updateMutation = useUpdateBookLoan();

    const loan = loanResponse?.data;
    const books = booksResponse?.data ?? [];
    const users = usersResponse?.data ?? [];

    const {
        register,
        handleSubmit,
        control,
        watch,
        reset,
        formState: { errors },
    } = useForm<BookLoanFormData>({
        resolver: zodResolver(bookLoanSchema),
        defaultValues: {
            bookId: "",
            userId: "",
            borrowDate: new Date().toISOString().split("T")[0],
            dueDate: "",
            notes: "",
            status: "DIPINJAM",
        },
    });

    useEffect(() => {
        if (loan && isEdit) {
            reset({
                bookId: loan.book?.id ?? loan.bookId,
                userId: loan.user?.id ?? loan.userId,
                borrowDate: loan.borrowDate ? loan.borrowDate.split("T")[0] : "",
                dueDate: loan.dueDate ? loan.dueDate.split("T")[0] : "",
                notes: loan.notes ?? "",
                status: loan.status,
            });
        }
    }, [loan, isEdit, reset]);

    const onSubmit = (data: BookLoanFormData) => {
        if (isEdit && id) {
            updateMutation.mutate(
                { id, data },
                {
                    onSuccess: () => navigate(ROUTE_PATHS.BOOK_LOANS),
                    onError: (err) => console.error(err),
                }
            );
        } else {
            createMutation.mutate(data, {
                onSuccess: () => navigate(ROUTE_PATHS.BOOK_LOANS),
                onError: (err) => console.error(err),
            });
        }
    };

    if (isEdit && isLoadingDetail) {
        return <LoadingScreen message="Memuat data peminjaman..." />;
    }

    const isSubmitting = createMutation.isPending || updateMutation.isPending;

    const bookOptions = books.map((book) => ({
        value: book.id,
        label: `${book.title} (${book.isbn}) - Stok: ${book.stockAvailable}`,
        disabled: book.stockAvailable <= 0,
    }));

    const userOptions = users
        .filter((user) => user.isActive)
        .map((user) => ({
            value: user.id,
            label: `${user.name} (${user.email})`,
        }));

    const readOnlyDivClass =
        "w-full rounded-md border border-gray-300 px-3 py-2 text-sm bg-gray-100 text-gray-900 cursor-not-allowed select-none";

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">
                    {isEdit ? "Edit Peminjaman" : "Pinjam Buku"}
                </h1>
                <p className="mt-1 text-sm text-gray-600">
                    {isEdit ? "Perbarui data peminjaman" : "Catat peminjaman buku baru"}
                </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="bg-white shadow rounded-lg p-6 space-y-4">
                {/* Buku */}
                <Controller
                    name="bookId"
                    control={control}
                    render={({ field }) => (
                        isEdit ? (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Buku</label>
                                <div className={readOnlyDivClass}>
                                    {loan?.book?.title ?? "-"} ({loan?.book?.isbn ?? "-"})
                                </div>
                            </div>
                        ) : (
                            <div>
                                <SearchableSelect
                                    label="Buku"
                                    options={bookOptions}
                                    value={field.value || ""}
                                    onChange={(val: any) => {
                                        const stringValue = typeof val === 'object' && val !== null ? val.value : val;
                                        field.onChange(stringValue || "");
                                    }}
                                    placeholder="Cari judul buku..."
                                    error={errors.bookId?.message}
                                    disabled={isSubmitting}
                                    className="text-gray-900"
                                />
                                <p className="text-xs text-gray-600 mt-1">Stok tersedia harus &gt; 0</p>
                            </div>
                        )
                    )}
                />

                {/* Peminjam */}
                <Controller
                    name="userId"
                    control={control}
                    render={({ field }) => (
                        isEdit ? (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Peminjam</label>
                                <div className={readOnlyDivClass}>
                                    {loan?.user?.name ?? "-"} ({loan?.user?.email ?? "-"})
                                </div>
                            </div>
                        ) : (
                            <div>
                                <SearchableSelect
                                    label="Peminjam"
                                    options={userOptions}
                                    value={field.value || ""}
                                    onChange={(val: any) => {
                                        const stringValue = typeof val === 'object' && val !== null ? val.value : val;
                                        field.onChange(stringValue || "");
                                    }}
                                    placeholder="Cari nama peminjam..."
                                    error={errors.userId?.message}
                                    disabled={isSubmitting}
                                    className="text-gray-900"
                                />
                                <p className="text-xs text-gray-600 mt-1">Hanya user aktif yang dapat meminjam</p>
                            </div>
                        )
                    )}
                />

                <div className="grid grid-cols-2 gap-4">
                    {/* Tanggal Pinjam – readonly saat edit */}
                    {isEdit ? (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal Pinjam</label>
                            <div className={readOnlyDivClass}>
                                {watch("borrowDate")
                                    ? new Date(watch("borrowDate")).toLocaleDateString("id-ID")
                                    : "-"}
                            </div>
                        </div>
                    ) : (
                        <Input
                            label="Tanggal Pinjam"
                            type="date"
                            {...register("borrowDate")}
                            error={errors.borrowDate?.message}
                            className="text-gray-900"
                        />
                    )}

                    {/* Jatuh Tempo – tetap bisa diedit */}
                    <Input
                        label="Jatuh Tempo"
                        type="date"
                        {...register("dueDate")}
                        error={errors.dueDate?.message}
                        disabled={isSubmitting}
                        className="text-gray-900"
                    />
                </div>

                {/* Status – hanya saat edit */}
                {isEdit && (
                    <Select
                        label="Status"
                        options={[
                            { value: "DIPINJAM", label: "Dipinjam" },
                            { value: "DIKEMBALIKAN", label: "Dikembalikan" },
                            { value: "TERLAMBAT", label: "Terlambat" },
                            { value: "HILANG", label: "Hilang" },
                        ]}
                        {...register("status")}
                        error={errors.status?.message}
                        disabled={isSubmitting}
                        className="text-gray-900"
                    />
                )}

                {/* Catatan */}
                <Input
                    label="Catatan (opsional)"
                    placeholder="Tambahkan catatan..."
                    {...register("notes")}
                    error={errors.notes?.message}
                    disabled={isSubmitting}
                    className="text-gray-900"
                />

                {Object.keys(errors).length > 0 && (
                    <div className="bg-red-50 text-red-700 p-3 rounded-lg text-sm">
                        Mohon periksa kembali data yang diisi.
                        <ul className="list-disc pl-5 mt-2">
                            {Object.entries(errors).map(([key, err]) => (
                                <li key={key}>{err?.message}</li>
                            ))}
                        </ul>
                    </div>
                )}

                <div className="flex justify-end gap-3 pt-4">
                    <Button
                        variant="ghost"
                        type="button"
                        onClick={() => navigate(ROUTE_PATHS.BOOK_LOANS)}
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