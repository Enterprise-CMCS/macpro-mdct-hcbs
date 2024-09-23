import handlerLib from "../handler-lib";
import { proxyEvent } from "../../testing/proxyEvent";
import { isAuthorized } from "../../utils/authorization";
import * as logger from "../debug-lib";
import { ok, StatusCodes } from "../response-lib";

jest.mock("../debug-lib", () => ({
  init: jest.fn(),
  debug: jest.fn(),
  error: jest.fn(),
  flush: jest.fn(),
}));

jest.mock("../../utils/authorization", () => ({
  isAuthorized: jest.fn(),
}));

describe("Test Lambda Handler Lib", () => {
  test("Test successful authorized lambda workflow", async () => {
    const testFunc = jest.fn().mockReturnValue(ok("test"));
    const handler = handlerLib(testFunc);

    (isAuthorized as jest.Mock).mockReturnValue(true);
    const res = await handler(proxyEvent, null);

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
    expect(testFunc).toHaveBeenCalledWith(proxyEvent);
  });

  test("Test unsuccessful authorization lambda workflow", async () => {
    const testFunc = jest.fn();
    const handler = handlerLib(testFunc);

    (isAuthorized as jest.Mock).mockReturnValue(false);
    const res = await handler(proxyEvent, null);

    expect(res.statusCode).toBe(StatusCodes.Unauthenticated);
    expect(res.body).toBe(`"User is not authorized to access this resource."`);
  });

  test("Test Errored lambda workflow", async () => {
    const err = new Error("Test Error");
    const testFunc = jest.fn().mockImplementation(() => {
      throw err;
    });
    const handler = handlerLib(testFunc);

    (isAuthorized as jest.Mock).mockReturnValue(true);
    const res = await handler(proxyEvent, null);

    expect(testFunc).toHaveBeenCalledWith(proxyEvent);
    expect(logger.error).toHaveBeenCalledWith("Error: %O", err);
    expect(logger.flush).toHaveBeenCalled();
    expect(res.statusCode).toBe(StatusCodes.InternalServerError);
    expect(res.body).toBe(`"Test Error"`);
    expect(testFunc).toHaveBeenCalledWith(proxyEvent);
  });
});
