import app from "./app.js";
import { env } from "./config/env.js";
import { logger } from "./lib/logger";

const PORT = env.PORT || 3000;

// Jalankan app.listen HANYA saat lokal / bukan di Vercel
if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, () => {
    logger.info(`🚀 API running at http://localhost:${PORT}`);
  });
}

// WAJIB: Export app sebagai default untuk Vercel Serverless Function
export default app;