// ./apps/server/src/modules/auth/auth.service.ts
import { AuthRepository } from "./auth.repository.js";
import { comparePassword } from "../../lib/password.js";
import { generateAccessToken } from "../../lib/jwt.js";
import { UnauthorizedError } from "../../errors/index.js";
import { NotFoundError } from "../../errors/index.js";
import { StudentRepository } from "../students/student.repository.js";

export interface GooglePayload {
  email: string;
  name?: string;
  picture?: string;
  googleId?: string;
}

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

    const student = await this.studentRepository.findByUserId(user.id);

    return {
      accessToken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        isActive: user.isActive,
        roles: user.roles,
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

  // Google Login dengan Otomatis Buat User + Profil Student
  async googleLogin(payload: GooglePayload) {
    // 1. Cari user berdasarkan email
    let user = await this.repository.findByEmailWithRoles(payload.email);

    // 2. Jika user belum ada, daftarkan otomatis beserta record Student & Role-nya
    if (!user) {
      user = await this.repository.createFromGoogle({
        email: payload.email,
        name: payload.name,
      });
    }

    if (!user.isActive) {
      throw new UnauthorizedError("Akun telah dinonaktifkan");
    }

    // 3. Generate Access Token JWT
    const accessToken = generateAccessToken({
      userId: user.id,
      email: user.email,
    });

    // 4. Ambil data Student beserta schoolClass milik user yang baru dibuat/sudah ada
    const student = await this.studentRepository.findByUserId(user.id);

    // 5. Kembalikan respons yang cocok dengan kebutuhan frontend home/dashboard
    return {
      accessToken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        isActive: user.isActive,
        roles: user.roles,
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

    const student = await this.studentRepository.findByUserId(userId);

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      isActive: user.isActive,
      roles: user.roles,
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