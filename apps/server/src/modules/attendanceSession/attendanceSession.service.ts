import { AttendanceSessionRepository } from "./attendanceSession.repository";
import {
  CreateAttendanceSessionDto,
  UpdateAttendanceSessionDto,
} from "./attendanceSession.types";
import { NotFoundError } from "../../errors";
import { PaginationQuery } from "../../utils/pagination";
import { createPaginationMeta } from "../../utils/pagination/PaginatedResponse";
import {
  toAttendanceSessionResponse,
  toAttendanceSessionsResponse,
} from "./attendanceSession.mapper";
import { ATTENDANCE_SESSION_MESSAGES } from "../../constant/messages";

export class AttendanceSessionService {
  private repository = new AttendanceSessionRepository();

  async findAll(query: PaginationQuery & any) {
    const sessions = await this.repository.findMany(query);
    const total = await this.repository.count(query);
    return {
      data: toAttendanceSessionsResponse(sessions),
      meta: createPaginationMeta(query.page, query.limit, total),
    };
  }

  async findById(id: string) {
    const session = await this.repository.findById(id);
    if (!session) throw new NotFoundError(ATTENDANCE_SESSION_MESSAGES.NOT_FOUND);
    return toAttendanceSessionResponse(session);
  }

  async create(data: CreateAttendanceSessionDto) {
    const session = await this.repository.create(data);
    return toAttendanceSessionResponse(session);
  }

  async update(id: string, data: UpdateAttendanceSessionDto) {
    await this.findById(id); // ensure exists
    const updated = await this.repository.update(id, data);
    return toAttendanceSessionResponse(updated);
  }

  async delete(id: string) {
    await this.findById(id);
    await this.repository.delete(id);
    return { message: ATTENDANCE_SESSION_MESSAGES.DELETED };
  }
}