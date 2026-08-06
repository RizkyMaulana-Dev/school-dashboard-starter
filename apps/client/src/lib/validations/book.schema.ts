import { z } from "zod";
export const bookSchema = z.object({
  isbn: z.string().min(1, "ISBN wajib diisi"),
  title: z.string().min(1, "Judul wajib diisi"),
  author: z.string().min(1, "Penulis wajib diisi"),
  publisher: z.string().min(1, "Penerbit wajib diisi"),
  publishedYear: z.number().int().min(1900).max(2100, "Tahun tidak valid"),
  bookCategoryId: z.string().min(1, "Kategori wajib dipilih"),
  stockTotal: z.number().int().min(1, "Minimal 1"),
  stockAvailable: z.number().int().min(0, "Tidak boleh negatif"),
  shelfLocation: z.string().optional(),
  coverImage: z.string().optional(),
});

export type BookFormData = z.infer<typeof bookSchema>;

export const bookLoanSchema = z.object({
  bookId: z.string().min(1, "Wajib ada book id"),
  userId: z.string().min(1, "Wajib ada user id"),
  borrowDate: z.string().min(1, "wajib ada borrow date"),
  dueDate: z.string().min(1, "Wajib ada due date"),
  status: z.enum(["DIPINJAM", "DIKEMBALIKAN", "TERLAMBAT", "HILANG"]).optional(),
  notes: z.string().optional(),
});
export type BookLoanFormData = z.infer<typeof bookLoanSchema>;
