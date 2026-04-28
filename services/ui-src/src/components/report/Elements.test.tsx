import { render, screen } from "@testing-library/react";
import { LabelElement } from "./Elements";
import { ElementType, LabelTemplate } from "types/report";

describe("<LabelElement />", () => {
  test("renders label and helper text", () => {
    const element: LabelTemplate = {
      type: ElementType.Label,
      id: "measurement-period-label",
      label: "Measurement period dates",
      helperText: "Select start and end dates",
    };

    render(<LabelElement element={element} />);

    expect(screen.getByText("Measurement period dates")).toBeInTheDocument();
    expect(screen.getByText("Select start and end dates")).toBeInTheDocument();
  });

  test("renders label without helper text", () => {
    const element: LabelTemplate = {
      type: ElementType.Label,
      id: "measurement-period-label",
      label: "Measurement period dates",
    };

    render(<LabelElement element={element} />);

    expect(screen.getByText("Measurement period dates")).toBeInTheDocument();
    expect(
      screen.queryByText("Select start and end dates")
    ).not.toBeInTheDocument();
  });
});
