import { prisma } from "../../lib/prisma";
import { CreateBookDto, UpdateBookDto } from "./book.types";
import { PaginationQuery } from "../../utils/pagination";
import { NotFoundError } from "../../errors";
import { BOOK_MESSAGES } from "../../constant/messages";

export class BookRepository {
  async findMany(query: PaginationQuery & { categoryId?: string }) {
    const where: any = {};

    if (query.search) {
      where.OR = [
        { title: { contains: query.search} },
        { author: { contains: query.search} },
        { isbn: { contains: query.search} },
        { publisher: { contains: query.search} },
      ];
    }

    if (query.categoryId) {
      where.bookCategoryId = query.categoryId;
    }

    return prisma.book.findMany({
      skip: query.skip,
      take: query.limit,
      where,
      orderBy: {
        [query.sort || "title"]: query.order || "asc",
      },
      include: {
        category: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
  }

  async count(search?: string, categoryId?: string) {
    const where: any = {};
    if (search) {
      where.OR = [
        { title: { contains: search} },
        { author: { contains: search} },
        { isbn: { contains: search} },
        { publisher: { contains: search} },
      ];
    }
    if (categoryId) {
      where.bookCategoryId = categoryId;
    }
    return prisma.book.count({ where });
  }

  async findById(id: string) {
    return prisma.book.findUnique({
      where: { id },
      include: {
        category: {
          select: { id: true, name: true },
        },
      },
    });
  }

  async create(data: CreateBookDto) {
    return prisma.book.create({
      data: {
        isbn: data.isbn,
        title: data.title,
        author: data.author,
        publisher: data.publisher,
        publishedYear: data.publishedYear,
        stockTotal: data.stockTotal,
        stockAvailable: data.stockAvailable,
        shelfLocation: data.shelfLocation,
        coverImage: data.coverImage,
        category: { connect: { id: data.bookCategoryId } },
      },
      include: {
        category: {
          select: { id: true, name: true },
        },
      },
    });
  }

  async update(id: string, data: UpdateBookDto) {
    const updateData: any = {};
    if (data.isbn !== undefined) updateData.isbn = data.isbn;
    if (data.title !== undefined) updateData.title = data.title;
    if (data.author !== undefined) updateData.author = data.author;
    if (data.publisher !== undefined) updateData.publisher = data.publisher;
    if (data.publishedYear !== undefined) updateData.publishedYear = data.publishedYear;
    if (data.stockTotal !== undefined) updateData.stockTotal = data.stockTotal;
    if (data.stockAvailable !== undefined) updateData.stockAvailable = data.stockAvailable;
    if (data.shelfLocation !== undefined) updateData.shelfLocation = data.shelfLocation;
    if (data.coverImage !== undefined) updateData.coverImage = data.coverImage;
    if (data.bookCategoryId) {
      updateData.category = { connect: { id: data.bookCategoryId } };
    }

    return prisma.book.update({
      where: { id },
      data: updateData,
      include: {
        category: {
          select: { id: true, name: true },
        },
      },
    });
  }

  async delete(id: string) {
    const book = await prisma.book.findUnique({ where: { id }, select: { id: true } });
    if (!book) throw new NotFoundError(BOOK_MESSAGES.NOT_FOUND);
    return prisma.book.delete({ where: { id } });
  }
}