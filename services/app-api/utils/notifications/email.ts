import { ElementType, Report, ReportStatus } from "../../types/reports";
import { sendSesEmail } from "../../libs/ses-lib";
import { logger } from "../../libs/debug-lib";
import { FROM_ADDRESS } from "../constants";

const getTemplate = (
  name: string,
  status: ReportStatus,
  recipients: string[]
) => ({
  Source: FROM_ADDRESS,
  Destination: {
    ToAddresses: recipients,
  },
  Message: {
    Subject: { Data: `MDCT HCBS Status Update for: ${name}` },
    Body: {
      Text: {
        Data: `Dear User,

This is an automated notification to inform you that there has been a change in the status of a report within the Home and Community-Based Services (HCBS) platform on MDCT.

Please find the details of the update below:

Update Summary

    Report Name: ${name}

    New Status: ${status}

    Date of Change: ${new Date().toDateString()}

If you believe this status change was made in error, or if you have questions regarding the requirements for this new status, please contact your system administrator or reach out to the HCBS support desk.
`,
      },
    },
  },
});

const getContactEmail = (report: Report): string | undefined => {
  return report.pages
    .find((page) => page.id === "general-info")
    ?.elements?.filter((element) => element.type === ElementType.Textbox)
    .find((element) => element.id === "contact-email")?.answer;
};

export const sendEmail = async (report: Report) => {
  const { name, status } = report;
  const recipient = getContactEmail(report);
  if (!recipient) {
    logger.warn("sendEmail: no recipient found for report", {
      id: report.id,
      status: report.status,
    });
    return;
  }
  const emailTemplate = getTemplate(name, status, [recipient]);
  logger.info("Sending email to: ", recipient, "with content: ", emailTemplate);
  await sendSesEmail(emailTemplate);
};
