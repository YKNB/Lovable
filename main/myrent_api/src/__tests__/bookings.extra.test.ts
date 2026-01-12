import request from "supertest";
import { app } from "../app";

async function registerAndLogin(role: "TENANT" | "OWNER") {
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

  return {
    token: login.body.token as string,
    email: email.toLowerCase(),
  };
}

async function createProperty(ownerToken: string) {
  const res = await request(app)
    .post("/properties")
    .set("Authorization", `Bearer ${ownerToken}`)
    .send({
      title: "Flat",
      description: "Desc",
      price_per_night: 60,
      city: "Rennes",
      address: "Somewhere",
      max_guests: 2,
    });

  expect(res.status).toBe(201);
  return res.body.id as string;
}

async function createBooking(tenantToken: string, propertyId: string) {
  const res = await request(app)
    .post("/bookings")
    .set("Authorization", `Bearer ${tenantToken}`)
    .send({
      property_id: propertyId,
      start_date: "2026-03-01",
      end_date: "2026-03-03",
    });

  expect(res.status).toBe(201);
  return res.body.id as string;
}

describe("Bookings extra", () => {
  it("TENANT can list my bookings (GET /bookings/me)", async () => {
    const owner = await registerAndLogin("OWNER");
    const tenant = await registerAndLogin("TENANT");
    const propertyId = await createProperty(owner.token);
    await createBooking(tenant.token, propertyId);

    const res = await request(app)
      .get("/bookings/me")
      .set("Authorization", `Bearer ${tenant.token}`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it("OWNER can list owned bookings (GET /bookings/owned)", async () => {
    const owner = await registerAndLogin("OWNER");
    const tenant = await registerAndLogin("TENANT");
    const propertyId = await createProperty(owner.token);
    await createBooking(tenant.token, propertyId);

    const res = await request(app)
      .get("/bookings/owned")
      .set("Authorization", `Bearer ${owner.token}`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it("TENANT can cancel own booking (PATCH /bookings/:id/cancel)", async () => {
    const owner = await registerAndLogin("OWNER");
    const tenant = await registerAndLogin("TENANT");
    const propertyId = await createProperty(owner.token);
    const bookingId = await createBooking(tenant.token, propertyId);

    const res = await request(app)
      .patch(`/bookings/${bookingId}/cancel`)
      .set("Authorization", `Bearer ${tenant.token}`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("status", "CANCELLED");
  });

  it("OWNER can cancel a booking (PATCH /bookings/:id/cancel-by-owner)", async () => {
    const owner = await registerAndLogin("OWNER");
    const tenant = await registerAndLogin("TENANT");
    const propertyId = await createProperty(owner.token);
    const bookingId = await createBooking(tenant.token, propertyId);

    const res = await request(app)
      .patch(`/bookings/${bookingId}/cancel-by-owner`)
      .set("Authorization", `Bearer ${owner.token}`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("status", "CANCELLED");
  });
});