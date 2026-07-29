import { prisma } from "../../lib/prisma";
import { CreateBookLoanDto, UpdateBookLoanDto } from "./bookLoan.types";
import { PaginationQuery } from "../../utils/pagination";
import { NotFoundError, ConflictError } from "../../errors";
import { BOOK_LOAN_MESSAGES } from "../../constant/messages";

export class BookLoanRepository {
  async findMany(
    query: PaginationQuery & {
      status?: string;
      userId?: string;
      bookId?: string;
    }
  ) {
    const where: any = {};

    if (query.search) {
      where.OR = [
        {
          book: {
            title: { contains: query.search, mode: "insensitive" },
          },
        },
        {
          user: {
            name: { contains: query.search, mode: "insensitive" },
          },
        },
      ];
    }

    if (query.status) where.status = query.status;
    if (query.userId) where.userId = query.userId;
    if (query.bookId) where.bookId = query.bookId;

    return prisma.bookLoan.findMany({
      skip: query.skip,
      take: query.limit,
      where,
      orderBy: { [query.sort || "borrowDate"]: query.order || "desc" },
      include: {
        book: {
          select: { id: true, title: true, isbn: true },
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
        { book: { title: { contains: query.search, mode: "insensitive" } } },
        { user: { name: { contains: query.search, mode: "insensitive" } } },
      ];
    }
    if (query.status) where.status = query.status;
    if (query.userId) where.userId = query.userId;
    if (query.bookId) where.bookId = query.bookId;
    return prisma.bookLoan.count({ where });
  }

  async findById(id: string) {
    return prisma.bookLoan.findUnique({
      where: { id },
      include: {
        book: { select: { id: true, title: true, isbn: true } },
        user: { select: { id: true, name: true, email: true } },
      },
    });
  }

  async create(data: CreateBookLoanDto) {
    return prisma.$transaction(async (tx) => {
      // Validasi buku dan stok
      const book = await tx.book.findUnique({
        where: { id: data.bookId },
        select: { id: true, stockAvailable: true },
      });
      if (!book) throw new NotFoundError(BOOK_LOAN_MESSAGES.BOOK_NOT_FOUND);
      if (book.stockAvailable < 1) {
        throw new ConflictError(BOOK_LOAN_MESSAGES.OUT_OF_STOCK);
      }

      // Kurangi stok
      await tx.book.update({
        where: { id: data.bookId },
        data: { stockAvailable: { decrement: 1 } },
      });

      // Buat peminjaman
      const loan = await tx.bookLoan.create({
        data: {
          bookId: data.bookId,
          userId: data.userId,
          dueDate: data.dueDate,
          notes: data.notes,
          status: "DIPINJAM",
        },
        include: {
          book: { select: { id: true, title: true, isbn: true } },
          user: { select: { id: true, name: true, email: true } },
        },
      });

      return loan;
    });
  }

  async update(id: string, data: UpdateBookLoanDto) {
    return prisma.$transaction(async (tx) => {
      const existingLoan = await tx.bookLoan.findUnique({
        where: { id },
        include: { book: { select: { id: true } } },
      });
      if (!existingLoan) throw new NotFoundError(BOOK_LOAN_MESSAGES.NOT_FOUND);

      const updateData: any = {};
      if (data.status) updateData.status = data.status;
      if (data.notes !== undefined) updateData.notes = data.notes;
      if (data.fineAmount !== undefined) updateData.fineAmount = data.fineAmount;
      if (data.returnDate !== undefined) updateData.returnDate = data.returnDate;

      // Jika status berubah menjadi DIKEMBALIKAN dan sebelumnya bukan DIKEMBALIKAN, kembalikan stok
      if (
        data.status === "DIKEMBALIKAN" &&
        existingLoan.status !== "DIKEMBALIKAN"
      ) {
        // Kembalikan stok hanya jika belum dikembalikan sebelumnya
        await tx.book.update({
          where: { id: existingLoan.bookId },
          data: { stockAvailable: { increment: 1 } },
        });
        // Jika returnDate tidak disediakan, isi dengan sekarang
        if (!data.returnDate) {
          updateData.returnDate = new Date();
        }
      }

      // Jika status HILANG, stok tidak bertambah (dianggap hilang)
      // Tidak ada perubahan stok untuk status lain

      const updatedLoan = await tx.bookLoan.update({
        where: { id },
        data: updateData,
        include: {
          book: { select: { id: true, title: true, isbn: true } },
          user: { select: { id: true, name: true, email: true } },
        },
      });

      return updatedLoan;
    });
  }

  async delete(id: string) {
    return prisma.$transaction(async (tx) => {
      const loan = await tx.bookLoan.findUnique({
        where: { id },
        include: { book: { select: { id: true } } },
      });
      if (!loan) throw new NotFoundError(BOOK_LOAN_MESSAGES.NOT_FOUND);

      // Jika status masih DIPINJAM, kembalikan stok saat menghapus
      if (loan.status === "DIPINJAM") {
        await tx.book.update({
          where: { id: loan.bookId },
          data: { stockAvailable: { increment: 1 } },
        });
      }

      return tx.bookLoan.delete({ where: { id } });
    });
  }
}