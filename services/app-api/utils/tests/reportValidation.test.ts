import { qmReportTemplate } from "../../forms/qm";
import { validateUpdateReportPayload } from "../reportValidation";
import { Report, ReportStatus } from "../../types/reports";

const validReport: Report = {
  ...qmReportTemplate,
  state: "NJ",
  id: "2rRaoAFm8yLB2N2wSkTJ0iRTDu0",
  created: 1736524513631,
  lastEdited: 1736524513631,
  lastEditedBy: "Anthony Soprano",
  lastEditedByEmail: "stateuser2@test.com",
  status: ReportStatus.NOT_STARTED,
  name: "yeehaw",
};

const invalidReport = {
  ...qmReportTemplate,
  // missing state
  id: "2rRaoAFm8yLB2N2wSkTJ0iRTDu0",
  created: 1736524513631,
  lastEdited: 1736524513631,
  lastEditedBy: "Anthony Soprano",
  lastEditedByEmail: "stateuser2@test.com",
  status: ReportStatus.NOT_STARTED,
  name: "yeehaw",
};

describe("Test validateUpdateReportPayload function", () => {
  it("successfully validates a valid report object", async () => {
    const validatedData = await validateUpdateReportPayload(validReport);
    expect(validatedData).toEqual(validReport);
  });
  it("throws an error when validating an invalid report", () => {
    expect(async () => {
      await validateUpdateReportPayload(invalidReport);
    }).rejects.toThrow();
  });
});
