import { useQuery } from "@tanstack/react-query";
import { attendanceSessionService } from "@/services/attendance-session.service";
import type { QueryParams } from "@/types/api";

export function useSessions(params?: QueryParams) {
  return useQuery({
    queryKey: ["attendance-sessions", params],
    queryFn: () => attendanceSessionService.getAll(params),
  });
}
export function useSessionDetail(id?: string) {
  return useQuery({
    queryKey: ["attendance-sessions", id],
    queryFn: () => attendanceSessionService.getById(id!),
    enabled: !!id,
  });
}
