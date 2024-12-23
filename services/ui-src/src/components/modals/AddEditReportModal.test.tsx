import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
import { AddEditReportModal } from "components";
import {
  mockStateUserStore,
  RouterWrappedComponent,
} from "utils/testing/setupJest";
import { useStore } from "utils";
import userEvent from "@testing-library/user-event";

const mockCloseHandler = jest.fn();
const mockReportHandler = jest.fn();

jest.mock("utils/state/useStore");
const mockedUseStore = useStore as jest.MockedFunction<typeof useStore>;

const addModalComponent = (
  <RouterWrappedComponent>
    <AddEditReportModal
      activeState="AB"
      reportType={"QM"}
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
      reportType={"QM"}
      modalDisclosure={{
        isOpen: true,
        onClose: mockCloseHandler,
      }}
      reportHandler={mockReportHandler}
      selectedReport={
        {
          name: "report name thing",
        } as unknown as any
      }
    />
  </RouterWrappedComponent>
);

describe("Test general modal functionality", () => {
  beforeEach(() => {
    mockedUseStore.mockReturnValue(mockStateUserStore);
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
    mockedUseStore.mockReturnValue(mockStateUserStore);
    render(addModalComponent);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("Add Report Modal shows proper add contents", () => {
    expect(
      screen.getByText("Add new Quality Measure Set Report")
    ).toBeInTheDocument();
    expect(screen.getByText("QMS report name")).toBeInTheDocument();
    expect(screen.getByText("Start new")).toBeInTheDocument();
  });
});

describe("Test Edit Report Modal", () => {
  beforeEach(() => {
    mockedUseStore.mockReturnValue(mockStateUserStore);
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

describe("Test AddEditReportModal accessibility", () => {
  it("Should not have basic accessibility issues", async () => {
    const { container } = render(addModalComponent);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
