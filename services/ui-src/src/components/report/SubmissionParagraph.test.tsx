import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import { useStore } from "utils";
import { SubmissionParagraph } from "./SubmissionParagraph";
import { Report } from "types";

const report = {
  submittedBy: "Tall Person",
  submitted: new Date("January 1, 2025").getTime(),
  state: "NJ",
  type: "QMS",
} as Report;

describe("SubmissionParagraph", () => {
  it("should not render if missing details from the store", () => {
    useStore.setState({ report: undefined });

    const { container } = render(
      <Router>
        <SubmissionParagraph />
      </Router>
    );
    expect(container).toBeEmptyDOMElement();
  });

  it("should render submission details", () => {
    useStore.setState({ report });
    render(
      <Router>
        <SubmissionParagraph />
      </Router>
    );
    expect(
      screen.getByText(
        "Quality Measure Set Report submission for NJ was submitted on January 1, 2025 by Tall Person."
      )
    ).toBeInTheDocument();
  });
});
