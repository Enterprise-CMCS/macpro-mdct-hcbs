import { useNavigate, useParams } from "react-router-dom";
import { measurePrevPage, useStore } from "utils";
import { Alert } from "components/alerts/Alert";
import { PageElementProps } from "./Elements";
import { ButtonLinkTemplate, PageStatus, StatusAlertTemplate } from "types";
import { submittableMetricsSelector } from "utils/state/selectors";
import { inferredReportStatus } from "utils/state/reportLogic/completeness";
import { Link } from "@chakra-ui/react";

export const StatusAlert = (props: PageElementProps) => {
  const navigate = useNavigate();
  const { report, currentPageId } = useStore();
  const { reportType, state, reportId, pageId } = useParams();
  const alert = props.element as StatusAlertTemplate;
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

  const page = report.pages.find((page) => page.id === pageId);
  const returnElement = page?.elements?.find(
    (element) => element.id === "return-button"
  ) as ButtonLinkTemplate;
  const pageTo = returnElement?.to
    ? returnElement.to
    : measurePrevPage(report, pageId!);
  const textElements = alert.text.split("<a>Click here</a>");

  const nav = () =>
    navigate(`/report/${reportType}/${state}/${reportId}/${pageTo}`);

  const link = <Link onClick={() => nav()}>Click here</Link>;

  return (
    <Alert
      status={alert.status}
      title={alert.title}
      children={[textElements[0], link, textElements[1]]}
    ></Alert>
  );
};
