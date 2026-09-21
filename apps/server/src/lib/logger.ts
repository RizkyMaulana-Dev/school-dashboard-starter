// apps/server/src/lib/logger.ts
import pino from "pino";

// Pastikan pino-pretty tidak pernah dijalankan di Cloudflare Workers
const isProduction = process.env.NODE_ENV === "production" || typeof (globalThis as any).WebSocketPair !== "undefined";

export const logger = pino({
  level: isProduction ? "info" : "debug",
  ...(isProduction
    ? {}
    : {
      transport: {
        target: "pino-pretty",
        options: { colorize: true, translateTime: "HH:MM:ss" },
      },
    }),
});
