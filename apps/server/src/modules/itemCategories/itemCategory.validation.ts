import { z } from "zod";

export const createItemCategorySchema = z.object({
  name: z.string().trim().min(1, "Nama kategori wajib diisi").max(100),
  description: z.string().max(500).optional(),
});

export const updateItemCategorySchema = z.object({
  name: z.string().trim().min(1).max(100).optional(),
  description: z.string().max(500).optional(),
});

export const itemCategoryQuerySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(10),
  search: z.string().optional(),
  sort: z.string().default("name"),
  order: z.enum(["asc", "desc"]).default("asc"),
});

export type CreateItemCategoryInput = z.infer<typeof createItemCategorySchema>;
export type UpdateItemCategoryInput = z.infer<typeof updateItemCategorySchema>;
export type ItemCategoryQueryInput = z.infer<typeof itemCategoryQuerySchema>;