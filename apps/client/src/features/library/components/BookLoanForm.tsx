import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input, Select, Button, LoadingScreen } from "@/components/ui";
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
    },
  });

  useEffect(() => {
    if (loan && isEdit) {
      reset({
        bookId: loan.bookId,
        userId: loan.userId,
        borrowDate: loan.borrowDate.split("T")[0],
        dueDate: loan.dueDate.split("T")[0],
        notes: loan.notes ?? "",
      });
    }
  }, [loan, isEdit, reset]);

  const onSubmit = (data: BookLoanFormData) => {
    if (isEdit && id) {
      updateMutation.mutate({ id, data }, { onSuccess: () => navigate(ROUTE_PATHS.BOOK_LOANS) });
    } else {
      createMutation.mutate(data, {
        onSuccess: () => navigate(ROUTE_PATHS.BOOK_LOANS),
      });
    }
  };

  if (isEdit && isLoadingDetail) {
    return <LoadingScreen message="Memuat data peminjaman..." />;
  }

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          {isEdit ? "Edit Peminjaman" : "Pinjam Buku"}
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          {isEdit ? "Perbarui data peminjaman" : "Catat peminjaman buku baru"}
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="bg-white shadow rounded-lg p-6 space-y-4">
        {/* Pilih Buku */}
        <Select
          label="Buku"
          options={books.map((book) => ({
            value: book.id,
            label: `${book.title} (${book.isbn}) - Stok: ${book.stockAvailable}`,
            disabled: book.stockAvailable <= 0,
          }))}
          placeholder="Pilih buku..."
          {...register("bookId")}
          error={errors.bookId?.message}
          disabled={isEdit || isSubmitting}
          helperText={!isEdit ? "Stok tersedia harus > 0" : "Buku tidak dapat diubah saat edit"}
        />

        {/* Pilih Peminjam */}
        <Select
          label="Peminjam"
          options={users
            .filter((user) => user.isActive)
            .map((user) => ({
              value: user.id,
              label: `${user.name} (${user.email})`,
            }))}
          placeholder="Pilih peminjam..."
          {...register("userId")}
          error={errors.userId?.message}
          disabled={isSubmitting}
          helperText="Hanya user aktif yang dapat meminjam"
        />

        <div className="grid grid-cols-2 gap-4">
          {/* Tanggal Pinjam */}
          <Input
            label="Tanggal Pinjam"
            type="date"
            {...register("borrowDate")}
            error={errors.borrowDate?.message}
            disabled={isSubmitting}
          />

          {/* Tanggal Jatuh Tempo */}
          <Input
            label="Jatuh Tempo"
            type="date"
            {...register("dueDate")}
            error={errors.dueDate?.message}
            disabled={isSubmitting}
          />
        </div>

        {/* Catatan */}
        <Input
          label="Catatan (opsional)"
          placeholder="Tambahkan catatan..."
          {...register("notes")}
          error={errors.notes?.message}
          disabled={isSubmitting}
        />

        {/* Tombol Aksi */}
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
