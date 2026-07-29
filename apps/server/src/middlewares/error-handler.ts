import { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import { Prisma } from "@prisma/client"; // 1. Import Prisma Client

import { ApiError } from "../errors/index.js";
import { logger } from "../lib/logger.js";

export function globalErrorHandler(
  error: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
) {
  if (error instanceof ApiError) {
    return res.status(error.statusCode).json({
      success: false,
      message: error.message,
    });
  }

  if (error instanceof ZodError) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: error.flatten().fieldErrors,
    });
  }

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    // P2003: Foreign Key Constraint Violation (ID relasi tidak ditemukan)
    if (error.code === "P2003") {
      return res.status(400).json({
        success: false,
        message: "Resource ID tidak ditemukan di database (Foreign key constraint failed).",
      });
    }

    // P2002: Unique Constraint Violation (Data duplikat)
    if (error.code === "P2002") {
      return res.status(409).json({
        success: false,
        message: "Data sudah ada di database (Unique constraint failed).",
      });
    }

    // P2025: Record Not Found (Misal saat update/delete ID yang tidak ada)
    if (error.code === "P2025") {
      return res.status(404).json({
        success: false,
        message: "Data yang dicari tidak ditemukan.",
      });
    }
  }

  logger.error(error);

  return res.status(500).json({
    success: false,
    message: "Internal Server Error",
  });
}
