import { z } from "zod";

export const teacherSchema = z.object({
  name: z.string().min(1, "Nama wajib diisi"),
  gender: z.enum(["MALE", "FEMALE"]),
  userId: z.string().min(1, "User wajib dipilih"),
});

export const teacherEditSchema = z.object({
  name: z.string().min(1, "Nama wajib diisi"),
  gender: z.enum(["MALE", "FEMALE"]),
  userId: z.string().optional().nullable(),
});

export type TeacherFormData = z.infer<typeof teacherSchema>;
export type TeacherEditFormData = z.infer<typeof teacherEditSchema>;