import { isAuthenticated } from "../authentication";
import { getCognitoParameters } from "../../storage/cognito";
import { proxyEvent } from "../../testing/proxyEvent";

const mockVerifier = jest.fn();

jest.mock("aws-jwt-verify", () => ({
  __esModule: true,
  CognitoJwtVerifier: {
    create: jest.fn().mockImplementation(() => ({
      verify: mockVerifier,
    })),
  },
}));

jest.mock("../../storage/cognito", () => ({
  getCognitoParameters: jest.fn().mockResolvedValue({
    userPoolId: "pool-id",
    userPoolClientId: "client-id",
  }),
}));

const apiKeyEvent = { ...proxyEvent, headers: { "x-api-key": "test" } };

describe("Test authorization with api key and environment variables", () => {
  beforeEach(() => {
    process.env["COGNITO_USER_POOL_ID"] = "fakeId";
    process.env["COGNITO_USER_POOL_CLIENT_ID"] = "fakeClientId";
  });
  afterEach(() => {
    delete process.env.COGNITO_USER_POOL_ID;
    delete process.env.COGNITO_USER_POOL_CLIENT_ID;
    jest.clearAllMocks();
  });
  test("is not authorized when token is missing or invalid", async () => {
    mockVerifier.mockImplementation(() => {
      throw new Error("could not verify");
    });
    const authStatus = await isAuthenticated(apiKeyEvent);
    expect(authStatus).toBeFalsy();
  });
  test("is authorized when api key is passed and environment variables are set", async () => {
    mockVerifier.mockReturnValue(true);
    const authStatus = await isAuthenticated(apiKeyEvent);
    expect(authStatus).toBeTruthy();
  });
});

describe("Test authorization with api key and ssm parameters", () => {
  beforeEach(() => {
    mockVerifier.mockReturnValue(true);
  });
  afterEach(() => {
    jest.clearAllMocks();
  });
  test("is authorized when api key is passed and ssm parameters exist", async () => {
    const authStatus = await isAuthenticated(apiKeyEvent);
    expect(authStatus).toBeTruthy();
  });

  test("authorization should reach out to SSM when missing cognito info", async () => {
    delete process.env["COGNITO_USER_POOL_ID"];
    delete process.env["COGNITO_USER_POOL_CLIENT_ID"];

    await isAuthenticated(apiKeyEvent);
    expect(getCognitoParameters).toHaveBeenCalled();
  });
});
