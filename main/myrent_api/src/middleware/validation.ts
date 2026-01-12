import { validationResult } from "express-validator";
import type { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/appError";

export function handleValidationErrors(req: Request, _res: Response, next: NextFunction) {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return next(
      new AppError(400, "Validation error", {
        code: "VALIDATION_ERROR",
        details: errors.array().map((e: any) => ({
          field: e.path ?? e.param ?? "unknown",
          message: e.msg,
        })),
      })
    );
  }

  return next();
}
