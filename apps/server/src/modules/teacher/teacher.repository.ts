import { prisma } from "../../lib/prisma";
import { CreateTeacherDto, UpdateTeacherDto } from "./teacher.types";
import { PaginationQuery } from "../../utils/pagination";
import { NotFoundError } from "../../errors";
import { TEACHER_MESSAGE } from "../../constant/messages";
import { da } from "zod/locales";
import { throwDeprecation } from "node:process";

export class TeacherRepository {
  async findMany(query: PaginationQuery) {
    return prisma.teacher.findMany({
      skip: query.skip,
      take: query.limit,
      where: query.search
        ? {
            OR: [
              {
                name: {
                  contains: query.search,
                },
              },
              {
                user: {
                  email: {
                    contains: query.search,

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
        classes: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
  }

  async count(search?: string) {
    return prisma.teacher.count({
      where: search
        ? {
            OR: [
              {
                name: {
                  contains: search,
                },
              },
              {
                user: {
                  email: {
                    contains: search,

                  },
                },
              },
            ],
          }
        : undefined,
    });
  }

  async findById(id: string) {
    return prisma.teacher.findUnique({
      where: {
        id,
      },
      include: {
        user: true,
        classes: true,
      },
    });
  }

  async create(data: CreateTeacherDto) {
    return prisma.teacher.create({
      data: {
        name: data.name,
        gender: data.gender,
        user: {
          connect: {
            id: data.userId,
          },
        },
        classes: {
          connect: data.classIds?.map((id) => ({
            id,
          })),
        },
      },
      include: {
        user: true,
        classes: true,
      },
    });
  }

  async update(id: string, data: UpdateTeacherDto) {
    return prisma.teacher.update({
      where: {
        id,
      },
      data: {
        name: data.name,
        gender: data.gender,

        ...(data.userId && {
          user: {
            connect: {
              id: data.userId,
            },
          },
        }),

        ...(data.classIds && {
          classes: {
            set: data.classIds.map((id) => ({
              id,
            })),
          },
        }),
      },
      include: {
        user: true,
        classes: true,
      },
    });
  }

  async delete(id: string) {
    const teacher = await prisma.teacher.findUnique({
      where: { id },
      select: { userId: true },
    });

    if (!teacher) throw new NotFoundError(TEACHER_MESSAGE.NOT_FOUND);

    return prisma.teacher.delete({
      where: {
        id,
      },
    });
  }
}
