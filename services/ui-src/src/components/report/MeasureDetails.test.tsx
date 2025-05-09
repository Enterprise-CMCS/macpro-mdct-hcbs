import { render, screen } from "@testing-library/react";
import { mockUseStore } from "utils/testing/setupJest";
import { MeasureDetailsElement } from "./MeasureDetails";

jest.mock("utils/state/useStore", () => ({
  useStore: jest
    .fn()
    .mockImplementation(
      (selector?: (state: typeof mockUseStore) => unknown) => {
        if (selector) {
          return selector(mockUseStore);
        }
        return mockUseStore;
      }
    ),
}));

describe("Measure Details", () => {
  it("Test Measure Details component", async () => {
    render(<MeasureDetailsElement />);

    expect(screen.getByText(/LTSS-1/)).toBeInTheDocument(); // name from store
    expect(screen.getByText(/960/)).toBeInTheDocument(); // CMIT from store
    expect(screen.getByText(/Hybrid/)).toBeInTheDocument(); // Collection method from store
  });
});
