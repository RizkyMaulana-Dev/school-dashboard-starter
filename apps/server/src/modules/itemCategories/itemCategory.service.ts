import { ItemCategoryRepository } from "./itemCategory.repository";
import { CreateItemCategoryDto, UpdateItemCategoryDto } from "./itemCategory.types";
import { NotFoundError, ConflictError } from "../../errors";
import { PaginationQuery } from "../../utils/pagination";
import { createPaginationMeta } from "../../utils/pagination/PaginatedResponse";
import { toItemCategoryResponse, toItemCategoriesResponse } from "./itemCategory.mapper";
import { ITEM_CATEGORY_MESSAGES } from "../../constant/messages";

export class ItemCategoryService {
  private repository = new ItemCategoryRepository();

  async findAll(query: PaginationQuery) {
    const categories = await this.repository.findMany(query);
    const total = await this.repository.count(query.search);
    return {
      data: toItemCategoriesResponse(categories),
      meta: createPaginationMeta(query.page, query.limit, total),
    };
  }

  async findById(id: string) {
    const category = await this.repository.findById(id);
    if (!category) throw new NotFoundError(ITEM_CATEGORY_MESSAGES.NOT_FOUND);
    return toItemCategoryResponse(category);
  }

  async create(data: CreateItemCategoryDto) {
    const existing = await this.repository.findByName(data.name);
    if (existing) throw new ConflictError(ITEM_CATEGORY_MESSAGES.ALREADY_EXISTS);
    const category = await this.repository.create(data);
    return toItemCategoryResponse(category);
  }

  async update(id: string, data: UpdateItemCategoryDto) {
    // Cek duplikasi nama jika diupdate
    if (data.name) {
      const existing = await this.repository.findByName(data.name);
      if (existing && existing.id !== id) {
        throw new ConflictError(ITEM_CATEGORY_MESSAGES.ALREADY_EXISTS);
      }
    }
    const updated = await this.repository.update(id, data);
    return toItemCategoryResponse(updated);
  }

  async delete(id: string) {
    await this.repository.delete(id);
    return { message: ITEM_CATEGORY_MESSAGES.DELETED };
  }
}