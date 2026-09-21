// apps/server/src/middlewares/errorHandler.ts
import { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import { Prisma } from "@prisma/client/edge";
import jwt from "jsonwebtoken";
import { ApiError } from "../errors/index.js";
import { logger } from "../lib/logger.js";

export function globalErrorHandler(
  error: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
) {
  // 1. Tangani error JWT (Token expired / token malformed) -> 401
  if (error instanceof jwt.TokenExpiredError) {
    return res.status(401).json({
      success: false,
      message: "Sesi login Anda telah berakhir. Silakan login kembali.",
    });
  }

  if (error instanceof jwt.JsonWebTokenError) {
    return res.status(401).json({
      success: false,
      message: "Token autentikasi tidak valid.",
    });
  }

  // 2. Tangani ApiError custom (Unauthorized, Forbidden, NotFound, dll)
  if (error instanceof ApiError) {
    return res.status(error.statusCode).json({
      success: false,
      message: error.message,
    });
  }

  // 3. Tangani Zod validation
  if (error instanceof ZodError) {
    return res.status(400).json({
      success: false,
      message: "Data yang dimasukkan tidak lengkap atau tidak sesuai.",
      errors: error.flatten().fieldErrors,
    });
  }

  // 4. Tangani Prisma Known Errors
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === "P2002") {
      return res.status(409).json({
        success: false,
        message: "Data ini sudah digunakan. Silakan gunakan data yang berbeda.",
      });
    }
    if (error.code === "P2025") {
      return res.status(404).json({
        success: false,
        message: "Data yang ingin diakses tidak ditemukan.",
      });
    }
  }

  // Log error aslinya
  try {
    logger.error(error);
  } catch {
    console.error(error);
  }

  // Fallback 500
  return res.status(500).json({
    success: false,
    message: "Terjadi kesalahan pada sistem kami. Silakan coba beberapa saat lagi.",
  });
}
