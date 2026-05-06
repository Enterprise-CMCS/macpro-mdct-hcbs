import { StatusCodes } from "../../libs/response-lib";
import { proxyEvent } from "../../testing/proxyEvent";
import { APIGatewayProxyEvent } from "../../types/types";
import { sendEmail } from "./sendEmail";

jest.mock("../../utils/authentication", () => ({
  authenticatedUser: jest.fn().mockResolvedValue({
    role: "admin",
    state: "PA",
  }),
}));

jest.mock("../../utils/authorization", () => ({
  isAuthenticated: jest.fn().mockReturnValue(true),
}));

let mockSend: jest.Mock;

jest.mock("@aws-sdk/client-ses", () => ({
  SESClient: jest.fn().mockImplementation(() => ({
    send: (...args: unknown[]) => mockSend(...args),
  })),
  SendEmailCommand: jest.fn().mockImplementation((input) => input),
}));

const validBody = {
  toAddress: "test@example.com",
  subject: "Test Subject",
  message: "Test message body.",
};

const validEvent: APIGatewayProxyEvent = {
  ...proxyEvent,
  headers: { "cognito-identity-id": "test" },
  body: JSON.stringify(validBody),
};

const noBodyEvent: APIGatewayProxyEvent = {
  ...proxyEvent,
  headers: { "cognito-identity-id": "test" },
  body: null,
};

describe("sendEmail", () => {
  beforeEach(() => {
    mockSend = jest.fn().mockResolvedValue({});
  });

  it("should return 400 if body is missing", async () => {
    const res = await sendEmail(noBodyEvent);
    expect(res.statusCode).toBe(StatusCodes.BadRequest);
  });

  it("should send an email and return 200 on success", async () => {
    const res = await sendEmail(validEvent);
    expect(mockSend).toHaveBeenCalledTimes(1);
    expect(res.statusCode).toBe(StatusCodes.Ok);
  });

  it("should return 500 if SES throws an error", async () => {
    mockSend.mockRejectedValueOnce(new Error("SES failure"));
    const res = await sendEmail(validEvent);
    expect(res.statusCode).toBe(StatusCodes.InternalServerError);
  });
});
