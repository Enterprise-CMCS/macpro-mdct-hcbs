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

const modalComponent = (
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

describe("Test AddEditProgramModal", () => {
  beforeEach(() => {
    mockedUseStore.mockReturnValue(mockStateUserStore);
    render(modalComponent);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("AddEditReportModal shows the contents", () => {
    expect(screen.getByLabelText("QMS report name")).toBeVisible();
    expect(screen.getByText("Start new")).toBeVisible();
  });

  test("AddEditReportModal top close button can be clicked", async () => {
    await userEvent.click(screen.getByText("Close"));
    expect(mockCloseHandler).toHaveBeenCalledTimes(1);
  });

  test("AddEditReportModal bottom cancel button can be clicked", async () => {
    await userEvent.click(screen.getByText("Cancel"));
    expect(mockCloseHandler).toHaveBeenCalledTimes(1);
  });
});

describe("Test AddEditReportModal accessibility", () => {
  it("Should not have basic accessibility issues", async () => {
    const { container } = render(modalComponent);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
