import { prisma } from "../../lib/prisma";
import { CreateItemCategoryDto, UpdateItemCategoryDto } from "./itemCategory.types";
import { PaginationQuery } from "../../utils/pagination";
import { NotFoundError } from "../../errors";
import { ITEM_CATEGORY_MESSAGES } from "../../constant/messages";

export class ItemCategoryRepository {
  async findMany(query: PaginationQuery) {
    return prisma.itemCategory.findMany({
      skip: query.skip,
      take: query.limit,
      where: query.search
        ? {
            OR: [
              { name: { contains: query.search} },
              { description: { contains: query.search} },
            ],
          }
        : undefined,
      orderBy: { [query.sort || "name"]: query.order || "asc" },
    });
  }

  async count(search?: string) {
    return prisma.itemCategory.count({
      where: search
        ? {
            OR: [
              { name: { contains: search} },
              { description: { contains: search} },
            ],
          }
        : undefined,
    });
  }

  async findById(id: string) {
    return prisma.itemCategory.findUnique({ where: { id } });
  }

  async findByName(name: string) {
    return prisma.itemCategory.findUnique({ where: { name } });
  }

  async create(data: CreateItemCategoryDto) {
    return prisma.itemCategory.create({
      data: {
        name: data.name,
        description: data.description,
      },
    });
  }

  async update(id: string, data: UpdateItemCategoryDto) {
    const category = await prisma.itemCategory.findUnique({ where: { id } });
    if (!category) throw new NotFoundError(ITEM_CATEGORY_MESSAGES.NOT_FOUND);

    return prisma.itemCategory.update({
      where: { id },
      data: {
        ...(data.name !== undefined && { name: data.name }),
        ...(data.description !== undefined && { description: data.description }),
      },
    });
  }

  async delete(id: string) {
    const category = await prisma.itemCategory.findUnique({ where: { id } });
    if (!category) throw new NotFoundError(ITEM_CATEGORY_MESSAGES.NOT_FOUND);

    return prisma.itemCategory.delete({ where: { id } });
  }
}