import { z } from "zod";

export const userCreateSchema = z.object({
  name: z
    .string()
    .min(1, "Nama wajib diisi")
    .min(3, "Nama minimal 3 karakter")
    .max(100, "Nama maksimal 100 karakter"),
  email: z.string().min(1, "Email wajib diisi").email("Format email tidak valid"),
  password: z
    .string()
    .min(1, "Password wajib diisi")
    .min(8, "Password minimal 8 karakter")
    .regex(/[A-Z]/, "Password harus mengandung huruf besar")
    .regex(/[a-z]/, "Password harus mengandung huruf kecil")
    .regex(/[0-9]/, "Password harus mengandung angka"),
  isActive: z.boolean().default(true),
  roleIds: z.array(z.string()).min(1, "Minimal pilih satu role"),
});

export const userUpdateSchema = z.object({
  name: z
    .string()
    .min(1, "Nama wajib diisi")
    .min(3, "Nama minimal 3 karakter")
    .max(100, "Nama maksimal 100 karakter"),
  email: z.string().min(1, "Email wajib diisi").email("Format email tidak valid"),
  isActive: z.boolean().default(true),
  roleIds: z.array(z.string()).min(1, "Minimal pilih satu role"),
});

export type UserCreateFormData = z.infer<typeof userCreateSchema>;
export type UserUpdateFormData = z.infer<typeof userUpdateSchema>;
