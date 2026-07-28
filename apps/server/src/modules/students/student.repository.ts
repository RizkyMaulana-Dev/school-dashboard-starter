import { prisma } from "../../lib/prisma";
import { CreateStudentDto, UpdateStudentDto } from "./student.types";
import { PaginationQuery } from "../../utils/pagination";
import { NotFoundError } from "../../errors";
import { STUDENT_MESSAGES } from "../../constant/messages";


export class StudentRepository {
  async findMany(query: PaginationQuery) {
    return prisma.student.findMany({
      skip: query.skip,
      take: query.limit,
      where: query.search
        ? {
            OR: [
              {
                name: {
                  contains: query.search,
                  mode: "insensitive",
                },
              },
              {
                user: {
                  email: {
                    contains: query.search,
                    mode: "insensitive",
                  },
                },
              },
            ],
          }
        : undefined,
      orderBy: {
        [query.sort]: query.order,
      },
      include: {
        user: {
          select: {
            email: true,
          },
        },
        schoolClass: {
          select: {
            id: true,
            name: true,
            grade: true,
          },
        },
      },
    });
  }

  async count(search?: string) {
    return prisma.student.count({
      where: search
        ? {
            OR: [
              {
                name: {
                  contains: search,
                  mode: "insensitive",
                },
              },
              {
                user: {
                  email: {
                    contains: search,
                    mode: "insensitive",
                  },
                },
              },
            ],
          }
        : undefined,
    });
  }

  async findByUserId(userId: string) {
    return prisma.student.findUnique({
      where: {
        userId,
      },
      select: {
        id: true,
      },
    });
  }

  async findById(id: string) {
    return prisma.student.findUnique({
      where: {
        id,
      },
      include: {
        user: true,
        schoolClass: true,
      },
    });
  }

  async create(data: CreateStudentDto) {
    return prisma.student.create({
      data: {
        name: data.name,
        gender: data.gender,
        birthDate: data.birthDate,
        user: {
          connect: { id: data.userId },
        },
        schoolClass: {
          connect: {
            id: data.schoolClassId,
          },
        },
      },
    });
  }

  async update(id: string, data: UpdateStudentDto) {
    return prisma.student.update({
      where: { id },
      data: {
        name: data.name,
        gender: data.gender,
        birthDate: data.birthDate,
        schoolClass: data.schoolClassId
          ? {
              connect: {
                id: data.schoolClassId,
              },
            }
          : undefined,
      },
      include: {
        user: {
          select: {
            email: true,
          },
        },
        schoolClass: {
          select: {
            name: true,
          },
        },
      },
    });
  }

  async delete(id: string) {
    const student = await prisma.student.findUnique({
      where: { id },
      select: { userId: true },
    });

    if (!student) throw new NotFoundError(STUDENT_MESSAGES.NOT_FOUND);

    return prisma.student.delete({
      where: {
        id,
      },
    });
  }
}
