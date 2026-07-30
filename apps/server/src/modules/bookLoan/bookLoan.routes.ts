import { Router } from "express";
import { BookLoanController } from "./bookLoan.controller";
import { createBookLoanSchema, updateBookLoanSchema } from "./bookLoan.validation";
import { authenticate } from "../../middlewares/auth.middleware";
import { authorize } from "../../middlewares/authorize";
import { validate } from "../../middlewares/validate";

const router = Router();
const controller = new BookLoanController();

router.get("/", authenticate, authorize("book-loan.read"), controller.getAll);

router.get("/:id", authenticate, authorize("book-loan.read"), controller.getById);

router.post(
  "/",
  authenticate,
  authorize("book-loan.create"),
  validate(createBookLoanSchema),
  controller.create,
);

router.patch(
  "/:id",
  authenticate,
  authorize("book-loan.update"),
  validate(updateBookLoanSchema),
  controller.update,
);

router.delete("/:id", authenticate, authorize("book-loan.delete"), controller.delete);

export default router;
