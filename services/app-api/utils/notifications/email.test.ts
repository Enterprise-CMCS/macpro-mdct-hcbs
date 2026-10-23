import { beforeEach, describe, expect, it, vi } from "vitest";
import { sendEmail } from "./email";
import { validReport } from "../tests/mockReport";
import { sendSesEmail } from "../../libs/ses-lib";
import { queryRecipientsByState } from "../../storage/notificationRecipients";
import { ElementType, ReportStatus } from "../../types/reports";
import { JSDOM } from "jsdom";

vi.mock("../../libs/ses-lib");
vi.mock("../../storage/notificationRecipients");

describe("sendEmail", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(queryRecipientsByState).mockResolvedValue([]);
  });

  it.each([ReportStatus.SUBMITTED, ReportStatus.IN_PROGRESS])(
    "should send %s content to the correct visible recipients",
    async (status) => {
      const report = structuredClone(validReport);
      report.status = status;
      report.name = "<b>Report</b> & Name";
      report.submittedByEmail = "submitter@example.com";
      report.submitted = Date.UTC(2026, 9, 21);
      const contact = report.pages
        .find((page) => page.id === "general-info")
        ?.elements?.find((element) => element.id === "contact-email");
      if (contact?.type !== ElementType.Textbox) {
        throw new Error("Expected contact email textbox");
      }
      contact.answer = "contact@example.com";
      vi.mocked(queryRecipientsByState).mockResolvedValue([
        {
          state: report.state,
          id: "cms",
          email: "cms@example.com",
        },
        {
          state: report.state,
          id: "duplicate",
          email: "submitter@example.com",
        },
      ]);

      await sendEmail(report);

      const submitted = status === ReportStatus.SUBMITTED;
      if (submitted) {
        expect(queryRecipientsByState).toHaveBeenCalledExactlyOnceWith(
          report.state
        );
      } else {
        expect(queryRecipientsByState).not.toHaveBeenCalled();
      }
      const email = vi.mocked(sendSesEmail).mock.calls[0][0];
      expect(email.Destination).toEqual({
        ToAddresses: submitted
          ? ["contact@example.com", "submitter@example.com", "cms@example.com"]
          : ["contact@example.com"],
      });
      expect(email.Message?.Subject?.Data).toBe(
        `HCBS - ${report.type}: ${report.name} ${
          submitted ? "has been Submitted" : "status changed to In Revision"
        }`
      );
      expect(email.Message?.Body?.Html?.Data).toBeDefined();
      const dom = new JSDOM(email.Message?.Body?.Html?.Data);
      const document = dom.window.document;
      expect(document.querySelector("b")).toBeNull();
      expect(document.querySelectorAll("ul > li")).toHaveLength(4);
      expect(document.querySelectorAll("ul > li")[1].textContent).toBe(
        `Report name: ${report.name}`
      );
      expect(document.querySelectorAll("ol > li")).toHaveLength(4);
      expect(document.querySelectorAll("ol > li")[3].textContent).toBe(
        `Select the report to ${submitted ? "begin your review" : "begin making your revisions"}.`
      );
      expect(document.querySelector("ol a")?.getAttribute("href")).toBe(
        "https://mdcthcbs.cms.gov/"
      );
      expect(
        document.querySelector('a[href^="mailto:"]')?.getAttribute("href")
      ).toBe("mailto:mdct_help@cms.hhs.gov");
      if (submitted) {
        expect(document.body.textContent).toContain("2026-10-21T00:00:00.000Z");
      }
      dom.window.close();
    }
  );

  it("should send to the submitter when the report contact is missing", async () => {
    await sendEmail({
      ...validReport,
      status: ReportStatus.SUBMITTED,
      submittedByEmail: "submitter@example.com",
    });
    expect(sendSesEmail).toHaveBeenCalledWith(
      expect.objectContaining({
        Destination: { ToAddresses: ["submitter@example.com"] },
      })
    );
  });

  it("should propagate lookup failures to the handler without sending", async () => {
    vi.mocked(queryRecipientsByState).mockRejectedValueOnce(
      new Error("Dynamo unavailable")
    );
    await expect(
      sendEmail({ ...validReport, status: ReportStatus.SUBMITTED })
    ).rejects.toThrow("Dynamo unavailable");
    expect(sendSesEmail).not.toHaveBeenCalled();
  });

  it("should not issue a send email command when no email in report", async () => {
    await sendEmail(validReport);
    expect(sendSesEmail).not.toHaveBeenCalled();
  });

  it("should issue a send email command when email in report", async () => {
    // any type so it doesn't complain about accessing .answer on generic PageElement
    const reportWithEmail: any = structuredClone(validReport);
    reportWithEmail.pages[1].elements[2].answer = "test@email.com";
    await sendEmail(reportWithEmail);
    expect(sendSesEmail).toHaveBeenCalledTimes(1);
  });
});
