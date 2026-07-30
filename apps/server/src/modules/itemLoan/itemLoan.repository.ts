import { prisma } from "../../lib/prisma";
import { CreateItemLoanDto, UpdateItemLoanDto } from "./itemLoan.types";
import { PaginationQuery } from "../../utils/pagination";
import { NotFoundError, ConflictError } from "../../errors";
import { ITEM_LOAN_MESSAGES } from "../../constant/messages";

export class ItemLoanRepository {
  async findMany(query: PaginationQuery & { status?: string; userId?: string; itemId?: string }) {
    const where: any = {};

    if (query.search) {
      where.OR = [
        {
          item: { name: { contains: query.search, mode: "insensitive" } },
        },
        {
          user: { name: { contains: query.search, mode: "insensitive" } },
        },
      ];
    }

    if (query.status) where.status = query.status;
    if (query.userId) where.userId = query.userId;
    if (query.itemId) where.itemId = query.itemId;

    return prisma.itemLoan.findMany({
      skip: query.skip,
      take: query.limit,
      where,
      orderBy: { [query.sort || "borrowDate"]: query.order || "desc" },
      include: {
        item: {
          select: { id: true, name: true, itemCode: true },
        },
        user: {
          select: { id: true, name: true, email: true },
        },
      },
    });
  }

  async count(query: any) {
    const where: any = {};
    if (query.search) {
      where.OR = [
        { item: { name: { contains: query.search, mode: "insensitive" } } },
        { user: { name: { contains: query.search, mode: "insensitive" } } },
      ];
    }
    if (query.status) where.status = query.status;
    if (query.userId) where.userId = query.userId;
    if (query.itemId) where.itemId = query.itemId;
    return prisma.itemLoan.count({ where });
  }

  async findById(id: string) {
    return prisma.itemLoan.findUnique({
      where: { id },
      include: {
        item: { select: { id: true, name: true, itemCode: true } },
        user: { select: { id: true, name: true, email: true } },
      },
    });
  }

  async create(data: CreateItemLoanDto) {
    return prisma.$transaction(async (tx) => {
      const item = await tx.item.findUnique({
        where: { id: data.itemId },
        select: { id: true, stockAvailable: true },
      });
      if (!item) throw new NotFoundError(ITEM_LOAN_MESSAGES.ITEM_NOT_FOUND);
      if (item.stockAvailable < data.quantity) {
        throw new ConflictError(ITEM_LOAN_MESSAGES.OUT_OF_STOCK);
      }

      // Kurangi stok
      await tx.item.update({
        where: { id: data.itemId },
        data: { stockAvailable: { decrement: data.quantity } },
      });

      const loan = await tx.itemLoan.create({
        data: {
          itemId: data.itemId,
          userId: data.userId,
          quantity: data.quantity,
          dueDate: data.dueDate,
          notes: data.notes,
          status: "DIPINJAM",
        },
        include: {
          item: { select: { id: true, name: true, itemCode: true } },
          user: { select: { id: true, name: true, email: true } },
        },
      });

      return loan;
    });
  }

  async update(id: string, data: UpdateItemLoanDto) {
    return prisma.$transaction(async (tx) => {
      const existingLoan = await tx.itemLoan.findUnique({
        where: { id },
        include: { item: { select: { id: true } } },
      });
      if (!existingLoan) throw new NotFoundError(ITEM_LOAN_MESSAGES.NOT_FOUND);

      const updateData: any = {};
      if (data.status) updateData.status = data.status;
      if (data.notes !== undefined) updateData.notes = data.notes;
      if (data.returnDate !== undefined) updateData.returnDate = data.returnDate;

      // Logika pengembalian stok
      if (data.status === "DIKEMBALIKAN" && existingLoan.status !== "DIKEMBALIKAN") {
        await tx.item.update({
          where: { id: existingLoan.itemId },
          data: { stockAvailable: { increment: existingLoan.quantity } },
        });
        if (!data.returnDate) {
          updateData.returnDate = new Date();
        }
      }

      // Jika status HILANG atau RUSAK, tidak mengembalikan stok

      const updatedLoan = await tx.itemLoan.update({
        where: { id },
        data: updateData,
        include: {
          item: { select: { id: true, name: true, itemCode: true } },
          user: { select: { id: true, name: true, email: true } },
        },
      });

      return updatedLoan;
    });
  }

  async delete(id: string) {
    return prisma.$transaction(async (tx) => {
      const loan = await tx.itemLoan.findUnique({
        where: { id },
        include: { item: { select: { id: true } } },
      });
      if (!loan) throw new NotFoundError(ITEM_LOAN_MESSAGES.NOT_FOUND);

      if (loan.status === "DIPINJAM") {
        // Kembalikan stok jika masih dipinjam
        await tx.item.update({
          where: { id: loan.itemId },
          data: { stockAvailable: { increment: loan.quantity } },
        });
      }

      return tx.itemLoan.delete({ where: { id } });
    });
  }
}
