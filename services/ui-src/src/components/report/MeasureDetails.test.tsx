import { render, screen } from "@testing-library/react";
import { mockUseStore } from "utils/testing/setupJest";
import { MeasureDetailsElement } from "./MeasureDetails";

jest.mock("utils/state/useStore", () => ({
  useStore: jest.fn().mockImplementation((selector: Function | undefined) => {
    if (selector) {
      return selector(mockUseStore);
    }
    return mockUseStore;
  }),
}));

describe("Measure Footer", () => {
  it("Test Measure Footer component", async () => {
    render(<MeasureDetailsElement />);

    expect(screen.getByText(/LTSS-1/)).toBeInTheDocument(); // name from store
    expect(screen.getByText(/960/)).toBeInTheDocument(); // CMIT from store
    expect(screen.getByText(/Hybrid/)).toBeInTheDocument(); // Collection method from store
  });
});
