import { z } from "zod";

export const createBookLoanSchema = z.object({
  bookId: z.string().min(1, "Buku wajib dipilih"),
  userId: z.string().min(1, "Peminjam wajib dipilih"),
  dueDate: z.coerce.date().min(new Date(), "Batas waktu harus di masa depan"),
  notes: z.string().max(500).optional(),
});

export const updateBookLoanSchema = z.object({
  status: z.enum(["DIPINJAM", "DIKEMBALIKAN", "TERLAMBAT", "HILANG"]).optional(),
  returnDate: z.coerce.date().optional(),
  fineAmount: z.number().min(0, "Denda tidak boleh negatif").optional(),
  notes: z.string().max(500).optional(),
});

export const bookLoanQuerySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(10),
  search: z.string().optional(),
  status: z.string().optional(),
  userId: z.string().optional(),
  bookId: z.string().optional(),
  sort: z.string().default("borrowDate"),
  order: z.enum(["asc", "desc"]).default("desc"),
});

export type CreateBookLoanInput = z.infer<typeof createBookLoanSchema>;
export type UpdateBookLoanInput = z.infer<typeof updateBookLoanSchema>;
export type BookLoanQueryInput = z.infer<typeof bookLoanQuerySchema>;