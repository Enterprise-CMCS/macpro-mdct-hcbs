import { beforeEach, describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import {
  AlertTypes,
  ComplianceAlertTemplate,
  ElementType,
  HcbsReportState,
  ImaTableTemplate,
  Report,
} from "types";
import { testA11y } from "utils/testing/commonTests";
import { useStore } from "utils";
import { ComplianceAlert } from "./ComplianceAlert";

const mockAlert: ComplianceAlertTemplate = {
  id: "compliance-alert",
  type: ElementType.ComplianceAlert,
  title: "Warning Status",
  text: "The State does not meet the requirement.",
  status: AlertTypes.WARNING,
  controllerElementId: "mock-table",
};

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

const storeStateWith = (table: ImaTableTemplate) =>
  ({
    report: {
      pages: [
        { id: "root", childPageIds: ["page-1"] },
        { id: "page-1", elements: [table] },
      ],
    } as Report,
    pageMap: new Map([
      ["root", 0],
      ["page-1", 1],
    ]),
    currentPageId: "page-1",
  }) as HcbsReportState;

describe("<ComplianceAlert />", () => {
  beforeEach(() => {
    useStore.setState(storeStateWith(structuredClone(mockTable)));
  });

  it("should not render when no answer has been given", () => {
    render(<ComplianceAlert element={mockAlert} />);

    expect(screen.queryByText("Warning Status")).toBeNull();
  });

  it("should not render when every answer is compliant", () => {
    useStore.setState(
      storeStateWith({
        ...structuredClone(mockTable),
        answer: [
          { id: "verbal-abuse", description: "Verbal Abuse", answer: "yes" },
        ],
      })
    );

    render(<ComplianceAlert element={mockAlert} />);

    expect(screen.queryByText("Warning Status")).toBeNull();
  });

  it("should render when any answer is non-compliant", () => {
    useStore.setState(
      storeStateWith({
        ...structuredClone(mockTable),
        answer: [
          { id: "verbal-abuse", description: "Verbal Abuse", answer: "yes" },
          { id: "neglect", description: "Neglect", answer: "no" },
        ],
      })
    );

    render(<ComplianceAlert element={mockAlert} />);

    expect(screen.getByText("Warning Status")).toBeVisible();
    expect(
      screen.getByText("The State does not meet the requirement.")
    ).toBeVisible();
  });

  it("should read non-compliance from template rows when unanswered", () => {
    useStore.setState(
      storeStateWith({
        ...structuredClone(mockTable),
        rows: [
          { id: "verbal-abuse", description: "Verbal Abuse", answer: "no" },
        ],
      })
    );

    render(<ComplianceAlert element={mockAlert} />);

    expect(screen.getByText("Warning Status")).toBeVisible();
  });

  it("should not render when the controller element is missing", () => {
    render(
      <ComplianceAlert
        element={{ ...mockAlert, controllerElementId: "does-not-exist" }}
      />
    );

    expect(screen.queryByText("Warning Status")).toBeNull();
  });

  testA11y(<ComplianceAlert element={mockAlert} />, () => {
    useStore.setState(
      storeStateWith({
        ...structuredClone(mockTable),
        answer: [
          { id: "verbal-abuse", description: "Verbal Abuse", answer: "no" },
        ],
      })
    );
  });
});
