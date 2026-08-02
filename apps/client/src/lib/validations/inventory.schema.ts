import { z } from "zod";

// Schema untuk barang inventaris
export const itemSchema = z.object({
  itemCode: z.string().min(1, "Kode barang wajib diisi"),
  name: z.string().min(1, "Nama barang wajib diisi"),
  categoryId: z.string().min(1, "Kategori wajib dipilih"),
  stockTotal: z.number().int().min(1, "Stok total minimal 1"),
  stockAvailable: z.number().int().min(0, "Stok tersedia minimal 0"),
  condition: z.enum(["BAIK", "RUSAK_RINGAN", "RUSAK_BERAT"]),
  location: z.string().optional().nullable(),
  purchaseDate: z.string().optional().nullable(),
});

export type ItemFormData = z.infer<typeof itemSchema>;

// Schema untuk peminjaman barang
export const itemLoanSchema = z.object({
  itemId: z.string().min(1, "Barang wajib dipilih"),
  userId: z.string().min(1, "Peminjam wajib dipilih"),
  quantity: z.number().int().min(1, "Jumlah minimal 1"),
  borrowDate: z.string().min(1, "Tanggal pinjam wajib diisi"),
  dueDate: z.string().min(1, "Jatuh tempo wajib diisi"),
  notes: z.string().optional().nullable(),
});

export type ItemLoanFormData = z.infer<typeof itemLoanSchema>;

export const itemLoanEditSchema = z.object({
  status: z.enum(["DIPINJAM", "DIKEMBALIKAN", "HILANG", "RUSAK"]),
  notes: z.string().optional().nullable(),
});

export type ItemLoanEditFormData = z.infer<typeof itemLoanEditSchema>;
