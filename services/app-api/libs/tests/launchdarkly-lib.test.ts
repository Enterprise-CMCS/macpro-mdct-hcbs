import { beforeEach, describe, expect, it, vi } from "vitest";

// The client in launchdarkly-lib is a module-level singleton, so we must
// reset the module registry before each test to get a fresh client each time.
describe("getFlag", () => {
  type MockedFunction = ReturnType<typeof vi.fn>;
  let getFlag: (flagKey: string, defaultValue?: boolean) => Promise<boolean>;
  let mockVariation: MockedFunction;
  let mockWaitForInitialization: MockedFunction;
  let mockInit: MockedFunction;

  beforeEach(async () => {
    delete process.env.LD_SDK_SERVER;
    mockVariation = vi.fn();
    mockWaitForInitialization = vi.fn().mockResolvedValue(undefined);
    mockInit = vi.fn().mockReturnValue({
      variation: mockVariation,
      waitForInitialization: mockWaitForInitialization,
    });

    vi.resetModules();
    vi.doMock("@launchdarkly/node-server-sdk", () => ({
      init: mockInit,
    }));

    ({ getFlag } = await import("../launchdarkly-lib.js"));
  });

  it("should return the flag value from LaunchDarkly", async () => {
    mockVariation.mockResolvedValue(true);

    const result = await getFlag("testFlag");

    expect(result).toBe(true);
    expect(mockVariation).toHaveBeenCalledWith(
      "testFlag",
      { key: "server" },
      false
    );
  });

  it("should return the provided defaultValue when the flag is off", async () => {
    mockVariation.mockResolvedValue(false);

    const result = await getFlag("testFlag", false);

    expect(result).toBe(false);
  });

  it("should fall back to 'local' when launchDarklyServer is not set", async () => {
    mockWaitForInitialization.mockRejectedValueOnce(new Error("timeout"));

    const result = await getFlag("testFlag", false);

    expect(result).toBe(false);
  });

  it("should fall back to 'local' when LD_SDK_SERVER is not set", async () => {
    mockVariation.mockResolvedValue(false);

    await getFlag("testFlag");

    expect(mockInit).toHaveBeenCalledWith("local", expect.anything());
  });
});
