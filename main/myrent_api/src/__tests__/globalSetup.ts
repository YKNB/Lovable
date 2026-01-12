import { execSync } from "child_process";
import path from "path";
import dotenv from "dotenv";

function sh(cmd: string) {
  execSync(cmd, { stdio: "inherit" });
}

export default async function globalSetup() {
  // Charge .env.test
  dotenv.config({ path: path.resolve(process.cwd(), ".env.test") });

  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is missing in .env.test");
  }

  console.log("[TEST DB]", process.env.DATABASE_URL);

  // 1) Reset DB (drop/recreate public schema) via stdin
  // NOTE: pas de --schema, ton CLI ne le supporte pas
  execSync("npx prisma db execute --stdin", {
    stdio: ["pipe", "inherit", "inherit"],
    input: `
      DROP SCHEMA IF EXISTS public CASCADE;
      CREATE SCHEMA public;
      GRANT ALL ON SCHEMA public TO public;
    `,
  } as any);

  // 2) Recreate tables from schema.prisma
  sh("npx prisma db push");
}
