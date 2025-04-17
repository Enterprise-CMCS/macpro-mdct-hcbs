import { useStore } from "utils";
import { Alert } from "components/alerts/Alert";
import { PageElementProps } from "./Elements";
import { StatusAlertTemplate } from "types";
import {
  currentPageCompletableSelector,
  submittableMetricsSelector,
} from "utils/state/selectors";

export const StatusAlert = (props: PageElementProps) => {
  const alert = props.element as StatusAlertTemplate;
  const { report, currentPageId } = useStore();
  const submittableMetrics = useStore(submittableMetricsSelector);
  const currentPageCompletable = useStore(currentPageCompletableSelector);

  if (!report) return <></>;

  const isReviewPage = currentPageId === "review-submit";
  if (isReviewPage && submittableMetrics?.submittable) {
    return <></>;
  } else if (!isReviewPage && currentPageCompletable) {
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
