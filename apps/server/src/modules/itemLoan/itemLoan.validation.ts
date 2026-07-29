import { z } from "zod";

export const createItemLoanSchema = z.object({
  itemId: z.string().min(1, "Barang wajib dipilih"),
  userId: z.string().min(1, "Peminjam wajib dipilih"),
  quantity: z.number().int().min(1, "Jumlah minimal 1"),
  dueDate: z.coerce.date().min(new Date(), "Batas waktu harus di masa depan"),
  notes: z.string().max(500).optional(),
});

export const updateItemLoanSchema = z.object({
  status: z.enum(["DIPINJAM", "DIKEMBALIKAN", "HILANG", "RUSAK"]).optional(),
  returnDate: z.coerce.date().optional(),
  notes: z.string().max(500).optional(),
});

export const itemLoanQuerySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(10),
  search: z.string().optional(),
  status: z.string().optional(),
  userId: z.string().optional(),
  itemId: z.string().optional(),
  sort: z.string().default("borrowDate"),
  order: z.enum(["asc", "desc"]).default("desc"),
});

export type CreateItemLoanInput = z.infer<typeof createItemLoanSchema>;
export type UpdateItemLoanInput = z.infer<typeof updateItemLoanSchema>;
export type ItemLoanQueryInput = z.infer<typeof itemLoanQuerySchema>;