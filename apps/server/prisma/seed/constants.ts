export const PERMISSIONS = [
  "dashboard.read",

  "user.read", "user.create", "user.update", "user.delete",
  "role.read", "role.create", "role.update", "role.delete",
  "permission.read", "permission.create", "permission.update", "permission.delete",

  "class.read", "class.create", "class.update", "class.delete",
  "student.read", "student.create", "student.update", "student.delete",
  "teacher.read", "teacher.create", "teacher.update", "teacher.delete",

  "attendance.read", "attendance.create", "attendance.update", "attendance.delete",
  "attendance-session.read", "attendance-session.create", "attendance-session.update", "attendance-session.delete",

  "book.read", "book.create", "book.update", "book.delete",
  "book-loan.read", "book-loan.create", "book-loan.update", "book-loan.delete",
  "book-category.read", "book-category.create", "book-category.update", "book-category.delete",

  "item.read", "item.create", "item.update", "item.delete",
  "item-loan.read", "item-loan.create", "item-loan.update", "item-loan.delete",
  "item-category.read", "item-category.create", "item-category.update", "item-category.delete",
];

export const TEACHER_PERMISSIONS = [
  "dashboard.read", "class.read", "student.read", "student.update",
];

export const STUDENT_PERMISSIONS = [
  "dashboard.read", "student.read", "book-loan.read", "item-loan.read",
  "attendance.read", "attendance.create", "attendance-session.read",
];

export const VIEWER_PERMISSIONS = ["dashboard.read"];

export const STAFF_PERMISSIONS = [
  "dashboard.read",
  "class.read", "student.read", "teacher.read",
  "book.read", "book.create", "book.update", "book.delete",
  "book-loan.read", "book-loan.create", "book-loan.update", "book-loan.delete",
  "item.read", "item.create", "item.update", "item.delete",
  "item-loan.read", "item-loan.create", "item-loan.update", "item-loan.delete",
  "attendance-session.read", "attendance.read", "attendance.create", "attendance.update",
];

export const ROLE_PERMISSION_MAP: Record<string, string[]> = {
  Teacher: TEACHER_PERMISSIONS,
  Student: STUDENT_PERMISSIONS,
  Viewer: VIEWER_PERMISSIONS,
  Staff: STAFF_PERMISSIONS,
};