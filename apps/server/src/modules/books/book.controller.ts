import { Request, Response } from "express";
import { BookService } from "./book.service";
import { successResponse, successResponseWithMeta } from "../../utils/response";
import { BOOK_MESSAGES } from "../../constant/messages";
import { getPagination } from "../../utils/pagination";

type Params = { id: string };

export class RoleController {
  private service = new BookService();

  getAll = async (req: Request, res: Response) => {
    const pagination = getPagination(req);
    const { categoryId } = req.query as any;
    const result = await this.service.findAll({ ...pagination, categoryId });
    return successResponseWithMeta(res, result.data, result.meta, BOOK_MESSAGES.FETCHED);
  };

  getById = async (req: Request<Params>, res: Response) => {
    const book = await this.service.findById(req.params.id);
    return successResponse(res, book, BOOK_MESSAGES.FETCHED_ONE);
  };

  create = async (req: Request<Params>, res: Response) => {
    const book = await this.service.create(req.body);
    return successResponse(res, book, BOOK_MESSAGES.CREATED, 201);
  };

  update = async (req: Request<Params>, res: Response) => {
    const book = await this.service.update(req.params.id, req.body);
    return successResponse(res, book, BOOK_MESSAGES.UPDATED);
  };

  delete = async (req: Request<Params>, res: Response) => {
    const result = await this.service.delete(req.params.id);
    return successResponse(res, null, result.message);
  };
}
