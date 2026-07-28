import { z } from "zod";

export const createAttendanceSchema = z.object({
  attendanceSessionId: z.string().min(1, "Session ID wajib diisi"),
  studentId: z.string().min(1, "Student ID wajib diisi"),
  status: z.enum(["PRESENT", "ABSENT", "LATE", "EXCUSED"]),
  notes: z.string().max(255).optional(),
  verificationData: z.any().optional(), // JSON
  recordedAt: z.coerce.date().optional(),
});

export const updateAttendanceSchema = z.object({
  status: z.enum(["PRESENT", "ABSENT", "LATE", "EXCUSED"]).optional(),
  notes: z.string().max(255).optional(),
  verificationData: z.any().optional(),
  recordedAt: z.coerce.date().optional(),
});

export const attendanceQuerySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(10),
  search: z.string().optional(),
  sessionId: z.string().optional(),
  studentId: z.string().optional(),
  status: z.enum(["PRESENT", "ABSENT", "LATE", "EXCUSED"]).optional(),
  classId: z.string().optional(),
  date: z.string().optional(),
  sort: z.string().default("createdAt"),
  order: z.enum(["asc", "desc"]).default("desc"),
});

export type CreateAttendanceInput = z.infer<typeof createAttendanceSchema>;
export type UpdateAttendanceInput = z.infer<typeof updateAttendanceSchema>;
export type AttendanceQueryInput = z.infer<typeof attendanceQuerySchema>;