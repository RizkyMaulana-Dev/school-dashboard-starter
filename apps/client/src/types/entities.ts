// ============================================================
// Core Entities - Model Utama
// ============================================================

export interface User {
  id: string;
  name: string;
  email: string;
  isActive: boolean;
  roles: Role[];
  student?: Student | null; // gunakan tipe Student lengkap
  teacher?: Teacher | null; // gunakan tipe Teacher lengkap
  createdAt: string;
  updatedAt: string;
}

export interface Role {
  id: string;
  name: string;
  description: string | null;
  permissions: Permission[];
  createdAt: string;
  updatedAt: string;
}

export interface Permission {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export type Gender = "MALE" | "FEMALE";

export interface Student {
  id: string;
  name: string;
  gender: Gender;
  birthDate: string;
  userId: string;
  user?: Pick<User, "id" | "name" | "email" | "isActive">;
  schoolClassId: string;
  schoolClass?: Pick<SchoolClass, "id" | "name" | "grade">;
  createdAt: string;
  updatedAt: string;
}

export interface Teacher {
  id: string;
  name: string;
  gender: Gender;
  birthDate: string;
  userId: string;
  user?: Pick<User, "id" | "name" | "email" | "isActive">; // tambahkan name
  homeroomClasses?: Pick<SchoolClass, "id" | "name" | "grade">[];
  createdAt: string;
  updatedAt: string;
}

export interface SchoolClass {
  id: string;
  name: string;
  description: string | null;
  grade: number;
  academicYear: string;
  teacherId?: string | null;
  teacher?: Pick<Teacher, "id" | "name"> | null;
  students?: Pick<Student, "id" | "name" | "gender">[];
  studentCount?: number;
  createdAt: string;
  updatedAt: string;
}

// ============================================================
// Attendance Entities
// ============================================================

export type AttendanceStatus = "PRESENT" | "ABSENT" | "LATE" | "EXCUSED";

export interface AttendanceSession {
  id: string;
  title: string;
  date: string;
  startTime: string | null;
  endTime: string | null;
  schoolClassId: string;
  schoolClass?: Pick<SchoolClass, "id" | "name" | "grade">;
  teacherId: string;
  teacher?: Pick<Teacher, "id" | "name">;
  recordCount?: number;
  attendanceRecords?: AttendanceRecord[];
  createdAt: string;
  updatedAt: string;
}

export interface AttendanceRecord {
  id: string;
  status: AttendanceStatus;
  attendanceSessionId: string;
  attendanceSession?: Pick<AttendanceSession, 'id' | 'title' | 'date'> & {
    class?: Pick<SchoolClass, 'id' | 'name'>;
  };
  // Tambahkan properti `session` untuk respons backend terbaru (sebagai alias opsional)
  session?: Pick<AttendanceSession, 'id' | 'title' | 'date'> & {
    class?: Pick<SchoolClass, 'id' | 'name'>;
  };
  studentId: string;
  student?: Pick<Student, 'id' | 'name'>;
  recordedAt: string;
  notes: string | null;
  verificationData: Record<string, unknown> | null;
  createdAt: string;
  updatedAt: string;
}

// ============================================================
// Library Entities (Perpustakaan)
// ============================================================

export interface BookCategory {
  id: string;
  name: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Book {
  id: string;
  isbn: string;
  title: string;
  author: string;
  publisher: string;
  publishedYear: number;
  bookCategoryId?: string; // opsional (backend pakai category objek)
  category?: {
    // tambahan dari respons backend
    id: string;
    name: string;
  };
  bookCategory?: BookCategory; // tetap ada untuk backward compatibility
  stockTotal: number;
  stockAvailable: number;
  shelfLocation: string | null;
  coverImage: string | null;
  createdAt: string;
  updatedAt: string;
}

export type BookLoanStatus = "DIPINJAM" | "DIKEMBALIKAN" | "TERLAMBAT" | "HILANG";

export interface BookLoan {
  id: string;
  bookId: string;
  book?: Pick<Book, "id" | "isbn" | "title" | "coverImage">;
  userId: string;
  user?: Pick<User, "id" | "name" | "email">;
  borrowDate: string;
  dueDate: string;
  returnDate: string | null;
  status: BookLoanStatus;
  fineAmount: number;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

// ============================================================
// Inventory Entities (Inventaris)
// ============================================================

export type ItemCondition = "BAIK" | "RUSAK_RINGAN" | "RUSAK_BERAT";

export interface ItemCategory {
  id: string;
  name: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Item {
  id: string;
  itemCode: string;
  name: string;
  categoryId?: string;
  category?: { id: string; name: string };
  itemCategory?: ItemCategory;
  stockTotal: number;
  stockAvailable: number;
  condition: ItemCondition;
  location: string | null;
  purchaseDate: string | null;
  createdAt: string;
  updatedAt: string;
}

export type ItemLoanStatus = "DIPINJAM" | "DIKEMBALIKAN" | "HILANG" | "RUSAK";

export interface ItemLoan {
  id: string;
  itemId: string;
  item?: Pick<Item, "id" | "itemCode" | "name" | "condition">;
  userId: string;
  user?: Pick<User, "id" | "name" | "email">;
  quantity: number;
  borrowDate: string;
  dueDate: string;
  returnDate: string | null;
  status: ItemLoanStatus;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

// ============================================================
// Auth Entities
// ============================================================

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken?: string;
}

export interface AuthData {
  accessToken: string;
  refreshToken?: string; // Diisi optional (?) karena dari respon backend tidak selalu ada
  user: User;
  student?: Student | null;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: AuthData;
}

// ============================================================
// DTOs (Data Transfer Objects) untuk Create/Update
// ============================================================

export interface CreateUserDTO {
  name: string;
  email: string;
  password: string;
  isActive?: boolean;
  roleIds?: string[];
}

export interface UpdateUserDTO {
  name?: string;
  email?: string;
  isActive?: boolean;
  roleIds?: string[];
}

export interface CreateStudentDTO {
  name: string;
  gender: Gender;
  birthDate: string;
  userId: string;
  schoolClassId: string;
}

export interface UpdateStudentDTO {
  name?: string;
  gender?: Gender;
  birthDate?: string;
  schoolClassId?: string;
}

export interface CreateTeacherDTO {
  name: string;
  gender: Gender;
  birthDate?: string;
  userId: string;
}

export interface UpdateTeacherDTO {
  name?: string;
  gender?: Gender;
  birthDate?: string;
  userId?: string | null;   // ✅ opsional & nullable
}


export interface CreateSchoolClassDTO {
  name: string;
  description?: string | null;
  grade: number;
  academicYear: string;
  teacherId?: string | null;
}

export interface UpdateSchoolClassDTO {
  name?: string;
  description?: string | null;
  grade?: number;
  academicYear?: string;
  teacherId?: string | null;
}

export interface CreateAttendanceSessionDTO {
  title: string;
  date: string;
  startTime?: string | null;
  endTime?: string | null;
  schoolClassId: string;
  teacherId: string;
}

export interface UpdateAttendanceSessionDTO {
  title?: string;
  date?: string;
  startTime?: string | null;
  endTime?: string | null;
  schoolClassId?: string;
  teacherId?: string;
}

export interface CreateAttendanceRecordDTO {
  attendanceSessionId: string;
  studentId: string;
  status: AttendanceStatus;
  notes?: string | null;
  verificationData?: Record<string, unknown> | null;
}

export interface UpdateAttendanceRecordDTO {
  status?: AttendanceStatus;
  notes?: string | null;
  verificationData?: Record<string, unknown> | null;
}

export interface CreateBookDTO {
  isbn: string;
  title: string;
  author: string;
  publisher: string;
  publishedYear: number;
  bookCategoryId: string;
  stockTotal: number;
  stockAvailable: number;
  shelfLocation?: string | null;
  coverImage?: string | null;
}

export interface UpdateBookDTO {
  isbn?: string;
  title?: string;
  author?: string;
  publisher?: string;
  publishedYear?: number;
  bookCategoryId?: string;
  stockTotal?: number;
  stockAvailable?: number;
  shelfLocation?: string | null;
  coverImage?: string | null;
}

export interface CreateBookLoanDTO {
  bookId: string;
  userId: string;
  borrowDate: string;
  dueDate: string;
  notes?: string | null;
}

export interface UpdateBookLoanDTO {
  status?: BookLoanStatus;
  returnDate?: string | null;
  dueDate?: string | null;
  fineAmount?: number;
  notes?: string | null;
}

export interface CreateItemDTO {
  itemCode: string;
  name: string;
  categoryId: string;
  stockTotal: number;
  stockAvailable: number;
  condition: ItemCondition;
  location?: string | null;
  purchaseDate?: string | null;
}

export interface UpdateItemDTO {
  itemCode?: string;
  name?: string;
  categoryId?: string;
  stockTotal?: number;
  stockAvailable?: number;
  condition?: ItemCondition;
  location?: string | null;
  purchaseDate?: string | null;
}

export interface CreateItemLoanDTO {
  itemId: string;
  userId: string;
  quantity: number;
  borrowDate: string;
  dueDate: string;
  notes?: string | null;
}

export interface UpdateItemLoanDTO {
  status?: ItemLoanStatus;
  returnDate?: string | null;
  notes?: string | null;
}
