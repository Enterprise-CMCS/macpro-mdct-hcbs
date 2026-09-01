import { beforeEach, describe, expect, it, vi } from "vitest";
import { act, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
  CMIT,
  DeliverySystem,
  DependentPageInfo,
  ElementType,
  MeasureTemplateName,
  PageType,
  Report,
  ReportType,
} from "types/report";
import { getReport } from "../../utils/api/requestMethods/report";
import { ReportPageWrapper } from "./ReportPageWrapper";
import { useStore } from "utils";
import { HcbsUser } from "types";
import { useNavigate } from "react-router-dom";

vi.mock("react-router-dom", async (importOriginal) => ({
  ...(await importOriginal()),
  useNavigate: vi.fn().mockReturnValue(vi.fn()),
  useParams: vi.fn(() => ({
    reportType: "QMS",
    state: "CO",
    reportId: "mock-report-id",
    pageId: "MOCK-1",
  })),
}));
const mockNavigate = vi.mocked(useNavigate());

const buildMockReport = (): Report =>
  ({
    id: "mock-report-id",
    type: ReportType.QMS,
    pages: [
      {
        id: "root",
        childPageIds: ["MOCK-1"],
      },
      {
        id: "MOCK-1",
        cmitId: "MOCK-1",
        cmitInfo: {
          deliverySystem: [DeliverySystem.FFS, DeliverySystem.MLTSS],
        } as CMIT,
        type: PageType.Measure,
        dependentPages: [
          {
            key: DeliverySystem.FFS,
            linkText: "Fee For Service",
            template: "MOCK-1-FFS" as MeasureTemplateName,
          },
          {
            key: DeliverySystem.MLTSS,
            linkText: "Managed Care",
            template: "MOCK-1-MLTSS" as MeasureTemplateName,
          },
        ] as DependentPageInfo[],
        elements: [
          {
            type: ElementType.Radio,
            id: "measure-reporting-radio",
            label: "Is the state reporting on this measure?",
            choices: [
              { label: "Yes, the state is reporting", value: "yes" },
              { label: "No, CMS is reporting", value: "no" },
            ],
            required: true,
            clickAction: "qmReportingChange",
          },
          {
            type: ElementType.Radio,
            id: "delivery-method-radio",
            required: true,
            label:
              "Which delivery methods will be reported on for this measure?",
            choices: [
              { label: "Fee-For-Service (FFS LTSS)", value: "FFS" },
              { label: "Managed Care (MLTSS)", value: "MLTSS" },
              { label: "Both FFS and MLTSS (separate)", value: "FFS,MLTSS" },
            ],
            hideCondition: {
              controllerElementId: "measure-reporting-radio",
              answer: "no",
            },
            clickAction: "qmDeliveryMethodChange",
          },
          {
            type: ElementType.MeasureResultsNavigationTable,
            id: "measure-results-navigation-table",
            measureDisplay: "quality",
            hideCondition: {
              controllerElementId: "measure-reporting-radio",
              answer: "no",
            },
          },
          {
            type: ElementType.MeasureFooter,
            id: "measure-footer",
            clear: true,
          },
        ],
      },
      {
        id: "MOCK-1-FFS",
        elements: [
          {
            id: "detail-text-ffs",
            label: "Tell me about FFS",
            type: ElementType.Textbox,
            answer: "Our FFS programs are first-rate",
            required: true,
          },
        ],
      },
      {
        id: "MOCK-1-MLTSS",
        elements: [
          {
            id: "detail-text-mltss",
            label: "Tell me about MLTSS",
            type: ElementType.Textbox,
            answer: "Our MLTSS programs are top-notch",
            required: true,
          },
        ],
      },
    ],
  }) as Report;

vi.mock("../../utils/api/requestMethods/report", () => ({
  getReport: vi.fn(),
}));
vi.mocked(getReport).mockResolvedValue(buildMockReport());

useStore.setState({ user: { userIsEndUser: true } as HcbsUser });

