import { sendEmail } from "./email";
import sesLib from "../../libs/ses-lib";
import { validReport } from "../tests/mockReport";

jest.mock("../../libs/ses-lib", () => ({
  __esModule: true,
  default: {
    sendSesEmail: jest.fn(),
  },
}));

describe("sendEmail", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("should not issue a send email command when no email in report", async () => {
    await sendEmail(validReport);
    expect(sesLib.sendSesEmail).not.toHaveBeenCalled();
  });

  test("should issue a send email command when email in report", async () => {
    // any type so it doesn't complain about accessing .answer on generic PageElement
    const reportWithEmail: any = structuredClone(validReport);
    reportWithEmail.pages[1].elements[2].answer = "test@email.com";
    await sendEmail(reportWithEmail);
    expect(sesLib.sendSesEmail).toHaveBeenCalledTimes(1);
  });
});
