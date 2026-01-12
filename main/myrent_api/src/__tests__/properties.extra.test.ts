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
  };
}

async function createProperty(ownerToken: string) {
  const res = await request(app)
    .post("/properties")
    .set("Authorization", `Bearer ${ownerToken}`)
    .send({
      title: "Flat",
      description: "Desc",
      price_per_night: 70,
      city: "Rennes",
      address: "Somewhere",
      max_guests: 2,
    });

  expect(res.status).toBe(201);
  return res.body.id as string;
}

describe("Properties extra", () => {
  it("GET /properties returns list (public)", async () => {
    const res = await request(app).get("/properties");
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it("GET /properties/:id returns a property (public)", async () => {
    const owner = await registerAndLogin("OWNER");
    const propertyId = await createProperty(owner.token);

    const res = await request(app).get(`/properties/${propertyId}`);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("id", propertyId);
  });

  it("PATCH /properties/:id forbids OWNER updating another OWNER's property", async () => {
    const owner1 = await registerAndLogin("OWNER");
    const owner2 = await registerAndLogin("OWNER");

    const propertyId = await createProperty(owner1.token);

    const res = await request(app)
      .patch(`/properties/${propertyId}`)
      .set("Authorization", `Bearer ${owner2.token}`)
      .send({ title: "Hacked" });

    expect(res.status).toBe(403);
  });

  it("DELETE /properties/:id forbids OWNER deleting another OWNER's property", async () => {
    const owner1 = await registerAndLogin("OWNER");
    const owner2 = await registerAndLogin("OWNER");

    const propertyId = await createProperty(owner1.token);

    const res = await request(app)
      .delete(`/properties/${propertyId}`)
      .set("Authorization", `Bearer ${owner2.token}`);

    expect(res.status).toBe(403);
  });

  it("PATCH /properties/:id allows OWNER to update own property", async () => {
    const owner = await registerAndLogin("OWNER");
    const propertyId = await createProperty(owner.token);

    const res = await request(app)
      .patch(`/properties/${propertyId}`)
      .set("Authorization", `Bearer ${owner.token}`)
      .send({ title: "New title" });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("title", "New title");
  });

  it("DELETE /properties/:id allows OWNER to delete own property", async () => {
    const owner = await registerAndLogin("OWNER");
    const propertyId = await createProperty(owner.token);

    const res = await request(app)
      .delete(`/properties/${propertyId}`)
      .set("Authorization", `Bearer ${owner.token}`);

    expect(res.status).toBe(204);
  });
});