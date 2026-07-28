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
    const student = await this.repository.create(data);
    return toStudentResponse(student);
  }

  async update(id: string, data: UpdateStudentDto) {
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
}
