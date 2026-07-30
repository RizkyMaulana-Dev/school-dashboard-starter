import { z } from "zod";

export const sessionSchema = z.object({
  title: z.string().min(1, "Judul wajib"),
  date: z.string().min(1, "Tanggal wajib"),
  startTime: z.string().nullable().optional(),
  endTime: z.string().nullable().optional(),
  schoolClassId: z.string().min(1, "Kelas wajib"),
  teacherId: z.string().min(1, "Guru wajib"),
});
export type SessionFormData = z.infer<typeof sessionSchema>;

export const attendanceRecordSchema = z.object({
  studentId: z.string().min(1),
  status: z.enum(["PRESENT", "ABSENT", "LATE", "EXCUSED"]),
  notes: z.string().optional(),
});
export type AttendanceRecordFormData = z.infer<typeof attendanceRecordSchema>;
