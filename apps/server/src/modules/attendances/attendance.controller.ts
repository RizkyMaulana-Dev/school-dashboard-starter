import { Request, Response } from "express";
import { AttendanceService } from "./attendance.service";
import { successResponse, successResponseWithMeta } from "../../utils/response";
import { ATTENDANCE_MESSAGES } from "../../constant/messages";
import { getPagination } from "../../utils/pagination";

type Params = { id: string };

export class AttendanceController {
  private service = new AttendanceService();

  getAll = async (req: Request, res: Response) => {
    const pagination = getPagination(req);
    const { sessionId, studentId, status, classId, date } = req.query as any;
    const result = await this.service.findAll({
      ...pagination,
      sessionId,
      studentId,
      status,
      classId,
      date,
    });
    return successResponseWithMeta(res, result.data, result.meta, ATTENDANCE_MESSAGES.FETCHED);
  };

  getById = async (req: Request<Params>, res: Response) => {
    const data = await this.service.findById(req.params.id);
    return successResponse(res, data, ATTENDANCE_MESSAGES.FETCHED_ONE);
  };

  create = async (req: Request<Params>, res: Response) => {
    const data = await this.service.create(req.body);
    return successResponse(res, data, ATTENDANCE_MESSAGES.CREATED, 201);
  };

  update = async (req: Request<Params>, res: Response) => {
    const data = await this.service.update(req.params.id, req.body);
    return successResponse(res, data, ATTENDANCE_MESSAGES.UPDATED);
  };

  delete = async (req: Request<Params>, res: Response) => {
    const result = await this.service.delete(req.params.id);
    return successResponse(res, null, result.message);
  };
}
