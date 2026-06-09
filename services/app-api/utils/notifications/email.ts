import { Report, ReportStatus } from "../../types/reports";
import { sesLib } from "../../libs/ses-lib";
import { logger } from "../../libs/debug-lib";
import { isLocalStack } from "../../libs/localstack";

const FROM_ADDRESS = "MDCT_NoReply@cms.hhs.gov";

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

const getRecipients = (report: Report): string[] => {
  const generalInfoPage = report.pages.find(
    (page) => "id" in page && page.id === "general-info"
  );
  if (!generalInfoPage || !("elements" in generalInfoPage)) return [];

  const contactEmailElement = generalInfoPage.elements?.find(
    (element) => "id" in element && element.id === "contact-email"
  );
  if (
    !contactEmailElement ||
    !("answer" in contactEmailElement) ||
    !contactEmailElement.answer
  ) {
    return [];
  }
  return [contactEmailElement.answer as string];
};

export const sendEmail = async (report: Report) => {
  const { name, status } = report;
  const recipients = getRecipients(report);
  if (recipients.length === 0) return;
  const emailTemplate = getTemplate(name, status, recipients);
  logger.info(
    "Sending email to: ",
    recipients,
    "with content: ",
    emailTemplate
  );
  if (!isLocalStack()) {
    await sesLib(emailTemplate);
  } else {
    logger.info("Skipping email in dev env");
  }
};
