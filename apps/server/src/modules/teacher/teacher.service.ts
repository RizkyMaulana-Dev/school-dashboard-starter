import { TeacherRepository } from "./teacher.repository";
import { CreateTeacherDto, UpdateTeacherDto } from "./teacher.types";
import { NotFoundError } from "../../errors";
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
    const teacher = await this.repository.create(data);

    return toTeacherResponse(teacher);
  }

  async update(id: string, data: UpdateTeacherDto) {
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
}