import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { MeasureDetailsElement } from "./MeasureDetails";
import { useStore } from "utils/state/useStore";
import { CMIT, DataSource, MeasurePageTemplate, PageType, Report } from "types";

useStore.setState({
  currentPageId: "LTSS-1",
  pageMap: new Map([["LTSS-1", 0]]),
  report: {
    pages: [
      {
        id: "LTSS-1",
        type: PageType.Measure,
        cmitInfo: {
          cmit: 960,
          name: "LTSS-1: Comprehensive Assessment and Update",
          measureSteward: "CMS",
          dataSource: DataSource.Hybrid,
        } as CMIT,
      } as MeasurePageTemplate,
    ],
  } as Report,
});

describe("Measure Details", () => {
  it("should render correctly", async () => {
    render(<MeasureDetailsElement />);

    expect(screen.getByText(/LTSS-1: Comprehensive/)).toBeInTheDocument();
    expect(screen.getByText(/960/)).toBeInTheDocument();
    expect(screen.getByText(/Hybrid/)).toBeInTheDocument();
  });
});
