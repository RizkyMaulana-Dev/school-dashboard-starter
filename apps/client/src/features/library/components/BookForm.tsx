// src/features/library/components/BookForm.tsx
import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input, Button, LoadingScreen } from "@/components/ui";
import { SearchableSelect } from "@/components/ui/SearchableSelect";
import { useBookDetail, useBookCategories } from "../hooks/useBooks";
import { useCreateBook, useUpdateBook } from "../hooks/useBookMutations";
import { bookSchema, type BookFormData } from "@/lib/validations/book.schema";
import { ROUTE_PATHS } from "@/routes/route-paths";

export default function BookForm() {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEdit = !!id;

    const { data: book, isLoading: loadingDetail } = useBookDetail(id);
    const {
        data: categoriesData,
        isLoading: loadingCategories,
        isError: errorCategories,
        error: catError,
    } = useBookCategories();

    const createMutation = useCreateBook();
    const updateMutation = useUpdateBook();

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        reset,
        formState: { errors },
    } = useForm<BookFormData>({
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
        if (isEdit && id) {
            updateMutation.mutate(
                { id, data },
                { onSuccess: () => navigate(ROUTE_PATHS.BOOKS) }
            );
        } else {
            createMutation.mutate(data, {
                onSuccess: () => navigate(ROUTE_PATHS.BOOKS),
            });
        }
    };

    if (isEdit && loadingDetail) return <LoadingScreen />;

    const isSubmitting = createMutation.isPending || updateMutation.isPending;

    const categoryOptions =
        categoriesData?.data?.map((cat) => ({
            value: cat.id,
            label: cat.name,
        })) ?? [];


    return (
        <div className="max-w-3xl mx-auto space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">
                    {isEdit ? "Edit Buku" : "Tambah Buku Baru"}
                </h1>
                <p className="mt-1 text-sm text-gray-600">
                    {isEdit
                        ? "Perbarui informasi buku yang sudah ada."
                        : "Isi data buku dengan lengkap untuk ditambahkan ke katalog."}
                </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Informasi Utama */}
                <div className="bg-white shadow rounded-lg p-6">
                    <h2 className="text-base font-semibold text-gray-900 mb-4">Informasi Utama</h2>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <Input
                            label="ISBN"
                            placeholder="978-xxx-xxx-xxx-x"
                            {...register("isbn")}
                            error={errors.isbn?.message}
                            disabled={isSubmitting}
                            className="text-gray-900"
                        />
                        <Input
                            label="Judul Buku"
                            placeholder="Masukkan judul buku"
                            {...register("title")}
                            error={errors.title?.message}
                            disabled={isSubmitting}
                            className="text-gray-900"
                        />
                        <Input
                            label="Penulis"
                            placeholder="Nama penulis"
                            {...register("author")}
                            error={errors.author?.message}
                            disabled={isSubmitting}
                            className="text-gray-900"
                        />
                        <Input
                            label="Penerbit"
                            placeholder="Nama penerbit"
                            {...register("publisher")}
                            error={errors.publisher?.message}
                            disabled={isSubmitting}
                            className="text-gray-900"
                        />
                        <Input
                            label="Tahun Terbit"
                            type="number"
                            placeholder="2025"
                            {...register("publishedYear", { valueAsNumber: true })}
                            error={errors.publishedYear?.message}
                            disabled={isSubmitting}
                            className="text-gray-900"
                        />

                        <div>
                            {loadingCategories && (
                                <p className="text-sm text-gray-500">Memuat kategori...</p>
                            )}
                            {errorCategories && (
                                <p className="text-sm text-red-500">
                                    Gagal memuat kategori: {catError?.message}
                                </p>
                            )}
                            {!loadingCategories && !errorCategories && (
                                <>
                                    <SearchableSelect
                                        label="Kategori"
                                        options={categoryOptions}
                                        value={watch("bookCategoryId") || ""}
                                        onChange={(val) =>
                                            setValue("bookCategoryId", val, { shouldValidate: true })
                                        }
                                        placeholder="Cari atau pilih kategori..."
                                        error={errors.bookCategoryId?.message}
                                        disabled={isSubmitting}
                                        className="text-gray-900"
                                    />
                                    <p className="text-xs text-gray-500 mt-1">
                                        Kategori membantu pengelompokan buku di katalog.
                                    </p>
                                </>
                            )}
                        </div>


                    </div>
                </div>

                {/* Stok & Lokasi */}
                <div className="bg-white shadow rounded-lg p-6">
                    <h2 className="text-base font-semibold text-gray-900 mb-4">Stok & Lokasi</h2>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                        <Input
                            label="Total Stok"
                            type="number"
                            placeholder="1"
                            {...register("stockTotal", { valueAsNumber: true })}
                            error={errors.stockTotal?.message}
                            disabled={isSubmitting}
                            className="text-gray-900"
                        />
                        <Input
                            label="Stok Tersedia"
                            type="number"
                            placeholder="1"
                            {...register("stockAvailable", { valueAsNumber: true })}
                            error={errors.stockAvailable?.message}
                            disabled={isSubmitting}
                            helperText="Tidak boleh lebih dari total stok"
                            className="text-gray-900"
                        />
                        <Input
                            label="Lokasi Rak"
                            placeholder="Rak A-1"
                            {...register("shelfLocation")}
                            error={errors.shelfLocation?.message}
                            disabled={isSubmitting}
                            className="text-gray-900"
                        />
                    </div>
                </div>

                {/* Tombol Aksi */}
                <div className="flex justify-end gap-3">
                    <Button
                        variant="ghost"
                        type="button"
                        onClick={() => navigate(ROUTE_PATHS.BOOKS)}
                        disabled={isSubmitting}
                    >
                        Batal
                    </Button>
                    <Button type="submit" isLoading={isSubmitting}>
                        {isEdit ? "Simpan Perubahan" : "Tambah Buku"}
                    </Button>
                </div>
            </form>
        </div>
    );
}