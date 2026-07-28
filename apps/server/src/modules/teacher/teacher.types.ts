import z from "zod";
import { createTeacherSchema, updateTeacherSchema, teacherQuerySchema, teacherResponseSchema } from "./teacher.validation";

export type CreateTeacherDto = z.infer<typeof createTeacherSchema>;

export type UpdateTeacherDto = z.infer<typeof updateTeacherSchema>;

export type TeacherQueryDto = z.infer<typeof teacherQuerySchema>;

export type TeacherResponseDto = z.infer<typeof teacherResponseSchema>;