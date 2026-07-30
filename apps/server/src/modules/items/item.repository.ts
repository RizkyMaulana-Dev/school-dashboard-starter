import { prisma } from "../../lib/prisma";
import { CreateItemDto, UpdateItemDto } from "./item.type";
import { PaginationQuery } from "../../utils/pagination";
import { NotFoundError } from "../../errors";
import { ITEM_MESSAGES } from "../../constant/messages";

export class ItemRepository {
  async findMany(query: PaginationQuery & { categoryId?: string; condition?: string }) {
    const where: any = {};

    if (query.search) {
      where.OR = [{ name: { contains: query.search } }, { itemCode: { contains: query.search } }];
    }

    if (query.categoryId) where.categoryId = query.categoryId;
    if (query.condition) where.condition = query.condition;

    return prisma.item.findMany({
      skip: query.skip,
      take: query.limit,
      where,
      orderBy: { [query.sort || "name"]: query.order || "asc" },
      include: {
        category: {
          select: { id: true, name: true },
        },
      },
    });
  }

  async count(search?: string, categoryId?: string, condition?: string) {
    const where: any = {};
    if (search) {
      where.OR = [{ name: { contains: search } }, { itemCode: { contains: search } }];
    }
    if (categoryId) where.categoryId = categoryId;
    if (condition) where.condition = condition;
    return prisma.item.count({ where });
  }

  async findById(id: string) {
    return prisma.item.findUnique({
      where: { id },
      include: { category: { select: { id: true, name: true } } },
    });
  }

  async create(data: CreateItemDto) {
    return prisma.item.create({
      data: {
        itemCode: data.itemCode,
        name: data.name,
        stockTotal: data.stockTotal,
        stockAvailable: data.stockAvailable,
        condition: data.condition,
        location: data.location,
        purchaseDate: data.purchaseDate,
        category: { connect: { id: data.categoryId } },
      },
      include: { category: { select: { id: true, name: true } } },
    });
  }

  async update(id: string, data: UpdateItemDto) {
    const updateData: any = {};
    if (data.itemCode !== undefined) updateData.itemCode = data.itemCode;
    if (data.name !== undefined) updateData.name = data.name;
    if (data.stockTotal !== undefined) updateData.stockTotal = data.stockTotal;
    if (data.stockAvailable !== undefined) updateData.stockAvailable = data.stockAvailable;
    if (data.condition !== undefined) updateData.condition = data.condition;
    if (data.location !== undefined) updateData.location = data.location;
    if (data.purchaseDate !== undefined) updateData.purchaseDate = data.purchaseDate;
    if (data.categoryId) updateData.category = { connect: { id: data.categoryId } };

    return prisma.item.update({
      where: { id },
      data: updateData,
      include: { category: { select: { id: true, name: true } } },
    });
  }

  async delete(id: string) {
    const item = await prisma.item.findUnique({ where: { id }, select: { id: true } });
    if (!item) throw new NotFoundError(ITEM_MESSAGES.NOT_FOUND);
    return prisma.item.delete({ where: { id } });
  }
}
