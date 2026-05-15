import type { Request, Response, NextFunction } from "express";
import { logger } from "../services/logger.service.js";

export function requestLogger(req: Request, res: Response, next: NextFunction) {
  const start = Date.now();

  res.on("finish", () => {
    const duration = Date.now() - start;
    const logObj = {
      req: req,
      res: res,
      responseTime: duration,
    };

    if (res.statusCode >= 400) {
      logger.warn(logObj);
    } else {
      logger.info(logObj);
    }
  });

  next();
}