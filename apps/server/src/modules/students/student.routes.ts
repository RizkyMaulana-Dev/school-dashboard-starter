import { Router } from "express";

import { studentController } from "./student.controller";
import { createStudentSchema, updateStudentSchema } from "./student.validation";

import { authenticate } from "../../middlewares/auth.middleware";
import { authorize } from "../../middlewares/authorize";
import { validate } from "../../middlewares/validate";

const router = Router();

const controller = new studentController();

router.get("/", authenticate, authorize("student.read"), controller.getAll);

router.get("/:id", authenticate, authorize("class.read"), controller.getById);

router.post(
  "/",
  authenticate,
  authorize("student.create"),
  validate(createStudentSchema),
  controller.create,
);

router.patch(
  "/:id",
  authenticate,
  authorize("class.update"),
  validate(updateStudentSchema),
  controller.update,
);

router.delete("/:id", authenticate, authorize("class.delete"), controller.delete);

export default router;
