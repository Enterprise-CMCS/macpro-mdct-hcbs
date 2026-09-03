import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import {
  ComplianceSectionTemplate,
  ElementType,
  HcbsReportState,
  ImaTableTemplate,
  Report,
} from "types";
import { useStore } from "utils";
import { ComplianceSection } from "./ComplianceSection";

const mockTable: ImaTableTemplate = {
  id: "mock-table",
  type: ElementType.ImaTable,
  caption: "mock caption",
  columns: [
    { id: "description", label: "Incident Type", type: "description" },
    { id: "yes", label: "Yes", type: "answer" },
    { id: "no", label: "No", type: "answer", nonCompliant: true },
  ],
  rows: [{ id: "verbal-abuse", description: "Verbal Abuse" }],
};

const mockSection: ComplianceSectionTemplate = {
  id: "noncompliance-section",
  type: ElementType.ComplianceSection,
  showCondition: {
    controllerElementId: "mock-table",
    when: "nonCompliant",
  },
  elements: [
    {
      id: "requirement-text",
      type: ElementType.Paragraph,
      text: "mock requirement text",
    },
    {
      id: "justification",
      type: ElementType.TextAreaField,
      label: "mock justification",
      required: true,
    },
  ],
};

const storeStateWith = (table: ImaTableTemplate) =>
  ({
    report: {
      pages: [
        { id: "root", childPageIds: ["page-1"] },
        { id: "page-1", elements: [table, mockSection] },
      ],
    } as Report,
    pageMap: new Map([
      ["root", 0],
      ["page-1", 1],
    ]),
    currentPageId: "page-1",
  }) as HcbsReportState;

const updateSpy = vi.fn();

describe("<ComplianceSection />", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useStore.setState(storeStateWith(structuredClone(mockTable)));
  });

  it("should render nothing when the table is compliant", () => {
    useStore.setState(
      storeStateWith({
        ...structuredClone(mockTable),
        answer: [
          { id: "verbal-abuse", description: "Verbal Abuse", answer: "yes" },
        ],
      })
    );

    render(
      <ComplianceSection element={mockSection} updateElement={updateSpy} />
    );

    expect(screen.queryByText("mock requirement text")).toBeNull();
    expect(screen.queryByLabelText(/mock justification/)).toBeNull();
  });

  it("should render every child when any row is non-compliant", () => {
    useStore.setState(
      storeStateWith({
        ...structuredClone(mockTable),
        answer: [
          { id: "verbal-abuse", description: "Verbal Abuse", answer: "no" },
        ],
      })
    );

    render(
      <ComplianceSection element={mockSection} updateElement={updateSpy} />
    );

    expect(screen.getByText("mock requirement text")).toBeVisible();
    expect(screen.getByRole("textbox")).toBeVisible();
  });

  it("should render nothing when the table is unanswered", () => {
    render(
      <ComplianceSection element={mockSection} updateElement={updateSpy} />
    );

    expect(screen.queryByText("mock requirement text")).toBeNull();
  });
});
