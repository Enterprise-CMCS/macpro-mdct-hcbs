import { render, screen } from "@testing-library/react";
import { ExportedReportWrapper } from "./ExportedReportWrapper";
import { ElementType, FormPageTemplate, PageElement, PageType } from "types";

const elements: PageElement[] = [
  {
    type: ElementType.Header,
    id: "",
    text: "General Information",
  },
  {
    type: ElementType.Textbox,
    id: "",
    label: "Contact title",
    required: true,
    helperText:
      "Enter person's title or a position title for CMS to contact with questions about this request.",
  },
  {
    type: ElementType.Date,
    id: "",
    label: "Reporting period start date",
    required: true,
    helperText:
      "What is the reporting period Start Date applicable to the measure results?",
  },
  {
    type: ElementType.Textbox,
    id: "",
    label: "Additional comments",
    answer: "",
    required: false,
    helperText: "Enter any additional comments",
  },
];

const section: FormPageTemplate = {
  id: "mock-id",
  title: "mock-title",
  type: PageType.Standard,
  elements: elements,
  sidebar: true,
};

describe("ExportedReportWrapper", () => {
  it("ExportedReportWrapper is visible", () => {
    render(<ExportedReportWrapper section={section}></ExportedReportWrapper>);
    expect(screen.getByText("Contact title")).toBeInTheDocument();
  });

  it("Unanswered optional fields are not rendered", () => {
    render(<ExportedReportWrapper section={section}></ExportedReportWrapper>);
    expect(screen.queryByText("Additional comments")).not.toBeInTheDocument();
  });
});
