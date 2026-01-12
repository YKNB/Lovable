import type { Request, Response } from "express";
import * as UsersService from "../services/users.service";
import { AppError } from "../utils/appError";

// Ce que tu autorises en update (tu peux ajuster)
type UpdateUserBody = {
  first_name?: string;
  last_name?: string;
  password?: string;
};

export async function updateUser(req: Request, res: Response) {
  const requester = req.user; // peut être undefined si requireAuth pas appelé
  if (!requester) throw new AppError(401, "Unauthorized", { code: "AUTH_UNAUTHORIZED" });

  const { id } = req.params;
  const body = req.body as UpdateUserBody;

  // Sécurité: self ou ADMIN
  const isAdmin = requester.role === "ADMIN";
  const isSelf = requester.id === id;

  if (!isAdmin && !isSelf) {
    throw new AppError(403, "Forbidden", { code: "AUTH_FORBIDDEN" });
  }

  const updated = await UsersService.updateUser(id, body);

  return res.json(updated);
}

export async function deleteUser(req: Request, res: Response) {
  const requester = req.user;
  if (!requester) throw new AppError(401, "Unauthorized", { code: "AUTH_UNAUTHORIZED" });

  const { id } = req.params;

  const isAdmin = requester.role === "ADMIN";
  const isSelf = requester.id === id;

  if (!isAdmin && !isSelf) {
    throw new AppError(403, "Forbidden", { code: "AUTH_FORBIDDEN" });
  }

  await UsersService.deleteUser(id);
  return res.status(204).end();
}
