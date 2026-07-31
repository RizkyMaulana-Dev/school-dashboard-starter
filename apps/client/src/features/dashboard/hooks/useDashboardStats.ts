// src/features/dashboard/hooks/useDashboardStats.ts
import { useQuery } from '@tanstack/react-query';
import { userService } from '@/services/user.service';
import { studentService } from '@/services/student.service';
import { teacherService } from '@/services/teacher.service';
import { bookService } from '@/services/book.service';
import { attendanceSessionService } from '@/services/attendance-session.service';

export function useDashboardStats() {
  return useQuery({
    queryKey: ['dashboard', 'stats'],
    queryFn: async () => {
      const [usersRes, studentsRes, teachersRes, booksRes, sessionsRes] = await Promise.all([
        userService.getAll({ limit: 1 }),
        studentService.getAll({ limit: 1 }),
        teacherService.getAll({ limit: 1 }),
        bookService.getAll({ limit: 1 }),
        attendanceSessionService.getAll({ limit: 1 }),
      ]);

      return {
        totalUsers: usersRes?.meta?.total ?? 0,
        totalStudents: studentsRes?.meta?.total ?? 0,
        totalTeachers: teachersRes?.meta?.total ?? 0,
        totalBooks: booksRes?.meta?.total ?? 0,
        totalSessions: sessionsRes?.meta?.total ?? 0,
      };
    },
    staleTime: 5 * 60 * 1000,
  });
}