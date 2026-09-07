import { Request, Response, NextFunction } from "express";
import { logger } from "../lib/logger.js";

export function requestLogger(req: Request, res: Response, next: NextFunction) {
  logger.info({
    method: req.method,
    url: req.originalUrl,
    ip: req.ip,
  });

  next();
}
