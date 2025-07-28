import { render, screen } from "@testing-library/react";
import { ElementType, MeasureFooterTemplate } from "types";
import { MeasureFooterElement } from "./MeasureFooter";
import userEvent from "@testing-library/user-event";
import { mockUseStore } from "utils/testing/setupJest";

const mockUseNavigate = jest.fn();

jest.mock("utils/state/useStore", () => ({
  useStore: jest
    .fn()
    .mockImplementation(
      (selector?: (state: typeof mockUseStore) => unknown) => {
        if (selector) {
          return selector(mockUseStore);
        }
        return mockUseStore;
      }
    ),
}));

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockUseNavigate,
  useParams: jest.fn(() => ({
    reportType: "QMS",
    state: "CO",
    reportId: "mock-id",
  })),
}));

const mockRhfMethods = {
  reset: () => {},
};

jest.mock("react-hook-form", () => ({
  useFormContext: jest.fn(() => mockRhfMethods),
}));

const mockedMeasureFooterElement: MeasureFooterTemplate = {
  id: "mock-footer-id",
  type: ElementType.MeasureFooter,
  nextTo: "mock-next-link",
  completeMeasure: true,
  clear: true,
};

const mockedMeasureFooterEmpty: MeasureFooterTemplate = {
  id: "mock-footer-id",
  type: ElementType.MeasureFooter,
  prevTo: "mock-prev-link",
};

const mockedMeasureSectionFooterElement: MeasureFooterTemplate = {
  id: "mock-footer-id",
  type: ElementType.MeasureFooter,
  prevTo: "mock-prev-link",
  completeSection: true,
};

describe("Measure Footer", () => {
  it("Test Measure Footer component", async () => {
    render(<MeasureFooterElement element={mockedMeasureFooterElement} />);

    //click previous
    const previousLink = screen.getByRole("button", {
      name: "Previous",
    });
    await userEvent.click(previousLink);
    const prevRoute = "/report/QMS/CO/mock-id/req-measure-result";
    expect(mockUseNavigate).toHaveBeenCalledWith(prevRoute);

    //click next
    const nextLink = screen.getByRole("button", {
      name: "Next",
    });
    await userEvent.click(nextLink);
    const nextRoute = "/report/QMS/CO/mock-id/mock-next-link";
    expect(mockUseNavigate).toHaveBeenCalledWith(nextRoute);

    //click clear
    const clearBtn = screen.getByRole("button", {
      name: "Clear measure data",
    });
    await userEvent.click(clearBtn);

    //click complete measure
    const completeMeasureBtn = screen.getByRole("button", {
      name: "Complete measure",
    });
    await userEvent.click(completeMeasureBtn);
  });

  it("Test Measure Footer component as a measure section", async () => {
    render(
      <MeasureFooterElement element={mockedMeasureSectionFooterElement} />
    );

    //click previous
    const previousLink = screen.getByRole("button", {
      name: "Previous",
    });
    await userEvent.click(previousLink);
    const prevRoute = "/report/QMS/CO/mock-id/mock-prev-link";
    expect(mockUseNavigate).toHaveBeenCalledWith(prevRoute);

    //click complete section
    const completeSectionBtn = screen.getByRole("button", {
      name: "Complete section",
    });
    await userEvent.click(completeSectionBtn);
  });

  it("Test Measure Footer component without optional fields", () => {
    render(<MeasureFooterElement element={mockedMeasureFooterEmpty} />);

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
