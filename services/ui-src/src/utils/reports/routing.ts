import { useLocation } from "react-router-dom";
import { ReportRoute, ReportType } from "types";

/**
 * WARNING: You probably want ReportContext.isReportPage instead.
 * This function is called from outside the ReportContext,
 * so it can only make a best guess.
 */
export const isApparentReportPage = (pathname: string): boolean => {
  const yes = Object.values(ReportType).some((reportType) => {
    const prefix = `/${reportType.toLowerCase()}/`;
    /*
     * Report pages look like "/wp/some-path", or "/sar/some-other-path"
     * Two exceptions are the Get Started page, and the root (Dashboard) page for that report type.
     */
    return (
      pathname.startsWith(prefix) &&
      !pathname.startsWith(`/${prefix}/get-started`) &&
      pathname.length > prefix.length
    );
  });
  return yes;
};
