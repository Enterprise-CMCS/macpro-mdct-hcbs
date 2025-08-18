import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AddEditReportModal } from "components";
import {
  mockStateUserStore,
  RouterWrappedComponent,
} from "utils/testing/setupJest";
import { useStore } from "utils";
import { Report, ReportType } from "../../types";
import assert from "node:assert";
import { testA11y } from "utils/testing/commonTests";

const mockCloseHandler = jest.fn();
const mockReportHandler = jest.fn();

jest.mock("utils/state/useStore");
const mockedUseStore = useStore as jest.MockedFunction<typeof useStore>;
mockedUseStore.mockReturnValue(mockStateUserStore);

jest.mock("utils/api/requestMethods/report", () => ({
  putReport: jest.fn(),
  createReport: jest.fn(),
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
      reportType={"QMS"}
      modalDisclosure={{
        isOpen: true,
        onClose: mockCloseHandler,
      }}
      reportHandler={mockReportHandler}
      selectedReport={
        {
          name: "report name thing",
          year: 2026,
          options: {
            cahps: true,
            nciidd: true,
            nciad: true,
            pom: true,
          },
        } as Report
      }
    />
  </RouterWrappedComponent>
);

describe("Test general modal functionality", () => {
  beforeEach(() => {
    render(addModalComponent);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("Modal top close button can be clicked", async () => {
    await userEvent.click(screen.getByText("Close"));
    expect(mockCloseHandler).toHaveBeenCalledTimes(1);
  });

  test("Modal bottom cancel button can be clicked", async () => {
    await userEvent.click(screen.getByText("Cancel"));
    expect(mockCloseHandler).toHaveBeenCalledTimes(1);
  });
});

describe("Test Add Report Modal", () => {
  beforeEach(() => {
    render(addModalComponent);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("Add Report Modal shows proper add contents", () => {
    expect(
      screen.getByText("Add new Quality Measure Set Report")
    ).toBeInTheDocument();
    expect(
      screen.getByText("Quality Measure Set Report Name")
    ).toBeInTheDocument();
    expect(screen.getByText("Start new")).toBeInTheDocument();
  });

  testA11y(addModalComponent);
});

describe("Test Edit Report Modal", () => {
  beforeEach(() => {
    render(editModalComponent);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("Edit report modal shows the proper edit contents with editable name", () => {
    expect(
      screen.getByText("Edit Quality Measure Set Report")
    ).toBeInTheDocument();
    expect(screen.getByText("Save")).toBeInTheDocument();
    expect(screen.getByDisplayValue("report name thing")).toBeInTheDocument();
  });
});

describe("Test dropdown for year", () => {
  beforeEach(() => {
    render(addModalComponent);
  });

  test("Assert dropdown options are rendered", () => {
    const dropdown = screen.getByRole("button", {
      name: "2026 Select the quality measure set reporting year.",
    });
    expect(dropdown).toBeInTheDocument();
  });

  test("Simulate selecting a year", async () => {
    const dropdown = screen.getAllByLabelText(
      "Select the quality measure set reporting year."
    )[0];
    assert(dropdown instanceof HTMLSelectElement);
    await userEvent.selectOptions(dropdown, "2026");
    expect(dropdown.value).toBe("2026");
  });
});

describe("Test submit", () => {
  it("Simulate submitting modal", async () => {
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
  });

  it("Simulate submitting an edited report", async () => {
    render(editModalComponent);

    const nameTextbox = screen.getByRole("textbox", {
      name: "Quality Measure Set Report Name",
    });
    await userEvent.type(nameTextbox, "mock-edit-report");

    const submitBtn = screen.getByText("Save");
    await userEvent.click(submitBtn);
  });
});

describe("Test AddEditReportModal types", () => {
  test.each([
    { type: ReportType.QMS, text: "Quality Measure Set Report" },
    { type: ReportType.TACM, text: "TACM Report" },
    { type: ReportType.CI, text: "Critical Incident Report" },
    { type: ReportType.PCP, text: "Person Centered Planning" },
  ])("$type report type renders a title", ({ type, text }) => {
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
});
