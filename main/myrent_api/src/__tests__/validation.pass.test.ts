// src/__tests__/validation.pass.test.ts
import request from "supertest";
import { app } from "../app";

describe("Validation middleware - pass path", () => {
  it("POST /auth/register passes validation (not 400)", async () => {
    const email = `pass${Date.now()}@test.com`;

    const res = await request(app).post("/auth/register").send({
      first_name: "John",
      last_name: "Doe",
      email,
      password: "Password123!",
      role: "TENANT",
    });

    // On veut juste prouver que la validation ne bloque pas
    expect(res.status).not.toBe(400);
    // si ton endpoint renvoie bien 201:
    expect([201, 200]).toContain(res.status);
  });
});
