import { Report } from "../../types/reports";

/**
 * Format the date as `M/d/yyyy, h:mma 'ET'`
 * @example formatDate(1793032366480) //=> 10/26/2026, 12:32pm ET
 * @param date Milliseconds since epoch. Default is `Date.now()`
 */
export const formatDate = (date: number | undefined) => {
  const options: Intl.DateTimeFormatOptions = {
    timeZone: "America/New_York",
    day: "numeric",
    month: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  };
  const parts = new Intl.DateTimeFormat("en-US", options).formatToParts(date);
  let [M, d, yyyy, h, mm, a] = [
    "month",
    "day",
    "year",
    "hour",
    "minute",
    "dayPeriod",
  ].map((type) => parts.find((part) => part.type === type)!.value);
  a = a.toLocaleLowerCase();
  return `${M}/${d}/${yyyy}, ${h}:${mm}${a} ET`;
};

const escapeHtml = (value: string) =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");

export const submittedTemplate = (report: Report) => {
  const name = escapeHtml(report.name);
  return {
    Subject: {
      Data: `HCBS - ${report.type}: ${report.name} has been Submitted`,
    },
    Body: {
      Html: {
        Data: `<p>This is an automated notification that the status of a report has changed within the MDCT Home and Community-Based Services (HCBS) platform. The report has been submitted by the State and is now ready for CMS review.</p>
<p>Update summary</p>
<ul>
  <li>Report: ${report.type}</li>
  <li>Report name: ${name}</li>
  <li>New status: Submitted</li>
  <li>Date of change: ${formatDate(report.submitted)}</li>
</ul>
<p>Please follow the steps below to access the submission within the portal:</p>
<ol>
  <li>Log in to the <a href="https://mdcthcbs.cms.gov/">MDCT Portal</a>.</li>
  <li>Select ${report.type}.</li>
  <li>Find ${name}.</li>
  <li>Select the report to begin your review.</li>
</ol>
<p>If you believe this status change was made in error or have questions, please reach out to the HCBS support desk at <a href="mailto:mdct_help@cms.hhs.gov">mdct_help@cms.hhs.gov</a>.</p>
<p>Sincerely,</p>
<p>The HCBS Team</p>`,
      },
    },
  };
};

export const inRevisionTemplate = (report: Report) => {
  const name = escapeHtml(report.name);
  return {
    Subject: {
      Data: `HCBS - ${report.type}: ${report.name} status changed to In Revision`,
    },
    Body: {
      Html: {
        Data: `<p>This is an automated notification that the status of a report has changed within the MDCT Home and Community-Based Services (HCBS) platform. You now have permission to edit and resubmit this report.</p>
<p>Update summary</p>
<ul>
  <li>Report: ${report.type}</li>
  <li>Report name: ${name}</li>
  <li>New status: In Revision</li>
  <li>Date of change: ${formatDate(undefined)}</li>
</ul>
<p>Please follow the steps below to access the report within the portal:</p>
<ol>
  <li>Log in to the <a href="https://mdcthcbs.cms.gov/">MDCT Portal</a>.</li>
  <li>Select ${report.type}.</li>
  <li>Find ${name}.</li>
  <li>Select the report to begin making your revisions.</li>
</ol>
<p>If you believe this status change was made in error, or if you have questions regarding the requirements for this new status, please reach out to the HCBS support desk at <a href="mailto:mdct_help@cms.hhs.gov">mdct_help@cms.hhs.gov</a>.</p>
<p>Sincerely,</p>
<p>The HCBS Team</p>`,
      },
    },
  };
};
