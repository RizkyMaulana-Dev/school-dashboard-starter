// ./apps/server/src/app.ts
import express from "express";
import cors from "cors";
import { requestLogger } from "./middlewares/requestLogger.js";
import routes from "./routes/index.js";
import { globalErrorHandler } from "./middlewares/errorHandler.js";

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  "https://rizkymaulana-dev.github.io",
];

const app = express();

// 1. CORS Middleware (Otomatis menangani request OPTIONS / Preflight)
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// 2. Parser & Logger Middleware
app.use(express.json());
app.use(requestLogger);

// 3. Application Routes
app.use("/api/v1", routes);

// 4. Catch-all 404 Handler (Aman dari path-to-regexp v8)
app.use((_req, res) => {
  res.status(404).json({
    success: false,
    message: "Endpoint tidak ditemukan.",
  });
});

// 5. Global Error Handler (Wajib paling bawah)
app.use(globalErrorHandler);

export default app;