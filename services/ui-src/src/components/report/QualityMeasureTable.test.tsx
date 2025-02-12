import { QualityMeasureTableElement } from "./QualityMeasureTable";
import { render, screen } from "@testing-library/react";
import { useStore } from "utils";
import { mockUseStore } from "utils/testing/setupJest";
import userEvent from "@testing-library/user-event";

jest.mock("utils/state/useStore");
const mockedUseStore = useStore as jest.MockedFunction<typeof useStore>;
mockedUseStore.mockReturnValue({ ...mockUseStore });

jest.mock("react-hook-form", () => ({
  useWatch: jest.fn().mockReturnValue({ answer: "FFS" }),
}));

const mockUseNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockUseNavigate,
  useParams: jest.fn(() => ({
    reportType: "QMS",
    state: "CO",
    reportId: "mock-id",
  })),
}));

describe("Quality Measure Table", () => {
  it("should enable each delivery system's button correctly", async () => {
    render(<QualityMeasureTableElement />);

    const ffsRow = screen.getByRole("row", { name: /FFS CMIT# 960/ });
    const ffsButton = ffsRow.querySelector("button");
    expect(ffsButton).toBeEnabled();

    await userEvent.click(ffsButton!);
    const ffsRoute = "/report/QMS/CO/mock-id/FFS960";
    expect(mockUseNavigate).toHaveBeenCalledWith(ffsRoute);

    const mltssRow = screen.getByRole("row", { name: /MLTSS CMIT# 960/ });
    const mltssButton = mltssRow.querySelector("button");
    expect(mltssButton).toBeDisabled();
  });
});
