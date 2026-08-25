import { screen, render } from "@testing-library/react";
import { useStore } from "utils";
import { ExportedReportPage } from "./ExportedReportPage";
import { Report, PageTemplate, ElementType, PageType, PageStatus } from "types";

const report = {
  type: "QMS",
  id: "mock-report-id",
  state: "CO",
  name: "mock-title",
  pages: [] as PageTemplate[],
  lastEdited: 1751987780396,
  lastEditedBy: "Mrs Editor",
  status: "In progress",
  options: {
    cahps: true,
    "cahps-period": "2024",
    nciidd: false,
    nciad: true,
    "nciad-period": "2024",
    pom: false,
  },
} as Report;
useStore.setState({ report });

const subHeader = (text: string) => ({
  type: ElementType.SubHeader,
  id: "",
  text,
});

describe("ExportedReportPage", () => {
  it("ExportReportPage is visible", () => {
    useStore.setState({
      report: {
        ...report,
        pages: [{ id: "root", childPageIds: [] }] as PageTemplate[],
      },
    });

    render(<ExportedReportPage />);

    const elements = screen.getAllByText(
      "Colorado Quality Measure Set Report for: mock-title"
    );
    expect(elements.length).toBe(2);

    expect(
      screen.getByRole("row", {
        name: "Reporting year Last edited Edited by Status",
      })
    );
    expect(
      screen.getByRole("row", { name: "07/08/2025 Mrs Editor In progress" })
    );

    expect(screen.getByRole("row", { name: /CAHPS Survey\? Yes/ }));
    expect(
      screen.getByRole("row", {
        name: "Reporting start and end date Jan 2024 - Dec 2024",
      })
    ).toBeInTheDocument();
    expect(screen.getByRole("row", { name: /NCI-IDD Survey\? No/ }));
    expect(screen.getByRole("row", { name: /NCI-AD Survey\? Yes/ }));
    expect(
      screen.getByRole("row", {
        name: "Reporting start and end date July 2024 - June 2025",
      })
    ).toBeInTheDocument();
    expect(screen.getByRole("row", { name: /POM Survey\? No/ }));
  });

  it("Should not render filtered sections", () => {
    useStore.setState({
      report: {
        ...report,
        pages: [
          {
            id: "root",
            childPageIds: ["review-submit"],
            elements: [subHeader("Root")],
          },
          {
            id: "review-submit",
            elements: [subHeader("Review")],
          },
        ] as PageTemplate[],
      },
    });

    render(<ExportedReportPage />);

    // The root page never renders
    expect(screen.queryByText(/Root/)).not.toBeInTheDocument();

    // The Review & Submit page never renders
    expect(screen.queryByText(/Review/)).not.toBeInTheDocument();
  });

  it("Should not render unreferenced sections", () => {
    useStore.setState({
      report: {
        ...report,
        pages: [
          { id: "root", childPageIds: ["page-a"] },
          {
            id: "page-a",
            elements: [subHeader("Page Alpha")],
          },
          {
            id: "page-b",
            elements: [subHeader("Page Beta")],
          },
        ] as PageTemplate[],
      },
    });

    render(<ExportedReportPage />);

    // Referenced from root
    expect(screen.queryByText(/Alpha/)).toBeInTheDocument();

    // Never referenced
    expect(screen.queryByText(/Beta/)).not.toBeInTheDocument();
  });

  it("Should render required measures and results with section header", () => {
    useStore.setState({
      report: {
        ...report,
        pages: [
          { id: "root", childPageIds: ["req-measure-result"] },
          {
            id: "req-measure-result",
            elements: [subHeader("Fluff")],
          },
          {
            id: "measure-a",
            type: PageType.Measure,
            required: true,
            status: PageStatus.IN_PROGRESS,
            elements: [subHeader("Measure Alpha")],
            dependentPages: [
              { template: "measure-a-ffs" },
              { template: "measure-a-mltss" },
            ],
          },
          {
            id: "measure-a-ffs",
            type: PageType.MeasureResults,
            status: PageStatus.NOT_STARTED,
            elements: [subHeader("Alpha FFS Results")],
          },
          {
            id: "measure-a-mltss",
            type: PageType.MeasureResults,
            status: PageStatus.IN_PROGRESS,
            elements: [subHeader("Alpha MLTSS Results")],
          },
          {
            id: "measure-b",
            type: PageType.Measure,
            required: true,
            status: PageStatus.NOT_STARTED,
            elements: [subHeader("Measure Beta")],
            dependentPages: [],
          },
        ] as PageTemplate[],
      },
    });

    render(<ExportedReportPage />);

    // The contents of the Required Measures page don't render
    expect(screen.queryByText(/Fluff/)).not.toBeInTheDocument();

    // The injected header does render
    expect(screen.getByText(/Required Measures/)).toBeInTheDocument();

    // The measure does render
    expect(screen.getByText(/Measure Alpha/)).toBeInTheDocument();
    // This status doesn't appear to be reporting Alpha FFS results
    expect(screen.queryByText(/Alpha FFS Results/)).not.toBeInTheDocument();
    // The MLTSS results have not been filled out
    expect(screen.getByText(/Alpha MLTSS Results/)).toBeInTheDocument();

    // Even though Beta is not started, it is required, so we show it
    expect(screen.getByText(/Measure Beta/)).toBeInTheDocument();
  });

  it("Should not render optional measure header when there is no optional data", () => {
    useStore.setState({
      report: {
        ...report,
        pages: [
          { id: "root", childPageIds: ["optional-measure-result"] },
          {
            id: "optional-measure-result",
            elements: [subHeader("Fluff")],
          },
          {
            id: "measure-g",
            type: PageType.Measure,
            required: false,
            status: PageStatus.NOT_STARTED,
            elements: [subHeader("Measure Gamma")],
            dependentPages: [],
          },
        ] as PageTemplate[],
      },
    });

    render(<ExportedReportPage />);

    // The contents of the Optional Measures page don't render
    expect(screen.queryByText(/Fluff/)).not.toBeInTheDocument();

    // The injected header does not render
    expect(screen.queryByText(/Optional Measures/)).not.toBeInTheDocument();

    // The measure, being optional and empty, does not render
    expect(screen.queryByText(/Measure Gamma/)).not.toBeInTheDocument();
  });

  it("Should render optional section when it has data", () => {
    useStore.setState({
      report: {
        ...report,
        pages: [
          { id: "root", childPageIds: ["optional-measure-result"] },
          { id: "optional-measure-result" },
          {
            id: "measure-g",
            type: PageType.Measure,
            required: false,
            status: PageStatus.IN_PROGRESS,
            elements: [subHeader("Measure Gamma")],
            dependentPages: [],
          },
        ] as PageTemplate[],
      },
    });

    render(<ExportedReportPage />);

    // The injected header does render
    expect(screen.getByText(/Optional Measures/)).toBeInTheDocument();

    // The measure, since it is In Progress, also renders
    expect(screen.getByText(/Measure Gamma/)).toBeInTheDocument();
  });

  it("Should render QIP Measure Target pages", () => {
    useStore.setState({
      report: {
        ...report,
        pages: [
          { id: "root", childPageIds: ["select-measures"] },
          {
            id: "select-measures",
            elements: [
              subHeader("Fluff"),
              {
                id: "select-measures-table",
                type: ElementType.QipMeasureTable,
                answer: [{ pageId: "target-d" }],
              },
            ],
          },
          {
            id: "target-d",
            type: PageType.Standard,
            elements: [subHeader("Measure Delta Targets")],
          },
        ] as PageTemplate[],
      },
    });

    render(<ExportedReportPage />);

    // The Select Measures page itself does not render
    expect(screen.queryByText(/Fluff/)).not.toBeInTheDocument();

    // But the measure target pages it references do render
    expect(screen.getByText(/Measure Delta Targets/)).toBeInTheDocument();
  });
});
