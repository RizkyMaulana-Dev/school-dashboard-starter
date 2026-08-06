import { prisma } from "../../lib/prisma";
import { CreateBookCategoryDto, UpdateBookCategoryDto } from "./bookCategory.types";
import { PaginationQuery } from "../../utils/pagination";
import { NotFoundError } from "../../errors";
import { BOOK_CATEGORY_MESSAGES } from "../../constant/messages";

export class BookCategoryRepository {
  async findMany(query: PaginationQuery) {
    return prisma.bookCategory.findMany({
      skip: query.skip,
      take: query.limit,
      where: query.search
        ? {
            OR: [
              { name: { contains: query.search, mode: "insensitive" } },
              { description: { contains: query.search, mode: "insensitive" } },
            ],
          }
        : undefined,
      orderBy: { [query.sort || "name"]: query.order || "asc" },
    });
  }

  async count(search?: string) {
    return prisma.bookCategory.count({
      where: search
        ? {
            OR: [
              { name: { contains: search, mode: "insensitive" } },
              { description: { contains: search, mode: "insensitive" } },
            ],
          }
        : undefined,
    });
  }

  async findById(id: string) {
    return prisma.bookCategory.findUnique({ where: { id } });
  }

  async findByName(name: string) {
    return prisma.bookCategory.findUnique({ where: { name } });
  }

  async create(data: CreateBookCategoryDto) {
    return prisma.bookCategory.create({
      data: {
        name: data.name,
        description: data.description,
      },
    });
  }

  async update(id: string, data: UpdateBookCategoryDto) {
    const category = await prisma.bookCategory.findUnique({ where: { id } });
    if (!category) throw new NotFoundError(BOOK_CATEGORY_MESSAGES.NOT_FOUND);

    return prisma.bookCategory.update({
      where: { id },
      data: {
        ...(data.name !== undefined && { name: data.name }),
        ...(data.description !== undefined && { description: data.description }),
      },
    });
  }

  async delete(id: string) {
    const category = await prisma.bookCategory.findUnique({ where: { id } });
    if (!category) throw new NotFoundError(BOOK_CATEGORY_MESSAGES.NOT_FOUND);

    return prisma.bookCategory.delete({ where: { id } });
  }
}