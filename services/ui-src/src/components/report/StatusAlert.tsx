import { useStore } from "utils";
import { Alert } from "components/alerts/Alert";
import { PageElementProps } from "./Elements";
import { PageStatus, StatusAlertTemplate } from "types";
import { submittableMetricsSelector } from "utils/state/selectors";
import { inferredReportStatus } from "utils/state/reportLogic/completeness";

export const StatusAlert = (props: PageElementProps) => {
  const alert = props.element as StatusAlertTemplate;
  const { report, currentPageId } = useStore();
  const submittableMetrics = useStore(submittableMetricsSelector);

  if (!report || !currentPageId) return <></>;

  const isReviewPage = currentPageId === "review-submit";
  if (isReviewPage && submittableMetrics?.submittable) {
    return <></>;
  } else if (
    inferredReportStatus(report, currentPageId) !== PageStatus.COMPLETE
  ) {
    return <></>;
  }

  return (
    <Alert
      status={alert.status}
      title={alert.title}
      children={alert.text}
    ></Alert>
  );
};
