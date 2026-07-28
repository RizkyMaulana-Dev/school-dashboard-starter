import { Router } from "express";
import { prisma } from "../lib/prisma";
import authRoutes from "../modules/auth/auth.routes";
import { authenticate } from "../middlewares/auth.middleware";
import { authorize } from "../middlewares/authorize";
import userRoutes from "../modules/users/user.routes";
import classRoutes from "../modules/schoolClass/class.routes"
import studentRoutes from "../modules/students/student.routes"
import teacherRuotes from "../modules/teacher/teacher.routes"
import attendanceRoutes from "../modules/attendances/attendance.routes";
const router = Router();

router.get("/permission-test", authenticate, authorize("dashboard.read"), (_req, res) => {
  res.json({
    success: true,
    message: "Permission berhasil.",
  });
});

router.use("/users", userRoutes);

router.get("/test-auth", authenticate, (req, res) => {
  res.json({
    success: true,
    user: req.user,
  });
});

router.use("/auth", authRoutes);

router.get("/", async (_req, res) => {
  const users = await prisma.user.findMany();

  res.json({
    success: true,
    users,
  });
});

router.get("/health", async (_req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;

    res.json({
      success: true,
      status: "ok",
      database: "connected",
      version: "1.0.0",
      timestamp: new Date().toISOString(),
    });
  } catch {
    res.status(500).json({
      success: false,
      status: "error",
      database: "disconnected",
      version: "1.0.0",
      timestamp: new Date().toISOString(),
    });
  }
});

router.use("/class", classRoutes);
router.use("/attendance", attendanceRoutes);
router.use("/student", studentRoutes)
router.use("/teacher", teacherRuotes)

export default router;
