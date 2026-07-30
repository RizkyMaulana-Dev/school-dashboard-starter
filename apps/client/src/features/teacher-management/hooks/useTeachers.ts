import { useQuery } from "@tanstack/react-query";
import { teacherService } from "@/services/teacher.service";
import type { QueryParams } from "@/types/api";

export function useTeachers(params?: QueryParams) {
  return useQuery({
    queryKey: ["teachers", params],
    queryFn: () => teacherService.getAll(params),
  });
}

export function useTeacherDetail(id: string | undefined) {
  return useQuery({
    queryKey: ["teachers", id],
    queryFn: () => teacherService.getById(id!),
    enabled: !!id,
  });
}
