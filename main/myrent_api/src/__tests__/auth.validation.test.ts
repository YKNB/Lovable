import request from "supertest";
import { app } from "../app";

function expectValidationError(res: request.Response) {
  expect(res.status).toBe(400);
  expect(res.headers["content-type"]).toMatch(/application\/json/);

  expect(res.body).toHaveProperty("error", "Validation error");
  expect(res.body).toHaveProperty("code", "VALIDATION_ERROR");
  expect(res.body).toHaveProperty("details");
  expect(Array.isArray(res.body.details)).toBe(true);
  expect(res.body.details.length).toBeGreaterThan(0);
}

describe("Auth validation (express-validator)", () => {
  it("POST /auth/register rejects unknown fields", async () => {
    const res = await request(app)
      .post("/auth/register")
      .set("Accept", "application/json")
      .send({
        first_name: "Karl",
        last_name: "Yegbe",
        email: "karl@example.com",
        password: "Password123!",
        hack: "nope",
      });

    expectValidationError(res);
    expect(JSON.stringify(res.body.details)).toMatch(/Unknown fields/i);
  });

  it("POST /auth/register rejects invalid email", async () => {
    const res = await request(app)
      .post("/auth/register")
      .set("Accept", "application/json")
      .send({
        first_name: "Karl",
        last_name: "Yegbe",
        email: "not-an-email",
        password: "Password123!",
      });

    expectValidationError(res);
    expect(JSON.stringify(res.body.details)).toMatch(/email must be a valid email/i);
  });

  it("POST /auth/register rejects too short first_name", async () => {
    const res = await request(app)
      .post("/auth/register")
      .set("Accept", "application/json")
      .send({
        first_name: "K",
        last_name: "Yegbe",
        email: "karl@example.com",
        password: "Password123!",
      });

    expectValidationError(res);
    expect(JSON.stringify(res.body.details)).toMatch(/first_name must be 2-100/i);
  });

  it("POST /auth/login rejects unknown fields", async () => {
    const res = await request(app)
      .post("/auth/login")
      .set("Accept", "application/json")
      .send({
        email: "karl@example.com",
        password: "Password123!",
        extra: "nope",
      });

    expectValidationError(res);
    expect(JSON.stringify(res.body.details)).toMatch(/Unknown fields/i);
  });

  it("POST /auth/login rejects missing password", async () => {
    const res = await request(app)
      .post("/auth/login")
      .set("Accept", "application/json")
      .send({
        email: "karl@example.com",
      });

    expectValidationError(res);
    expect(JSON.stringify(res.body.details)).toMatch(/password/i);
  });

  it("POST /auth/login rejects invalid email", async () => {
    const res = await request(app)
      .post("/auth/login")
      .set("Accept", "application/json")
      .send({
        email: "bad-email",
        password: "Password123!",
      });

    expectValidationError(res);
    expect(JSON.stringify(res.body.details)).toMatch(/email must be a valid email/i);
  });
});
