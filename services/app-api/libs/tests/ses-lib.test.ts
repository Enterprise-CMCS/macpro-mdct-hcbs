import { mockClient } from "aws-sdk-client-mock";
import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";
import { sendSesEmail } from "../ses-lib";

jest.mock("../debug-lib", () => ({
  debug: jest.fn(),
  error: jest.fn(),
  flush: jest.fn(),
  info: jest.fn(),
  init: jest.fn(),
  warn: jest.fn(),
}));

const sesMock = mockClient(SESClient);

const mockParams = {
  Source: "MDCT_NoReply@cms.hhs.gov",
  Destination: { ToAddresses: ["test@example.com"] },
  Message: {
    Subject: { Data: "Test Subject" },
    Body: { Text: { Data: "Test Body" } },
  },
};

describe("sendSesEmail", () => {
  beforeEach(() => {
    sesMock.reset();
  });

  it("calls client.send with a SendEmailCommand", async () => {
    sesMock.on(SendEmailCommand).resolves({});

    await sendSesEmail(mockParams);

    expect(sesMock.calls()).toHaveLength(1);
    expect(sesMock.calls()[0].args[0].input).toMatchObject(mockParams);
  });
});
