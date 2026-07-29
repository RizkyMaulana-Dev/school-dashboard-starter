import { AttendanceRepository } from "./attendance.repository";
import { CreateAttendanceDto, UpdateAttendanceDto } from "./attendance.type";
import { NotFoundError } from "../../errors";
import { PaginationQuery } from "../../utils/pagination";
import { createPaginationMeta } from "../../utils/pagination/PaginatedResponse";
import { toAttendanceResponse, toAttendancesResponse } from "./attendance.mapper";
import { ATTENDANCE_MESSAGES } from "../../constant/messages";

export class AttendanceService {
  private repository = new AttendanceRepository();

  async findAll(query: PaginationQuery & any) {
    // Destructure `data` (array records) dan `total` (jumlah count) dari repository
    const { data, total } = await this.repository.findMany(query);

    return {
      // Oper array `data` ke mapper, bukan wrapper object-nya
      data: toAttendancesResponse(data),
      meta: createPaginationMeta(query.page, query.limit, total),
    };
  }

  async findById(id: string) {
    const record = await this.repository.findById(id);
    if (!record) throw new NotFoundError(ATTENDANCE_MESSAGES.NOT_FOUND);
    return toAttendanceResponse(record);
  }

  async create(data: CreateAttendanceDto) {
    const record = await this.repository.create(data);
    return toAttendanceResponse(record);
  }

  async update(id: string, data: UpdateAttendanceDto) {
    await this.findById(id); // validasi exist
    const updated = await this.repository.update(id, data);
    return toAttendanceResponse(updated);
  }

  async delete(id: string) {
    await this.findById(id);
    await this.repository.delete(id);
    return { message: ATTENDANCE_MESSAGES.DELETED };
  }
}