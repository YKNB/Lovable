import request from "supertest";
import { app } from "../app";

describe("Auth protection", () => {
  it("GET /me without token returns 401", async () => {
    const res = await request(app).get("/me");
    expect(res.status).toBe(401);
  });
});
