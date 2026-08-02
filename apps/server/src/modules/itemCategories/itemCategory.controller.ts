import { Request, Response } from "express";
import { ItemCategoryService } from "./itemCategory.service";
import { successResponse, successResponseWithMeta } from "../../utils/response";
import { ITEM_CATEGORY_MESSAGES } from "../../constant/messages";
import { getPagination } from "../../utils/pagination";

type Params = { id: string };

export class ItemCategoryController {
  private service = new ItemCategoryService();

  getAll = async (req: Request, res: Response) => {
    const pagination = getPagination(req);
    const result = await this.service.findAll(pagination);
    return successResponseWithMeta(res, result.data, result.meta, ITEM_CATEGORY_MESSAGES.FETCHED);
  };

  getById = async (req: Request<Params>, res: Response) => {
    const category = await this.service.findById(req.params.id);
    return successResponse(res, category, ITEM_CATEGORY_MESSAGES.FETCHED_ONE);
  };

  create = async (req: Request<Params>, res: Response) => {
    const category = await this.service.create(req.body);
    return successResponse(res, category, ITEM_CATEGORY_MESSAGES.CREATED, 201);
  };

  update = async (req: Request<Params>, res: Response) => {
    const category = await this.service.update(req.params.id, req.body);
    return successResponse(res, category, ITEM_CATEGORY_MESSAGES.UPDATED);
  };

  delete = async (req: Request<Params>, res: Response) => {
    const result = await this.service.delete(req.params.id);
    return successResponse(res, null, result.message);
  };
}