import { Request, Response } from "express";
import { ItemService } from "./item.service";
import { successResponse, successResponseWithMeta } from "../../utils/response";
import { ITEM_MESSAGES } from "../../constant/messages";
import { getPagination } from "../../utils/pagination";

type Params = { id: string };

export class ItemController {
  private service = new ItemService();

  getAll = async (req: Request, res: Response) => {
    const pagination = getPagination(req);
    const { categoryId, condition } = req.query as any;
    const result = await this.service.findAll({ ...pagination, categoryId, condition });
    return successResponseWithMeta(res, result.data, result.meta, ITEM_MESSAGES.FETCHED);
  };

  getById = async (req: Request<Params>, res: Response) => {
    const item = await this.service.findById(req.params.id);
    return successResponse(res, item, ITEM_MESSAGES.FETCHED_ONE);
  };

  create = async (req: Request<Params>, res: Response) => {
    const item = await this.service.create(req.body);
    return successResponse(res, item, ITEM_MESSAGES.CREATED, 201);
  };

  update = async (req: Request<Params>, res: Response) => {
    const item = await this.service.update(req.params.id, req.body);
    return successResponse(res, item, ITEM_MESSAGES.UPDATED);
  };

  delete = async (req: Request<Params>, res: Response) => {
    const result = await this.service.delete(req.params.id);
    return successResponse(res, null, result.message);
  };
}
