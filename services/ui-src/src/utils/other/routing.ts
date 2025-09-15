import { LiteReport, MeasurePageTemplate, Report } from "types";

export const reportBasePath = (report: Report | LiteReport) => {
  return `/report/${report.type}/${report.state}/${report.id}`;
};

//utilized for finding the previous page in a measure. also, handles the routing when a measure is substituted.
export const measurePrevPage = (report: Report, pageId: string) => {
  const measure = report?.pages.find(
    (measure) => measure.id === pageId
  ) as MeasurePageTemplate;
  return measure?.required ? "req-measure-result" : "optional-measure-result";
};
