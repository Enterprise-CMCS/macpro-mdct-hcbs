import {
  ElementType,
  Report,
  ReportStatus,
  TextboxTemplate,
} from "../../types/reports";
import { sendSesEmail } from "../../libs/ses-lib";
import { logger } from "../../libs/debug-lib";
import { scanNotificationAssignments } from "../../storage/notificationAssignments";
import { string } from "yup";
import { inRevisionTemplate, submittedTemplate } from "./emailTemplates";

const FROM_ADDRESS = "MDCT_NoReply@cms.hhs.gov";
const recipientEmailSchema = string().email().required();

const getContactEmail = (report: Report): string | undefined => {
  return report.pages
    .find((page) => page.id === "general-info")
    ?.elements?.find(
      (element): element is TextboxTemplate =>
        element.type === ElementType.Textbox && element.id === "contact-email"
    )?.answer;
};

const getSubmittedRecipients = async (report: Report) => {
  const cmsRecipients = (await scanNotificationAssignments()).filter(
    (assignment) =>
      assignment.states.includes(report.state) &&
      assignment.reports.includes(report.type)
  );
  if (cmsRecipients.length === 0) {
    logger.warn("sendEmail: no CMS recipients assigned to state and report", {
      state: report.state,
      reportType: report.type,
    });
  }
  return [
    getContactEmail(report),
    report.submittedByEmail,
    ...cmsRecipients.map((recipient) => recipient.email),
  ];
};

const getInRevisionRecipients = (report: Report) => [getContactEmail(report)];

export const sendEmail = async (report: Report) => {
  const { recipients, message } =
    report.status === ReportStatus.SUBMITTED
      ? {
          recipients: await getSubmittedRecipients(report),
          message: submittedTemplate(report),
        }
      : {
          recipients: getInRevisionRecipients(report),
          message: inRevisionTemplate(report),
        };
  const addresses = recipients.filter(
    (email): email is string => typeof email === "string" && email !== ""
  );
  const validRecipients = [...new Set(addresses)].filter((email) => {
    if (!recipientEmailSchema.isValidSync(email)) {
      logger.warn("sendEmail: excluding invalid recipient email", {
        id: report.id,
        email,
      });
      return false;
    }
    return true;
  });
  if (validRecipients.length === 0) {
    logger.warn("sendEmail: no recipients found for report", {
      id: report.id,
      status: report.status,
    });
    return;
  }
  logger.info("Sending email to: ", validRecipients);
  await sendSesEmail({
    Source: FROM_ADDRESS,
    Destination: {
      ToAddresses: validRecipients,
    },
    Message: message,
  });
};
