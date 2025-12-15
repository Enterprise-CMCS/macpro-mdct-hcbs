import { handler as handlerLib } from "../handler-lib";
import { proxyEvent } from "../../testing/proxyEvent";
import { authenticatedUser } from "../../utils/authentication";
import * as logger from "../debug-lib";
import { ok, StatusCodes } from "../response-lib";

jest.mock("../debug-lib", () => ({
  init: jest.fn(),
  debug: jest.fn(),
  error: jest.fn(),
  flush: jest.fn(),
}));

jest.mock("../../utils/authentication", () => ({
  authenticatedUser: jest.fn(),
}));

const parser = () => ({});

describe("Test Lambda Handler Lib", () => {
  test("successful authorized lambda workflow", async () => {
    const testFunc = jest.fn().mockReturnValue(ok("test"));
    const handler = handlerLib(parser, testFunc);

    (authenticatedUser as jest.Mock).mockReturnValue({});
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

  test("unsuccessful authorization lambda workflow", async () => {
    const testFunc = jest.fn();
    const handler = handlerLib(parser, testFunc);

    (authenticatedUser as jest.Mock).mockReturnValue(undefined);
    const res = await handler(proxyEvent);

    expect(res.statusCode).toBe(StatusCodes.Unauthenticated);
    expect(res.body).toBe(`"User is not authorized to access this resource."`);
  });

  test("Errored lambda workflow", async () => {
    const err = new Error("Test Error");
    const testFunc = jest.fn().mockImplementation(() => {
      throw err;
    });
    const handler = handlerLib(parser, testFunc);

    (authenticatedUser as jest.Mock).mockReturnValue({});
    const res = await handler(proxyEvent);

    expect(testFunc).toHaveBeenCalled();
    expect(logger.error).toHaveBeenCalledWith("Error: %O", err);
    expect(logger.flush).toHaveBeenCalled();
    expect(res.statusCode).toBe(StatusCodes.InternalServerError);
    expect(res.body).toBe(`"Test Error"`);
  });
});
