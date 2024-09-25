import { getParameter } from "./ssm-lib";
import { GetParameterCommand, SSMClient } from "@aws-sdk/client-ssm";
import { mockClient } from "aws-sdk-client-mock";

const mockSSM = mockClient(SSMClient);

describe("SSM utilities", () => {
  describe("getParameter", () => {
    it("should call SSM get named parameters", async () => {
      const mockGet = jest.fn().mockResolvedValue({
        Parameter: { Name: "foo", Value: "bar" },
      });
      mockSSM.on(GetParameterCommand).callsFake(mockGet);

      const value = await getParameter("foo");

      expect(value).toBe("bar");
      expect(mockGet).toHaveBeenCalledWith(
        expect.objectContaining({
          Name: "foo",
        }),
        expect.any(Function)
      );
    });
  });
});
