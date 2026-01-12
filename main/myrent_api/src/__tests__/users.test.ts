import request from "supertest";
import { app } from "../app";

async function registerAndLogin(role: "TENANT" | "OWNER") {
  const email = `u${role}${Date.now()}@test.com`;
  const password = "Password123!";

  const reg = await request(app).post("/auth/register").send({
    first_name: "Test",
    last_name: role,
    email,
    password,
    role,
  });

  const login = await request(app).post("/auth/login").send({ email, password });

  return {
    token: login.body.token as string,
    userId: reg.body.id as string,
    email,
    password,
  };
}

describe("Users", () => {
  it("PUT /users/:id allows self update", async () => {
    const u = await registerAndLogin("TENANT");

    const res = await request(app)
      .put(`/users/${u.userId}`)
      .set("Authorization", `Bearer ${u.token}`)
      .send({ first_name: "Justin" });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("id", u.userId);
    expect(res.body).toHaveProperty("first_name", "Justin");
    expect(res.body).toHaveProperty("email", u.email.toLowerCase());

  });

  it("PUT /users/:id forbids updating another user", async () => {
    const u1 = await registerAndLogin("TENANT");
    const u2 = await registerAndLogin("TENANT");

    const res = await request(app)
      .put(`/users/${u2.userId}`)
      .set("Authorization", `Bearer ${u1.token}`)
      .send({ first_name: "Hacker" });

    expect(res.status).toBe(403);
  });

  it("DELETE /users/:id allows self delete", async () => {
    const u = await registerAndLogin("TENANT");

    const res = await request(app)
      .delete(`/users/${u.userId}`)
      .set("Authorization", `Bearer ${u.token}`);

    expect(res.status).toBe(204);
  });
});
