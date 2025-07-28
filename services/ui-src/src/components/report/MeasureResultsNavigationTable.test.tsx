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
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => jest.fn().mockReturnValue(jest.fn()),
  useParams: jest.fn(() => ({
    reportType: "QMS",
    state: "CO",
    reportId: "mock-report-id",
    // pageId: "MOCK-1",
  })),
}));
// TODO: test that navigate is called when you click the nav buttons
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const mockNavigate = useNavigate() as jest.MockedFunction<
  ReturnType<typeof useNavigate>
>;

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
        ],
      },
      {
        id: "MOCK-1-FFS",
        elements: [
          {
            id: "detail-text-ffs",
            label: "Tell me about FFS",
            type: ElementType.Textbox,
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
          },
        ],
      },
    ],
  } as Report);

jest.mock("../../utils/api/requestMethods/report", () => ({
  getReport: jest.fn(),
}));
const mockedGetReport = getReport as unknown as jest.MockedFunction<
  typeof getReport
>;
mockedGetReport.mockResolvedValue(buildMockReport());

const mockUser = { userIsEndUser: true } as HcbsUser;

const MockReportPage = () => {
  const { setUser } = useStore();
  useEffect(() => {
    setUser(mockUser);
  }, []);
  return <ReportPageWrapper />;
};

describe("Measure Results Navigation Table", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should disabled both nav buttons when delivery method is unspecified", async () => {
    act(() => render(<MockReportPage />));
    await waitFor(() => {
      expect(screen.getByText(/Is the state reporting/)).toBeVisible();
    });

    const buttons = screen.queryAllByRole("button", { name: "Edit" });
    const [ffsNavButton, mltssNavButton] = buttons;
    expect(ffsNavButton).toBeDisabled();
    expect(mltssNavButton).toBeDisabled();
  });

  it("should enable nav buttons when delivery methods are selected", async () => {
    act(() => render(<MockReportPage />));
    await waitFor(() => {
      expect(screen.getByText(/Is the state reporting/)).toBeVisible();
    });

    const buttons = screen.queryAllByRole("button", { name: "Edit" });
    const [ffsNavButton, mltssNavButton] = buttons;

    const ffsOption = screen.getByRole("radio", { name: /Fee-For-Service/ });
    const mltssOption = screen.getByRole("radio", { name: /Managed Care/ });
    const bothOption = screen.getByRole("radio", { name: /Both/ });

    await userEvent.click(ffsOption);
    expect(ffsNavButton).toBeEnabled();
    expect(mltssNavButton).toBeDisabled();

    await userEvent.click(mltssOption);
    expect(ffsNavButton).toBeDisabled();
    expect(mltssNavButton).toBeEnabled();

    await userEvent.click(bothOption);
    expect(ffsNavButton).toBeEnabled();
    expect(mltssNavButton).toBeEnabled();
  });
});
