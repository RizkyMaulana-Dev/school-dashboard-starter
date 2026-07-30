import { useQuery } from "@tanstack/react-query";
import { studentService } from "@/services/student.service";
import type { QueryParams } from "@/types/api";

export function useStudents(params?: QueryParams) {
  return useQuery({
    queryKey: ["students", params],
    queryFn: () => studentService.getAll(params),
  });
}

export function useStudentDetail(id: string | undefined) {
  return useQuery({
    queryKey: ["students", id],
    queryFn: () => studentService.getById(id!),
    enabled: !!id,
  });
}
