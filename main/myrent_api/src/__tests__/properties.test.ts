import request from "supertest";
import { app } from "../app";

async function registerAndLogin(role: "OWNER" | "TENANT") {
  const email = `u${role}${Date.now()}@test.com`;
  const password = "Password123!";

  await request(app).post("/auth/register").send({
    first_name: "Test",
    last_name: role,
    email,
    password,
    role,
  });

  const login = await request(app).post("/auth/login").send({ email, password });
  return login.body.token as string;
}

describe("Properties", () => {
  it("POST /properties requires OWNER", async () => {
    const tenantToken = await registerAndLogin("TENANT");

    const res = await request(app)
      .post("/properties")
      .set("Authorization", `Bearer ${tenantToken}`)
      .send({
        title: "Nice flat",
        description: "Test",
        price_per_night: 50,
        city: "Rennes",
        address: "Somewhere",
        max_guests: 2,
      });

    expect(res.status).toBe(403);
  });

  it("POST /properties works for OWNER", async () => {
    const ownerToken = await registerAndLogin("OWNER");

    const res = await request(app)
      .post("/properties")
      .set("Authorization", `Bearer ${ownerToken}`)
      .send({
        title: "Nice flat",
        description: "Test",
        price_per_night: 50,
        city: "Rennes",
        address: "Somewhere",
        max_guests: 2,
      });

    expect([200, 201]).toContain(res.status);
    expect(res.body).toHaveProperty("id");
    expect(res.body).toHaveProperty("title", "Nice flat");
  });
});
