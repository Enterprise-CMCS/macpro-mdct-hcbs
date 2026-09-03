import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { ElementType, ImaTableTemplate } from "types";
import { testA11y } from "utils/testing/commonTests";
import { ImaTableElement } from "./ImaTableElement";

const template: ImaTableTemplate = {
  id: "incident-definitions",
  type: ElementType.ImaTable,
  caption: "Critical Incident Definitions",
  label: "Critical incident types",
  columns: [
    { id: "description", label: "Incident type", type: "description" },
    { id: "yes", label: "Yes", type: "answer" },
    { id: "no", label: "No", type: "answer", nonCompliant: true },
    { id: "delete", label: "Delete", type: "delete" },
  ],
  rows: [
    { id: "abuse", description: "Abuse" },
    { id: "neglect", description: "Neglect", answer: "yes" },
  ],
  addButtonText: "Add other incident type",
  customRowLabel: "Other incident type:",
  allowCustomRows: true,
};

const updateSpy = vi.fn();

const ImaTableElementWrapper = ({
  initialTemplate = template,
}: {
  initialTemplate?: ImaTableTemplate;
}) => {
  const [element, setElement] = useState(initialTemplate);
  const onChange = (updatedElement: Partial<ImaTableTemplate>) => {
    updateSpy(updatedElement);
    setElement({ ...element, ...updatedElement });
  };

  return <ImaTableElement element={element} updateElement={onChange} />;
};

describe("<ImaTableElement />", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should initialize from the saved answer instead of the template rows", () => {
    render(
      <ImaTableElementWrapper
        initialTemplate={{
          ...template,
          answer: [
            { id: "saved", description: "Saved incident", answer: "no" },
          ],
        }}
      />
    );

    expect(screen.getByText("Saved incident")).toBeVisible();
    expect(screen.queryByText("Abuse")).not.toBeInTheDocument();
    expect(
      screen.getByRole("radio", { name: "No for Saved incident" })
    ).toBeChecked();
  });

  it("should persist a selected answer", async () => {
    render(<ImaTableElementWrapper />);

    await userEvent.click(screen.getByRole("radio", { name: "No for Abuse" }));

    expect(updateSpy).toHaveBeenLastCalledWith({
      answer: [
        { id: "abuse", description: "Abuse", answer: "no" },
        { id: "neglect", description: "Neglect", answer: "yes" },
      ],
    });
  });

  it("should add, edit, and delete a custom row", async () => {
    render(<ImaTableElementWrapper />);

    await userEvent.click(
      screen.getByRole("button", { name: "Add other incident type" })
    );

    const description = screen.getByRole("textbox", {
      name: "Other incident type:",
    });
    await userEvent.type(description, "Other");
    await userEvent.click(screen.getByRole("button", { name: "Delete Other" }));

    expect(screen.queryByRole("textbox")).not.toBeInTheDocument();
    expect(updateSpy).toHaveBeenLastCalledWith({ answer: template.rows });
  });

  testA11y(<ImaTableElementWrapper />);
});
