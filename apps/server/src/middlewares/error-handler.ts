import { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import { Prisma } from "@prisma/client";

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
      message: "Data yang dimasukkan tidak lengkap atau tidak sesuai.",
      errors: error.flatten().fieldErrors,
    });
  }

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    // P2014: Relation Violation (Kasus nyambungin akun 2x ke relasi 1-to-1)
    if (error.code === "P2014") {
      return res.status(400).json({
        success: false,
        message: "Akun ini sudah terhubung dengan data lain. Satu akun hanya bisa digunakan satu kali.",
      });
    }

    // P2003: Foreign Key Constraint Violation
    if (error.code === "P2003") {
      return res.status(400).json({
        success: false,
        message: "Data referensi tidak ditemukan. Pastikan pilihanmu valid (misalnya, data kelas atau akun sudah benar).",
      });
    }

    // P2002: Unique Constraint Violation (Data duplikat, misal email/NISN sama)
    if (error.code === "P2002") {
      return res.status(409).json({
        success: false,
        message: "Data ini sudah digunakan oleh orang lain. Silakan gunakan data yang berbeda.",
      });
    }

    // P2025: Record Not Found
    if (error.code === "P2025") {
      return res.status(404).json({
        success: false,
        message: "Data yang ingin kamu ubah atau hapus tidak ditemukan.",
      });
    }
  }

  // Log error aslinya untuk developer melihat detailnya di console/server
  logger.error(error);

  // Pesan default untuk error yang tidak terduga
  return res.status(500).json({
    success: false,
    message: "Terjadi kesalahan pada sistem kami. Silakan coba beberapa saat lagi.",
  });
}