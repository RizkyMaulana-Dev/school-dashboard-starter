import { z } from "zod";

export const studentSchema = z.object({
  name: z.string().min(1, "Nama wajib diisi"),
  gender: z.enum(["MALE", "FEMALE"], { error: "Gender Wajib Di Isi" }),
  birthDate: z.string().min(1, "Tanggal lahir wajib diisi"),
  userId: z.string().min(1, "User harus dipilih"),
  schoolClassId: z.string().min(1, "Kelas harus dipilih"),
});

export type StudentFormData = z.infer<typeof studentSchema>;
