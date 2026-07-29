import { z } from "zod";

export const createItemSchema = z.object({
  categoryId: z.string().min(1, "Kategori wajib dipilih"),
  itemCode: z.string().min(1, "Kode barang wajib diisi"),
  name: z.string().trim().min(1, "Nama barang wajib diisi"),
  stockTotal: z.number().int().min(0).default(0),
  stockAvailable: z.number().int().min(0).default(0),
  condition: z.enum(["BAIK", "RUSAK_RINGAN", "RUSAK_BERAT"]).default("BAIK"),
  location: z.string().optional(),
  purchaseDate: z.coerce.date().optional(),
});

export const updateItemSchema = z.object({
  categoryId: z.string().optional(),
  itemCode: z.string().min(1).optional(),
  name: z.string().trim().min(1).optional(),
  stockTotal: z.number().int().min(0).optional(),
  stockAvailable: z.number().int().min(0).optional(),
  condition: z.enum(["BAIK", "RUSAK_RINGAN", "RUSAK_BERAT"]).optional(),
  location: z.string().optional(),
  purchaseDate: z.coerce.date().optional(),
});

export const itemQuerySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(10),
  search: z.string().optional(),
  categoryId: z.string().optional(),
  condition: z.string().optional(),
  sort: z.string().default("name"),
  order: z.enum(["asc", "desc"]).default("asc"),
});

export type CreateItemInput = z.infer<typeof createItemSchema>;
export type UpdateItemInput = z.infer<typeof updateItemSchema>;
export type ItemQueryInput = z.infer<typeof itemQuerySchema>;