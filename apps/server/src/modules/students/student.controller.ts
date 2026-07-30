import { Request, Response } from "express";
import { StudentService } from "./student.service";
import { successResponse, successResponseWithMeta } from "../../utils/response";
import { STUDENT_MESSAGES } from "../../constant/messages";
import { getPagination } from "../../utils/pagination";

type studentParams = {
  id: string;
};

export class studentController {
  private service = new StudentService();

  getAll = async (req: Request, res: Response) => {
    const pagination = getPagination(req);
    const result = await this.service.findAll(pagination);
    return successResponseWithMeta(res, result.data, result.meta, STUDENT_MESSAGES.FETCHED);
  };

  getById = async (req: Request<studentParams>, res: Response) => {
    const student = await this.service.findById(req.params.id);

    return successResponse(res, student, STUDENT_MESSAGES.FETCHED_ONE);
  };

  create = async (req: Request<studentParams>, res: Response) => {
    const student = await this.service.create(req.body);
    return successResponse(res, student, STUDENT_MESSAGES.CREATED, 201);
  };

  update = async (req: Request<studentParams>, res: Response) => {
    const student = await this.service.update(req.params.id, req.body);
    return successResponse(res, student, STUDENT_MESSAGES.UPDATED);
  };

  delete = async (req: Request<studentParams>, res: Response) => {
    const result = await this.service.delete(req.params.id);

    return successResponse(res, null, result.message);
  };
}
