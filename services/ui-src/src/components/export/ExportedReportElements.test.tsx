import { render, screen } from "@testing-library/react";
import { renderElements } from "./ExportedReportElements";
import {
  DataSource,
  ElementType,
  NdrEnhancedTemplate,
  PageStatus,
} from "types";

const section = {
  cmitInfo: {
    cmit: 1,
    name: "mock measure",
    uid: "1",
    measureSteward: "measure steward",
    dataSource: DataSource.Hybrid,
  },
  status: PageStatus.IN_PROGRESS,
};

const mockedPerformanceElement: NdrEnhancedTemplate = {
  id: "mock-perf-id",
  type: ElementType.NdrEnhanced,
  label: "test label",
  helperText: "helper text",
  performanceTargetLabel:
    "What is the 2028 state performance target for this assessment?",
  assessments: [{ id: "test-1", label: "assessment 1" }],
  answer: {
    denominator: 2,
    rates: [],
  },
};

const elements = [
  { element: { text: "mock sub header" }, type: ElementType.SubHeader },
  { element: {}, type: ElementType.MeasureDetails },
  { element: {}, type: ElementType.Ndr },
  { element: {}, type: ElementType.NdrFields },
  { element: {}, type: ElementType.LengthOfStayRate },
  { element: {}, type: ElementType.NdrBasic },
];

describe("Test ExportedReportElements", () => {
  test("Test functions", () => {
    for (var i = 0; i < elements.length; i++) {
      const element = elements[i];
      render(renderElements(section, element.element, element.type));
    }
  });
  test("Render NDR Enhanced element", () => {
    render(
      renderElements(
        section,
        mockedPerformanceElement,
        mockedPerformanceElement.type
      )
    );
  });
});
