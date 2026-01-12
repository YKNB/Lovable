import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { requireAuth } from "../middleware/auth";
import { AppError } from "../utils/appError";

function makeReq(authHeader?: string) {
  return {
    headers: authHeader ? { authorization: authHeader } : {},
  } as unknown as Request;
}

function makeRes() {
  return {} as Response;
}

function getCode(err: any): string | undefined {
  return err?.code
    ?? err?.details?.code
    ?? err?.meta?.code
    ?? err?.data?.code
    ?? err?.payload?.code
    ?? err?.context?.code;
}

describe("requireAuth middleware", () => {
  it("returns AUTH_MISSING_TOKEN when header is missing", () => {
    const req = makeReq(undefined);
    const res = makeRes();
    const next = jest.fn() as unknown as NextFunction;

    requireAuth(req, res, next);

    const err = (next as any).mock.calls[0][0] as AppError;
    expect(err).toBeInstanceOf(AppError);
    expect((err as any).statusCode).toBe(401);
    expect((err as any).message).toBe("Missing token");
    expect(getCode(err)).toBe("AUTH_MISSING_TOKEN");
  });

  it("returns AUTH_MISSING_TOKEN when header does not start with Bearer", () => {
    const req = makeReq("Basic abc");
    const res = makeRes();
    const next = jest.fn() as unknown as NextFunction;

    requireAuth(req, res, next);

    const err = (next as any).mock.calls[0][0] as AppError;
    expect((err as any).statusCode).toBe(401);
    expect(getCode(err)).toBe("AUTH_MISSING_TOKEN");
  });

  it("returns AUTH_MISSING_TOKEN when Bearer token is empty", () => {
    const req = makeReq("Bearer   ");
    const res = makeRes();
    const next = jest.fn() as unknown as NextFunction;

    requireAuth(req, res, next);

    const err = (next as any).mock.calls[0][0] as AppError;
    expect((err as any).statusCode).toBe(401);
    expect(getCode(err)).toBe("AUTH_MISSING_TOKEN");
  });

  it("returns AUTH_INVALID_TOKEN for invalid token (JsonWebTokenError)", () => {
    const req = makeReq("Bearer not.a.jwt");
    const res = makeRes();
    const next = jest.fn() as unknown as NextFunction;

    requireAuth(req, res, next);

    const err = (next as any).mock.calls[0][0] as AppError;
    expect((err as any).statusCode).toBe(401);
    expect((err as any).message).toBe("Invalid token");
    expect(getCode(err)).toBe("AUTH_INVALID_TOKEN");
  });

  it("returns AUTH_TOKEN_EXPIRED for expired token", () => {
    const token = jwt.sign(
      { sub: "u1", role: "TENANT", email: "u1@test.com" },
      process.env.JWT_SECRET as string,
      { expiresIn: -1 }
    );

    const req = makeReq(`Bearer ${token}`);
    const res = makeRes();
    const next = jest.fn() as unknown as NextFunction;

    requireAuth(req, res, next);

    const err = (next as any).mock.calls[0][0] as AppError;
    expect((err as any).statusCode).toBe(401);
    expect((err as any).message).toBe("Token expired");
    expect(getCode(err)).toBe("AUTH_TOKEN_EXPIRED");
  });

  it("returns AUTH_INVALID_TOKEN_PAYLOAD when payload shape is invalid", () => {
    const badPayloadToken = jwt.sign(
      { foo: "bar" },
      process.env.JWT_SECRET as string,
      { expiresIn: "1h" }
    );

    const req = makeReq(`Bearer ${badPayloadToken}`);
    const res = makeRes();
    const next = jest.fn() as unknown as NextFunction;

    requireAuth(req, res, next);

    const err = (next as any).mock.calls[0][0] as AppError;
    expect((err as any).statusCode).toBe(401);
    expect((err as any).message).toBe("Invalid token");
    expect(getCode(err)).toBe("AUTH_INVALID_TOKEN_PAYLOAD");
  });

  it("sets req.user and calls next() for valid token", () => {
    const token = jwt.sign(
      { sub: "user-123", role: "OWNER", email: "owner@test.com" },
      process.env.JWT_SECRET as string,
      { expiresIn: "1h" }
    );

    const req = makeReq(`Bearer ${token}`);
    const res = makeRes();
    const next = jest.fn() as unknown as NextFunction;

    requireAuth(req, res, next);

    expect((next as any).mock.calls[0][0]).toBeUndefined();
    expect((req as any).user).toEqual({
      id: "user-123",
      role: "OWNER",
      email: "owner@test.com",
    });
  });
});
