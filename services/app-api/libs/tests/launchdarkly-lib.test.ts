// The client in launchdarkly-lib is a module-level singleton, so we must
// reset the module registry before each test to get a fresh client each time.

describe("getFlag", () => {
  let getFlag: (flagKey: string, defaultValue?: boolean) => Promise<boolean>;
  let mockVariation: jest.Mock;
  let mockWaitForInitialization: jest.Mock;
  let mockInit: jest.Mock;

  beforeEach(() => {
    mockVariation = jest.fn();
    mockWaitForInitialization = jest.fn().mockResolvedValue(undefined);
    mockInit = jest.fn().mockReturnValue({
      variation: mockVariation,
      waitForInitialization: mockWaitForInitialization,
    });

    jest.resetModules();
    jest.doMock("@launchdarkly/node-server-sdk", () => ({
      init: mockInit,
    }));

    ({ getFlag } = require("../launchdarkly-lib"));
  });

  afterEach(() => {
    delete process.env.launchDarklyServer;
  });

  it("returns the flag value from LaunchDarkly", async () => {
    mockVariation.mockResolvedValue(true);

    const result = await getFlag("testFlag");

    expect(result).toBe(true);
    expect(mockVariation).toHaveBeenCalledWith(
      "testFlag",
      { key: "server" },
      false
    );
  });

  it("returns the provided defaultValue when the flag is off", async () => {
    mockVariation.mockResolvedValue(false);

    const result = await getFlag("testFlag", false);

    expect(result).toBe(false);
  });

  it("returns defaultValue when LaunchDarkly client fails to initialize", async () => {
    mockWaitForInitialization.mockRejectedValueOnce(new Error("timeout"));

    const result = await getFlag("testFlag", false);

    expect(result).toBe(false);
  });

  it("falls back to 'local' when launchDarklyServer is not set", async () => {
    mockVariation.mockResolvedValue(false);

    await getFlag("testFlag");

    expect(mockInit.mock.calls[0][0]).toBe("local");
  });
});
