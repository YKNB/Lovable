import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { prisma } from "../prisma";
import { AppError } from "../utils/appError";

type PublicRole = "TENANT" | "OWNER";

function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new AppError(500, "JWT_SECRET is missing");
  return secret;
}

export async function register(data: {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  role?: PublicRole;
}) {
  const safeRole: PublicRole = data.role === "OWNER" ? "OWNER" : "TENANT";

  const existing = await prisma.users.findUnique({ where: { email: data.email } });
  if (existing) throw new AppError(409, "Email already used");

  const password_hash = await bcrypt.hash(data.password, 10);

  return prisma.users.create({
    data: {
      first_name: data.first_name,
      last_name: data.last_name,
      email: data.email,
      password_hash,
      role: safeRole,
    },
    select: {
      id: true,
      first_name: true,
      last_name: true,
      email: true,
      role: true,
      created_at: true,
    },
  });
}

export async function login(credentials: { email: string; password: string }) {
  const user = await prisma.users.findUnique({ where: { email: credentials.email } });
  if (!user) throw new AppError(401, "Invalid credentials");

  const ok = await bcrypt.compare(credentials.password, user.password_hash);
  if (!ok) throw new AppError(401, "Invalid credentials");

  const token = jwt.sign(
    { sub: user.id, role: user.role, email: user.email },
    getJwtSecret(),
    { expiresIn: "2h" }
  );

  return {
    token,
    user: {
      id: user.id,
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      role: user.role,
    },
  };
}
