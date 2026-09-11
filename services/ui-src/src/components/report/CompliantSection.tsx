import { useState } from "react";
import { CompliantSectionTemplate } from "types";
import {
  getReportElements,
  tableIsNonCompliant,
} from "utils/state/reportLogic/completeness";
import { useStore } from "utils";
import { Page } from "./Page";

interface CompliantSectionProps {
  element: CompliantSectionTemplate;
  updateElement: (updatedElement: Partial<CompliantSectionTemplate>) => void;
}

export const CompliantSection = ({
  element,
  updateElement,
}: CompliantSectionProps) => {
  const report = useStore((state) => state.report);
  const [elements, setElements] = useState(element.elements);
  const reportElements = getReportElements(report);
  const isVisible = element.controllerElementIds.some((controllerElementId) =>
    tableIsNonCompliant(controllerElementId, reportElements)
  );

  if (!isVisible) return null;

  return (
    <Page
      id={element.id}
      elements={elements}
      setElements={(updatedElements) => {
        setElements(updatedElements);
        updateElement({ elements: updatedElements });
      }}
    />
  );
};
