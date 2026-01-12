import { prisma } from "../prisma";

export default async function globalTeardown() {
  await prisma.$disconnect();
}
