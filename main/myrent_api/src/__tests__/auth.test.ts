import request from "supertest";
import { app } from "../app";

describe("Auth", () => {
  const email = `u${Date.now()}@test.com`;
  const password = "Password123!";

  it("POST /auth/register creates a user", async () => {
    const res = await request(app).post("/auth/register").send({
      first_name: "Justin",
      last_name: "BANANE",
      email,
      password,
      role: "TENANT",
    });

    expect(res.status).toBe(201); // si chez toi c’est 200, adapte
    expect(res.body).toHaveProperty("id");
    expect(res.body.email).toBe(email);
    expect(res.body).not.toHaveProperty("password_hash");
  });

  it("POST /auth/login returns a token", async () => {
    const res = await request(app).post("/auth/login").send({
      email,
      password,
    });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("token");
    expect(typeof res.body.token).toBe("string");
  });
});
