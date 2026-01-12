import { prisma } from "../prisma";

afterEach(async () => {
  // garde la DB propre côté connexions
  await prisma.$disconnect();
});

afterAll(async () => {
  await prisma.$disconnect();
});
