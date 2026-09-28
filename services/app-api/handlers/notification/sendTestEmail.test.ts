import { beforeEach, describe, expect, it, vi } from "vitest";
import { StatusCodes } from "../../libs/response-lib";
import { APIGatewayProxyEvent, User, UserRoles } from "../../types/types";
import { authenticatedUser } from "../../utils/authentication";
import { sendTestEmail } from "./sendTestEmail";
import { sendSesEmail } from "../../libs/ses-lib";

vi.mock("../../libs/ses-lib");

vi.mock("../../utils/authentication", () => ({
  authenticatedUser: vi.fn(),
}));
const mockAdminUser = {
  role: UserRoles.ADMIN,
  fullName: "mock admin",
} as User;
vi.mocked(authenticatedUser).mockReturnValue(mockAdminUser);

vi.mock("../../libs/debug-lib", () => ({
  debug: vi.fn(),
  error: vi.fn(),
  flush: vi.fn(),
  info: vi.fn(),
  init: vi.fn(),
  warn: vi.fn(),
  logger: {
    debug: vi.fn(),
    error: vi.fn(),
    info: vi.fn(),
    warn: vi.fn(),
  },
}));

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
    vi.clearAllMocks();
  });

  it("should return Forbidden if the user is not authorized", async () => {
    vi.mocked(authenticatedUser).mockReturnValueOnce({
      ...mockAdminUser,
      role: UserRoles.STATE_USER,
    });

    const res = await sendTestEmail(mockEvent());

    expect(res.statusCode).toBe(StatusCodes.Forbidden);
  });

  it("should return Bad Request if required fields are missing", async () => {
    const res = await sendTestEmail(
      mockEvent({ toAddress: "only@example.com" })
    );

    expect(res.statusCode).toBe(StatusCodes.BadRequest);
  });

  it("should send an email when all fields are provided", async () => {
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

  it("should return OK even when SES throws (localstack)", async () => {
    vi.mocked(sendSesEmail).mockRejectedValueOnce(
      new Error("Email address not verified")
    );

    const res = await sendTestEmail(mockEvent());

    expect(res.statusCode).toBe(StatusCodes.Ok);
  });
});
