import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import {
  ElementType,
  HcbsUser,
  MeasureFooterTemplate,
  PageType,
  Report,
} from "types";
import { MeasureFooterElement } from "./MeasureFooter";
import userEvent from "@testing-library/user-event";
import { useStore } from "utils";

const mockUseNavigate = vi.fn();

vi.mock("react-router-dom", async (importOriginal) => ({
  ...(await importOriginal()),
  useNavigate: () => mockUseNavigate,
  useParams: vi.fn(() => ({
    reportType: "QMS",
    state: "CO",
    reportId: "mock-id",
  })),
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

useStore.setState({
  user: { userIsEndUser: true } as HcbsUser,
  report: {
    pages: [
      { id: "root", childPageIds: ["page-1"] },
      {
        id: "page-1",
        type: PageType.Measure,
        required: true,
        elements: [{ type: ElementType.Textbox, answer: "complete" }],
      },
    ],
  } as Report,
  pageMap: new Map([
    ["root", 0],
    ["page-1", 1],
  ]),
  currentPageId: "page-1",
});

describe("Measure Footer", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers({ shouldAdvanceTime: true });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("should respond to button clicks", async () => {
    render(<MeasureFooterElement element={mockedMeasureFooterElement} />);

    await userEvent.click(screen.getByRole("button", { name: "Previous" }));
    const prevRoute = "/report/QMS/CO/mock-id/req-measure-result";
    expect(mockUseNavigate).toHaveBeenCalledWith(prevRoute);

    await userEvent.click(screen.getByRole("button", { name: "Next" }));
    const nextRoute = "/report/QMS/CO/mock-id/mock-next-link";
    expect(mockUseNavigate).toHaveBeenCalledWith(nextRoute);

    await userEvent.click(screen.getByRole("button", { name: /Clear/ }));
    // TODO: assert on behavior. What should have happened?

    await userEvent.click(
      screen.getByRole("button", { name: "Complete measure" })
    );
    // TODO: assert on behavior. What should have happened?
  });

  it("should behave correctly as a measure section footer", async () => {
    render(
      <MeasureFooterElement element={mockedMeasureSectionFooterElement} />
    );

    await userEvent.click(screen.getByRole("button", { name: "Previous" }));
    const prevRoute = "/report/QMS/CO/mock-id/mock-prev-link";
    expect(mockUseNavigate).toHaveBeenCalledWith(prevRoute);

    await userEvent.click(
      screen.getByRole("button", { name: "Complete section" })
    );
    // TODO: assert on behavior. What should have happened?
  });

  it("should not render optional buttons when they are not needed", () => {
    render(<MeasureFooterElement element={mockedMeasureFooterEmpty} />);

    expect(screen.getByText("Previous")).toBeInTheDocument();

    const optionalButtonNames = [
      "Next",
      "Clear measure data",
      "Complete section",
      "Complete measure",
    ];
    for (let name of optionalButtonNames) {
      expect(screen.queryByRole("button", { name })).not.toBeInTheDocument();
    }
  });
});
