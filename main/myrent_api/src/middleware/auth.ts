import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { AppError } from "../utils/appError";

type JwtPayload = {
  sub: string;
  role: "TENANT" | "OWNER" | "ADMIN";
  email: string;
  iat?: number;
  exp?: number;
};

const JWT_SECRET: string = process.env.JWT_SECRET ?? "";
if (!JWT_SECRET) throw new Error("JWT_SECRET is missing in .env");

declare global {
  namespace Express {
    interface Request {
      user?: { id: string; role: JwtPayload["role"]; email: string };
    }
  }
}

function isJwtPayload(x: unknown): x is JwtPayload {
  if (!x || typeof x !== "object") return false;

  const obj = x as Record<string, unknown>;
  return (
    typeof obj.sub === "string" &&
    typeof obj.email === "string" &&
    (obj.role === "TENANT" || obj.role === "OWNER" || obj.role === "ADMIN")
  );
}

export function requireAuth(req: Request, _res: Response, next: NextFunction) {
  const auth = req.headers.authorization;

  // Token manquant / header invalide
  if (!auth || !auth.startsWith("Bearer ")) {
    return next(new AppError(401, "Missing token", { code: "AUTH_MISSING_TOKEN" }));
  }

  const token = auth.slice("Bearer ".length).trim();
  if (!token) {
    return next(new AppError(401, "Missing token", { code: "AUTH_MISSING_TOKEN" }));
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as unknown;

    // Payload invalide
    if (!isJwtPayload(decoded)) {
      return next(new AppError(401, "Invalid token", { code: "AUTH_INVALID_TOKEN_PAYLOAD" }));
    }

    req.user = {
      id: decoded.sub,
      role: decoded.role,
      email: decoded.email,
    };

    return next();
  } catch (err: any) {
    // Token expiré
    if (err?.name === "TokenExpiredError") {
      return next(new AppError(401, "Token expired", { code: "AUTH_TOKEN_EXPIRED" }));
    }

    // Token invalide
    if (err?.name === "JsonWebTokenError") {
      return next(new AppError(401, "Invalid token", { code: "AUTH_INVALID_TOKEN" }));
    }

    // Autre cas
    return next(new AppError(401, "Unauthorized", { code: "AUTH_UNAUTHORIZED" }));
  }
}

