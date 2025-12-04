import { apiLib } from "./apiLib";
import { updateTimeout } from "utils";

const mockAmplifyApi = require("aws-amplify/api");

jest.mock("utils", () => ({
  updateTimeout: jest.fn(),
}));

const path = "my/url";
const mockOptions = {
  headers: {
    "x-api-key": "mock key",
  },
  body: {
    foo: "bar",
  },
};
const requestObj = {
  apiName: "labs",
  path,
  options: mockOptions,
};

describe("API lib", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("Calling post should update the session timeout", async () => {
    const apiSpy = jest.spyOn(mockAmplifyApi, "post");
    await apiLib.post(path, mockOptions);

    expect(apiSpy).toHaveBeenCalledWith(requestObj);
    expect(updateTimeout).toHaveBeenCalled();
  });

  test("Calling put should update the session timeout", async () => {
    const apiSpy = jest.spyOn(mockAmplifyApi, "put");
    await apiLib.put(path, mockOptions);

    expect(apiSpy).toHaveBeenCalledWith(requestObj);
    expect(updateTimeout).toHaveBeenCalled();
  });

  test("Calling get should update the session timeout", async () => {
    const apiSpy = jest.spyOn(mockAmplifyApi, "get");
    await apiLib.get(path, mockOptions);

    expect(apiSpy).toHaveBeenCalledWith(requestObj);
    expect(updateTimeout).toHaveBeenCalled();
  });

  test("Calling del should update the session timeout", async () => {
    const apiSpy = jest.spyOn(mockAmplifyApi, "del");
    await apiLib.del(path, mockOptions);

    expect(apiSpy).toHaveBeenCalledWith(requestObj);
    expect(updateTimeout).toHaveBeenCalled();
  });

  test("API errors should be surfaced for handling", async () => {
    // For this test only, ignore console output. We deliberately log the error.
    const consoleSpy = jest.spyOn(console, "log");
    consoleSpy.mockImplementation(() => {});

    const apiSpy = jest.spyOn(mockAmplifyApi, "del");
    apiSpy.mockImplementationOnce(() => {
      throw new Error("Mock 500 error");
    });

    await expect(apiLib.del(path, mockOptions)).rejects.toThrow(Error);
    consoleSpy.mockRestore();
  });
});
