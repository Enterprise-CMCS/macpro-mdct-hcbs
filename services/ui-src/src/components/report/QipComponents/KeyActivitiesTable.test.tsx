import { render, screen, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { ElementType, KeyActivityTableTemplate } from "types";
import { testA11y } from "utils/testing/commonTests";
import { KeyActivitiesTableElement } from "./KeyActivitiesTable";

const mockOpenDeleteModal = jest.fn();
let capturedOnConfirm: (remaining: any[], deletedId: string) => void;

jest.mock("../useDeleteConfirmModal", () => ({
  useDeleteConfirmModal: ({ onConfirm }: any) => {
    capturedOnConfirm = onConfirm;
    return {
      addButtonRef: { current: null },
      getDeleteButtonRef: jest.fn().mockReturnValue(() => {}),
      openDeleteModal: mockOpenDeleteModal,
    };
  },
}));

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
  required: true,
  answer: [],
};

const populatedTemplate: KeyActivityTableTemplate = {
  id: "key-activities-table",
  type: ElementType.KeyActivityTable,
  caption: "Key Activities",
  required: true,
  answer: [
    {
      id: "activity-1",
      title: "Activity 1",
      completionDate: "01/2026",
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

  it("should display warning when there are no activities", () => {
    render(<KeyActivitiesTableWrapper template={emptyTemplate} />);

    expect(
      screen.getByText(/Provide at least one key activity to support/i)
    ).toBeVisible();
    expect(screen.queryByText("Actions")).not.toBeInTheDocument();
  });

  it("should open and close add modal", async () => {
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

  it("should close add modal when clicking Cancel", async () => {
    render(<KeyActivitiesTableWrapper template={emptyTemplate} />);

    await userEvent.click(screen.getByText("Add key activity"));
    await userEvent.click(screen.getByRole("button", { name: "Cancel" }));

    expect(
      screen.queryByRole("dialog", { name: "Add key activity" })
    ).not.toBeInTheDocument();
  });

  it("should close add modal with Escape key", async () => {
    render(<KeyActivitiesTableWrapper template={emptyTemplate} />);

    await userEvent.click(screen.getByText("Add key activity"));
    await userEvent.keyboard("{Escape}");

    expect(
      screen.queryByRole("dialog", { name: "Add key activity" })
    ).not.toBeInTheDocument();
  });

  it("should add a new activity", async () => {
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

  it("should show required validation when title is empty", async () => {
    render(<KeyActivitiesTableWrapper template={emptyTemplate} />);

    await userEvent.click(screen.getByText("Add key activity"));
    await userEvent.click(screen.getByText("Save"));

    expect(screen.getByText("A response is required")).toBeVisible();
    expect(updateSpy).not.toHaveBeenCalled();
  });

  it("should prevent duplicate title when adding activity", async () => {
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

  it("should open edit modal with existing activity values", async () => {
    render(<KeyActivitiesTableWrapper template={populatedTemplate} />);

    await userEvent.click(screen.getByLabelText("Edit Activity 1"));

    expect(
      screen.getByRole("dialog", { name: "Edit key activity" })
    ).toBeVisible();
    expect(
      screen.getByRole("textbox", { name: "Title or description" })
    ).toHaveValue("Activity 1");
    expect(screen.getByLabelText("Expected completion date")).toHaveValue(
      "01/2026"
    );
  });

  it("should edit an activity and save updated values", async () => {
    render(<KeyActivitiesTableWrapper template={populatedTemplate} />);

    await userEvent.click(screen.getByLabelText("Edit Activity 1"));
    const titleInput = screen.getByRole("textbox", {
      name: "Title or description",
    });

    await userEvent.clear(titleInput);
    await userEvent.type(titleInput, "Updated Activity");
    await userEvent.click(screen.getByRole("button", { name: "Save" }));

    expect(screen.getByText("Updated Activity")).toBeVisible();
    expect(screen.queryByText("Activity 1")).not.toBeInTheDocument();
  });

  it("should update completion date from date field", async () => {
    render(<KeyActivitiesTableWrapper template={emptyTemplate} />);

    await userEvent.click(screen.getByText("Add key activity"));
    await userEvent.type(
      screen.getByRole("textbox", { name: "Title or description" }),
      "Date Activity"
    );
    await userEvent.type(
      screen.getByLabelText("Expected completion date"),
      "03/2027"
    );

    await userEvent.click(screen.getByRole("button", { name: "Save" }));

    expect(screen.getByText("Expected completion date: 03/2027")).toBeVisible();
  });

  it("should call openDeleteModal when delete button is clicked", async () => {
    render(<KeyActivitiesTableWrapper template={populatedTemplate} />);
    await userEvent.click(screen.getByLabelText("Delete Activity 1"));

    expect(mockOpenDeleteModal).toHaveBeenCalledWith("activity-1");
  });

  it("should remove activity when delete is confirmed", async () => {
    render(<KeyActivitiesTableWrapper template={populatedTemplate} />);
    await userEvent.click(screen.getByLabelText("Delete Activity 1"));

    await act(async () => capturedOnConfirm([], "activity-1"));

    expect(screen.queryByText("Activity 1")).not.toBeInTheDocument();
    expect(updateSpy).toHaveBeenCalled();
  });

  it("should hide delete button when disabled is true", () => {
    render(
      <KeyActivitiesTableElement
        element={populatedTemplate}
        updateElement={updateSpy}
        disabled
      />
    );

    expect(
      screen.getByRole("button", { name: "View Activity 1" })
    ).toBeVisible();
    expect(
      screen.queryByRole("button", { name: "Delete Activity 1" })
    ).not.toBeInTheDocument();
  });

  testA11y(<KeyActivitiesTableWrapper template={emptyTemplate} />);
});
