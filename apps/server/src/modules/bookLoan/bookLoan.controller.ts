import { Request, Response } from "express";
import { BookLoanService } from "./bookLoan.service";
import { successResponse, successResponseWithMeta } from "../../utils/response";
import { BOOK_LOAN_MESSAGES } from "../../constant/messages";
import { getPagination } from "../../utils/pagination";

type Params = { id: string };

export class BookLoanController {
  private service = new BookLoanService();

  getAll = async (req: Request, res: Response) => {
    const pagination = getPagination(req);
    const { status, userId, bookId } = req.query as any;
    const result = await this.service.findAll({
      ...pagination,
      status,
      userId,
      bookId,
    });
    return successResponseWithMeta(res, result.data, result.meta, BOOK_LOAN_MESSAGES.FETCHED);
  };

  getById = async (req: Request<Params>, res: Response) => {
    const loan = await this.service.findById(req.params.id);
    return successResponse(res, loan, BOOK_LOAN_MESSAGES.FETCHED_ONE);
  };

  create = async (req: Request<Params>, res: Response) => {
    const loan = await this.service.create(req.body);
    return successResponse(res, loan, BOOK_LOAN_MESSAGES.CREATED, 201);
  };

  update = async (req: Request<Params>, res: Response) => {
    const loan = await this.service.update(req.params.id, req.body);
    return successResponse(res, loan, BOOK_LOAN_MESSAGES.UPDATED);
  };

  delete = async (req: Request<Params>, res: Response) => {
    const result = await this.service.delete(req.params.id);
    return successResponse(res, null, result.message);
  };
}
