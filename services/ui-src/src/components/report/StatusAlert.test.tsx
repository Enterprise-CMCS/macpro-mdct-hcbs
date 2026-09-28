import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { StatusAlert } from "./StatusAlert";
import {
  AlertTypes,
  ElementType,
  HcbsReportState,
  Report,
  StatusAlertTemplate,
} from "types";
import { testA11y } from "utils/testing/commonTests";
import { useStore } from "utils";
import userEvent from "@testing-library/user-event";

vi.mock("utils/state/reportLogic/completeness", () => ({
  inferredReportStatus: vi.fn().mockReturnValue("Complete"),
}));

vi.mock("react-router-dom", async (importOriginal) => ({
  ...(await importOriginal()),
  useNavigate: () => vi.fn(),
  useParams: vi.fn(() => ({
    reportType: "QMS",
    state: "CO",
    reportId: "mock-id",
  })),
}));

const mockStatusAlert: StatusAlertTemplate = {
  id: "mock-alert-id",
  type: ElementType.StatusAlert,
  title: "mock alert",
  text: "mock text",
  status: AlertTypes.ERROR,
};

const mockStatusLink: StatusAlertTemplate = {
  id: "mock-alert-id",
  type: ElementType.StatusAlert,
  title: "mock alert",
  text: "mock text {ReturnButton}",
  status: AlertTypes.ERROR,
};

const submittableStoreState = {
  report: {
    pages: [
      { id: "root", childPageIds: ["page-1"] },
      {
        id: "page-1",
        elements: [
          {
            type: ElementType.Textbox,
            required: true,
            answer: "completed",
          },
        ],
      },
    ],
  } as Report,
  pageMap: new Map([
    ["root", 0],
    ["page-1", 1],
  ]),
  currentPageId: "review-submit",
} as HcbsReportState;

const unsubmittableStoreState = structuredClone(submittableStoreState);
(unsubmittableStoreState as any).report.pages[1].elements[0].answer = undefined;
unsubmittableStoreState.currentPageId = "page-1";

describe("<StatusAlert />", () => {
  beforeEach(() => {
    useStore.setState(structuredClone(unsubmittableStoreState));
  });

  it("should render correctly", () => {
    render(<StatusAlert element={mockStatusAlert} />);
    expect(screen.getByText("mock alert")).toBeVisible();
    expect(screen.getByText("mock text")).toBeVisible();
  });

  it("should render clickable links", async () => {
    render(<StatusAlert element={mockStatusLink}></StatusAlert>);

    expect(screen.getByText("mock alert")).toBeVisible();
    const link = screen.getByText("Click here");

    await userEvent.click(link);
  });

  it("should not render on Review & Submit page of completed report", () => {
    useStore.setState(submittableStoreState);
    render(<StatusAlert element={mockStatusAlert} />);

    expect(screen.queryByText("mock alert")).not.toBeInTheDocument();
    expect(screen.queryByText("mock text")).not.toBeInTheDocument();
  });

  testA11y(<StatusAlert element={mockStatusAlert} />);
});
