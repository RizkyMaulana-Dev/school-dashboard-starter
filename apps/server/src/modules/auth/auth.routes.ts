// ./apps/server/src/modules/auth/auth.routes.ts
import { Router } from "express";
import { AuthController } from "./auth.controller.js";
import { validate } from "../../middlewares/validate.js";
import { loginSchema } from "./auth.validation.js";
import { authenticate } from "../../middlewares/auth.middleware.js";

const router = Router();
const authController = new AuthController();

router.post("/login", validate(loginSchema), authController.login);

// Route untuk Google Sign-In
router.post("/google", authController.googleLogin);

router.get("/me", authenticate, authController.me);

export default router;