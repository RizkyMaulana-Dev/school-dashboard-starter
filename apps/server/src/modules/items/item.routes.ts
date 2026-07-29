import { Router } from "express";
import { ItemController } from "./item.controller";
import { createItemSchema, updateItemSchema } from "./item.validation";
import { authenticate } from "../../middlewares/auth.middleware";
import { authorize } from "../../middlewares/authorize";
import { validate } from "../../middlewares/validate";

const router = Router();
const controller = new ItemController();

router.get("/", authenticate, authorize("item.read"), controller.getAll);
router.get("/:id", authenticate, authorize("item.read"), controller.getById);
router.post(
  "/",
  authenticate,
  authorize("item.create"),
  validate(createItemSchema),
  controller.create
);
router.patch(
  "/:id",
  authenticate,
  authorize("item.update"),
  validate(updateItemSchema),
  controller.update
);
router.delete("/:id", authenticate, authorize("item.delete"), controller.delete);

export default router;