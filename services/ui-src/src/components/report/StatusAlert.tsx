import { useNavigate, useParams } from "react-router-dom";
import { measurePrevPage, useStore } from "utils";
import { Alert } from "components/alerts/Alert";
import { PageElementProps } from "./Elements";
import { ButtonLinkTemplate, PageStatus, StatusAlertTemplate } from "types";
import { submittableMetricsSelector } from "utils/state/selectors";
import { inferredReportStatus } from "utils/state/reportLogic/completeness";
import { Link } from "@chakra-ui/react";
import { ReactNode } from "react";

export const StatusAlert = (props: PageElementProps<StatusAlertTemplate>) => {
  const navigate = useNavigate();
  const { report, currentPageId } = useStore();
  const { reportType, state, reportId, pageId } = useParams();
  const alert = props.element;
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
  const pageTo = returnElement?.to ?? measurePrevPage(report, pageId!);

  const nav = () =>
    navigate(`/report/${reportType}/${state}/${reportId}/${pageTo}`);

  let children: ReactNode = alert.text;
  if (alert.text.includes("{ReturnButton}")) {
    const link = <Link onClick={() => nav()}>Click here</Link>;
    const textElements = alert.text.split("{ReturnButton}");
    children = (
      <>
        {textElements[0]} {link} {textElements[1]}
      </>
    );
  }

  return (
    <Alert
      status={alert.status}
      title={alert.title}
      // oxlint-disable-next-line no-children-prop
      children={children}
    ></Alert>
  );
};
