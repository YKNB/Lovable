import type { NextFunction, Request, Response } from "express";

type AppErrorShape = {
  statusCode?: number;
  message?: string;
  details?: unknown;
  code?: string;
};

export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction) {
  let statusCode = 500;
  let message = "Internal server error";
  let details: unknown = undefined;
  let code: string | undefined = undefined;

  if (typeof err === "object" && err !== null) {
    const e = err as AppErrorShape;
    if (typeof e.statusCode === "number") statusCode = e.statusCode;
    if (typeof e.message === "string") message = e.message;
    if (e.details !== undefined) details = e.details;
    if (typeof e.code === "string") code = e.code;
  }

  // ✅ en test: ne pas polluer pour les 4xx (attendus)
  if (!(process.env.NODE_ENV === "test" && statusCode < 500)) {
    console.error("[ERROR]", err);
  }

  return res.status(statusCode).json({
    error: message,
    ...(code ? { code } : {}),
    ...(details !== undefined ? { details } : {}),
  });
}
