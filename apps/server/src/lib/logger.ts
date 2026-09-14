import pino from "pino";
import { env } from "../config/env.js";

// Nonaktifkan transport pino-pretty saat di production/Cloudflare Workers untuk menghindari error thread/worker
const isProduction = env.NODE_ENV === "production";

export const logger = pino({
  level: isProduction ? "info" : "debug",
  // Jangan gunakan transport pino-pretty di Cloudflare Workers
  ...(isProduction
    ? {}
    : {
        transport: {
          target: "pino-pretty",
          options: {
            colorize: true,
            translateTime: "HH:MM:ss",
          },
        },
      }),
});