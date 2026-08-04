export interface CreateStudentDto {
  name: string;
  gender: "MALE" | "FEMALE";
  birthDate?: string | Date; // Bisa menerima string ISO ("2006-08-15") atau objek Date
  userId: string; // ID dari tabel User yang sudah dibuat sebelumnya
  schoolClassId: string; // Opsional: Langsung menghubungkan ke kelas saat dibuat
}

export interface UpdateStudentDto {
  name?: string;
  gender?: "MALE" | "FEMALE";
  birthDate?: string | Date;
  schoolClassId: string;
  userId?: string; // tambahkan jika diizinkan mengganti user
}

export interface StudentQueryDto {
  page?: number;
  limit?: number;
  search?: string;
  gender?: "MALE" | "FEMALE";
  classId?: string;
  sort?: string;
  order?: "asc" | "desc";
}

export interface StudentResponseDto {
  id: string;
  name: string;
  gender: "MALE" | "FEMALE";
  birthDate: Date | null;

  // Membawa data user terkait tanpa password
  user: {
    id: string;
    email: string;
    isActive: boolean;
  };

  // Membawa daftar kelas yang diikuti mahasiswa saat ini
  class: {
    id: string;
    name: string;
    academicYear: string;
  }[];

  createdAt: Date;
  updatedAt: Date;
}
