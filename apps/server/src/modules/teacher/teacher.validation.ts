import z from "zod";

/* ===========================
 * Create Teacher
 * =========================== */

export const createTeacherSchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, "Nama minimal 3 karakter")
    .max(100, "Nama maksimal 100 karakter"),

  gender: z.enum(["MALE", "FEMALE"], {
    error: "Gender harus MALE atau FEMALE",
  }),

  userId: z
    .string()
    .trim()
    .min(1, "User ID wajib diisi"),

  classIds: z
    .array(
      z.string().trim().min(1, "Class ID tidak boleh kosong")
    )
    .optional()
    .default([]),
});

/* ===========================
 * Update Teacher
 * =========================== */

export const updateTeacherSchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, "Nama minimal 3 karakter")
    .max(100, "Nama maksimal 100 karakter")
    .optional(),

  gender: z
    .enum(["MALE", "FEMALE"], {
      error: "Gender harus MALE atau FEMALE",
    })
    .optional(),

  userId: z
    .string()
    .trim()
    .min(1, "User ID wajib diisi")
    .optional(),

  classIds: z
    .array(
      z.string().trim().min(1, "Class ID tidak boleh kosong")
    )
    .optional(),
});

/* ===========================
 * Teacher Query
 * =========================== */

export const teacherQuerySchema = z.object({
  page: z.coerce
    .number()
    .int()
    .positive()
    .default(1),

  limit: z.coerce
    .number()
    .int()
    .positive()
    .max(100)
    .default(10),

  search: z
    .string()
    .trim()
    .optional(),

  gender: z
    .enum(["MALE", "FEMALE"])
    .optional(),

  classId: z
    .string()
    .trim()
    .optional(),

  userId: z
    .string()
    .trim()
    .optional(),

  sortBy: z
    .enum(["name", "createdAt"])
    .default("createdAt"),

  sortOrder: z
    .enum(["asc", "desc"])
    .default("desc"),
});

/* ===========================
 * Teacher Response
 * =========================== */

export const teacherResponseSchema = z.object({
  id: z.string(),

  name: z.string(),

  gender: z.enum(["MALE", "FEMALE"]),

  user: z.object({
    id: z.string(),
    email: z.string().email(),
    username: z.string(),
  }),

  classes: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
    })
  ),

  createdAt: z.date(),

  updatedAt: z.date(),
});