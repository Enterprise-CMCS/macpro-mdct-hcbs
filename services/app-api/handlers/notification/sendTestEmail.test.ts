import { StatusCodes } from "../../libs/response-lib";
import { APIGatewayProxyEvent, User, UserRoles } from "../../types/types";
import { authenticatedUser as actualAuthenticatedUser } from "../../utils/authentication";
import { sendTestEmail } from "./sendTestEmail";
import { sendSesEmail } from "../../libs/ses-lib";

jest.mock("../../libs/ses-lib");

jest.mock("../../utils/authentication", () => ({
  authenticatedUser: jest.fn(),
}));

jest.mock("../../libs/debug-lib", () => ({
  debug: jest.fn(),
  error: jest.fn(),
  flush: jest.fn(),
  info: jest.fn(),
  init: jest.fn(),
  warn: jest.fn(),
  logger: {
    debug: jest.fn(),
    error: jest.fn(),
    info: jest.fn(),
    warn: jest.fn(),
  },
}));

const authenticatedUser = actualAuthenticatedUser as jest.MockedFunction<
  typeof actualAuthenticatedUser
>;

const mockAdminUser = {
  role: UserRoles.ADMIN,
  fullName: "mock admin",
} as User;

const validBody = {
  toAddress: "recipient@example.com",
  subject: "HCBS Notification Test",
  message: "This is a test notification from the HCBS system.",
};

const mockEvent = (body: object | null = validBody) =>
  ({
    body: body ? JSON.stringify(body) : null,
  }) as APIGatewayProxyEvent;

describe("sendTestEmail handler", () => {
  beforeEach(() => {
    authenticatedUser.mockReturnValue(mockAdminUser);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("returns 403 if the user is not authorized", async () => {
    authenticatedUser.mockReturnValueOnce({
      ...mockAdminUser,
      role: UserRoles.STATE_USER,
    });

    const res = await sendTestEmail(mockEvent());

    expect(res.statusCode).toBe(StatusCodes.Forbidden);
  });

  it("returns 400 if required fields are missing", async () => {
    const res = await sendTestEmail(
      mockEvent({ toAddress: "only@example.com" })
    );

    expect(res.statusCode).toBe(StatusCodes.BadRequest);
  });

  it("returns 400 if toAddress is not a valid email address", async () => {
    const res = await sendTestEmail(
      mockEvent({ ...validBody, toAddress: "not-an-email" })
    );

    expect(res.statusCode).toBe(StatusCodes.BadRequest);
    expect(sendSesEmail).not.toHaveBeenCalled();
  });

  it("returns 200 and sends email when all fields are provided", async () => {
    const res = await sendTestEmail(mockEvent());

    expect(res.statusCode).toBe(StatusCodes.Ok);
    expect(sendSesEmail).toHaveBeenCalledTimes(1);
    expect(sendSesEmail).toHaveBeenCalledWith(
      expect.objectContaining({
        Destination: { ToAddresses: [validBody.toAddress] },
        Message: expect.objectContaining({
          Subject: { Data: validBody.subject },
          Body: { Text: { Data: validBody.message } },
        }),
      })
    );
  });

  it("returns 200 even when SES throws (localstack)", async () => {
    (sendSesEmail as jest.Mock).mockRejectedValueOnce(
      new Error("Email address not verified")
    );

    const res = await sendTestEmail(mockEvent());

    expect(res.statusCode).toBe(StatusCodes.Ok);
  });
});
