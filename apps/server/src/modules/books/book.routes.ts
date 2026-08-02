import { Router } from "express";
import { RoleController } from "./book.controller";
import { createBookSchema, updateBookSchema } from "./book.validation";
import { authenticate } from "../../middlewares/auth.middleware";
import { authorize } from "../../middlewares/authorize";
import { validate } from "../../middlewares/validate";

const router = Router();
const controller = new RoleController();

router.get("/", authenticate, authorize("book.read"), controller.getAll);
router.get("/:id", authenticate, authorize("book.read"), controller.getById);
router.post(
  "/",
  authenticate,
  authorize("book.create"),
  validate(createBookSchema),
  controller.create,
);
router.patch(
  "/:id",
  authenticate,
  authorize("book.update"),
  validate(updateBookSchema),
  controller.update,
);
router.delete("/:id", authenticate, authorize("book.delete"), controller.delete);

export default router;
