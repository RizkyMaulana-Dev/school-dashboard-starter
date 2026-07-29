import { BookRepository } from "./book.repository";
import { CreateBookDto, UpdateBookDto } from "./book.types";
import { NotFoundError } from "../../errors";
import { PaginationQuery } from "../../utils/pagination";
import { createPaginationMeta } from "../../utils/pagination/PaginatedResponse";
import { toBookResponse, toBooksResponse } from "./book.mapper";
import { BOOK_MESSAGES } from "../../constant/messages";

export class BookService {
  private repository = new BookRepository();

  async findAll(query: PaginationQuery & { categoryId?: string }) {
    const books = await this.repository.findMany(query);
    const total = await this.repository.count(query.search, query.categoryId);

    return {
      data: toBooksResponse(books),
      meta: createPaginationMeta(query.page, query.limit, total),
    };
  }

  async findById(id: string) {
    const book = await this.repository.findById(id);
    if (!book) throw new NotFoundError(BOOK_MESSAGES.NOT_FOUND);
    return toBookResponse(book);
  }

  async create(data: CreateBookDto) {
    const book = await this.repository.create(data);
    return toBookResponse(book);
  }

  async update(id: string, data: UpdateBookDto) {
    await this.findById(id); // ensure exists
    const updated = await this.repository.update(id, data);
    return toBookResponse(updated);
  }

  async delete(id: string) {
    await this.findById(id);
    await this.repository.delete(id);
    return { message: BOOK_MESSAGES.DELETED };
  }
}