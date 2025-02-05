import { getCognitoParameters } from "./cognito";
import { getParameter } from "./ssm/ssm-lib";

process.env.STAGE = "local";

jest.mock("./ssm/ssm-lib", () => ({
  getParameter: jest.fn(),
}));
(getParameter as jest.Mock).mockImplementation(async (name: string) => {
  return name.split("_").slice(-2).join("-");
});

describe("getCognitoParameters", () => {
  it("Should call SSM with the correct names", async () => {
    const result = await getCognitoParameters();

    expect(result.userPoolId).toBe("pool-id");
    expect(result.userPoolClientId).toBe("client-id");
    expect(getParameter).toHaveBeenCalledWith(
      "/local/ui-auth/cognito_user_pool_id"
    );
    expect(getParameter).toHaveBeenCalledWith(
      "/local/ui-auth/cognito_user_pool_client_id"
    );
  });

  it("Should ensure both parameters have values", async () => {
    (getParameter as jest.Mock).mockResolvedValueOnce(undefined);

    expect(async () => await getCognitoParameters()).rejects.toThrow();
  });
});
