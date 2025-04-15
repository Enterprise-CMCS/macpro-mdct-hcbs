import { useStore } from "utils";
import { Alert } from "components/alerts/Alert";
import { PageElementProps } from "./Elements";
import { PageStatus, StatusAlertTemplate } from "types";
import { inferredReportStatus } from "utils/state/reportLogic/completeness";

export const StatusAlert = (props: PageElementProps) => {
  const alert = props.element as StatusAlertTemplate;
  const { report, currentPageId } = useStore();

  if (report && currentPageId) {
    switch (currentPageId) {
      case "review-submit":
        const childPages = report.pages[0].childPageIds?.slice(0, -1);

        const status = childPages?.every(
          (page) => inferredReportStatus(report, page) === PageStatus.COMPLETE
        );

        if (status) return <></>;
        break;
      default:
        const displayStatus = inferredReportStatus(report, currentPageId);
        if (displayStatus != PageStatus.COMPLETE) {
          return <></>;
        }
        break;
    }
  }

  return (
    <Alert
      status={alert.status}
      title={alert.title}
      children={alert.text}
    ></Alert>
  );
};
