import request from "supertest";
import { app } from "../app";

describe("Auth extra", () => {
  it("POST /auth/login fails with wrong password", async () => {
    const email = `u${Date.now()}@test.com`;

    await request(app).post("/auth/register").send({
      first_name: "Test",
      last_name: "User",
      email,
      password: "Password123!",
      role: "TENANT",
    });

    const res = await request(app).post("/auth/login").send({
      email,
      password: "WrongPassword123!",
    });

    expect(res.status).toBe(401);
  });
});
