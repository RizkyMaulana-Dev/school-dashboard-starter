import { BookCategoryRepository } from "./bookCategory.repository";
import { CreateBookCategoryDto, UpdateBookCategoryDto } from "./bookCategory.types";
import { NotFoundError, ConflictError } from "../../errors";
import { PaginationQuery } from "../../utils/pagination";
import { createPaginationMeta } from "../../utils/pagination/PaginatedResponse";
import { toBookCategoryResponse, toBookCategoriesResponse } from "./bookCategory.mapper";
import { BOOK_CATEGORY_MESSAGES } from "../../constant/messages";

export class BookCategoryService {
  private repository = new BookCategoryRepository();

  async findAll(query: PaginationQuery) {
    const categories = await this.repository.findMany(query);
    const total = await this.repository.count(query.search);
    return {
      data: toBookCategoriesResponse(categories),
      meta: createPaginationMeta(query.page, query.limit, total),
    };
  }

  async findById(id: string) {
    const category = await this.repository.findById(id);
    if (!category) throw new NotFoundError(BOOK_CATEGORY_MESSAGES.NOT_FOUND);
    return toBookCategoryResponse(category);
  }

  async create(data: CreateBookCategoryDto) {
    const existing = await this.repository.findByName(data.name);
    if (existing) throw new ConflictError(BOOK_CATEGORY_MESSAGES.ALREADY_EXISTS);
    const category = await this.repository.create(data);
    return toBookCategoryResponse(category);
  }

  async update(id: string, data: UpdateBookCategoryDto) {
    if (data.name) {
      const existing = await this.repository.findByName(data.name);
      if (existing && existing.id !== id) {
        throw new ConflictError(BOOK_CATEGORY_MESSAGES.ALREADY_EXISTS);
      }
    }
    const updated = await this.repository.update(id, data);
    return toBookCategoryResponse(updated);
  }

  async delete(id: string) {
    await this.repository.delete(id);
    return { message: BOOK_CATEGORY_MESSAGES.DELETED };
  }
}