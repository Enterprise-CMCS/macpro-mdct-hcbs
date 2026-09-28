import { describe, expect, it } from "vitest";
import {
  ok,
  created,
  badRequest,
  unauthenticated,
  forbidden,
  notFound,
  conflict,
  internalServerError,
} from "../response-lib";

describe("HTTP Response helper functions", () => {
  it("should have correct status codes", () => {
    expect(ok({}).statusCode).toBe(200);
    expect(created({}).statusCode).toBe(201);
    expect(badRequest({}).statusCode).toBe(400);
    expect(unauthenticated({}).statusCode).toBe(401);
    expect(forbidden({}).statusCode).toBe(403);
    expect(notFound({}).statusCode).toBe(404);
    expect(conflict({}).statusCode).toBe(409);
    expect(internalServerError({}).statusCode).toBe(500);
  });

  it("should exclude a body if not provided", () => {
    const response = badRequest();
    expect(response.body).toBeUndefined();
  });

  it("should include a body if provided", () => {
    const res = badRequest("try again");
    expect(res.body).toBe('"try again"');
  });

  it("should include the necessary headers", () => {
    const response = ok({});
    expect(response.headers["Access-Control-Allow-Origin"]).toBe("*");
    expect(response.headers["Access-Control-Allow-Credentials"]).toBe(true);
  });
});
