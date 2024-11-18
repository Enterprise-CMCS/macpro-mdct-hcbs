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

  test("Test not authorized to delete banner throws 403 error", async () => {
    (canWriteBanner as jest.Mock).mockReturnValueOnce(false);
    const res = await deleteBanner(testEvent);
    expect(res.statusCode).toBe(StatusCodes.Forbidden);
    expect(res.body).toContain(error.UNAUTHORIZED);
  });

  test("Test Successful Banner Deletion", async () => {
    const mockDelete = jest.fn();
    dynamoClientMock.on(DeleteCommand).callsFake(mockDelete);
    const res = await deleteBanner(testEvent);
    expect(res.statusCode).toBe(StatusCodes.Ok);
    expect(mockDelete).toHaveBeenCalled();
  });

  test("Test bannerKey not provided throws 500 error", async () => {
    const noKeyEvent: APIGatewayProxyEvent = {
      ...testEvent,
      pathParameters: {},
    };
    const res = await deleteBanner(noKeyEvent);

    expect(res.statusCode).toBe(StatusCodes.BadRequest);
    expect(res.body).toContain(error.MISSING_DATA);
  });

  test("Test bannerKey empty throws 500 error", async () => {
    const noKeyEvent: APIGatewayProxyEvent = {
      ...testEvent,
      pathParameters: { bannerId: "" },
    };
    const res = await deleteBanner(noKeyEvent);

    expect(res.statusCode).toBe(StatusCodes.BadRequest);
    expect(res.body).toContain(error.MISSING_DATA);
  });
});
