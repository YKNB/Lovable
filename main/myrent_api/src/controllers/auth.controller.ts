import type { Request, Response } from "express";
import * as AuthService from "../services/auth.service";
import { asyncHandler } from "../utils/asyncHandler";
import { AppError } from "../utils/appError";

type PublicRole = "TENANT" | "OWNER";

export const register = asyncHandler(async (req: Request, res: Response) => {
  const { first_name, last_name, email, password, role } = req.body as {
    first_name: string;
    last_name: string;
    email: string;
    password: string;
    role?: PublicRole;
  };

  if (!first_name || !last_name || !email || !password) {
    throw new AppError(400, "Missing required fields");
  }

  const user = await AuthService.register({
    first_name,
    last_name,
    email,
    password,
    role,
  });

  res.status(201).json(user);
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body as { email: string; password: string };

  if (!email || !password) {
    throw new AppError(400, "Missing email/password");
  }

  const result = await AuthService.login({ email, password });
  res.json(result);
});
