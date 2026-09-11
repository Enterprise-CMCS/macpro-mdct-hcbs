import { Alert } from "components/alerts/Alert";
import { ComplianceAlertTemplate, ElementType, ImaTableTemplate } from "types";
import { useStore } from "utils";
import { currentPageSelector } from "utils/state/selectors";
import { PageElementProps } from "../Elements";

export const ComplianceAlert = (
  props: PageElementProps<ComplianceAlertTemplate>
) => {
  const { element } = props;
  const currentPage = useStore(currentPageSelector);

  const tables = currentPage?.elements?.filter(
    (pageElement): pageElement is ImaTableTemplate =>
      element.controllerElementId.includes(pageElement.id) &&
      pageElement.type === ElementType.ImaTable
  );

  const isNonCompliant = tables?.some((table) => {
    const nonCompliantColumnIds = new Set(
      table.columns
        .filter((column) => column.nonCompliant)
        .map((column) => column.id)
    );
    const rows = table.answer ?? table.rows;

    return rows.some(
      (row) => row.answer && nonCompliantColumnIds.has(row.answer)
    );
  });

  if (!isNonCompliant) return <></>;

  return (
    <Alert status={element.status} title={element.title}>
      {element.text}
    </Alert>
  );
};
