import { prisma } from "../../lib/prisma";
import { CreateAttendanceDto, UpdateAttendanceDto } from "./attendance.type";
import { PaginationQuery } from "../../utils/pagination";
import { NotFoundError } from "../../errors";
import { ATTENDANCE_MESSAGES } from "../../constant/messages";

export class AttendanceRepository {
  async findMany(
    query: PaginationQuery & {
      sessionId?: string;
      studentId?: string;
      status?: string;
      classId?: string;
      date?: string;
    },
  ) {
    const where: any = {};

    // 1. Text Search Filter
    if (query.search) {
      where.OR = [
        {
          student: {
            name: { contains: query.search },
          },
        },
        {
          student: {
            user: { email: { contains: query.search } },
          },
        },
        {
          session: {
            title: { contains: query.search },
          },
        },
      ];
    }

    // 2. Exact Filters
    if (query.sessionId) where.attendanceSessionId = query.sessionId;
    if (query.studentId) where.studentId = query.studentId;
    if (query.status) where.status = query.status;

    if (query.classId) {
      where.session = { ...where.session, schoolClassId: query.classId };
    }

    // 3. Date Range Filter
    if (query.date) {
      const startDate = new Date(query.date);
      startDate.setUTCHours(0, 0, 0, 0);

      const endDate = new Date(query.date);
      endDate.setUTCHours(23, 59, 59, 999);

      where.session = {
        ...where.session,
        date: {
          gte: startDate,
          lte: endDate,
        },
      };
    }

    // 4. Fetch data and count in parallel
    const [data, total] = await prisma.$transaction([
      prisma.attendance.findMany({
        skip: query.skip,
        take: query.limit,
        where,
        orderBy: { [query.sort || "createdAt"]: query.order || "desc" },
        include: {
          session: {
            select: {
              id: true,
              title: true,
              date: true,
              schoolClass: { select: { id: true, name: true } },
            },
          },
          student: {
            select: { id: true, name: true },
          },
        },
      }),
      prisma.attendance.count({ where }),
    ]);

    return { data, total };
  }

  async findById(id: string) {
    return prisma.attendance.findUnique({
      where: { id },
      include: {
        session: {
          select: {
            id: true,
            title: true,
            date: true,
            schoolClass: { select: { id: true, name: true } },
          },
        },
        student: { select: { id: true, name: true } },
      },
    });
  }

  async create(data: CreateAttendanceDto) {
    return prisma.attendance.create({
      data: {
        attendanceSessionId: data.attendanceSessionId,
        studentId: data.studentId,
        status: data.status,
        notes: data.notes,
        verificationData: data.verificationData,
        recordedAt: data.recordedAt ?? new Date(),
      },
      include: {
        session: {
          select: {
            id: true,
            title: true,
            date: true,
            schoolClass: { select: { id: true, name: true } },
          },
        },
        student: { select: { id: true, name: true } },
      },
    });
  }

  async update(id: string, data: UpdateAttendanceDto) {
    return prisma.attendance.update({
      where: { id },
      data: {
        ...(data.status && { status: data.status }),
        ...(data.notes !== undefined && { notes: data.notes }),
        ...(data.verificationData !== undefined && { verificationData: data.verificationData }),
        ...(data.recordedAt && { recordedAt: data.recordedAt }),
      },
      include: {
        session: {
          select: {
            id: true,
            title: true,
            date: true,
            schoolClass: { select: { id: true, name: true } },
          },
        },
        student: { select: { id: true, name: true } },
      },
    });
  }

  async delete(id: string) {
    const record = await prisma.attendance.findUnique({ where: { id } });
    if (!record) throw new NotFoundError(ATTENDANCE_MESSAGES.NOT_FOUND);
    return prisma.attendance.delete({ where: { id } });
  }
}
