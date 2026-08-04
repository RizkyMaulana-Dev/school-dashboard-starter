import { prisma } from "../../lib/prisma"; // 🔥 tambahkan ini
import { StudentRepository } from "./student.repository";
import { CreateStudentDto, UpdateStudentDto } from "./student.types";
import { NotFoundError, ConflictError } from "../../errors";
import { PaginationQuery } from "../../utils/pagination";
import { createPaginationMeta } from "../../utils/pagination/PaginatedResponse";
import { toStudentResponse, toStudentsResponse } from "./student.mapper";
import { STUDENT_MESSAGES } from "../../constant/messages";

export class StudentService {
  private repository = new StudentRepository();

  async findAll(query: PaginationQuery) {
    const students = await this.repository.findMany(query);
    const total = await this.repository.count(query.search);

    return {
      data: toStudentsResponse(students),
      meta: createPaginationMeta(query.page, query.limit, total),
    };
  }

  async findById(id: string) {
    const student = await this.repository.findById(id);
    if (!student) throw new NotFoundError(STUDENT_MESSAGES.NOT_FOUND);
    return toStudentResponse(student);
  }

  async create(data: CreateStudentDto) {
    // 🛡️ Validasi: pastikan userId memiliki role "Student"
    await this.validateUserRole(data.userId, "Student");

    const student = await this.repository.create(data);
    return toStudentResponse(student);
  }

  async update(id: string, data: UpdateStudentDto) {
    // Jika userId disertakan dalam update, validasi juga
    if (data.userId) {
      await this.validateUserRole(data.userId, "Student");
    }

    const student = await this.repository.findById(id);
    if (!student) throw new NotFoundError(STUDENT_MESSAGES.NOT_FOUND);
    const updated = await this.repository.update(id, data);
    return toStudentResponse(updated);
  }

  async delete(id: string) {
    const student = await this.repository.findById(id);
    if (!student) throw new NotFoundError(STUDENT_MESSAGES.NOT_FOUND);
    await this.repository.delete(id);
    return {
      message: STUDENT_MESSAGES.DELETED,
    };
  }

  // 🔒 Helper untuk mengecek role user
  private async validateUserRole(userId: string, roleName: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        roles: {
          select: { name: true },
        },
      },
    });

    if (!user) {
      throw new NotFoundError("User tidak ditemukan");
    }

    const hasRole = user.roles.some((role: any) => role.name === roleName);
    if (!hasRole) {
      throw new ConflictError(
        `User harus memiliki role '${roleName}' untuk dapat dihubungkan sebagai ${roleName.toLowerCase()}.`
      );
    }
  }
}