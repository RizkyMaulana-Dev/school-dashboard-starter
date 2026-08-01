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
  attendanceSessionId: z.string().min(1, "Sesi wajib dipilih"),
  studentId: z.string().min(1, "Siswa wajib dipilih"),
  status: z.enum(["PRESENT", "ABSENT", "LATE", "EXCUSED"]),
  notes: z.string().optional(),
});

export type AttendanceRecordFormData = z.infer<typeof attendanceRecordSchema>;

// src/lib/validations/attendance.schema.ts
export const attendanceRecordEditSchema = z.object({
  status: z.enum(['PRESENT', 'ABSENT', 'LATE', 'EXCUSED']),
  notes: z.string().optional().nullable(),
});

export type AttendanceRecordEditFormData = z.infer<typeof attendanceRecordEditSchema>;
