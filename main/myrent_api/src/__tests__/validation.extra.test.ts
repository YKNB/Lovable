import request from "supertest";
import { app } from "../app";

describe("Validation middleware branches", () => {
  it("POST /auth/register invalid payload -> 400", async () => {
    const res = await request(app).post("/auth/register").send({
      // manque email/password etc
      first_name: "A",
    });
    expect(res.status).toBe(400);
  });
});
