import { z } from "zod";

export const classSchema = z.object({
  name: z.string().min(1, "Nama kelas wajib diisi"),
  description: z.string().nullable().optional(),
  grade: z.string().min(1, "Tingkat kelas wajib diisi"),
  academicYear: z.string().min(1, "Tahun ajaran wajib diisi"),
  teacherId: z.string().nullable().optional(),
});

export type ClassFormData = z.infer<typeof classSchema>;
