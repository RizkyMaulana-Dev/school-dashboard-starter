import { Request, Response } from "express";
import { RoleService } from "./role.service";
import { successResponse, successResponseWithMeta } from "../../utils/response";
import { ROLE_MESSAGES } from "../../constant/messages";
import { getPagination } from "../../utils/pagination";

type Params = { id: string };

export class RoleController {
  private service = new RoleService();

  getAll = async (req: Request, res: Response) => {
    const pagination = getPagination(req);
    const result = await this.service.findAll(pagination);
    return successResponseWithMeta(res, result.data, result.meta, ROLE_MESSAGES.FETCHED);
  };

  getById = async (req: Request<Params>, res: Response) => {
    const role = await this.service.findById(req.params.id);
    return successResponse(res, role, ROLE_MESSAGES.FETCHED_ONE);
  };
}