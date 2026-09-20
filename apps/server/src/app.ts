// ./apps/server/src/app.ts
import express from "express";
import cors from "cors";
import { requestLogger } from "./middlewares/requestLogger";
import routes from "./routes";
import { globalErrorHandler } from "./middlewares/errorHandler.js";

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  "https://rizkymaulana-dev.github.io"
];
const app = express();

app.use(
  cors({
    origin: (origin, callback) => {
      // Izinkan request tanpa origin (seperti Postman/mobile apps) atau yang terdaftar
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
);app.use(express.json());

app.use("/api/v1", routes);
app.use(globalErrorHandler);
app.use(requestLogger);
export default app;
