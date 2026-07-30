import { prisma } from "../../lib/prisma";
import { CreateAttendanceSessionDto, UpdateAttendanceSessionDto } from "./attendanceSession.types";
import { PaginationQuery } from "../../utils/pagination";
import { NotFoundError } from "../../errors";
import { ATTENDANCE_SESSION_MESSAGES } from "../../constant/messages";

export class AttendanceSessionRepository {
  async findMany(
    query: PaginationQuery & {
      classId?: string;
      teacherId?: string;
      date?: string;
    },
  ) {
    const where: any = {};

    if (query.search) {
      where.OR = [
        { title: { contains: query.search } },
        {
          schoolClass: {
            name: { contains: query.search },
          },
        },
        {
          teacher: {
            name: { contains: query.search },
          },
        },
      ];
    }

    if (query.classId) where.schoolClassId = query.classId;
    if (query.teacherId) where.teacherId = query.teacherId;
    if (query.date) {
      const startDate = new Date(query.date);
      startDate.setUTCHours(0, 0, 0, 0); // Set ke awal hari (00:00:00.000)

      const endDate = new Date(query.date);
      endDate.setUTCHours(23, 59, 59, 999); // Set ke akhir hari (23:59:59.999)

      where.date = {
        gte: startDate,
        lte: endDate,
      };
    }
    return prisma.attendanceSession.findMany({
      skip: query.skip,
      take: query.limit,
      where,
      orderBy: { [query.sort || "date"]: query.order || "desc" },
      include: {
        schoolClass: {
          select: { id: true, name: true },
        },
        teacher: {
          select: { id: true, name: true },
        },
      },
    });
  }

  async count(query: any) {
    const where: any = {};
    if (query.search) {
      where.OR = [
        { title: { contains: query.search } },
        { schoolClass: { name: { contains: query.search } } },
        { teacher: { name: { contains: query.search } } },
      ];
    }
    if (query.classId) where.schoolClassId = query.classId;
    if (query.teacherId) where.teacherId = query.teacherId;
    if (query.date) where.date = new Date(query.date);
    return prisma.attendanceSession.count({ where });
  }

  async findById(id: string) {
    return prisma.attendanceSession.findUnique({
      where: { id },
      include: {
        schoolClass: { select: { id: true, name: true } },
        teacher: { select: { id: true, name: true } },
        // optionally include count of records
        _count: { select: { records: true } },
      },
    });
  }

  async create(data: CreateAttendanceSessionDto) {
    return prisma.attendanceSession.create({
      data: {
        title: data.title,
        date: data.date,
        startTime: data.startTime,
        endTime: data.endTime,
        schoolClass: { connect: { id: data.schoolClassId } },
        teacher: { connect: { id: data.teacherId } },
      },
      include: {
        schoolClass: { select: { id: true, name: true } },
        teacher: { select: { id: true, name: true } },
      },
    });
  }

  async update(id: string, data: UpdateAttendanceSessionDto) {
    // Perlu handle null untuk startTime/endTime jika dikirim null (reset)
    const updateData: any = {};
    if (data.title !== undefined) updateData.title = data.title;
    if (data.date !== undefined) updateData.date = data.date;
    if (data.startTime !== undefined) updateData.startTime = data.startTime;
    if (data.endTime !== undefined) updateData.endTime = data.endTime;
    if (data.schoolClassId) {
      updateData.schoolClass = { connect: { id: data.schoolClassId } };
    }
    if (data.teacherId) {
      updateData.teacher = { connect: { id: data.teacherId } };
    }

    return prisma.attendanceSession.update({
      where: { id },
      data: updateData,
      include: {
        schoolClass: { select: { id: true, name: true } },
        teacher: { select: { id: true, name: true } },
      },
    });
  }

  async delete(id: string) {
    const session = await prisma.attendanceSession.findUnique({
      where: { id },
      select: { id: true },
    });
    if (!session) throw new NotFoundError(ATTENDANCE_SESSION_MESSAGES.NOT_FOUND);
    return prisma.attendanceSession.delete({ where: { id } });
  }
}
