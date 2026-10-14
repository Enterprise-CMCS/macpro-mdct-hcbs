import { beforeEach, describe, expect, it, vi } from "vitest";
import { apiLib } from "./apiLib";
import { del, get, patch, post, put } from "aws-amplify/api";
import { updateTimeout } from "../auth/authLifecycle";

const { mockResponse } = vi.hoisted(() => ({
  mockResponse: {
    response: Promise.resolve({
      body: {
        text: () => Promise.resolve(JSON.stringify({ foo: "bar" })),
      },
    }),
  },
}));

vi.mock("aws-amplify/api", () => ({
  del: vi.fn().mockReturnValue(mockResponse),
  get: vi.fn().mockReturnValue(mockResponse),
  patch: vi.fn().mockReturnValue(mockResponse),
  post: vi.fn().mockReturnValue(mockResponse),
  put: vi.fn().mockReturnValue(mockResponse),
}));

vi.mock("../auth/authLifecycle", () => ({
  updateTimeout: vi.fn(),
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
  apiName: "hcbs",
  path,
  options: mockOptions,
};

describe("API lib", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should update the session timeout when calling get", async () => {
    await apiLib.get(path, mockOptions);

    expect(get).toHaveBeenCalledWith(requestObj);
    expect(updateTimeout).toHaveBeenCalled();
  });

  it("should update the session timeout when calling del", async () => {
    await apiLib.del(path, mockOptions);

    expect(del).toHaveBeenCalledWith(requestObj);
    expect(updateTimeout).toHaveBeenCalled();
  });

  it("should update the session timeout when calling post", async () => {
    await apiLib.patch(path, mockOptions);

    expect(patch).toHaveBeenCalledWith(requestObj);
    expect(updateTimeout).toHaveBeenCalled();
  });

  it("should update the session timeout when calling post", async () => {
    await apiLib.post(path, mockOptions);

    expect(post).toHaveBeenCalledWith(requestObj);
    expect(updateTimeout).toHaveBeenCalled();
  });

  it("should update the session timeout when calling put", async () => {
    await apiLib.put(path, mockOptions);

    expect(put).toHaveBeenCalledWith(requestObj);
    expect(updateTimeout).toHaveBeenCalled();
  });

  it("should surface API errors for handling", async () => {
    // For this test only, ignore console output. We deliberately log the error.
    const consoleSpy = vi.spyOn(console, "log");
    consoleSpy.mockImplementation(() => {});

    vi.mocked(del).mockImplementationOnce(() => {
      throw new Error("Mock 500 error");
    });

    await expect(apiLib.del(path, mockOptions)).rejects.toThrow(Error);
    consoleSpy.mockRestore();
  });
});
