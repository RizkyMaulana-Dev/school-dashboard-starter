import { ItemRepository } from "./item.repository";
import { CreateItemDto, UpdateItemDto } from "./item.types";
import { NotFoundError } from "../../errors";
import { PaginationQuery } from "../../utils/pagination";
import { createPaginationMeta } from "../../utils/pagination/PaginatedResponse";
import { toItemResponse, toItemsResponse } from "./item.mapper";
import { ITEM_MESSAGES } from "../../constant/messages";

export class ItemService {
  private repository = new ItemRepository();

  async findAll(query: PaginationQuery & { categoryId?: string; condition?: string }) {
    const items = await this.repository.findMany(query);
    const total = await this.repository.count(query.search, query.categoryId, query.condition);
    return {
      data: toItemsResponse(items),
      meta: createPaginationMeta(query.page, query.limit, total),
    };
  }

  async findById(id: string) {
    const item = await this.repository.findById(id);
    if (!item) throw new NotFoundError(ITEM_MESSAGES.NOT_FOUND);
    return toItemResponse(item);
  }

  async create(data: CreateItemDto) {
    const item = await this.repository.create(data);
    return toItemResponse(item);
  }

  async update(id: string, data: UpdateItemDto) {
    await this.findById(id);
    const updated = await this.repository.update(id, data);
    return toItemResponse(updated);
  }

  async delete(id: string) {
    await this.findById(id);
    await this.repository.delete(id);
    return { message: ITEM_MESSAGES.DELETED };
  }
}