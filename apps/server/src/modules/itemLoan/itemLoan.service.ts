import { ItemLoanRepository } from "./itemLoan.repository";
import { CreateItemLoanDto, UpdateItemLoanDto } from "./itemLoan.types";
import { NotFoundError } from "../../errors";
import { PaginationQuery } from "../../utils/pagination";
import { createPaginationMeta } from "../../utils/pagination/PaginatedResponse";
import { toItemLoanResponse, toItemLoansResponse } from "./itemLoan.mapper";
import { ITEM_LOAN_MESSAGES } from "../../constant/messages";

export class ItemLoanService {
  private repository = new ItemLoanRepository();

  async findAll(query: PaginationQuery & any) {
    const loans = await this.repository.findMany(query);
    const total = await this.repository.count(query);
    return {
      data: toItemLoansResponse(loans),
      meta: createPaginationMeta(query.page, query.limit, total),
    };
  }

  async findById(id: string) {
    const loan = await this.repository.findById(id);
    if (!loan) throw new NotFoundError(ITEM_LOAN_MESSAGES.NOT_FOUND);
    return toItemLoanResponse(loan);
  }

  async create(data: CreateItemLoanDto) {
    const loan = await this.repository.create(data);
    return toItemLoanResponse(loan);
  }

  async update(id: string, data: UpdateItemLoanDto) {
    const loan = await this.repository.update(id, data);
    return toItemLoanResponse(loan);
  }

  async delete(id: string) {
    await this.repository.delete(id);
    return { message: ITEM_LOAN_MESSAGES.DELETED };
  }
}
