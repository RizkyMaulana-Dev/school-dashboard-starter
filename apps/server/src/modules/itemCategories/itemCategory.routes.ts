import { Router } from "express";
import { ItemCategoryController } from "./itemCategory.controller";
import { createItemCategorySchema, updateItemCategorySchema } from "./itemCategory.validation";
import { authenticate } from "../../middlewares/auth.middleware";
import { authorize } from "../../middlewares/authorize";
import { validate } from "../../middlewares/validate";

const router = Router();
const controller = new ItemCategoryController();

router.get("/", authenticate, authorize("item-category.read"), controller.getAll);
router.get("/:id", authenticate, authorize("item-category.read"), controller.getById);
router.post(
  "/",
  authenticate,
  authorize("item-category.create"),
  validate(createItemCategorySchema),
  controller.create
);
router.patch(
  "/:id",
  authenticate,
  authorize("item-category.update"),
  validate(updateItemCategorySchema),
  controller.update
);
router.delete("/:id", authenticate, authorize("item-category.delete"), controller.delete);

export default router;