import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { ElementType, KeyActivityTableTemplate } from "types";
import { testA11y } from "utils/testing/commonTests";
import { KeyActivitiesTableElement } from "./KeyActivitiesTable";

jest.mock("components/fields", () => ({
  DateField: ({ element, updateElement }: any) => (
    <input
      aria-label={element.label}
      value={element.answer || ""}
      onChange={(e) => updateElement({ answer: e.target.value })}
    />
  ),
}));

const emptyTemplate: KeyActivityTableTemplate = {
  id: "key-activities-table",
  type: ElementType.KeyActivityTable,
  caption: "Key Activities",
  answer: [],
};

const populatedTemplate: KeyActivityTableTemplate = {
  id: "key-activities-table",
  type: ElementType.KeyActivityTable,
  caption: "Key Activities",
  answer: [
    {
      title: "Activity 1",
      completionDate: "01/01/2026",
    },
  ],
};

const updateSpy = jest.fn();

const KeyActivitiesTableWrapper = ({
  template,
}: {
  template: KeyActivityTableTemplate;
}) => {
  const [element, setElement] = useState(template);
  const onChange = (updatedElement: Partial<typeof element>) => {
    updateSpy(updatedElement);
    setElement({ ...element, ...updatedElement });
  };

  return (
    <KeyActivitiesTableElement element={element} updateElement={onChange} />
  );
};

describe("<KeyActivitiesTableElement />", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("should display warning when there are no activities", () => {
    render(<KeyActivitiesTableWrapper template={emptyTemplate} />);

    expect(
      screen.getByText(/Provide at least one key activity to support/i)
    ).toBeVisible();
    expect(screen.queryByText("Actions")).not.toBeInTheDocument();
  });

  test("should open and close add modal", async () => {
    render(<KeyActivitiesTableWrapper template={emptyTemplate} />);

    await userEvent.click(screen.getByText("Add key activity"));
    expect(
      screen.getByRole("dialog", { name: "Add key activity" })
    ).toBeVisible();

    await userEvent.click(screen.getByText("Close"));
    expect(
      screen.queryByRole("dialog", { name: "Add key activity" })
    ).not.toBeInTheDocument();
  });

  test("should add a new activity", async () => {
    render(<KeyActivitiesTableWrapper template={emptyTemplate} />);

    await userEvent.click(screen.getByText("Add key activity"));
    await userEvent.type(
      screen.getByRole("textbox", { name: "Title or description" }),
      "New Activity"
    );

    await userEvent.click(screen.getByText("Save"));

    expect(screen.getByText("New Activity")).toBeVisible();
    expect(screen.getByText("Actions")).toBeVisible();
    expect(updateSpy).toHaveBeenCalled();
  });

  test("should show required validation when title is empty", async () => {
    render(<KeyActivitiesTableWrapper template={emptyTemplate} />);

    await userEvent.click(screen.getByText("Add key activity"));
    await userEvent.click(screen.getByText("Save"));

    expect(screen.getByText("A response is required")).toBeVisible();
    expect(updateSpy).not.toHaveBeenCalled();
  });

  test("should prevent duplicate title when adding activity", async () => {
    render(<KeyActivitiesTableWrapper template={populatedTemplate} />);

    await userEvent.click(screen.getByText("Add key activity"));
    await userEvent.type(
      screen.getByRole("textbox", { name: "Title or description" }),
      "activity 1"
    );

    await userEvent.click(screen.getByText("Save"));

    expect(screen.getByText("Title must be unique")).toBeVisible();
    expect(screen.getAllByText("Activity 1")).toHaveLength(1);
  });

  test("should open edit modal with existing activity values", async () => {
    render(<KeyActivitiesTableWrapper template={populatedTemplate} />);

    await userEvent.click(screen.getByLabelText("Edit Activity 1"));

    expect(
      screen.getByRole("dialog", { name: "Edit key activity" })
    ).toBeVisible();
    expect(
      screen.getByRole("textbox", { name: "Title or description" })
    ).toHaveValue("Activity 1");
    expect(screen.getByLabelText("Expected completion date")).toHaveValue(
      "01/01/2026"
    );
  });

  test("should open delete modal and removes activity", async () => {
    render(<KeyActivitiesTableWrapper template={populatedTemplate} />);

    await userEvent.click(screen.getByLabelText("Delete Activity 1"));

    expect(
      screen.getByRole("dialog", {
        name: "Are you sure you want to remove this key activity?",
      })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Remove key activity" })
    ).toBeInTheDocument();

    await userEvent.click(screen.getByText("Remove key activity"));

    expect(screen.queryByText("Activity 1")).not.toBeInTheDocument();
    expect(updateSpy).toHaveBeenCalled();
  });

  test("should cancel in delete modal keeps activity", async () => {
    render(<KeyActivitiesTableWrapper template={populatedTemplate} />);

    await userEvent.click(screen.getByLabelText("Delete Activity 1"));
    await userEvent.click(screen.getByText("Cancel"));

    expect(screen.getByText("Activity 1")).toBeVisible();
  });

  testA11y(<KeyActivitiesTableWrapper template={emptyTemplate} />);
});
