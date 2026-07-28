import { Router } from "express";
import { AttendanceController } from "./attendance.controller";
import {
  createAttendanceSchema,
  updateAttendanceSchema,
} from "./attendance.validation";
import { authenticate } from "../../middlewares/auth.middleware";
import { authorize } from "../../middlewares/authorize";
import { validate } from "../../middlewares/validate";

const router = Router();
const controller = new AttendanceController();

router.get("/", authenticate, authorize("attendance.read"), controller.getAll);
router.get("/:id", authenticate, authorize("attendance.read"), controller.getById);
router.post(
  "/",
  authenticate,
  authorize("attendance.create"),
  validate(createAttendanceSchema),
  controller.create
);
router.patch(
  "/:id",
  authenticate,
  authorize("attendance.update"),
  validate(updateAttendanceSchema),
  controller.update
);
router.delete("/:id", authenticate, authorize("attendance.delete"), controller.delete);

export default router;