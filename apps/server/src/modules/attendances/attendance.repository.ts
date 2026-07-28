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

    if (query.search) {
      where.OR = [
        {
          student: {
            name: { contains: query.search, mode: "insensitive" },
          },
        },
        {
          student: {
            user: { email: { contains: query.search, mode: "insensitive" } },
          },
        },
      ];
    }

    if (query.sessionId) where.attendanceSessionId = query.sessionId;
    if (query.studentId) where.studentId = query.studentId;
    if (query.status) where.status = query.status;

    if (query.classId) {
      where.session = { schoolClassId: query.classId };
    }

    if (query.date) {
      where.session = { ...where.session, date: new Date(query.date) };
    }

    return prisma.attendance.findMany({
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
    });
  }

  async count(query: any) {
    const where: any = {};
    if (query.search) {
      where.OR = [
        { student: { name: { contains: query.search, mode: "insensitive" } } },
        { student: { user: { email: { contains: query.search, mode: "insensitive" } } } },
      ];
    }
    if (query.sessionId) where.attendanceSessionId = query.sessionId;
    if (query.studentId) where.studentId = query.studentId;
    if (query.status) where.status = query.status;
    if (query.classId) {
      where.session = { schoolClassId: query.classId };
    }
    if (query.date) {
      where.session = { ...where.session, date: new Date(query.date) };
    }
    return prisma.attendance.count({ where });
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
