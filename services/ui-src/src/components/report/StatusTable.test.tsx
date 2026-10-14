import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { StatusTableElement } from "./StatusTable";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { postSubmitReport, useStore } from "utils";
import {
  mockHelpDeskUser,
  mockStateUser,
  RouterWrappedComponent,
} from "utils/testing/setupTests";
import { ElementType, Report } from "types";
import { ReportModal } from "./ReportModal";

vi.mock("utils", async (importOriginal) => ({
  ...(await importOriginal()),
  postSubmitReport: vi.fn(),
}));

const mockNavigate = vi.fn();
vi.mock("react-router-dom", async (importOriginal) => ({
  ...(await importOriginal()),
  useParams: vi.fn().mockReturnValue({
    reportType: "QMS",
    state: "CO",
    reportId: "mock-report-id",
  }),
  useNavigate: () => mockNavigate,
}));

vi.mock("launchdarkly-react-client-sdk", () => ({
  useFlags: vi.fn().mockReturnValue({
    viewPdf: true,
  }),
}));

const report = {
  type: "QMS",
  id: "mock-report-id",
  state: "CO",
  pages: [
    { id: "root", childPageIds: ["id-1", "id-2", "review-submit"] },
    {
      id: "id-1",
      navTitle: "Page One",
      elements: [{ type: ElementType.Textbox, required: true, answer: "foo" }],
    },
    {
      id: "id-2",
      navTitle: "Page Two",
      elements: [{ type: ElementType.Textbox, answer: undefined }],
    },
  ],
} as Report;

const submittableReport = structuredClone(report);
(submittableReport as any).pages[2].elements[0].required = false;

const unsubmittableReport = structuredClone(report);
(unsubmittableReport as any).pages[2].elements[0].required = true;

// Calling loadReport also initializes the page map, etc
useStore.getState().loadReport(submittableReport);

describe("StatusTable", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useStore.setState({ user: mockStateUser, report: submittableReport });
  });

  it("should render correctly", () => {
    render(
      <MemoryRouter>
        <StatusTableElement />
      </MemoryRouter>
    );

    expect(
      screen.getByRole("table", { name: "Review & Submit" })
    ).toBeVisible();
    expect(screen.getByRole("columnheader", { name: "Section" })).toBeVisible();
    expect(screen.getByRole("columnheader", { name: "Status" })).toBeVisible();
    expect(screen.getByRole("columnheader", { name: "Actions" })).toBeVisible();
    expect(
      screen.getByRole("row", { name: "Page One complete icon Complete Edit" })
    ).toBeVisible();
    expect(
      screen.getByRole("row", { name: "Page Two complete icon Complete Edit" })
    ).toBeVisible();
  });

  it("should navigate to the correct editable page when the Edit button is clicked", async () => {
    render(
      <MemoryRouter>
        <StatusTableElement />
      </MemoryRouter>
    );

    const editButton = screen.getAllByRole("button", { name: /Edit/i })[0];
    await userEvent.click(editButton);

    expect(editButton).toBeVisible();
  });

  it("should navigate to PDF when the Review PDF button is clicked", async () => {
    render(
      <MemoryRouter>
        <StatusTableElement />
      </MemoryRouter>
    );

    const reviewPdfButton = screen.getByRole("link", { name: /Review PDF/i });

    const PdfPath = `/report/${report.type}/${report.state}/${report.id}/export`;
    expect(reviewPdfButton).toHaveAttribute("href", PdfPath);
    expect(reviewPdfButton).toHaveAttribute("target", "_blank");
  });

  it("should call the API and render QMS submit modal when the Submit button is clicked", async () => {
    render(
      <RouterWrappedComponent>
        <ReportModal />
        <StatusTableElement />
      </RouterWrappedComponent>
    );

    const pageSubmitButton = screen.getByRole("button", {
      name: /Submit QMS Report/i,
    });
    await userEvent.click(pageSubmitButton);

    expect(screen.getByRole("dialog", { name: /Are you sure/i })).toBeVisible();

    const modalSubmitButton = screen.getByRole("button", {
      name: /Submit QMS Report/i,
    });
    await userEvent.click(modalSubmitButton);

    expect(postSubmitReport).toHaveBeenCalled();
  });

  it("should disable the submit button when submittable is false", async () => {
    useStore.setState({ report: unsubmittableReport });

    render(
      <MemoryRouter initialEntries={["/report/QMS/CO/mock-report-id"]}>
        <Routes>
          <Route
            path="/report/:reportType/:state/:reportId"
            element={<StatusTableElement />}
          />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByRole("button", { name: /Submit/ })).toBeDisabled();
  });

  it("should not render anything if report is undefined", () => {
    useStore.setState({ report: undefined });

    render(
      <MemoryRouter>
        <StatusTableElement />
      </MemoryRouter>
    );
    expect(screen.queryByRole("table")).not.toBeInTheDocument();
  });

  it("should not render the Submit QMS Report button when user is read only", async () => {
    useStore.setState({ user: mockHelpDeskUser });

    render(
      <MemoryRouter>
        <StatusTableElement />
      </MemoryRouter>
    );

    expect(screen.getByRole("table")).toBeVisible();
    expect(screen.queryByRole("button", { name: /Submit/ })).toBeNull();
  });
});
