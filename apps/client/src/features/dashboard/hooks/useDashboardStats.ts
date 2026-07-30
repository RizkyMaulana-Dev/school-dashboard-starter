import { useQuery } from "@tanstack/react-query";
import { userService } from "@/services/user.service";
import { studentService } from "@/services/student.service";
import { teacherService } from "@/services/teacher.service";
import { bookService } from "@/services/book.service";
import { attendanceSessionService } from "@/services/attendance-session.service";

export function useDashboardStats() {
  return useQuery({
    queryKey: ["dashboard", "stats"],
    queryFn: async () => {
      // Fetch multiple stats in parallel
      const [users, students, teachers, books, sessions] = await Promise.all([
        userService.getAll({ limit: 1 }),
        studentService.getAll({ limit: 1 }),
        teacherService.getAll({ limit: 1 }),
        bookService.getAll({ limit: 1 }),
        attendanceSessionService.getAll({ limit: 1 }),
      ]);

      return {
        totalUsers: users.meta.totalItems,
        totalStudents: students.meta.totalItems,
        totalTeachers: teachers.meta.totalItems,
        totalBooks: books.meta.totalItems,
        totalSessions: sessions.meta.totalItems,
      };
    },
  });
}
