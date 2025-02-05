import { QualityMeasureTableElement } from "./QualityMeasureTable";
import { render, screen } from "@testing-library/react";
import { useStore } from "utils";
import { mockUseStore } from "utils/testing/setupJest";

jest.mock("utils/state/useStore");
const mockedUseStore = useStore as jest.MockedFunction<typeof useStore>;
mockedUseStore.mockReturnValue({ ...mockUseStore });

jest.mock("react-hook-form", () => ({
  useFormContext: jest.fn().mockReturnValue({
    getValues: jest.fn().mockReturnValue({ answer: "FFS" }),
  }),
}));

describe("Quality Measure Table", () => {
  it("should enable each delivery system's button correctly", () => {
    render(<QualityMeasureTableElement />);

    const ffsRow = screen.getByRole("row", { name: /FFS CMIT# 960/ });
    const ffsButton = ffsRow.querySelector("button");
    expect(ffsButton).toBeEnabled();

    const mltssRow = screen.getByRole("row", { name: /MLTSS CMIT# 960/ });
    const mltssButton = mltssRow.querySelector("button");
    expect(mltssButton).toBeDisabled();
  });
});
