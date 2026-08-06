import { Router } from "express";
import { BookCategoryController } from "./bookCategory.controller";
import { createBookCategorySchema, updateBookCategorySchema } from "./bookCategory.validation";
import { authenticate } from "../../middlewares/auth.middleware";
import { authorize } from "../../middlewares/authorize";
import { validate } from "../../middlewares/validate";

const router = Router();
const controller = new BookCategoryController();

router.get("/", authenticate, authorize("book-category.read"), controller.getAll);
router.get("/:id", authenticate, authorize("book-category.read"), controller.getById);
router.post(
  "/",
  authenticate,
  authorize("book-category.create"),
  validate(createBookCategorySchema),
  controller.create
);
router.patch(
  "/:id",
  authenticate,
  authorize("book-category.update"),
  validate(updateBookCategorySchema),
  controller.update
);
router.delete("/:id", authenticate, authorize("book-category.delete"), controller.delete);

export default router;