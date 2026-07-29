import { Router } from "express";
import { AttendanceSessionController } from "./attendanceSession.controller";
import {
  createAttendanceSessionSchema,
  updateAttendanceSessionSchema,
} from "./attendanceSession.validation";
import { authenticate } from "../../middlewares/auth.middleware";
import { authorize } from "../../middlewares/authorize";
import { validate } from "../../middlewares/validate";

const router = Router();
const controller = new AttendanceSessionController();

router.get(
  "/",
  authenticate,
  authorize("attendance-session.read"),
  controller.getAll
);

router.get(
  "/:id",
  authenticate,
  authorize("attendance-session.read"),
  controller.getById
);

router.post(
  "/",
  authenticate,
  authorize("attendance-session.create"),
  validate(createAttendanceSessionSchema),
  controller.create
);

router.patch(
  "/:id",
  authenticate,
  authorize("attendance-session.update"),
  validate(updateAttendanceSessionSchema),
  controller.update
);

router.delete(
  "/:id",
  authenticate,
  authorize("attendance-session.delete"),
  controller.delete
);

export default router;