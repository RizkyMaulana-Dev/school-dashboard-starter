import { Router } from "express";
import { RoleController } from "./role.controller";
import { authenticate } from "../../middlewares/auth.middleware";
import { authorize } from "../../middlewares/authorize";

const router = Router();
const controller = new RoleController();

router.get("/", authenticate, authorize("role.read"), controller.getAll);
router.get("/:id", authenticate, authorize("role.read"), controller.getById);

export default router;