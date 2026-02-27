import { StatusCodes } from "../../libs/response-lib";
import { proxyEvent } from "../../testing/proxyEvent";
import { APIGatewayProxyEvent, UserRoles } from "../../types/types";
import { canWriteBanner } from "../../utils/authorization";
import { deleteBanner } from "./delete";
import { error } from "../../utils/constants";
import { DeleteCommand, DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import { mockClient } from "aws-sdk-client-mock";

const dynamoClientMock = mockClient(DynamoDBDocumentClient);

jest.mock("../../utils/authentication", () => ({
  authenticatedUser: jest.fn().mockResolvedValue({
    role: UserRoles.ADMIN,
    state: "PA",
  }),
}));

jest.mock("../../utils/authorization", () => ({
  canWriteBanner: jest.fn().mockReturnValue(true),
}));

const testEvent: APIGatewayProxyEvent = {
  ...proxyEvent,
  headers: { "cognito-identity-id": "test" },
  pathParameters: { bannerId: "testKey" },
};

describe("Test deleteBanner API method", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should delete the given banner from the database", async () => {
    const mockDelete = jest.fn();
    dynamoClientMock.on(DeleteCommand).callsFake(mockDelete);
    const res = await deleteBanner(testEvent);
    expect(res.statusCode).toBe(StatusCodes.Ok);
    expect(mockDelete).toHaveBeenCalled();
  });

  it("should return an error if the user does not have permissions", async () => {
    (canWriteBanner as jest.Mock).mockReturnValueOnce(false);
    const res = await deleteBanner(testEvent);
    expect(res.statusCode).toBe(StatusCodes.Forbidden);
    expect(res.body).toContain(error.UNAUTHORIZED);
  });

  it("should return an error if a banner key is not provided", async () => {
    const noKeyEvent: APIGatewayProxyEvent = {
      ...testEvent,
      pathParameters: {},
    };
    const res = await deleteBanner(noKeyEvent);

    expect(res.statusCode).toBe(StatusCodes.BadRequest);
    expect(res.body).toContain(error.MISSING_DATA);
  });
});
