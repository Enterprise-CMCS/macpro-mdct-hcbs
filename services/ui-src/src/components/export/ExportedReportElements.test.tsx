import { render, screen } from "@testing-library/react";
import { renderElements } from "./ExportedReportElements";
import {
  DataSource,
  DeliverySystem,
  ElementType,
  MeasureSpecification,
  PageStatus,
  PageType,
} from "types";
import {
  mockedNDREnhanced,
  mockLengthOfStayFields,
  mockNDR,
  mockNDRBasics,
  mockNDRFields,
} from "utils/testing/mockRates";

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
  elements: [] as any[],
  status: PageStatus.IN_PROGRESS,
};

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
  test("Test render NDR element", () => {
    section.elements.push(mockNDR);
    const element = renderElements(section, mockNDR);
    render(<>{element}</>);
    expect(
      screen.getByText(
        "Performance Rate : Person uses the same environments as people without disabilities"
      )
    ).toBeInTheDocument();
    expect(screen.getAllByText(4)).toHaveLength(1);
  });
  test("Test render NDR Enhanced element", () => {
    section.elements.push(mockedNDREnhanced);
    const element = renderElements(section, mockedNDREnhanced);
    render(<>{element}</>);

    expect(screen.getByText("test label : assessment 1")).toBeInTheDocument();
    expect(
      screen.getByText("Performance Rates Denominator")
    ).toBeInTheDocument();
    expect(screen.getAllByText("2")).toHaveLength(2);
    expect(screen.getAllByText("Not answered")).toHaveLength(2);
  });
  test("Test render NDR Fields element", () => {
    section.elements.push(mockNDRFields);
    const element = renderElements(section, mockNDRFields);
    render(<>{element}</>);

    expect(screen.getAllByText("Denominator (Assessment 1)")).toHaveLength(2);
    expect(
      screen.getByText(
        "What is the 2028 state performance target for this Assessment 1 field 1?"
      )
    ).toBeInTheDocument();
    expect(screen.getAllByText("2")).toHaveLength(2);
  });
  test("Test render FieldsExport element", () => {
    section.elements.push(mockLengthOfStayFields);
    const element = renderElements(section, mockLengthOfStayFields);
    render(<>{element}</>);
    expect(screen.getByText("Actual Count")).toBeInTheDocument();
    expect(screen.getAllByText("Not answered")).toHaveLength(8);
  });
  test("Test render NDR Basic element", () => {
    section.elements.push(mockNDRBasics);
    const element = renderElements(section, mockNDRBasics);
    render(<>{element}</>);
    expect(screen.getByText("Result")).toBeInTheDocument();
    expect(screen.getAllByText("Not answered")).toHaveLength(2);
  });
});
