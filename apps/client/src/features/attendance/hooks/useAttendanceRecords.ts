// src/features/attendance/hooks/useAttendanceRecords.ts
import { useQuery } from '@tanstack/react-query';
import { attendanceService } from '@/services/attendance.service';
import type { QueryParams } from '@/types/api';

export function useAttendanceRecords(params?: QueryParams) {
  return useQuery({
    queryKey: ['attendance-records', params],
    queryFn: () => attendanceService.getAll(params),
  });
}

export function useAttendanceRecordDetail(id: string | undefined) {
  return useQuery({
    queryKey: ['attendance-records', id],
    queryFn: () => attendanceService.getById(id!),
    enabled: !!id,
  });
}