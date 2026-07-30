import { useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input, Select, Button, LoadingScreen } from "@/components/ui";
import { useBookDetail, useBookCategories } from "../hooks/useBooks";
import { useCreateBook, useUpdateBook } from "../hooks/useBookMutations";
import { bookSchema, type BookFormData } from "@/lib/validations/book.schema";
import { ROUTE_PATHS } from "@/routes/route-paths";
import { useEffect } from "react";

export default function BookForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;
  const { data: book, isLoading: loadingDetail } = useBookDetail(id);
  const { data: categoriesData } = useBookCategories();
  const createMutation = useCreateBook();
  const updateMutation = useUpdateBook();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(bookSchema),
    defaultValues: {
      isbn: "",
      title: "",
      author: "",
      publisher: "",
      publishedYear: new Date().getFullYear(),
      bookCategoryId: "",
      stockTotal: 1,
      stockAvailable: 1,
      shelfLocation: "",
      coverImage: "",
    },
  });

  useEffect(() => {
    if (book?.data) {
      const b = book.data;
      reset({
        isbn: b.isbn,
        title: b.title,
        author: b.author,
        publisher: b.publisher,
        publishedYear: b.publishedYear,
        bookCategoryId: b.bookCategoryId,
        stockTotal: b.stockTotal,
        stockAvailable: b.stockAvailable,
        shelfLocation: b.shelfLocation ?? "",
        coverImage: b.coverImage ?? "",
      });
    }
  }, [book, reset]);

  const onSubmit = (data: BookFormData) => {
    if (isEdit && id)
      updateMutation.mutate({ id, data }, { onSuccess: () => navigate(ROUTE_PATHS.BOOKS) });
    else createMutation.mutate(data, { onSuccess: () => navigate(ROUTE_PATHS.BOOKS) });
  };

  if (isEdit && loadingDetail) return <LoadingScreen />;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">{isEdit ? "Edit Buku" : "Tambah Buku"}</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="bg-white shadow p-6 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <Input label="ISBN" {...register("isbn")} error={errors.isbn?.message} />
          <Input label="Judul" {...register("title")} error={errors.title?.message} />
        </div>
        <Input label="Penulis" {...register("author")} error={errors.author?.message} />
        <Input label="Penerbit" {...register("publisher")} error={errors.publisher?.message} />
        <Input
          label="Tahun Terbit"
          type="number"
          {...register("publishedYear", { valueAsNumber: true })}
          error={errors.publishedYear?.message}
        />
        <Select
          label="Kategori"
          options={categoriesData?.data?.map((c) => ({ value: c.id, label: c.name })) || []}
          {...register("bookCategoryId")}
          error={errors.bookCategoryId?.message}
        />
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Total Stok"
            type="number"
            {...register("stockTotal", { valueAsNumber: true })}
            error={errors.stockTotal?.message}
          />
          <Input
            label="Stok Tersedia"
            type="number"
            {...register("stockAvailable", { valueAsNumber: true })}
            error={errors.stockAvailable?.message}
          />
        </div>
        <Input label="Lokasi Rak" {...register("shelfLocation")} />
        <div className="flex justify-end gap-3">
          <Button variant="ghost" onClick={() => navigate(ROUTE_PATHS.BOOKS)}>
            Batal
          </Button>
          <Button type="submit" isLoading={createMutation.isPending || updateMutation.isPending}>
            Simpan
          </Button>
        </div>
      </form>
    </div>
  );
}
