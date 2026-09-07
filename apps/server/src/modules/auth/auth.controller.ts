// ./apps/server/src/modules/auth/auth.controller.ts
import { Request, Response } from "express";
import { OAuth2Client } from "google-auth-library";
import { AuthService } from "./auth.service.js";
import { success } from "../../utils/response/index.js";
import { AuthRepository } from "./auth.repository.js";
import { StudentRepository } from "../students/student.repository.js";

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export class AuthController {
  private authRepository = new AuthRepository();
  private studentRepository = new StudentRepository();

  private service = new AuthService(this.authRepository, this.studentRepository);

  login = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const result = await this.service.login(email, password);

    return success(res, result, "Login berhasil");
  };

  googleLogin = async (req: Request, res: Response) => {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({
        success: false,
        message: "Token Google wajib dikirim",
      });
    }

    // 1. Verifikasi ID token ke Google
    const ticket = await googleClient.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();

    if (!payload || !payload.email) {
      return res.status(400).json({
        success: false,
        message: "Token Google tidak valid",
      });
    }

    // 2. Cari/daftarkan user lewat AuthService
    // (Jika di AuthService kamu sudah ada method khusus untuk google/email, panggil di sini)
    // Contoh jika menggunakan method penanganan Google login di service:
    // const result = await this.service.googleLogin(payload);
    
    // Atau jika hanya mencari/login berdasarkan email payload:
    const result = await this.service.googleLogin({
      email: payload.email,
      name: payload.name,
      picture: payload.picture,
      googleId: payload.sub,
    });

    return success(res, result, "Login Google berhasil");
  };

  me = async (req: Request, res: Response) => {
    const result = await this.service.me(req.user!.userId);

    return success(res, result, "Profil berhasil diambil");
  };
}