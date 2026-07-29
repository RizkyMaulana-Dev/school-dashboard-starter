import { BookLoanRepository } from "./bookLoan.repository";
import { CreateBookLoanDto, UpdateBookLoanDto } from "./bookLoan.type";
import { NotFoundError } from "../../errors";
import { PaginationQuery } from "../../utils/pagination";
import { createPaginationMeta } from "../../utils/pagination/PaginatedResponse";
import { toBookLoanResponse, toBookLoansResponse } from "./bookLoan.mapper";
import { BOOK_LOAN_MESSAGES } from "../../constant/messages";

export class BookLoanService {
  private repository = new BookLoanRepository();

  async findAll(query: PaginationQuery & any) {
    const loans = await this.repository.findMany(query);
    const total = await this.repository.count(query);
    return {
      data: toBookLoansResponse(loans),
      meta: createPaginationMeta(query.page, query.limit, total),
    };
  }

  async findById(id: string) {
    const loan = await this.repository.findById(id);
    if (!loan) throw new NotFoundError(BOOK_LOAN_MESSAGES.NOT_FOUND);
    return toBookLoanResponse(loan);
  }

  async create(data: CreateBookLoanDto) {
    const loan = await this.repository.create(data);
    return toBookLoanResponse(loan);
  }

  async update(id: string, data: UpdateBookLoanDto) {
    // Jika status DIKEMBALIKAN dan tidak ada returnDate, service bisa set default di repository
    const loan = await this.repository.update(id, data);
    return toBookLoanResponse(loan);
  }

  async delete(id: string) {
    await this.repository.delete(id);
    return { message: BOOK_LOAN_MESSAGES.DELETED };
  }
}