describe("Measure Results Navigation Table", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const waitForRender = async () => {
    await waitFor(() => {
      const reportingLabel = screen.getAllByText(/Is the state reporting/)[0];
      expect(reportingLabel).toBeVisible();
    });
  };

  it("should disable both nav buttons when delivery method is unspecified", async () => {
    act(() => render(<ReportPageWrapper />));
    await waitForRender();

    const buttons = screen.queryAllByRole("button", { name: "Edit" });
    const [ffsNavButton, mltssNavButton] = buttons;
    expect(ffsNavButton).toBeDisabled();
    expect(mltssNavButton).toBeDisabled();
  });

  it("should enable FFS nav button when FFS delivery method is selected", async () => {
    act(() => render(<ReportPageWrapper />));
    await waitForRender();

    const ffsOption = screen.getByRole("radio", { name: /Fee-For-Service/ });
    await userEvent.click(ffsOption);

    const buttons = screen.queryAllByRole("button", { name: "Edit" });
    const [ffsNavButton, mltssNavButton] = buttons;
    expect(ffsNavButton).toBeEnabled();
    expect(mltssNavButton).toBeDisabled();
  });

  it("should enable MLTSS nav button when MLTSS delivery method is selected", async () => {
    act(() => render(<ReportPageWrapper />));
    await waitForRender();

    const mltssOption = screen.getByRole("radio", { name: /Managed Care/ });
    await userEvent.click(mltssOption);

    const buttons = screen.queryAllByRole("button", { name: "Edit" });
    const [ffsNavButton, mltssNavButton] = buttons;
    expect(mltssNavButton).toBeEnabled();
    expect(ffsNavButton).toBeDisabled();
  });

  it("should enable both nav buttons when both delivery methods are selected", async () => {
    act(() => render(<ReportPageWrapper />));
    await waitForRender();

    const bothOption = screen.getByRole("radio", { name: /Both/ });
    await userEvent.click(bothOption);
    const buttons = screen.queryAllByRole("button", { name: "Edit" });
    const [ffsNavButton, mltssNavButton] = buttons;
    expect(ffsNavButton).toBeEnabled();
    expect(mltssNavButton).toBeEnabled();
  });

  it("should navigate to details pages when the edit buttons are clicked", async () => {
    act(() => render(<ReportPageWrapper />));
    await waitForRender();

    const bothOption = screen.getByRole("radio", { name: /Both/ });
    const buttons = screen.queryAllByRole("button", { name: "Edit" });
    const [ffsNavButton, mltssNavButton] = buttons;

    // Enable both nav buttons
    await userEvent.click(bothOption);

    expect(ffsNavButton).toBeEnabled();
    await userEvent.click(ffsNavButton);
    expect(mockNavigate).toHaveBeenCalledWith(
      "/report/QMS/CO/mock-report-id/MOCK-1-FFS"
    );

    expect(mltssNavButton).toBeEnabled();
    await userEvent.click(mltssNavButton);
    expect(mockNavigate).toHaveBeenCalledWith(
      "/report/QMS/CO/mock-report-id/MOCK-1-MLTSS"
    );
  });

  it("should be hidden and shown according to the reporting radio", async () => {
    act(() => render(<ReportPageWrapper />));
    await waitForRender();

    const findTableHeader = () =>
      screen.queryByRole("columnheader", { name: "Measure section" });
    const notReporting = screen.getByText("No, CMS is reporting");
    const yesReporting = screen.getByText("Yes, the state is reporting");

    expect(findTableHeader()).toBeVisible();

    await userEvent.click(notReporting);
    expect(findTableHeader()).not.toBeInTheDocument();

    await userEvent.click(yesReporting);
    expect(findTableHeader()).toBeVisible();
  });

  // This test isn't really about the MRNavTable, but it's convenient to put here
  it("should clear measure data when the reporting radio changes", async () => {
    act(() => render(<ReportPageWrapper />));
    await waitForRender();

    const notReporting = screen.getByText("No, CMS is reporting");
    const yesReporting = screen.getByText("Yes, the state is reporting");
    const ffsOption = screen.getByRole("radio", { name: /Fee-For-Service/ });

    expect(ffsOption).not.toBeChecked();
    await userEvent.click(ffsOption);
    expect(ffsOption).toBeChecked();

    let report = useStore.getState().report as any;
    expect(report.pages[1].elements[1].answer).toBe("FFS");
    expect(report.pages[2].elements[0].answer).toContain("first-rate");

    await userEvent.click(notReporting);
    expect(ffsOption).not.toBeVisible();
    await userEvent.click(yesReporting);

    report = useStore.getState().report as any;
    expect(report.pages[1].elements[1].answer).toBeUndefined();
    expect(report.pages[2].elements[0].answer).toBeUndefined();

    // TODO, figure out why this testing-library thinks this is still checked

    // expect(ffsOption).not.toBeChecked();
  });

  // This test isn't really about the MRNavTable, but it's convenient to put here
  it("should clear measure details pages when delivery method changes", async () => {
    act(() => render(<ReportPageWrapper />));
    await waitForRender();

    const ffsOption = screen.getByRole("radio", { name: /Fee-For-Service/ });
    const mltssOption = screen.getByRole("radio", { name: /Managed Care/ });

    await userEvent.click(ffsOption);
    let report = useStore.getState().report as any;
    expect(report.pages[2].elements[0].answer).toContain("first-rate");

    await userEvent.click(mltssOption);
    // Dismiss the delivery method change confirmation modal
    await userEvent.click(screen.getByRole("button", { name: "Yes" }));
    report = useStore.getState().report as any;
    expect(report.pages[2].elements[0].answer).toBeUndefined();
  });

  // This test isn't really about the MRNavTable, but it's convenient to put here
  it("should clear measure details pages when Clear Measure is clicked", async () => {
    act(() => render(<ReportPageWrapper />));
    await waitForRender();

    let report = useStore.getState().report as any;
    expect(report.pages[2].elements[0].answer).toContain("first-rate");
    expect(report.pages[3].elements[0].answer).toContain("top-notch");

    // Click the clear button in the measure footer
    await userEvent.click(
      screen.getByRole("button", { name: /Clear measure/ })
    );
    // Click the confirm button in the modal that appears
    await userEvent.click(
      screen.getByRole("button", { name: /Clear measure/ })
    );

    report = useStore.getState().report as any;
    expect(report.pages[2].elements[0].answer).not.toBeDefined();
    expect(report.pages[3].elements[0].answer).not.toBeDefined();
  });

  test("should display View buttons in read-only mode", async () => {
    useStore.setState({ user: { userIsEndUser: false } as HcbsUser });

    render(<ReportPageWrapper />);
    await waitForRender();

    expect(screen.getAllByRole("button", { name: "View" })).toHaveLength(2);
    expect(
      screen.queryByRole("button", { name: "Edit" })
    ).not.toBeInTheDocument();
  });
});
