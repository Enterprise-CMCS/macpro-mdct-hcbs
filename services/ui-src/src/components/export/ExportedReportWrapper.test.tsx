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
    helperText:
      "Enter person's title or a position title for CMS to contact with questions about this request.",
  },
  {
    type: ElementType.Date,
    id: "",
    label: "Reporting period start date",
    helperText:
      "What is the reporting period Start Date applicable to the measure results?",
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
});
