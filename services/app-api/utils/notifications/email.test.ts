import { beforeEach, describe, expect, it, vi } from "vitest";
import { sendEmail } from "./email";
import { validReport } from "../tests/mockReport";
import { sendSesEmail } from "../../libs/ses-lib";
import { scanNotificationAssignments } from "../../storage/notificationAssignments";
import { logger } from "../../libs/debug-lib";
import {
  ElementType,
  PageType,
  Report,
  ReportStatus,
  ReportType,
} from "../../types/reports";

vi.mock("../../libs/ses-lib");
vi.mock("../../storage/notificationAssignments");
vi.mock("../../libs/debug-lib");

const withContactEmail = (email: string): Report => ({
  ...validReport,
  pages: [
    {
      id: "general-info",
      type: PageType.Standard,
      navTitle: "General information",
      elements: [
        {
          id: "contact-email",
          type: ElementType.Textbox,
          label: "Contact email",
          required: true,
          answer: email,
        },
      ],
    },
  ],
});

describe("sendEmail", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(scanNotificationAssignments).mockResolvedValue([]);
  });

  it("does not send when there is no contact or matching assignment", async () => {
    await sendEmail(validReport);
    expect(sendSesEmail).not.toHaveBeenCalled();
  });

  it("should issue a send email command when email in report", async () => {
    await sendEmail(withContactEmail("test@email.com"));
    expect(sendSesEmail).toHaveBeenCalledTimes(1);
    expect(sendSesEmail).toHaveBeenCalledWith(
      expect.objectContaining({
        Destination: { ToAddresses: ["test@email.com"] },
      })
    );
  });

  it.each([ReportStatus.SUBMITTED, ReportStatus.IN_PROGRESS])(
    "notifies only assignments matching both state and report for status %s",
    async (status) => {
      vi.mocked(scanNotificationAssignments).mockResolvedValue([
        {
          email: "matching@example.com",
          states: ["AL", validReport.state],
          reports: [ReportType.HA, validReport.type],
        },
        {
          email: "wrong-state@example.com",
          states: ["AL"],
          reports: [validReport.type],
        },
        {
          email: "wrong-report@example.com",
          states: [validReport.state],
          reports: [ReportType.HA],
        },
      ]);

      await sendEmail({ ...validReport, status });

      expect(sendSesEmail).toHaveBeenCalledTimes(1);
      expect(sendSesEmail).toHaveBeenCalledWith(
        expect.objectContaining({
          Destination: { ToAddresses: ["matching@example.com"] },
          Message: expect.objectContaining({
            Body: {
              Text: { Data: expect.stringContaining(`New Status: ${status}`) },
            },
          }),
        })
      );
    }
  );

  it("sends separately to the contact and subscribers without duplicate addresses", async () => {
    vi.mocked(scanNotificationAssignments).mockResolvedValue([
      {
        email: "contact@example.com",
        states: [validReport.state],
        reports: [validReport.type],
      },
      {
        email: "subscriber@example.com",
        states: [validReport.state],
        reports: [validReport.type],
      },
    ]);

    await sendEmail(withContactEmail(" Contact@Example.com "));

    expect(sendSesEmail).toHaveBeenCalledTimes(2);
    expect(
      vi.mocked(sendSesEmail).mock.calls.map(([email]) => email.Destination)
    ).toEqual([
      { ToAddresses: ["contact@example.com"] },
      { ToAddresses: ["subscriber@example.com"] },
    ]);
  });

  it("uses updated assignments on the next status notification", async () => {
    vi.mocked(scanNotificationAssignments).mockResolvedValueOnce([
      {
        email: "subscriber@example.com",
        states: [validReport.state],
        reports: [validReport.type],
      },
    ]);
    await sendEmail(validReport);
    await sendEmail(validReport);
    expect(scanNotificationAssignments).toHaveBeenCalledTimes(2);
    expect(sendSesEmail).toHaveBeenCalledTimes(1);
  });

  it("propagates assignment lookup failures to the status handler", async () => {
    const error = new Error("Assignment lookup failed");
    vi.mocked(scanNotificationAssignments).mockRejectedValueOnce(error);
    await expect(sendEmail(validReport)).rejects.toThrow(error);
    expect(sendSesEmail).not.toHaveBeenCalled();
  });

  it.each([ReportStatus.SUBMITTED, ReportStatus.IN_PROGRESS])(
    "still sends to the contact when subscriber lookup fails for status %s",
    async (status) => {
      const error = new Error("Assignment lookup failed");
      vi.mocked(scanNotificationAssignments).mockRejectedValueOnce(error);

      await expect(
        sendEmail({
          ...withContactEmail(" Contact@Example.com "),
          status,
        })
      ).rejects.toThrow(error);

      expect(sendSesEmail).toHaveBeenCalledExactlyOnceWith(
        expect.objectContaining({
          Destination: { ToAddresses: ["contact@example.com"] },
        })
      );
      expect(logger.error).toHaveBeenCalledWith(
        "Unable to load notification subscribers",
        { id: validReport.id, status, error }
      );
    }
  );

  it("propagates email delivery failures to the status handler", async () => {
    const error = new Error("Email delivery failed");
    vi.mocked(sendSesEmail).mockRejectedValueOnce(error);
    await expect(
      sendEmail(withContactEmail("contact@example.com"))
    ).rejects.toThrow(error);
  });
});
