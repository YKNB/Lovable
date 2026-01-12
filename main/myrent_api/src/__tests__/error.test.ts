import request from "supertest";
import { app } from "../app";

describe("Error handler", () => {
  const original = console.error;

  beforeAll(() => {
    console.error = jest.fn();
  });

  afterAll(() => {
    console.error = original;
  });

  it("GET /__test__/boom returns 500", async () => {
    const res = await request(app).get("/__test__/boom");
    expect(res.status).toBe(500);
    expect(res.text || res.body).toBeDefined();
  });
});
