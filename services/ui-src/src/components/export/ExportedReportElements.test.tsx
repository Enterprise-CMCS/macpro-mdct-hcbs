import { render, screen } from "@testing-library/react";
import { renderElements } from "./ExportedReportElements";
import {
  DataSource,
  DeliverySystem,
  ElementType,
  MeasureSpecification,
  NdrEnhancedTemplate,
  PageStatus,
  PageType,
} from "types";

const mockedPerformanceElement: NdrEnhancedTemplate = {
  id: "mock-perf-id",
  type: ElementType.NdrEnhanced,
  label: "test label",
  helperText: "helper text",
  required: true,
  performanceTargetLabel:
    "What is the 2028 state performance target for this assessment?",
  assessments: [{ id: "test-1", label: "assessment 1" }],
  answer: {
    denominator: 2,
    rates: [],
  },
};

const section = {
  id: "mock-section",
  cmitId: "1",
  title: "mock section title",
  type: PageType.Measure,
  cmitInfo: {
    cmit: 1,
    name: "mock measure",
    uid: "1",
    measureSteward: "measure steward",
    dataSource: DataSource.Hybrid,
    deliverySystem: [DeliverySystem.FFS],
    measureSpecification: [MeasureSpecification.HEDIS],
  },
  elements: [mockedPerformanceElement],
  status: PageStatus.IN_PROGRESS,
};

const elements = [
  { element: { id: "mock-ndr", type: ElementType.Ndr } },
  { element: { id: "mock-ndr-field", type: ElementType.NdrFields } },
  {
    element: {
      id: "mock-length-of-stay-rate",
      type: ElementType.LengthOfStayRate,
      required: true,
    },
  },
  { element: { id: "mock-ndr-basic", type: ElementType.NdrBasic } },
];

describe("Test ExportedReportElements", () => {
  test("Test render SubHeader element", () => {
    const element = renderElements(section, {
      id: "mock-sub-header",
      text: "mock sub header",
      type: ElementType.SubHeader,
    });
    render(element);

    expect(screen.getByText("mock sub header")).toBeInTheDocument();
  });
  test("Test render Measure Details element", () => {
    const element = renderElements(section, {
      id: "mock-measure-details",
      type: ElementType.MeasureDetails,
    });
    render(element);

    expect(screen.getByText("Measure Name: mock measure")).toBeInTheDocument();
    expect(screen.getByText("CMIT number: #1")).toBeInTheDocument();
    expect(screen.getByText("Steward: measure steward")).toBeInTheDocument();
    expect(screen.getByText("Collection method: Hybrid")).toBeInTheDocument();
  });
  test("Test render NDR Enhanced element", () => {
    const element = renderElements(section, mockedPerformanceElement);
    render(<>{element}</>);

    expect(
      screen.getByText(mockedPerformanceElement.performanceTargetLabel)
    ).toBeInTheDocument();
    expect(screen.getByText("test label : assessment 1")).toBeInTheDocument();
    expect(
      screen.getByText("Performance Rates Denominator")
    ).toBeInTheDocument();
    expect(screen.getAllByText("2")).toHaveLength(2);
    expect(screen.getAllByText("Not answered")).toHaveLength(2);
  });
  //TO DO: replace with real test when these elements have been anded
  test("Test render", () => {
    for (var i = 0; i < elements.length; i++) {
      const element = elements[i];
      render(<>{renderElements(section, element.element)}</>);
    }
  });
});
