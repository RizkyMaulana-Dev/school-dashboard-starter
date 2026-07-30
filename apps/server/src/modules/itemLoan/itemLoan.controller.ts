import { Request, Response } from "express";
import { ItemLoanService } from "./itemLoan.service";
import { successResponse, successResponseWithMeta } from "../../utils/response";
import { ITEM_LOAN_MESSAGES } from "../../constant/messages";
import { getPagination } from "../../utils/pagination";

type Params = { id: string };

export class ItemLoanController {
  private service = new ItemLoanService();

  getAll = async (req: Request, res: Response) => {
    const pagination = getPagination(req);
    const { status, userId, itemId } = req.query as any;
    const result = await this.service.findAll({
      ...pagination,
      status,
      userId,
      itemId,
    });
    return successResponseWithMeta(res, result.data, result.meta, ITEM_LOAN_MESSAGES.FETCHED);
  };

  getById = async (req: Request<Params>, res: Response) => {
    const loan = await this.service.findById(req.params.id);
    return successResponse(res, loan, ITEM_LOAN_MESSAGES.FETCHED_ONE);
  };

  create = async (req: Request<Params>, res: Response) => {
    const loan = await this.service.create(req.body);
    return successResponse(res, loan, ITEM_LOAN_MESSAGES.CREATED, 201);
  };

  update = async (req: Request<Params>, res: Response) => {
    const loan = await this.service.update(req.params.id, req.body);
    return successResponse(res, loan, ITEM_LOAN_MESSAGES.UPDATED);
  };

  delete = async (req: Request<Params>, res: Response) => {
    const result = await this.service.delete(req.params.id);
    return successResponse(res, null, result.message);
  };
}
