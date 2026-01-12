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
  };
}

async function createProperty(ownerToken: string) {
  const res = await request(app)
    .post("/properties")
    .set("Authorization", `Bearer ${ownerToken}`)
    .send({
      title: "Test flat",
      description: "Test",
      price_per_night: 60,
      city: "Rennes",
      address: "Somewhere",
      max_guests: 2,
    });

  expect([200, 201]).toContain(res.status);
  return res.body.id as string;
}

describe("Bookings", () => {
  it("TENANT can create booking and OWNER can confirm it", async () => {
    const owner = await registerAndLogin("OWNER");
    const tenant = await registerAndLogin("TENANT");

    const propertyId = await createProperty(owner.token);

    // Create booking (tenant)
    const createBooking = await request(app)
      .post("/bookings")
      .set("Authorization", `Bearer ${tenant.token}`)
      .send({
        property_id: propertyId,
        start_date: "2026-02-01",
        end_date: "2026-02-03",
      });

    expect([200, 201]).toContain(createBooking.status);
    expect(createBooking.body).toHaveProperty("id");
    expect(createBooking.body).toHaveProperty("status"); // PENDING normalement

    const bookingId = createBooking.body.id as string;

    // Confirm booking (owner)
    const confirm = await request(app)
      .patch(`/bookings/${bookingId}/confirm`)
      .set("Authorization", `Bearer ${owner.token}`)
      .send();

    expect(confirm.status).toBe(200);
    expect(confirm.body).toHaveProperty("status", "CONFIRMED");
  });
});
