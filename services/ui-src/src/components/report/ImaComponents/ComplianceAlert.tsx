import { Alert } from "components/alerts/Alert";
import { ComplianceAlertTemplate, ElementType } from "types";
import { useStore } from "utils";
import { currentPageSelector } from "utils/state/selectors";
import { PageElementProps } from "../Elements";

export const ComplianceAlert = (
  props: PageElementProps<ComplianceAlertTemplate>
) => {
  const { element } = props;
  const currentPage = useStore(currentPageSelector);

  const table = currentPage?.elements?.find(
    (pageElement) => pageElement.id === element.controllerElementId
  );

  if (!table || table.type !== ElementType.ImaTable) return <></>;

  const nonCompliantColumnIds = new Set(
    table.columns
      .filter((column) => column.nonCompliant)
      .map((column) => column.id)
  );
  const rows = table.answer ?? table.rows;
  const isNonCompliant = rows.some(
    (row) => row.answer && nonCompliantColumnIds.has(row.answer)
  );

  if (!isNonCompliant) return <></>;

  return (
    <Alert status={element.status} title={element.title}>
      {element.text}
    </Alert>
  );
};
