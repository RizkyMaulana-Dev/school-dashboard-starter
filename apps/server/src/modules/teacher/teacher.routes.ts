import { Router } from "express";

import { TeacherController } from "./teacher.controller";
import { createTeacherSchema, updateTeacherSchema } from "./teacher.validation";

import { authenticate } from "../../middlewares/auth.middleware";
import { authorize } from "../../middlewares/authorize";
import { validate } from "../../middlewares/validate";

const router = Router();

const controller = new TeacherController();

router.get("/", authenticate, authorize("teacher.read"), controller.getAll);

router.get("/:id", authenticate, authorize("teacher.read"), controller.getById);

router.post(
  "/",
  authenticate,
  authorize("teacher.create"),
  validate(createTeacherSchema),
  controller.create,
);

router.patch(
  "/:id",
  authenticate,
  authorize("teacher.update"),
  validate(updateTeacherSchema),
  controller.update,
);

router.delete("/:id", authenticate, authorize("teacher.delete"), controller.delete);

export default router;
