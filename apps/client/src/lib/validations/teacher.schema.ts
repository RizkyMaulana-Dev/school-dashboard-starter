import { z } from "zod";
export const teacherSchema = z.object({
  name: z.string().min(1),
  gender: z.enum(["MALE", "FEMALE"], { error: "Gender Wajib Di Isi" }),
  birthDate: z.string().min(1),
  userId: z.string().min(1),
});
export type TeacherFormData = z.infer<typeof teacherSchema>;
