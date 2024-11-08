import { render, screen } from "@testing-library/react";
import { ExportedReportWrapper } from "./ExportedReportWrapper";
import { FormPageTemplate, PageElement, PageType } from "types";

const elements: PageElement[] = [];

const section: FormPageTemplate = {
  id: "mock-id",
  childPageIds: [],
  title: "mock-title",
  type: PageType.Standard,
  elements: elements,
  sidebar: undefined,
  hideNavButtons: undefined,
};

describe("ExportedReportWrapper", () => {
  it("ExportedReportWrapper is visible", () => {
    render(<ExportedReportWrapper section={section}></ExportedReportWrapper>);
  });
});
