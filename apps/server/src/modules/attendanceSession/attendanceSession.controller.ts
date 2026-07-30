import { Request, Response } from "express";
import { AttendanceSessionService } from "./attendanceSession.service";
import { successResponse, successResponseWithMeta } from "../../utils/response";
import { ATTENDANCE_SESSION_MESSAGES } from "../../constant/messages";
import { getPagination } from "../../utils/pagination";

type Params = { id: string };

export class AttendanceSessionController {
  private service = new AttendanceSessionService();

  getAll = async (req: Request, res: Response) => {
    const pagination = getPagination(req);
    const { classId, teacherId, date } = req.query as any;
    const result = await this.service.findAll({
      ...pagination,
      classId,
      teacherId,
      date,
    });
    return successResponseWithMeta(
      res,
      result.data,
      result.meta,
      ATTENDANCE_SESSION_MESSAGES.FETCHED,
    );
  };

  getById = async (req: Request<Params>, res: Response) => {
    const session = await this.service.findById(req.params.id);
    return successResponse(res, session, ATTENDANCE_SESSION_MESSAGES.FETCHED_ONE);
  };

  create = async (req: Request<Params>, res: Response) => {
    const session = await this.service.create(req.body);
    return successResponse(res, session, ATTENDANCE_SESSION_MESSAGES.CREATED, 201);
  };

  update = async (req: Request<Params>, res: Response) => {
    const session = await this.service.update(req.params.id, req.body);
    return successResponse(res, session, ATTENDANCE_SESSION_MESSAGES.UPDATED);
  };

  delete = async (req: Request<Params>, res: Response) => {
    const result = await this.service.delete(req.params.id);
    return successResponse(res, null, result.message);
  };
}
