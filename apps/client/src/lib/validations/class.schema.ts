import { z } from "zod";

export const classSchema = z.object({
  name: z.string().min(1, "Nama kelas wajib diisi"),
  description: z.string().optional(),  // opsional
  grade: z.number().int().min(1, "Tingkat kelas wajib diisi"),
  academicYearStart: z
    .string()
    .regex(/^20\d{2}$/, "Format tahun awal harus 20**"),
  academicYearEnd: z
    .string()
    .regex(/^20\d{2}$/, "Format tahun akhir harus 20**"),
  teacherId: z.string().optional().nullable(),
});

export type ClassFormData = z.infer<typeof classSchema>;