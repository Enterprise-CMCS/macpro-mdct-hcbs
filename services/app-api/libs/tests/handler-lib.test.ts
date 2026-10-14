import { beforeEach, describe, expect, it, vi } from "vitest";
import { handler as handlerLib } from "../handler-lib";
import { proxyEvent } from "../../testing/proxyEvent";
import { authenticatedUser } from "../../utils/authentication";
import * as logger from "../debug-lib";
import { ok, StatusCodes } from "../response-lib";
import { User } from "../../types/types";

vi.mock("../debug-lib", () => ({
  init: vi.fn(),
  debug: vi.fn(),
  error: vi.fn(),
  flush: vi.fn(),
}));

vi.mock("../../utils/authentication", () => ({
  authenticatedUser: vi.fn(),
}));

const parser = () => ({});

describe("Lambda Handler Lib", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should coordinate parsing, logging, authentication, and business logic", async () => {
    const testFunc = vi.fn().mockReturnValue(ok("test"));
    const handler = handlerLib(parser, testFunc);

    vi.mocked(authenticatedUser).mockReturnValue({} as User);
    const res = await handler(proxyEvent);

    expect(res.statusCode).toBe(StatusCodes.Ok);
    expect(res.body).toContain("test");
    expect(logger.init).toHaveBeenCalled();
    expect(logger.debug).toHaveBeenCalledWith(
      "API event: %O",
      expect.objectContaining({
        body: proxyEvent.body,
        pathParameters: proxyEvent.pathParameters,
        queryStringParameters: proxyEvent.queryStringParameters,
      })
    );
    expect(logger.flush).toHaveBeenCalled();
    expect(testFunc).toHaveBeenCalledWith(
      expect.objectContaining({
        body: {},
        user: {},
        parameters: {},
      })
    );
  });

  it("should return Unauthenticated immediately if user cannot be identified", async () => {
    const testFunc = vi.fn();
    const handler = handlerLib(parser, testFunc);

    vi.mocked(authenticatedUser).mockReturnValue(undefined);
    const res = await handler(proxyEvent);

    expect(testFunc).not.toHaveBeenCalled();
    expect(res.statusCode).toBe(StatusCodes.Unauthenticated);
    expect(res.body).toBe(`"User is not authorized to access this resource."`);
  });

  it("should return Internal Server Error if the business logic throws", async () => {
    const err = new Error("Test Error");
    const testFunc = vi.fn().mockImplementation(() => {
      throw err;
    });
    const handler = handlerLib(parser, testFunc);

    vi.mocked(authenticatedUser).mockReturnValue({} as User);
    const res = await handler(proxyEvent);

    expect(testFunc).toHaveBeenCalled();
    expect(logger.error).toHaveBeenCalledWith("Error: %O", err);
    expect(logger.flush).toHaveBeenCalled();
    expect(res.statusCode).toBe(StatusCodes.InternalServerError);
    expect(res.body).toBe(`"Test Error"`);
  });
});
