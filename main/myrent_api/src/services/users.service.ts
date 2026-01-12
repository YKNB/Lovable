import bcrypt from "bcrypt";
import { prisma } from "../prisma";
import { AppError } from "../utils/appError";

type UpdateUserBody = {
  first_name?: string;
  last_name?: string;
  password?: string;
};

export async function updateUser(id: string, data: UpdateUserBody) {
  const existing = await prisma.users.findUnique({ where: { id } });
  if (!existing) {
    throw new AppError(404, "User not found", { code: "USER_NOT_FOUND" });
  }

  const updateData: Record<string, any> = {};

  if (data.first_name !== undefined) updateData.first_name = data.first_name;
  if (data.last_name !== undefined) updateData.last_name = data.last_name;

  if (data.password !== undefined) {
    const password_hash = await bcrypt.hash(data.password, 10);
    updateData.password_hash = password_hash;
  }

  if (Object.keys(updateData).length === 0) {
    throw new AppError(400, "Nothing to update", { code: "USER_NOTHING_TO_UPDATE" });
  }

  return prisma.users.update({
    where: { id },
    data: updateData,
    select: {
      id: true,
      first_name: true,
      last_name: true,
      email: true,
      role: true,
      created_at: true,
      updated_at: true,
    },
  });
}

export async function deleteUser(id: string) {
  const existing = await prisma.users.findUnique({ where: { id } });
  if (!existing) {
    throw new AppError(404, "User not found", { code: "USER_NOT_FOUND" });
  }

  await prisma.users.delete({ where: { id } });
}
