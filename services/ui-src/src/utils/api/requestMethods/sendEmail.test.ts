import { initAuthManager } from "utils/auth/authLifecycle";
import { SendEmailPayload, sendEmail } from "./sendEmail";

const mockPayload: SendEmailPayload = {
  toAddress: "test@example.com",
  subject: "Test Subject",
  message: "Test message body.",
};

describe("utils/sendEmail", () => {
  beforeEach(async () => {
    initAuthManager();
  });

  describe("sendEmail()", () => {
    test("executes", () => {
      expect(sendEmail(mockPayload)).toBeTruthy();
    });
  });
});
