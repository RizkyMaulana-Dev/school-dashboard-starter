/**
 * Route path constants untuk menghindari hardcode string paths
 */
export const ROUTE_PATHS = {
  // Auth
  LOGIN: "/login",
  FORGOT_PASSWORD: "/forgot-password",
  RESET_PASSWORD: "/reset-password",

  // Dashboard (Internal Area)
  DASHBOARD: "/app",
  DASHBOARD_HOME: "/app/dashboard",

  // User Management
  USERS: "/app/users",
  USER_CREATE: "/app/users/create",
  USER_EDIT: "/app/users/:id/edit",
  USER_DETAIL: "/app/users/:id",

  // Role Management
  ROLES: "/app/roles",
  ROLE_CREATE: "/app/roles/create",
  ROLE_EDIT: "/app/roles/:id/edit",

  // Class Management
  CLASSES: "/app/classes",
  CLASS_CREATE: "/app/classes/create",
  CLASS_EDIT: "/app/classes/:id/edit",
  CLASS_DETAIL: "/app/classes/:id",

  // Student Management
  STUDENTS: "/app/students",
  STUDENT_CREATE: "/app/students/create",
  STUDENT_EDIT: "/app/students/:id/edit",
  STUDENT_DETAIL: "/app/students/:id",

  // Teacher Management
  TEACHERS: "/app/teachers",
  TEACHER_CREATE: "/app/teachers/create",
  TEACHER_EDIT: "/app/teachers/:id/edit",
  TEACHER_DETAIL: "/app/teachers/:id",

  // Attendance
  ATTENDANCE_SESSIONS: "/app/attendance/sessions",
  ATTENDANCE_SESSION_DETAIL: "/app/attendance/sessions/:id",
  ATTENDANCE_SESSION_EDIT: "/app/attendance/sessions/:id/edit",
  ATTENDANCE_SESSION_CREATE: "/app/attendance/sessions/create",
  ATTENDANCE_RECORDS: "/app/attendance/records",
  ATTENDANCE_RECORDS_DETAIL: "/app/attendance/records/:id",
  ATTENDANCE_RECORD_EDIT: "/app/attendance/records/:id/edit",
  ITEM_LOAN_EDIT: "/app/inventory/loans/:id/edit",

  // Library
  BOOKS: "/app/library/books",
  BOOK_CREATE: "/app/library/books/create",
  BOOK_EDIT: "/app/library/books/:id/edit",
  BOOK_DETAIL: "/app/library/books/:id",
  BOOK_LOANS: "/app/library/loans",
  BOOK_LOAN_CREATE: "/app/library/loans/create",
  BOOK_LOAN_DETAIL: "/app/library/loans/:id",
  BOOK_LOAN_EDIT: "/app/library/loans/:id/edit", // ← tambahkan baris ini

  // Inventory
  ITEMS: "/app/inventory/items",
  ITEM_CREATE: "/app/inventory/items/create",
  ITEM_EDIT: "/app/inventory/items/:id/edit",
  ITEM_DETAIL: "/app/inventory/items/:id",
  ITEM_LOANS: "/app/inventory/loans",
  ITEM_LOAN_CREATE: "/app/inventory/loans/create",
  ITEM_LOAN_DETAIL: "/app/inventory/loans/:id",

  // Public Area
  PUBLIC: "/activity",
  PUBLIC_ATTENDANCE: "/activity/attendance",
  PUBLIC_LOANS: "/activity/loans",
  PUBLIC_PROFILE: "/activity/profile",

  ITEM_CATEGORIES: "/app/inventory/categories",
  ITEM_CATEGORY_CREATE: "/app/inventory/categories/create",
  ITEM_CATEGORY_EDIT: "/app/inventory/categories/:id/edit",
  ITEM_CATEGORY_DETAIL: "/app/inventory/categories/:id",

  // Not Found
  NOT_FOUND: "/404",
} as const;

/**
 * Helper function untuk generate dynamic paths
 */
export function generatePath(path: string, params: Record<string, string>): string {
  let generatedPath = path;
  Object.entries(params).forEach(([key, value]) => {
    generatedPath = generatedPath.replace(`:${key}`, value);
  });
  return generatedPath;
}
