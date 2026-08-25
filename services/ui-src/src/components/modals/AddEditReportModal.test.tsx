import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AddEditReportModal } from "components";
import {
  mockStateUser,
  RouterWrappedComponent,
} from "utils/testing/setupTests";
import { useStore } from "utils";
import { LiteReport, ReportType } from "../../types";
import assert from "node:assert";
import { testA11y } from "utils/testing/commonTests";
import { createReport, updateReport } from "utils/api/requestMethods/report";

const mockCloseHandler = vi.fn();
const mockReportHandler = vi.fn();

useStore.setState({ user: mockStateUser });

vi.mock("utils/api/requestMethods/report", () => ({
  updateReport: vi.fn(),
  createReport: vi.fn(),
  getReportsForState: vi.fn().mockResolvedValue([
    {
      id: "1",
      name: "mock-name-a",
      year: 2026,
    } as LiteReport,
  ]),
}));

const addModalComponent = (
  <RouterWrappedComponent>
    <AddEditReportModal
      activeState="AB"
      reportType={"QMS"}
      modalDisclosure={{
        isOpen: true,
        onClose: mockCloseHandler,
      }}
      reportHandler={mockReportHandler}
    />
  </RouterWrappedComponent>
);

const editModalComponent = (
  <RouterWrappedComponent>
    <AddEditReportModal
      activeState="AB"
      reportType={"CI"}
      modalDisclosure={{
        isOpen: true,
        onClose: mockCloseHandler,
      }}
      reportHandler={mockReportHandler}
      selectedReport={
        {
          name: "report name thing",
          year: 2026,
        } as LiteReport
      }
    />
  </RouterWrappedComponent>
);

describe("AddEditReportModal", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should be closeable by top button", async () => {
    render(addModalComponent);
    await userEvent.click(screen.getByText("Close"));
    expect(mockCloseHandler).toHaveBeenCalledTimes(1);
  });

  it("should be closeabled by Cancel button", async () => {
    render(addModalComponent);
    await userEvent.click(screen.getByText("Cancel"));
    expect(mockCloseHandler).toHaveBeenCalledTimes(1);
  });

  it("should show Add contents when in create mode", () => {
    render(addModalComponent);
    expect(
      screen.getByText("Add new Quality Measure Set Report")
    ).toBeInTheDocument();
    expect(
      screen.getByText("Quality Measure Set Report Name")
    ).toBeInTheDocument();
    expect(screen.getByText("Start new")).toBeInTheDocument();
  });

  it("should show Edit contents when in edit mode", () => {
    render(editModalComponent);
    expect(
      screen.getByText("Edit Critical Incident Report")
    ).toBeInTheDocument();
    expect(screen.getByText("Save")).toBeInTheDocument();
    expect(screen.getByDisplayValue("report name thing")).toBeInTheDocument();
  });

  it("should render year dropdown options", () => {
    render(addModalComponent);
    const dropdown = screen.getByRole("button", {
      name: "2026 Select the quality measure set reporting year.",
    });
    expect(dropdown).toBeInTheDocument();
  });

  it("should allow year to be selected", async () => {
    render(addModalComponent);
    const dropdown = screen.getAllByLabelText(
      "Select the quality measure set reporting year."
    )[0];
    assert.ok(dropdown instanceof HTMLSelectElement);
    await userEvent.selectOptions(dropdown, "2026");
    expect(dropdown.value).toBe("2026");
  });

  it("should call the API to create a report", async () => {
    render(addModalComponent);
    const nameTextbox = screen.getByRole("textbox", {
      name: "Quality Measure Set Report Name",
    });
    await userEvent.type(nameTextbox, "mock-name");

    const radioBtns = screen.getAllByLabelText("Yes");
    for (const radio of radioBtns) {
      await userEvent.click(radio);
    }

    const submitBtn = screen.getByText("Start new");
    await userEvent.click(submitBtn);

    expect(mockReportHandler).toHaveBeenCalled();
    expect(createReport).toHaveBeenCalled();
  });

  it("should call the API to edit a report", async () => {
    render(editModalComponent);

    const nameTextbox = screen.getByRole("textbox", {
      name: "Critical Incident Report Name",
    });
    expect(nameTextbox).toBeInTheDocument();
    await userEvent.type(nameTextbox, "mock-edit-report");

    const submitBtn = screen.getByText("Save");
    expect(submitBtn).toBeInTheDocument();

    await userEvent.click(submitBtn);
    expect(updateReport).toHaveBeenCalled();
  });

  it("should not allow two reports with the same name", async () => {
    const user = userEvent.setup();
    render(addModalComponent);
    const nameTextbox = screen.getByRole("textbox", {
      name: "Quality Measure Set Report Name",
    }) as HTMLInputElement;

    await user.click(nameTextbox);
    await user.paste("mock-name-a");

    expect(nameTextbox.value).toBe("mock-name-a");
    expect(
      screen.getByText(
        "A report with this name already exists during this reporting period."
      )
    ).toBeInTheDocument();

    const radioBtns = screen.getAllByLabelText("Yes");
    for (const radio of radioBtns) {
      await user.click(radio);
    }

    const submitBtn = screen.getByText("Start new");
    await user.click(submitBtn);

    // Form should not submit when there's a validation error
    expect(mockReportHandler).not.toHaveBeenCalled();
    expect(createReport).not.toHaveBeenCalled();
  });

  it.each([
    { type: ReportType.QMS, text: "Quality Measure Set Report" },
    { type: ReportType.TACM, text: "TACM Report" },
    { type: ReportType.CI, text: "Critical Incident Report" },
    { type: ReportType.PCP, text: "Person-Centered Planning Report" },
    { type: ReportType.QIP, text: "Quality Improvement Plan" },
    { type: ReportType.WWL, text: "Waiver Waiting List Report" },
  ])("should render $type report title", ({ type, text }) => {
    render(
      <RouterWrappedComponent>
        <AddEditReportModal
          activeState="AB"
          reportType={type}
          modalDisclosure={{
            isOpen: true,
            onClose: mockCloseHandler,
          }}
          reportHandler={mockReportHandler}
        />
      </RouterWrappedComponent>
    );
    expect(screen.getByText(`Add new ${text}`)).toBeInTheDocument();
  });

  it("should render special subheading for QIP", () => {
    render(
      <RouterWrappedComponent>
        <AddEditReportModal
          activeState="AB"
          reportType={ReportType.QIP}
          modalDisclosure={{
            isOpen: true,
            onClose: mockCloseHandler,
          }}
          reportHandler={mockReportHandler}
        />
      </RouterWrappedComponent>
    );

    expect(
      screen.getByText(
        "Enter a report for each of your state's quality improvement plans."
      )
    ).toBeInTheDocument();
  });

  it("should render special subheading for WWL", () => {
    render(
      <RouterWrappedComponent>
        <AddEditReportModal
          activeState="AB"
          reportType={ReportType.WWL}
          modalDisclosure={{
            isOpen: true,
            onClose: mockCloseHandler,
          }}
          reportHandler={mockReportHandler}
        />
      </RouterWrappedComponent>
    );

    expect(screen.getByText("Waiting List Separation")).toBeInTheDocument();
  });

  testA11y(addModalComponent);
  testA11y(editModalComponent);
});
