import { Router } from "express";
import { ItemLoanController } from "./itemLoan.controller";
import { createItemLoanSchema, updateItemLoanSchema } from "./itemLoan.validation";
import { authenticate } from "../../middlewares/auth.middleware";
import { authorize } from "../../middlewares/authorize";
import { validate } from "../../middlewares/validate";

const router = Router();
const controller = new ItemLoanController();

router.get("/", authenticate, authorize("item-loan.read"), controller.getAll);
router.get("/:id", authenticate, authorize("item-loan.read"), controller.getById);
router.post(
  "/",
  authenticate,
  authorize("item-loan.create"),
  validate(createItemLoanSchema),
  controller.create
);
router.patch(
  "/:id",
  authenticate,
  authorize("item-loan.update"),
  validate(updateItemLoanSchema),
  controller.update
);
router.delete("/:id", authenticate, authorize("item-loan.delete"), controller.delete);

export default router;