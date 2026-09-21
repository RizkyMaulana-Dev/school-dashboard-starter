// apps/server/src/app.ts
import express from "express";
import cors from "cors";
import { requestLogger } from "./middlewares/requestLogger.js";
import routes from "./routes/index.js";
import { globalErrorHandler } from "./middlewares/errorHandler.js";
import { asyncLocalStorage, createPrismaClient } from "./lib/prisma.js";

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  "https://rizkymaulana-dev.github.io",
];

const app = express();

app.use(
  cors({
    origin: (origin, callback) => {
      // Izinkan jika tanpa origin (curl/mobile) atau jika origin terdaftar
      if (!origin || allowedOrigins.includes(origin) || origin.endsWith(".github.io")) {
        callback(null, true);
      } else {
        // Jangan melempar Error("Not allowed by CORS") karena akan menghasilkan 500
        callback(null, false);
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Accept", "X-Requested-With"],
  })
);

app.use(express.json());
app.use(requestLogger);

// Prisma per-request context untuk Cloudflare Workers I/O isolation
app.use((_req, _res, next) => {
  const client = createPrismaClient();
  asyncLocalStorage.run(client, () => {
    next();
  });
});

app.use("/api/v1", routes);

app.use((_req, res) => {
  res.status(404).json({
    success: false,
    message: "Endpoint tidak ditemukan.",
  });
});

app.use(globalErrorHandler);

export default app;
