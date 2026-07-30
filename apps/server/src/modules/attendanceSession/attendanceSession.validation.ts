import { z } from "zod";

export const createAttendanceSessionSchema = z.object({
  title: z.string().trim().min(3, "Judul minimal 3 karakter").max(200),
  date: z.coerce.date(),
  startTime: z.coerce.date().optional(),
  endTime: z.coerce.date().optional(),
  schoolClassId: z.string().min(1, "Kelas wajib dipilih"),
  teacherId: z.string().min(1, "Guru wajib dipilih"),
});

export const updateAttendanceSessionSchema = z.object({
  title: z.string().trim().min(3).max(200).optional(),
  date: z.coerce.date().optional(),
  startTime: z.coerce.date().optional().nullable(),
  endTime: z.coerce.date().optional().nullable(),
  schoolClassId: z.string().min(1).optional(),
  teacherId: z.string().min(1).optional(),
});

export const attendanceSessionQuerySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(10),
  search: z.string().optional(),
  classId: z.string().optional(),
  teacherId: z.string().optional(),
  date: z.string().optional(),
  sort: z.string().default("date"),
  order: z.enum(["asc", "desc"]).default("desc"),
});

export type CreateAttendanceSessionInput = z.infer<typeof createAttendanceSessionSchema>;
export type UpdateAttendanceSessionInput = z.infer<typeof updateAttendanceSessionSchema>;
export type AttendanceSessionQueryInput = z.infer<typeof attendanceSessionQuerySchema>;
