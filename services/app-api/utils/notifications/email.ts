import { ElementType, Report, ReportStatus } from "../../types/reports";
import { sendSesEmail } from "../../libs/ses-lib";
import { logger } from "../../libs/debug-lib";
import { queryRecipientsByState } from "../../storage/notificationRecipients";

const FROM_ADDRESS = "MDCT_NoReply@cms.hhs.gov";

const escapeHtml = (value: string) =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");

const getTemplate = (report: Report, recipients: string[]) => {
  const submitted = report.status === ReportStatus.SUBMITTED;
  const status = submitted ? "Submitted" : "In Revision";
  const name = escapeHtml(report.name);
  return {
    Source: FROM_ADDRESS,
    Destination: {
      ToAddresses: recipients,
    },
    Message: {
      Subject: {
        Data: `HCBS - ${report.type}: ${report.name} ${
          submitted ? "has been Submitted" : "status changed to In Revision"
        }`,
      },
      Body: {
        Html: {
          Data: `<p>This is an automated notification that the status of a report has changed within the MDCT Home and Community-Based Services (HCBS) platform. ${
            submitted
              ? "The report has been submitted by the State and is now ready for CMS review."
              : "You now have permission to edit and resubmit this report."
          }</p>
<p>Update summary</p>
<ul>
  <li>Report: ${report.type}</li>
  <li>Report name: ${name}</li>
  <li>New status: ${status}</li>
  <li>Date of change: ${new Date(submitted ? (report.submitted ?? Date.now()) : Date.now()).toISOString()}</li>
</ul>
<p>Please follow the steps below to access ${submitted ? "the submission" : "the report"} within the portal:</p>
<ol>
  <li>Log in to the <a href="https://mdcthcbs.cms.gov/">MDCT Portal</a>.</li>
  <li>Select ${report.type}.</li>
  <li>Find ${name}.</li>
  <li>Select the report to ${submitted ? "begin your review" : "begin making your revisions"}.</li>
</ol>
<p>If you believe this status change was made in error${
            submitted
              ? " or have questions"
              : ", or if you have questions regarding the requirements for this new status"
          }, please reach out to the HCBS support desk at <a href="mailto:mdct_help@cms.hhs.gov">mdct_help@cms.hhs.gov</a>.</p>
<p>Sincerely,</p>
<p>The HCBS Team</p>`,
        },
      },
    },
  };
};

const getContactEmail = (report: Report): string | undefined => {
  return report.pages
    .find((page) => page.id === "general-info")
    ?.elements?.filter((element) => element.type === ElementType.Textbox)
    .find((element) => element.id === "contact-email")?.answer;
};

const getRecipients = async (report: Report): Promise<string[]> => {
  const submitted = report.status === ReportStatus.SUBMITTED;
  const cmsRecipients = submitted
    ? await queryRecipientsByState(report.state)
    : [];
  if (submitted && cmsRecipients.length === 0) {
    logger.warn("sendEmail: no CMS recipients assigned to state", report.state);
  }
  const recipients = [
    getContactEmail(report),
    ...(submitted
      ? [
          report.submittedByEmail,
          ...cmsRecipients.map((recipient) => recipient.email),
        ]
      : []),
  ].filter((email): email is string => email !== undefined && email !== "");
  return [...new Set(recipients)];
};

export const sendEmail = async (report: Report) => {
  const recipients = await getRecipients(report);
  if (recipients.length === 0) {
    logger.warn("sendEmail: no recipients found for report", {
      id: report.id,
      status: report.status,
    });
    return;
  }
  const emailTemplate = getTemplate(report, recipients);
  logger.info("Sending email to: ", recipients);
  await sendSesEmail(emailTemplate);
};
