import { z } from "zod";

export const createBookCategorySchema = z.object({
  name: z.string().trim().min(1, "Nama kategori wajib diisi").max(100),
  description: z.string().max(500).optional(),
});

export const updateBookCategorySchema = z.object({
  name: z.string().trim().min(1).max(100).optional(),
  description: z.string().max(500).optional(),
});

export const bookCategoryQuerySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(10),
  search: z.string().optional(),
  sort: z.string().default("name"),
  order: z.enum(["asc", "desc"]).default("asc"),
});

export type CreateBookCategoryInput = z.infer<typeof createBookCategorySchema>;
export type UpdateBookCategoryInput = z.infer<typeof updateBookCategorySchema>;
export type BookCategoryQueryInput = z.infer<typeof bookCategoryQuerySchema>;