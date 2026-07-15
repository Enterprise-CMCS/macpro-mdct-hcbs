import { sendEmail } from "./email";
import { validReport } from "../tests/mockReport";
import { sendSesEmail } from "../../libs/ses-lib";

jest.mock("../../libs/ses-lib");

describe("sendEmail", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("should not issue a send email command when no email in report", async () => {
    await sendEmail(validReport);
    expect(sendSesEmail).not.toHaveBeenCalled();
  });

  test("should issue a send email command when email in report", async () => {
    // any type so it doesn't complain about accessing .answer on generic PageElement
    const reportWithEmail: any = structuredClone(validReport);
    reportWithEmail.pages[1].elements[2].answer = "test@email.com";
    await sendEmail(reportWithEmail);
    expect(sendSesEmail).toHaveBeenCalledTimes(1);
  });
});
