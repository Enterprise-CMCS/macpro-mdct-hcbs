import { render, screen } from "@testing-library/react";
import { ElementType, MeasureFooterTemplate } from "types";
import { MeasureFooterElement } from "./MeasureFooter";
import userEvent from "@testing-library/user-event";

const mockUseNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockUseNavigate,
  useParams: jest.fn(() => ({
    reportType: "QMS",
    state: "CO",
  })),
}));

const mockedMeasureFooterElement = {
  type: ElementType.MeasureFooter,
  prevTo: "mock-prev-link",
  nextTo: "mock-next-link",
  completeMeasure: true,
  completeSection: true,
  clear: true,
} as MeasureFooterTemplate;

const mockedMeasureFooterEmpty = {
  type: ElementType.MeasureFooter,
  prevTo: "mock-prev-link",
} as MeasureFooterTemplate;

describe("Measure Footer", () => {
  it("Test Measure Footer component", async () => {
    render(
      <MeasureFooterElement
        element={mockedMeasureFooterElement}
        index={0}
        formkey="elements.0"
      />
    );

    const previousLink = screen.getByRole("button", {
      name: "Previous",
    });
    await userEvent.click(previousLink);
    const prevRoute = "/report/QMS/CO/undefined/mock-prev-link";
    expect(mockUseNavigate).toHaveBeenCalledWith(prevRoute);

    const nextLink = screen.getByRole("button", {
      name: "Next",
    });
    await userEvent.click(nextLink);
    const nextRoute = "/report/QMS/CO/undefined/mock-next-link";
    expect(mockUseNavigate).toHaveBeenCalledWith(nextRoute);

    expect(screen.getByText("Clear measure data")).toBeInTheDocument();
    expect(screen.getByText("Complete section")).toBeInTheDocument();
    expect(screen.getByText("Complete measure")).toBeInTheDocument();
  });

  it("Test Measure Footer component without optional fields", () => {
    render(
      <MeasureFooterElement
        element={mockedMeasureFooterEmpty}
        index={0}
        formkey="elements.0"
      />
    );

    expect(screen.getByText("Previous")).toBeInTheDocument();

    expect(
      screen.queryByRole("button", { name: "Next" })
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "Clear measure data" })
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "Complete section" })
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "Complete measure" })
    ).not.toBeInTheDocument();
  });
});
