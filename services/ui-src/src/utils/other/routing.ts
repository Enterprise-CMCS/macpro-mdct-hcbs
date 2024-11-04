import { Report } from "types";

export const reportBasePath = (report: Report) => {
  return `/report/${report.type}/${report.state}/${report.id}`;
};
