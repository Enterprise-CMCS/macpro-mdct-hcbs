import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { sendEmail } from "./email";
import { validReport } from "../tests/mockReport";
import { sendSesEmail } from "../../libs/ses-lib";
import { scanNotificationAssignments } from "../../storage/notificationAssignments";
import { ElementType, ReportStatus, ReportType } from "../../types/reports";
import { JSDOM } from "jsdom";

vi.mock("../../libs/ses-lib");
vi.mock("../../storage/notificationAssignments");

describe("sendEmail", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(scanNotificationAssignments).mockResolvedValue([]);
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-10-26T16:32:46.480Z"));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("should send Submitted content to the contact, submitter, and assigned CMS recipients", async () => {
    const report = structuredClone(validReport);
    report.status = ReportStatus.SUBMITTED;
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
    vi.mocked(scanNotificationAssignments).mockResolvedValue([
      {
        states: [report.state],
        reports: [report.type],
        email: "cms@example.com",
      },
      {
        states: [report.state],
        reports: [report.type],
        email: "submitter@example.com",
      },
      {
        states: ["CA"],
        reports: [report.type],
        email: "other-state@example.com",
      },
      {
        states: [report.state],
        reports: [ReportType.HA],
        email: "other-report@example.com",
      },
    ]);

    await sendEmail(report);

    expect(scanNotificationAssignments).toHaveBeenCalledTimes(1);
    expect(sendSesEmail).toHaveBeenCalledTimes(1);
    const email = vi.mocked(sendSesEmail).mock.calls[0][0];
    expect(email.Destination).toEqual({
      ToAddresses: [
        "contact@example.com",
        "submitter@example.com",
        "cms@example.com",
      ],
    });
    expect(email.Message?.Subject?.Data).toBe(
      `HCBS - ${report.type}: ${report.name} has been Submitted`
    );
    expect(email.Message?.Body?.Html?.Data).toBeDefined();
    const dom = new JSDOM(email.Message?.Body?.Html?.Data);
    const document = dom.window.document;
    expect(document.querySelector("b")).toBeNull();
    expect(document.querySelectorAll("ul > li")).toHaveLength(4);
    expect(document.querySelectorAll("ul > li")[1].textContent).toBe(
      `Report name: ${report.name}`
    );
    expect(document.querySelectorAll("ul > li")[2].textContent).toBe(
      "New status: Submitted"
    );
    expect(document.querySelectorAll("ol > li")).toHaveLength(4);
    expect(document.querySelectorAll("ol > li")[3].textContent).toBe(
      "Select the report to begin your review."
    );
    expect(document.querySelector("ol a")?.getAttribute("href")).toBe(
      "https://mdcthcbs.cms.gov/"
    );
    expect(
      document.querySelector('a[href^="mailto:"]')?.getAttribute("href")
    ).toBe("mailto:mdct_help@cms.hhs.gov");
    expect(document.querySelectorAll("ul > li")[3].textContent).toBe(
      "Date of change: 10/20/2026, 8:00pm ET"
    );
    dom.window.close();
  });

  it("should send In Revision content only to the report contact", async () => {
    const report = structuredClone(validReport);
    report.status = ReportStatus.IN_PROGRESS;
    report.name = "<b>Report</b> & Name";
    report.submittedByEmail = "submitter@example.com";
    const contact = report.pages
      .find((page) => page.id === "general-info")
      ?.elements?.find((element) => element.id === "contact-email");
    if (contact?.type !== ElementType.Textbox) {
      throw new Error("Expected contact email textbox");
    }
    contact.answer = "contact@example.com";
    vi.mocked(scanNotificationAssignments).mockResolvedValue([
      {
        states: [report.state],
        reports: [report.type],
        email: "cms@example.com",
      },
    ]);

    await sendEmail(report);

    expect(scanNotificationAssignments).not.toHaveBeenCalled();
    expect(sendSesEmail).toHaveBeenCalledTimes(1);
    const email = vi.mocked(sendSesEmail).mock.calls[0][0];
    expect(email.Destination).toEqual({
      ToAddresses: ["contact@example.com"],
    });
    expect(email.Message?.Subject?.Data).toBe(
      `HCBS - ${report.type}: ${report.name} status changed to In Revision`
    );
    expect(email.Message?.Body?.Html?.Data).toBeDefined();
    const dom = new JSDOM(email.Message?.Body?.Html?.Data);
    const document = dom.window.document;
    expect(document.querySelector("b")).toBeNull();
    expect(document.querySelectorAll("ul > li")).toHaveLength(4);
    expect(document.querySelectorAll("ul > li")[1].textContent).toBe(
      `Report name: ${report.name}`
    );
    expect(document.querySelectorAll("ul > li")[2].textContent).toBe(
      "New status: In Revision"
    );
    expect(document.querySelectorAll("ul > li")[3].textContent).toBe(
      "Date of change: 10/26/2026, 12:32pm ET"
    );
    expect(document.querySelectorAll("ol > li")).toHaveLength(4);
    expect(document.querySelectorAll("ol > li")[3].textContent).toBe(
      "Select the report to begin making your revisions."
    );
    expect(document.querySelector("ol a")?.getAttribute("href")).toBe(
      "https://mdcthcbs.cms.gov/"
    );
    expect(
      document.querySelector('a[href^="mailto:"]')?.getAttribute("href")
    ).toBe("mailto:mdct_help@cms.hhs.gov");
    dom.window.close();
  });

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
    vi.mocked(scanNotificationAssignments).mockRejectedValueOnce(
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

  it("should exclude malformed addresses without blocking valid recipients", async () => {
    const report = structuredClone(validReport);
    report.status = ReportStatus.SUBMITTED;
    report.submittedByEmail = "submitter@example.com";
    const contact = report.pages
      .find((page) => page.id === "general-info")
      ?.elements?.find((element) => element.id === "contact-email");
    if (contact?.type !== ElementType.Textbox) {
      throw new Error("Expected contact email textbox");
    }
    contact.answer = "invalid-contact";
    vi.mocked(scanNotificationAssignments).mockResolvedValue([
      { email: "invalid-cms", states: [report.state], reports: [report.type] },
      {
        email: "cms@example.com",
        states: [report.state],
        reports: [report.type],
      },
    ]);

    await sendEmail(report);

    expect(sendSesEmail).toHaveBeenCalledExactlyOnceWith(
      expect.objectContaining({
        Destination: {
          ToAddresses: ["submitter@example.com", "cms@example.com"],
        },
      })
    );
  });

  it("should not send when every recipient address is malformed", async () => {
    await sendEmail({
      ...validReport,
      status: ReportStatus.SUBMITTED,
      submittedByEmail: "invalid-submitter",
    });
    expect(sendSesEmail).not.toHaveBeenCalled();
  });

  it("should exclude a null contact from recipients", async () => {
    const report = structuredClone(validReport);
    report.status = ReportStatus.SUBMITTED;
    const contact = report.pages
      .find((page) => page.id === "general-info")
      ?.elements?.find((element) => element.id === "contact-email");
    if (contact?.type !== ElementType.Textbox) {
      throw new Error("Expected contact email textbox");
    }
    // Stored answers can be null although the template type omits null.
    Object.assign(contact, { answer: null });

    await sendEmail(report);
    expect(sendSesEmail).not.toHaveBeenCalled();

    report.submittedByEmail = "submitter@example.com";
    await sendEmail(report);
    expect(sendSesEmail).toHaveBeenCalledExactlyOnceWith(
      expect.objectContaining({
        Destination: { ToAddresses: ["submitter@example.com"] },
      })
    );
  });

  it("should issue a send email command when email in report", async () => {
    // any type so it doesn't complain about accessing .answer on generic PageElement
    const reportWithEmail: any = structuredClone(validReport);
    reportWithEmail.pages[1].elements[2].answer = "test@email.com";
    await sendEmail(reportWithEmail);
    expect(sendSesEmail).toHaveBeenCalledTimes(1);
  });
});
