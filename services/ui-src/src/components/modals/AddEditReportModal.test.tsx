import { fireEvent, render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
//components
import { AddEditReportModal } from "components";
import {
  mockStateUserStore,
  RouterWrappedComponent,
} from "utils/testing/setupJest";
import { useStore } from "utils";

const mockCloseHandler = jest.fn();

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
    />
  </RouterWrappedComponent>
);

describe("Test AddEditProgramModal", () => {
  beforeEach(async () => {
    mockedUseStore.mockReturnValue(mockStateUserStore);
    render(modalComponent);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("AddEditReportModal shows the contents", () => {
    expect(screen.getByText("QMS Report Name")).toBeTruthy();
    expect(screen.getByText("Submit")).toBeTruthy();
  });

  test("AddEditReportModal top close button can be clicked", () => {
    fireEvent.click(screen.getByText("Close"));
    expect(mockCloseHandler).toHaveBeenCalledTimes(1);
  });

  test("AddEditReportModal bottom cancel button can be clicked", () => {
    fireEvent.click(screen.getByText("Cancel"));
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
