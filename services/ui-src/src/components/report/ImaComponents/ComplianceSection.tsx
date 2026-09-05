import { PageElement, ComplianceSectionTemplate } from "types";
import { useStore } from "utils";
import { sectionIsShown } from "utils/state/reportLogic/completeness";
import { currentPageSelector } from "utils/state/selectors";
import { Page } from "../Page";

interface Props {
  element: ComplianceSectionTemplate;
  updateElement: (updated: Partial<ComplianceSectionTemplate>) => void;
}

export const ComplianceSection = ({ element, updateElement }: Props) => {
  const currentPage = useStore(currentPageSelector);

  if (!sectionIsShown(element.showCondition, currentPage?.elements ?? [])) {
    return null;
  }

  return (
    <Page
      id={`${element.id}-children`}
      elements={element.elements}
      setElements={(elements: PageElement[]) => updateElement({ elements })}
    />
  );
};
