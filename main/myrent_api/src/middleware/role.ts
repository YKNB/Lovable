import type { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/appError";

type Role = "TENANT" | "OWNER" | "ADMIN";

export function requireRole(...allowed: Role[]) {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new AppError(401, "Unauthorized", { code: "AUTH_UNAUTHORIZED" }));
    }

    if (!allowed.includes(req.user.role)) {
      return next(new AppError(403, "Forbidden", { code: "AUTH_FORBIDDEN" }));
    }

    return next();
  };
}
