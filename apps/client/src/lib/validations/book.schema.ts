import { z } from "zod";
export const bookSchema = z.object({
  isbn: z.string().min(1),
  title: z.string().min(1),
  author: z.string().min(1),
  publisher: z.string().min(1),
  publishedYear: z.coerce.number().int().min(1900).max(2100),
  bookCategoryId: z.string().min(1),
  stockTotal: z.coerce.number().int().min(1),
  stockAvailable: z.coerce.number().int().min(0),
  shelfLocation: z.string().optional(),
  coverImage: z.string().optional(),
});
export type BookFormData = z.infer<typeof bookSchema>;

export const bookLoanSchema = z.object({
  bookId: z.string().min(1),
  userId: z.string().min(1),
  borrowDate: z.string().min(1),
  dueDate: z.string().min(1),
  notes: z.string().optional(),
});
export type BookLoanFormData = z.infer<typeof bookLoanSchema>;
