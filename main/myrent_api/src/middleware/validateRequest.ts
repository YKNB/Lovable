// src/middleware/validateRequest.ts
import type { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";
import { AppError } from "../utils/appError";

export function validateRequest(req: Request, _res: Response, next: NextFunction) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const msg = errors.array().map((e) => e.msg).join(", ");
    throw new AppError(400, msg);
  }
  next();
}
