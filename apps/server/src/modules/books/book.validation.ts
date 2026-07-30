import { z } from "zod";

export const createBookSchema = z.object({
  bookCategoryId: z.string().min(1, "Kategori buku wajib dipilih"),
  isbn: z.string().optional(),
  title: z.string().trim().min(1, "Judul buku wajib diisi").max(255),
  author: z.string().trim().max(255).optional(),
  publisher: z.string().trim().max(255).optional(),
  publishedYear: z
    .number()
    .int()
    .min(1000)
    .max(new Date().getFullYear() + 1)
    .optional(),
  stockTotal: z.number().int().min(0, "Stok total tidak boleh negatif").default(1),
  stockAvailable: z.number().int().min(0, "Stok tersedia tidak boleh negatif").default(1),
  shelfLocation: z.string().optional(),
  coverImage: z.string().optional(),
});

export const updateBookSchema = z.object({
  bookCategoryId: z.string().min(1).optional(),
  isbn: z.string().optional(),
  title: z.string().trim().min(1).max(255).optional(),
  author: z.string().trim().max(255).optional(),
  publisher: z.string().trim().max(255).optional(),
  publishedYear: z
    .number()
    .int()
    .min(1000)
    .max(new Date().getFullYear() + 1)
    .optional(),
  stockTotal: z.number().int().min(0).optional(),
  stockAvailable: z.number().int().min(0).optional(),
  shelfLocation: z.string().optional(),
  coverImage: z.string().optional(),
});

export const bookQuerySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(10),
  search: z.string().optional(),
  categoryId: z.string().optional(),
  sort: z.string().default("title"),
  order: z.enum(["asc", "desc"]).default("asc"),
});

export type CreateBookInput = z.infer<typeof createBookSchema>;
export type UpdateBookInput = z.infer<typeof updateBookSchema>;
export type BookQueryInput = z.infer<typeof bookQuerySchema>;
