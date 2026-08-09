import { AuthRepository } from "./auth.repository.js";
import { comparePassword } from "../../lib/password.js";
import { generateAccessToken } from "../../lib/jwt.js";
import { UnauthorizedError } from "../../errors/index.js";
import { NotFoundError } from "../../errors/index.js";
import { StudentRepository } from "../students/student.repository.js";

export class AuthService {
  constructor(
    private repository: AuthRepository,
    private studentRepository: StudentRepository,
  ) {}

  async login(email: string, password: string) {
    const user = await this.repository.findByEmailWithRoles(email);
    if (!user) {
      throw new UnauthorizedError("Email atau password salah");
    }

    const validPassword = await comparePassword(password, user.password);

    if (!validPassword) {
      throw new UnauthorizedError("Email atau password salah");
    }

    if (!user.isActive) {
      throw new UnauthorizedError("Akun telah dinonaktifkan");
    }

    const accessToken = generateAccessToken({
      userId: user.id,
      email: user.email,
    });

    // Ambil data student berdasarkan userId, beserta relasi schoolClass-nya
    const student = await this.studentRepository.findByUserId(user.id);

    return {
      accessToken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        isActive: user.isActive,
        roles: user.roles,
        // Masukkan student ke dalam objek user agar cocok dengan frontend store
        student: student
          ? {
              id: student.id,
              name: student.name,
              gender: student.gender,
              birthDate: student.birthDate,
              schoolClass: student.schoolClass ?? null,
            }
          : null,
      },
    };
  }

  async me(userId: string) {
    const user = await this.repository.findById(userId);

    if (!user) {
      throw new NotFoundError("User tidak ditemukan");
    }

    // Ambil juga data student saat fungsi me() dipanggil
    const student = await this.studentRepository.findByUserId(userId);

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      isActive: user.isActive,
      roles: user.roles,
      // Sertakan student di sini agar saat halaman di-refresh, datanya tidak hilang
      student: student
        ? {
            id: student.id,
            name: student.name,
            gender: student.gender,
            birthDate: student.birthDate,
            schoolClass: student.schoolClass ?? null,
          }
        : null,
    };
  }
}