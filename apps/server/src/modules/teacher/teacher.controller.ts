import { Request, Response } from "express";
import { TeacherService } from "./teacher.service";
import { successResponse, successResponseWithMeta } from "../../utils/response";
import { getPagination } from "../../utils/pagination";
import { TEACHER_MESSAGE } from "../../constant/messages";

type TeacherParams = {
  id: string;
};

export class TeacherController {
  private service = new TeacherService();

  getAll = async (req: Request, res: Response) => {
    const pagination = getPagination(req);
    const result = await this.service.findAll(pagination);

    return successResponseWithMeta(res, result.data, result.meta, TEACHER_MESSAGE.FETCHED);
  };

  getById = async (req: Request<TeacherParams>, res: Response) => {
    const teacher = await this.service.findById(req.params.id);

    return successResponse(res, teacher, TEACHER_MESSAGE.FETCHED_ONE);
  };

  create = async (req: Request<TeacherParams>, res: Response) => {
    const teacher = await this.service.create(req.body);

    return successResponse(res, teacher, TEACHER_MESSAGE.CREATED, 201);
  };

  update = async (req: Request<TeacherParams>, res: Response) => {
    const teacher = await this.service.update(req.params.id, req.body);

    return successResponse(res, teacher, TEACHER_MESSAGE.UPDATED);
  };

  delete = async (req: Request<TeacherParams>, res: Response) => {
    const result = await this.service.delete(req.params.id);

    return successResponse(res, null, result.message);
  };
}
