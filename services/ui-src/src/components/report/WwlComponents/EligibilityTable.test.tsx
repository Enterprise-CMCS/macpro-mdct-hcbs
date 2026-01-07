import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ElementType, EligibilityTableTemplate } from "types";
import { testA11y } from "utils/testing/commonTests";
import { useState } from "react";
import {
  EligibilityTableElement,
  fieldLabels,
  EligibilityTableElementExport,
} from "./EligibilityTable";

const mockedElement: EligibilityTableTemplate = {
  id: "mock-id",
  type: ElementType.EligibilityTable,
  answer: [
    {
      title: "mockTitle1",
      description: "mockDescription1",
      recheck: "Yes",
      frequency: "Annually",
      eligibilityUpdate: "No",
    },
  ],
};
const updateSpy = jest.fn();

const EligibilityTableWrapper = ({
  template,
}: {
  template: EligibilityTableTemplate;
}) => {
  const [element, setElement] = useState(template);
  const onChange = (updatedElement: Partial<typeof element>) => {
    updateSpy(updatedElement);
    setElement({ ...element, ...updatedElement });
  };
  return <EligibilityTableElement element={element} updateElement={onChange} />;
};

describe("<EligibilityTableElement />", () => {
  describe("Test EligibilityTableElement component", () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    test("EligibilityTableElement is visible", () => {
      render(<EligibilityTableWrapper template={mockedElement} />);
      expect(screen.getByText("Other Eligibility")).toBeVisible();
      expect(screen.getByText("mockTitle1")).toBeVisible();
    });

    test("Modal should open and close", async () => {
      render(<EligibilityTableWrapper template={mockedElement} />);

      const addButton = screen.getByText("Add eligibility");
      await userEvent.click(addButton);
      const modalTitle = screen.getByText("Add other eligibility");
      expect(modalTitle).toBeVisible();

      const closeButton = screen.getByText("Close");
      await userEvent.click(closeButton);
      expect(modalTitle).not.toBeVisible();
    });

    test("Able to add new eligibility", async () => {
      render(<EligibilityTableWrapper template={mockedElement} />);
      const addButton = screen.getByText("Add eligibility");
      await userEvent.click(addButton);

      const title = screen.getByRole("textbox", { name: fieldLabels.title });
      await userEvent.type(title, "mockTitle2");

      const description = screen.getByRole("textbox", {
        name: fieldLabels.description,
      });
      await userEvent.type(description, "mockDescription2");

      const radios = screen.getAllByText("No");
      await userEvent.click(radios[0]); // recheck
      await userEvent.click(radios[1]); // eligibility update

      const saveButton = screen.getByText("Save");
      await userEvent.click(saveButton);
      expect(screen.getByText("mockTitle2")).toBeVisible();
      expect(updateSpy).toHaveBeenCalled();
    });

    test("Field validations showing proper errors", async () => {
      render(<EligibilityTableWrapper template={mockedElement} />);
      const addButton = screen.getByText("Add eligibility");
      await userEvent.click(addButton);

      const title = screen.getByRole("textbox", { name: fieldLabels.title });
      await userEvent.type(title, "mockTitle1");

      const saveButton = screen.getByText("Save");
      await userEvent.click(saveButton);
      expect(screen.getAllByText("A response is required")[0]).toBeVisible();
      expect(screen.getByText("Title must be unique")).toBeVisible();
    });

    test("Able to delete eligibility", async () => {
      render(<EligibilityTableWrapper template={mockedElement} />);
      const deleteButton = screen.getByAltText("Delete Item");
      await userEvent.click(deleteButton);

      expect(screen.queryByText("mockTitle1")).not.toBeInTheDocument();
      expect(updateSpy).toHaveBeenCalled();
    });

    test("Able to edit eligibility", async () => {
      render(<EligibilityTableWrapper template={mockedElement} />);
      const editButton = screen.getByText("Edit");
      await userEvent.click(editButton);

      const title = screen.getByRole("textbox", { name: fieldLabels.title });
      await userEvent.type(title, "addonTitle");

      const saveButton = screen.getByText("Save");
      await userEvent.click(saveButton);
      expect(updateSpy).toHaveBeenCalled();
      expect(screen.getByText("mockTitle1addonTitle")).toBeVisible();
      expect(updateSpy).toHaveBeenCalled();
    });
  });

  describe("EligibilityTableElementExport", () => {
    it("should render export table", () => {
      render(EligibilityTableElementExport(mockedElement));
      expect(screen.getByText("mockTitle1")).toBeVisible();
      expect(
        screen.getByRole("cell", { name: fieldLabels.description })
      ).toBeVisible();
      expect(
        screen.getByRole("cell", { name: fieldLabels.recheck })
      ).toBeVisible();
      expect(
        screen.getByRole("cell", { name: fieldLabels.frequency })
      ).toBeVisible();
      expect(
        screen.getByRole("cell", { name: fieldLabels.eligibilityUpdate })
      ).toBeVisible();
    });
  });

  testA11y(<EligibilityTableWrapper template={mockedElement} />);
});
