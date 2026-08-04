import { prisma } from "../../lib/prisma";
import { TeacherRepository } from "./teacher.repository";
import { CreateTeacherDto, UpdateTeacherDto } from "./teacher.types";
import { NotFoundError, ConflictError } from "../../errors";
import { PaginationQuery } from "../../utils/pagination";
import { createPaginationMeta } from "../../utils/pagination/PaginatedResponse";
import { toTeacherResponse, toTeachersResponse } from "./teacher.mapper";
import { TEACHER_MESSAGE } from "../../constant/messages";

export class TeacherService {
  private repository = new TeacherRepository();

  async findAll(query: PaginationQuery) {
    const teachers = await this.repository.findMany(query);
    const total = await this.repository.count(query.search);

    return {
      data: toTeachersResponse(teachers),
      meta: createPaginationMeta(query.page, query.limit, total),
    };
  }

  async findById(id: string) {
    const teacher = await this.repository.findById(id);

    if (!teacher) {
      throw new NotFoundError(TEACHER_MESSAGE.NOT_FOUND);
    }

    return toTeacherResponse(teacher);
  }

  async create(data: CreateTeacherDto) {
    // 🛡️ Validasi: pastikan userId memiliki role "Teacher"
    await this.validateUserRole(data.userId, "Teacher");

    const teacher = await this.repository.create(data);
    return toTeacherResponse(teacher);
  }

  async update(id: string, data: UpdateTeacherDto) {
    // 🛡️ Validasi jika userId disertakan dalam update
    if (data.userId) {
      await this.validateUserRole(data.userId, "Teacher");
    }

    const teacher = await this.repository.findById(id);
    if (!teacher) {
      throw new NotFoundError(TEACHER_MESSAGE.NOT_FOUND);
    }

    const updated = await this.repository.update(id, data);
    return toTeacherResponse(updated);
  }

  async delete(id: string) {
    const teacher = await this.repository.findById(id);

    if (!teacher) {
      throw new NotFoundError(TEACHER_MESSAGE.NOT_FOUND);
    }

    await this.repository.delete(id);

    return {
      message: TEACHER_MESSAGE.DELETED,
    };
  }

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
        `User harus memiliki role '${roleName}' untuk dapat dihubungkan sebagai ${roleName.toLowerCase()}.`,
      );
    }
  }
}
