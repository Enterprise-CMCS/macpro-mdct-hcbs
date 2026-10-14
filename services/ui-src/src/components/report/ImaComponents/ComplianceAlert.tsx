import { Alert } from "components/alerts/Alert";
import { ComplianceAlertTemplate } from "types";
import { useElementIsHidden } from "utils/state/hooks/useElementIsHidden";
import { PageElementProps } from "../Elements";

export const ComplianceAlert = (
  props: PageElementProps<ComplianceAlertTemplate>
) => {
  const { element } = props;
  const hideElement = useElementIsHidden(
    undefined,
    element.controllerElementId
  );

  if (hideElement) return null;

  return (
    <Alert status={element.status} title={element.title}>
      {element.text}
    </Alert>
  );
};
